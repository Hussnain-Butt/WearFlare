// controllers/productController.js
const path = require('path')
const Product = require('../models/Product')
const mongoose = require('mongoose') // Import mongoose for transactions (if needed later)

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
          // Optionally throw an error here if strict validation is needed
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
    const currentProduct = await Product.findById(id).select('sizes')
    if (!currentProduct) {
      return res.status(404).json({ message: 'Product not found.' })
    }

    // Handle simple field updates
    if (title !== undefined) updatedFields.title = title.trim()
    if (price !== undefined) updatedFields.price = String(price).trim()
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

      // --- Validation: Ensure stock map isn't empty if final sizes array is not empty ---
      if (finalSizesArray.length > 0 && stockDetailsMap.size === 0) {
        return res
          .status(400)
          .json({ message: 'Stock details cannot be empty when sizes are defined.' })
      }

      // --- Validation: Stock sizes must match the final list of available sizes ---
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
      // --- Validation: Ensure all final sizes have a stock entry ---
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
      updatedFields.image = `/uploads/${req.file.filename}`
      console.log(`[UpdateProduct ${id}] Processing image update.`)
      // Optional: Add logic here to delete the old image file
    }

    // Check if any fields were actually provided for update
    if (Object.keys(updatedFields).length === 0 && !req.file) {
      console.log(`[UpdateProduct ${id}] No fields provided for update.`)
      // Return 304 Not Modified or the current product data? Or 400?
      // Let's return the current data as no update was performed.
      const product = await Product.findById(id)
      return res.status(200).json(product) // Return current product
      // return res.status(400).json({ message: 'No update fields provided.' });
    }

    console.log(`[UpdateProduct ${id}] Updating with fields:`, JSON.stringify(updatedFields))

    // Use findByIdAndUpdate with $set for partial updates
    // Mongoose 'save' hooks (like our pre-save) DO NOT run on findByIdAndUpdate by default.
    // If you need the pre-save hook to run for standardization, you'd need to:
    // 1. Find the document: `const doc = await Product.findById(id);`
    // 2. Apply updates: `Object.assign(doc, updatedFields);`
    // 3. Save the document: `const updatedProduct = await doc.save();`
    // However, this is less atomic. Let's rely on controller validation for now.
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updatedFields }, // Use $set to only update provided fields
      { new: true, runValidators: true, context: 'query' }, // Run schema validators on update
    )

    if (!updatedProduct) {
      // This case should be covered by the initial findById check, but keep for safety
      console.log(`[UpdateProduct ${id}] Product not found during update.`)
      return res.status(404).json({ message: 'Product not found' })
    }

    console.log(`[UpdateProduct ${id}] Update successful.`)
    res.json(updatedProduct) // Returns updated product with virtuals
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

// --- DELETE /api/products/:id (No changes needed regarding stock logic) ---
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    const deletedProduct = await Product.findByIdAndDelete(id)
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' })
    // Optional: Delete associated image file
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

    // Return the full product details. Frontend (details page) can use stockDetails.
    res.json(product) // Includes virtuals and stockDetails map
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    if (error.name === 'CastError' && error.path === '_id')
      return res.status(400).json({ message: 'Invalid Product ID format.' })
    res.status(500).json({ message: `Failed to fetch product: ${error.message}` })
  }
}

// --- GET /api/products/search (No changes needed) ---
exports.searchProducts = async (req, res) => {
  // ... (Existing search logic - searches category, returns matching products with virtuals)
  try {
    const { query } = req.query
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return res.status(400).json({ message: 'Search query required.' })
    }
    const trimmedQuery = query.trim()
    const products = await Product.find({
      category: { $regex: trimmedQuery, $options: 'i' },
    })
    res.json(products) // Includes virtuals
  } catch (error) {
    console.error('Error searching products:', error)
    res.status(500).json({ message: `Failed to search products: ${error.message}` })
  }
}

// --- POST /api/products/search-by-image (No changes needed) ---
exports.searchProductsByImage = async (req, res) => {
  // ... (Existing image search logic)
  // Returns products found based on image labels - includes virtuals
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' })
    // Placeholder for image analysis
    const labels = ['ExampleLabel1', 'ExampleLabel2'] // Replace with actual labels
    let products = []
    for (let label of labels) {
      const foundProducts = await Product.find({ title: { $regex: label, $options: 'i' } })
      products.push(...foundProducts)
    }
    const uniqueIds = new Set()
    const uniqueProducts = products.filter((p) => {
      const idString = p._id.toString()
      if (!uniqueIds.has(idString)) {
        uniqueIds.add(idString)
        return true
      }
      return false
    })
    res.json({ labels, products: uniqueProducts }) // Includes virtuals
  } catch (error) {
    console.error('Image Search Error:', error)
    res.status(500).json({ message: `Failed to search by image: ${error.message}` })
  }
}

// --- GET /api/products/new-collection (Filter by isInStock virtual) ---
exports.getNewCollectionProducts = async (req, res) => {
  try {
    const requestedLimit = parseInt(req.query.limit, 10)
    const limit = !isNaN(requestedLimit) && requestedLimit > 0 ? requestedLimit : 3

    console.log(`[New Collection] Fetching up to ${limit} in-stock products.`)

    // Find products marked as new collection
    const newCollectionProducts = await Product.find({ isNewCollection: true }).sort({
      createdAt: -1,
    }) // Fetch all new first

    // Filter results based on the 'isInStock' virtual property AFTER fetching
    const inStockNewCollection = newCollectionProducts
      .filter((p) => p.isInStock) // Use the virtual getter
      .slice(0, limit) // Apply limit to the filtered results

    console.log(
      `[New Collection] Found ${inStockNewCollection.length} in-stock products marked as new.`,
    )
    res.status(200).json(inStockNewCollection) // Send filtered list (includes virtuals)
  } catch (error) {
    console.error('Error fetching new collection products:', error)
    res.status(500).json({ message: 'Failed to fetch new collection products.' })
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
