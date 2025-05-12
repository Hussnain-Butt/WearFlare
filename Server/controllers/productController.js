// controllers/productController.js
const path = require('path')
const fs = require('node:fs') // For checking credentials file existence
const fsp = require('node:fs/promises') // For async file operations like unlink
const Product = require('../models/Product')
const mongoose = require('mongoose') // Import mongoose for transactions

// NEW: Import Google Cloud Vision client
const { ImageAnnotatorClient } = require('@google-cloud/vision')

// --- Initialize Google Cloud Vision Client ---
let visionClient
const credentialsPath = path.join(__dirname, '..', 'config', 'credentials.json')

if (fs.existsSync(credentialsPath)) {
  try {
    visionClient = new ImageAnnotatorClient({ keyFilename: credentialsPath })
    console.log('[VisionAPI] Client initialized using keyfile:', credentialsPath)
  } catch (error) {
    console.error('[VisionAPI] Error initializing client with keyfile:', error)
    // Fallback or alternative initialization can be added here if needed
  }
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    visionClient = new ImageAnnotatorClient()
    console.log('[VisionAPI] Client initialized using GOOGLE_APPLICATION_CREDENTIALS env var.')
  } catch (error) {
    console.error(
      '[VisionAPI] Error initializing client with GOOGLE_APPLICATION_CREDENTIALS:',
      error,
    )
  }
} else {
  console.warn(
    '[VisionAPI] Credentials not found (neither keyfile nor GOOGLE_APPLICATION_CREDENTIALS). Image search will be disabled.',
  )
}

// --- Helper function to parse comma-separated sizes string ---
const parseSizesString = (sizesString) => {
  if (!sizesString || typeof sizesString !== 'string') return []
  return sizesString
    .split(',')
    .map((s) => s.trim().toUpperCase()) // Standardize to uppercase
    .filter((s) => s !== '') // Remove empty entries
}

// --- Helper function to parse stock details string (e.g., "S:10, M:15, L:5") ---
const parseStockDetailsString = (stockString) => {
  const stockMap = new Map()
  if (!stockString || typeof stockString !== 'string') {
    return stockMap // Return empty map if input is invalid
  }
  const pairs = stockString.split(',')
  pairs.forEach((pair) => {
    const parts = pair.split(':') // Split by colon
    if (parts.length === 2) {
      const size = parts[0].trim().toUpperCase() // Standardize size to uppercase
      const quantityStr = parts[1].trim()
      if (size && quantityStr) {
        // Ensure both parts are non-empty
        const quantity = parseInt(quantityStr, 10)
        // Ensure quantity is a non-negative integer
        if (!isNaN(quantity) && quantity >= 0 && Number.isInteger(quantity)) {
          stockMap.set(size, quantity)
        } else {
          console.warn(
            `[parseStockDetailsString] Invalid quantity format for size "${size}": "${quantityStr}". Skipping.`,
          )
        }
      }
    } else {
      console.warn(`[parseStockDetailsString] Invalid pair format: "${pair}". Skipping.`)
    }
  })
  return stockMap
}

// --- GET /api/products (Returns 'isInStock' virtual) ---
exports.getProducts = async (req, res) => {
  try {
    const filter = {}
    if (req.query.gender) {
      filter.gender = { $regex: new RegExp(`^${req.query.gender}$`, 'i') }
    }
    if (req.query.newCollection && String(req.query.newCollection).toLowerCase() === 'true') {
      filter.isNewCollection = true
    }

    let queryLimit = 0
    if (req.query.limit) {
      const parsedLimit = parseInt(req.query.limit, 10)
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        queryLimit = parsedLimit
      }
    }

    console.log(`[getProducts] Applying filter: ${JSON.stringify(filter)}, Limit: ${queryLimit}`)

    let query = Product.find(filter).sort({ createdAt: -1 })

    if (queryLimit > 0) {
      query = query.limit(queryLimit)
    }

    const products = await query

    // Use the virtual property included by default via toJSON in the model
    res.json(products) // products will include 'isInStock'
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ message: `Failed to fetch products: ${error.message}` })
  }
}

// --- POST /api/products (Handles sizes and stockDetails) ---
exports.createProduct = async (req, res) => {
  try {
    // Expect 'sizes' and 'stockDetailsString' from the form
    const {
      title,
      price,
      category,
      gender,
      description,
      sizes,
      isNewCollection,
      stockDetailsString,
    } = req.body

    if (!title || !price || !category || !gender || !sizes || !stockDetailsString) {
      return res.status(400).json({
        message:
          'Missing required fields: title, price, category, gender, sizes, stockDetailsString.',
      })
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Product image is required.' })
    }

    const imagePath = `/uploads/${req.file.filename}`
    const sizesArray = parseSizesString(sizes) // e.g., ['S', 'M', 'L']
    const stockDetailsMap = parseStockDetailsString(stockDetailsString) // e.g., Map { 'S' => 10, 'M' => 5 }

    // --- Validation: Ensure stock map isn't empty if sizes are provided ---
    if (sizesArray.length > 0 && stockDetailsMap.size === 0) {
      return res
        .status(400)
        .json({ message: 'Stock details cannot be empty when sizes are provided.' })
    }

    // --- Validation: Ensure stock details are provided *only* for listed sizes ---
    const listedSizesSet = new Set(sizesArray)
    for (const size of stockDetailsMap.keys()) {
      if (!listedSizesSet.has(size)) {
        return res.status(400).json({
          message: `Stock quantity provided for size "${size}" which is not listed in available sizes (${sizesArray.join(
            ', ',
          )}).`,
        })
      }
    }

    // --- Validation: Ensure all listed sizes have a stock entry ---
    for (const size of sizesArray) {
      if (!stockDetailsMap.has(size)) {
        return res.status(400).json({
          message: `Missing stock quantity for listed size "${size}". Please provide quantity for all sizes listed (${sizesArray.join(
            ', ',
          )}).`,
        })
      }
    }

    const newCollectionStatus =
      isNewCollection !== undefined ? String(isNewCollection).toLowerCase() === 'true' : false

    const product = new Product({
      title,
      price, // Consider converting/validating as number on backend
      category,
      gender,
      image: imagePath,
      description,
      sizes: sizesArray, // Store parsed array
      stockDetails: stockDetailsMap, // Store parsed map
      isNewCollection: newCollectionStatus,
    })

    await product.save() // Pre-save hook in model will handle final standardization
    res.status(201).json(product) // Returns product with virtuals included
  } catch (error) {
    console.error('Error creating product:', error)
    if (error.name === 'ValidationError') {
      // Extract specific validation messages if possible
      const messages = Object.values(error.errors)
        .map((el) => el.message)
        .join('. ')
      return res.status(400).json({ message: `Validation Error: ${messages || error.message}` })
    }
    res.status(500).json({ message: `Failed to create product: ${error.message}` })
  }
}

// --- PUT /api/products/:id (Handles updates to sizes and stockDetails) ---
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const {
      title,
      price,
      category,
      gender,
      description,
      sizes,
      isNewCollection,
      stockDetailsString,
    } = req.body

    console.log(`[UpdateProduct ${id}] Received Body:`, JSON.stringify(req.body))

    const updatedFields = {}
    let finalSizesArray // To store the array of sizes after potential update

    // Fetch current product to get existing sizes if not provided in request
    const currentProduct = await Product.findById(id).select('sizes image') // Also select image for potential deletion
    if (!currentProduct) {
      return res.status(404).json({ message: 'Product not found.' })
    }

    // Handle simple field updates
    if (title !== undefined) updatedFields.title = title.trim()
    if (price !== undefined) updatedFields.price = String(price).trim() // Keep as string for now, model handles type
    if (category !== undefined) updatedFields.category = category.trim()
    if (gender !== undefined) updatedFields.gender = gender
    if (description !== undefined) updatedFields.description = description.trim()
    if (isNewCollection !== undefined) {
      updatedFields.isNewCollection = String(isNewCollection).toLowerCase() === 'true'
    }

    // Handle sizes update
    if (sizes !== undefined) {
      finalSizesArray = parseSizesString(sizes)
      updatedFields.sizes = finalSizesArray
      console.log(`[UpdateProduct ${id}] Processing sizes update to:`, finalSizesArray)
    } else {
      finalSizesArray = currentProduct.sizes // Use existing sizes if not updated
    }

    // Handle stockDetails update
    if (stockDetailsString !== undefined) {
      const stockDetailsMap = parseStockDetailsString(stockDetailsString)

      if (finalSizesArray.length > 0 && stockDetailsMap.size === 0) {
        return res
          .status(400)
          .json({ message: 'Stock details cannot be empty when sizes are defined.' })
      }
      const finalSizesSet = new Set(finalSizesArray)
      for (const size of stockDetailsMap.keys()) {
        if (!finalSizesSet.has(size)) {
          return res.status(400).json({
            message: `Stock quantity provided for size "${size}" which is not in the final list of available sizes (${finalSizesArray.join(
              ', ',
            )}).`,
          })
        }
      }
      for (const size of finalSizesArray) {
        if (!stockDetailsMap.has(size)) {
          return res.status(400).json({
            message: `Missing stock quantity for final size "${size}". Please provide quantity for all listed sizes (${finalSizesArray.join(
              ', ',
            )}).`,
          })
        }
      }
      updatedFields.stockDetails = stockDetailsMap
      console.log(`[UpdateProduct ${id}] Processing stockDetails update to:`, stockDetailsMap)
    }

    // Handle image update
    if (req.file) {
      const oldImagePath = currentProduct.image
      updatedFields.image = `/uploads/${req.file.filename}`
      console.log(`[UpdateProduct ${id}] Processing image update to ${updatedFields.image}.`)
      // Delete old image if it exists and is a local upload
      if (oldImagePath && oldImagePath.startsWith('/uploads/')) {
        const imagePathToDelete = path.join(__dirname, '..', 'public', oldImagePath) // Adjust 'public' if your uploads are served differently
        try {
          await fsp.unlink(imagePathToDelete)
          console.log(`[UpdateProduct ${id}] Deleted old image file: ${imagePathToDelete}`)
        } catch (err) {
          console.error(
            `[UpdateProduct ${id}] Failed to delete old image file ${imagePathToDelete}:`,
            err,
          )
        }
      }
    }

    if (Object.keys(updatedFields).length === 0 && !req.file) {
      console.log(`[UpdateProduct ${id}] No fields provided for update.`)
      const product = await Product.findById(id) // Fetch full product again
      return res.status(200).json(product)
    }

    console.log(`[UpdateProduct ${id}] Updating with fields:`, JSON.stringify(updatedFields))
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true, runValidators: true, context: 'query' },
    )

    if (!updatedProduct) {
      console.log(`[UpdateProduct ${id}] Product not found during update.`)
      return res.status(404).json({ message: 'Product not found' })
    }

    console.log(`[UpdateProduct ${id}] Update successful.`)
    res.json(updatedProduct)
  } catch (error) {
    console.error(`[UpdateProduct ${req.params?.id}] Error:`, error)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors)
        .map((el) => el.message)
        .join('. ')
      return res.status(400).json({ message: `Validation Error: ${messages || error.message}` })
    }
    if (error.name === 'CastError' && error.path === '_id') {
      return res.status(400).json({ message: 'Invalid Product ID format.' })
    }
    res.status(500).json({ message: `Failed to update product: ${error.message}` })
  }
}

// --- DELETE /api/products/:id ---
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    const deletedProduct = await Product.findByIdAndDelete(id)
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' })

    // Delete associated image file if it exists and is a local upload
    if (deletedProduct.image && deletedProduct.image.startsWith('/uploads/')) {
      // Assuming 'public' is your static serving folder and 'uploads' is inside it.
      // Adjust this path if your 'uploads' folder is directly in the project root
      // or served via a different static path configuration in your Express app.
      const imagePathToDelete = path.join(__dirname, '..', 'public', deletedProduct.image)
      // If your 'uploads' folder is in the Server root, it might be:
      // const imagePathToDelete = path.join(__dirname, '..', deletedProduct.image);

      try {
        await fsp.unlink(imagePathToDelete)
        console.log(`Deleted image file: ${imagePathToDelete}`)
      } catch (err) {
        // Log error but don't fail the entire delete operation if image deletion fails
        console.error(`Failed to delete image file ${imagePathToDelete}:`, err)
      }
    }

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    if (error.name === 'CastError' && error.path === '_id')
      return res.status(400).json({ message: 'Invalid Product ID format.' })
    res.status(500).json({ message: `Failed to delete product: ${error.message}` })
  }
}

// --- GET /api/products/:id (Return full details including stockDetails) ---
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    if (error.name === 'CastError' && error.path === '_id')
      return res.status(400).json({ message: 'Invalid Product ID format.' })
    res.status(500).json({ message: `Failed to fetch product: ${error.message}` })
  }
}

// --- GET /api/products/search ---
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return res.status(400).json({ message: 'Search query required.' })
    }
    const trimmedQuery = query.trim()
    // Search in category, title, or description
    const products = await Product.find({
      $or: [
        { category: { $regex: trimmedQuery, $options: 'i' } },
        { title: { $regex: trimmedQuery, $options: 'i' } },
        { description: { $regex: trimmedQuery, $options: 'i' } },
      ],
    }).limit(20) // Added a limit for performance
    res.json(products)
  } catch (error) {
    console.error('Error searching products:', error)
    res.status(500).json({ message: `Failed to search products: ${error.message}` })
  }
}

// --- POST /api/products/search-by-image (FUNCTIONAL WITH GOOGLE CLOUD VISION) ---
exports.searchProductsByImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' })
  }
  if (!visionClient) {
    console.error(
      '[VisionAPI Search] Vision API client not initialized. Cannot perform image search.',
    )
    return res.status(500).json({ message: 'Image search service is not configured or available.' })
  }

  const imagePath = req.file.path // Path to the uploaded image by multer
  try {
    console.log(`[VisionAPI Search] Analyzing image: ${imagePath}`)

    // Performs label detection and object localization on the local file
    const [result] = await visionClient.labelDetection(imagePath)
    const detectedAnnotations = result.labelAnnotations || []

    // Optionally, you can also use objectLocalization for more specific items
    // const [objectResult] = await visionClient.objectLocalization(imagePath);
    // const localizedObjects = objectResult.localizedObjectAnnotations || [];
    // console.log('[VisionAPI Search] Localized Objects:', localizedObjects.map(obj => obj.name));

    // Filter labels: by score, and take top N.
    const labels = detectedAnnotations
      .filter((label) => label.score && label.score > 0.65 && label.description) // Filter by confidence
      .slice(0, 5) // Take top 5 relevant labels
      .map((label) => label.description.trim())
      .filter(Boolean) // Ensure no empty strings

    console.log('[VisionAPI Search] Detected and filtered labels:', labels)

    if (labels.length === 0) {
      console.log('[VisionAPI Search] No relevant labels detected for the image.')
      return res.json({ labels: [], products: [] })
    }

    // Escape regex special characters from labels
    const escapedLabels = labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

    // Construct a query to find products matching any of the labels
    // in title, category, or description
    const searchConditions = escapedLabels.flatMap((label) => [
      { title: { $regex: label, $options: 'i' } },
      { category: { $regex: label, $options: 'i' } },
      { description: { $regex: label, $options: 'i' } },
    ])

    let products = []
    if (searchConditions.length > 0) {
      const foundProducts = await Product.find({ $or: searchConditions }).limit(20) // Limit results
      products.push(...foundProducts)
    }

    // Deduplicate products
    const uniqueIds = new Set()
    const uniqueProducts = products.filter((p) => {
      const idString = p._id.toString()
      if (!uniqueIds.has(idString)) {
        uniqueIds.add(idString)
        return true
      }
      return false
    })

    console.log(
      `[VisionAPI Search] Found ${uniqueProducts.length} unique products for labels: ${labels.join(
        ', ',
      )}`,
    )
    res.json({ labels, products: uniqueProducts })
  } catch (error) {
    console.error('[VisionAPI Search] Error:', error)
    if (error.message && error.message.toLowerCase().includes('credential')) {
      return res
        .status(500)
        .json({ message: 'Image search authentication failed. Please check server logs.' })
    }
    res.status(500).json({ message: `Failed to search by image: ${error.message}` })
  } finally {
    // Clean up the uploaded file after processing
    if (imagePath) {
      try {
        await fsp.unlink(imagePath)
        console.log(`[VisionAPI Search] Cleaned up uploaded file: ${imagePath}`)
      } catch (cleanupError) {
        console.error(`[VisionAPI Search] Error cleaning up file ${imagePath}:`, cleanupError)
      }
    }
  }
}

// --- GET /api/products/new-collection (Filter by isInStock virtual) ---
exports.getNewCollectionProducts = async (req, res) => {
  try {
    const requestedLimit = parseInt(req.query.limit, 10)
    const limit = !isNaN(requestedLimit) && requestedLimit > 0 ? requestedLimit : 4 // Default to 4 or a reasonable number

    console.log(`[New Collection] Fetching up to ${limit} in-stock products.`)

    const newCollectionProducts = await Product.find({ isNewCollection: true }).sort({
      createdAt: -1,
    })

    const inStockNewCollection = newCollectionProducts
      .filter((p) => p.isInStock) // Use the virtual getter
      .slice(0, limit)

    console.log(
      `[New Collection] Found ${inStockNewCollection.length} in-stock products marked as new.`,
    )
    res.status(200).json(inStockNewCollection)
  } catch (error) {
    console.error('Error fetching new collection products:', error)
    res.status(500).json({ message: 'Failed to fetch new collection products.' })
  }
}

// --- Utility for Atomic Stock Decrease ---
async function decreaseStockAtomically(productId, size, quantityToDecrease = 1, session = null) {
  const stockField = `stockDetails.${size}`
  try {
    const updateOptions = { new: true }
    if (session) {
      updateOptions.session = session
    }

    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: productId,
        [stockField]: { $gte: quantityToDecrease },
      },
      {
        $inc: { [stockField]: -quantityToDecrease },
      },
      updateOptions,
    )

    if (!updatedProduct) {
      // More detailed check for failure reason
      const product = await Product.findById(productId).select('stockDetails').lean()
      if (!product) {
        throw new Error(`Product with ID ${productId} not found.`)
      }
      if (!product.stockDetails || product.stockDetails.get(size) === undefined) {
        throw new Error(`Size "${size}" not found in stock details for product ${productId}.`)
      }
      // If product and size exist, it means stock was insufficient
      throw new Error(
        `Insufficient stock for product ${productId}, size ${size}. Available: ${product.stockDetails.get(
          size,
        )}, Required: ${quantityToDecrease}.`,
      )
    }

    console.log(
      `Successfully decreased stock for product ${productId}, size ${size}. New quantity: ${updatedProduct.stockDetails.get(
        size,
      )}`,
    )
    return updatedProduct
  } catch (error) {
    console.error(
      `Error during atomic stock decrease for product ${productId}, size ${size}: ${error.message}`,
    )
    throw error // Re-throw to be handled by calling function
  }
}

async function decreaseStockAtomically(productId, size, quantityToDecrease = 1, session = null) {
  // session is optional, use if part of a larger transaction
  const stockField = `stockDetails.${size}` // Path to the specific size's quantity in the map

  try {
    const updateOptions = { new: true } // Return the updated document
    if (session) {
      updateOptions.session = session // Include session in options if provided
    }

    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: productId, // Find the correct product
        [stockField]: { $gte: quantityToDecrease }, // Condition: Check if stock for the specific size is sufficient
      },
      {
        $inc: { [stockField]: -quantityToDecrease }, // Action: Atomically decrease the stock for that size
      },
      updateOptions, // Pass options (includes session if any)
    )

    if (!updatedProduct) {
      // Failure reasons:
      // 1. Product ID doesn't exist.
      // 2. The 'size' key doesn't exist within the 'stockDetails' map for that product.
      // 3. The quantity for that size was less than 'quantityToDecrease' (Race condition winner or already OOS)
      console.warn(
        `Atomic stock decrease failed for product ${productId}, size ${size}, quantity ${quantityToDecrease}. Item may be unavailable or out of stock.`,
      )
      // Check if product exists at all to differentiate errors
      const productExists = await Product.findById(productId).select('_id').lean()
      if (!productExists) throw new Error(`Product with ID ${productId} not found.`)
      // Check if size exists in stockDetails
      const productSizeCheck = await Product.findOne({
        _id: productId,
        [`stockDetails.${size}`]: { $exists: true },
      })
        .select('_id')
        .lean()
      if (!productSizeCheck)
        throw new Error(`Size "${size}" not found in stock details for product ${productId}.`)

      // If product and size exist, it means stock was insufficient
      throw new Error(`Insufficient stock for product ${productId}, size ${size}.`)
    }

    console.log(
      `Successfully decreased stock for product ${productId}, size ${size}. New quantity: ${updatedProduct.stockDetails.get(
        size,
      )}`,
    )
    return updatedProduct // Success
  } catch (error) {
    console.error(
      `Error during atomic stock decrease for product ${productId}, size ${size}:`,
      error,
    )
    // Re-throw the specific error to be handled by the calling function (e.g., rollback transaction)
    throw error
  }
}

// --- Example Usage in an Order Controller (Conceptual) ---
/*
exports.createOrder = async (req, res) => {
    const { userId, items } = req.body; // items = [{ productId, size, quantity }, ...]
    const session = await mongoose.startSession(); // Start a session for transaction

    try {
        session.startTransaction(); // Begin transaction

        const orderItemsDetails = [];
        let totalAmount = 0;

        for (const item of items) {
            // 1. Atomically decrease stock within the transaction
            const updatedProduct = await decreaseStockAtomically(item.productId, item.size, item.quantity, session);

            // 2. Get price (ensure price cannot be manipulated by client)
            // Ideally, fetch the product again *within the transaction* or have validated price
             const productPrice = parseFloat(updatedProduct.price); // Use price from the reliably updated product
             if (isNaN(productPrice) || productPrice <= 0) {
                throw new Error(`Invalid price found for product ${item.productId}`);
             }

            orderItemsDetails.push({
                product: item.productId,
                size: item.size,
                quantity: item.quantity,
                priceAtOrder: productPrice // Record price at the time of order
            });
            totalAmount += productPrice * item.quantity;
        }

        // 3. Create the Order document within the transaction
        const order = new Order({ // Assuming you have an Order model
            user: userId,
            items: orderItemsDetails,
            totalAmount: totalAmount,
            status: 'Pending', // Initial status
            // ... other order fields
        });
        await order.save({ session }); // Save using the transaction session

        // 4. Commit the transaction if all steps succeeded
        await session.commitTransaction();

        res.status(201).json({ message: 'Order placed successfully!', order });

    } catch (error) {
        // 5. If any error occurred, abort the transaction
        console.error('Order creation failed, aborting transaction:', error);
        await session.abortTransaction();
        res.status(400).json({ message: error.message || 'Failed to place order. Stock might be unavailable or another error occurred.' });

    } finally {
        // 6. Always end the session
        session.endSession();
    }
};
*/
