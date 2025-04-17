import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext' // Verify path to CartContext
import { ChevronRight, CheckCircle } from 'lucide-react' // Removed ShoppingCart if not used directly
import { toast, Toaster } from 'react-hot-toast' // Import toast

// --- Backend API Base URL ---
// Ensure this matches your backend configuration
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app' // Or https://backend-production-c8ff.up.railway.app

// --- Updated Product Detail Interface ---
interface ProductDetail {
  _id: string
  title: string
  price: string // Keep as string if backend consistently sends string
  category: string
  gender: string
  image: string // Backend path like /uploads/image.jpg
  description?: string
  inStock: boolean // Added inStock status
  sizes?: string[] // Added sizes array
  colors?: string[] // Optional: Keep if you implement colors
  // fit?: string;    // Optional: Keep if you implement fit
}

// --- Cart Item Interface (from CartContext, ensure consistency) ---
// Define it here if not exported from context, or import it
interface CartItem {
  _id: string
  title: string
  price: number // Use number for calculations
  image: string
  selectedSize: string | null
  selectedColor?: string | null // Optional color
  quantity: number
}

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>() // Get product ID from URL
  const navigate = useNavigate()
  const { addToCart } = useCart() // Get addToCart function from context

  // --- Component State ---
  const [product, setProduct] = useState<ProductDetail | null>(null) // Holds the fetched product data
  const [loading, setLoading] = useState<boolean>(true) // Loading state for initial fetch
  const [error, setError] = useState<string | null>(null) // Error message state
  const [selectedSize, setSelectedSize] = useState<string | null>(null) // Currently selected size
  const [selectedColor, setSelectedColor] = useState<string | null>(null) // Currently selected color (if using)
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false) // Loading state for Add to Cart button
  const [showAddedMessage, setShowAddedMessage] = useState<boolean>(false) // State for "Added!" message

  // --- Fetch Product Data Effect ---
  useEffect(() => {
    // Validate productId
    if (!productId) {
      setError('Product ID is missing from URL.')
      setLoading(false)
      return
    }

    setLoading(true) // Start loading indicator
    setError(null) // Reset error state

    const fetchProduct = async () => {
      try {
        const response = await axios.get<ProductDetail>(`${API_BASE_URL}/api/products/${productId}`)

        // Basic validation of received data
        if (!response.data || !response.data._id) {
          throw new Error('Invalid product data received from server.')
        }

        // Set product state, ensuring defaults for potentially missing fields
        setProduct({
          ...response.data,
          inStock: response.data.inStock ?? true, // Default inStock if missing
          sizes: response.data.sizes ?? [], // Default sizes array if missing
          colors: response.data.colors ?? [], // Default colors array if missing
        })
      } catch (err: any) {
        console.error('Fetch product error:', err)
        // Provide more specific error messages
        if (err.response?.status === 404) {
          setError('Product not found.')
        } else {
          setError('Failed to load product details. Please try refreshing the page.')
        }
      } finally {
        setLoading(false) // Stop loading indicator
      }
    }

    fetchProduct() // Execute fetch function
  }, [productId]) // Re-run effect if productId changes

  // --- Add to Cart Handler ---
  const handleAddToCart = () => {
    // Ensure product exists, is in stock, and not already adding
    if (!product || !product.inStock || isAddingToCart) {
      if (product && !product.inStock) {
        toast.error('This item is currently out of stock.')
      }
      return
    }

    // --- Size and Color Selection Validation ---
    // Check if sizes are available and one hasn't been selected
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size.')
      return
    }
    // Check if colors are available and one hasn't been selected (if using colors)
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color.')
      return
    }

    // --- Proceed with Adding to Cart ---
    setIsAddingToCart(true) // Set loading state for button
    setShowAddedMessage(false) // Hide previous success message

    // Simulate network delay/processing
    setTimeout(() => {
      try {
        // Validate and parse the price to a number for cart calculations
        const priceNumber = parseFloat(product.price)
        if (isNaN(priceNumber) || priceNumber < 0) {
          console.error('Invalid product price format:', product.price)
          throw new Error('Invalid product price.') // Throw error to be caught below
        }

        // Create the item object for the cart
        const cartItemToAdd: CartItem = {
          _id: product._id,
          title: product.title,
          price: priceNumber, // Use the validated number
          image: product.image, // Pass the image path
          selectedSize: selectedSize, // Include the selected size
          selectedColor: selectedColor, // Include selected color (optional)
          quantity: 1, // Default quantity
        }

        // Call the addToCart function from context
        addToCart(cartItemToAdd)

        // Update UI state for success
        setIsAddingToCart(false) // Stop loading
        setShowAddedMessage(true) // Show "Added!" message
        // Optional: Reset selections after adding?
        // setSelectedSize(null);
        // setSelectedColor(null);

        // Hide the "Added!" message after a short delay
        setTimeout(() => setShowAddedMessage(false), 2500)
      } catch (cartError: any) {
        // Handle potential errors during price parsing or adding to cart
        console.error('Add to cart process error:', cartError)
        toast.error(cartError.message || 'Could not add item to cart. Please try again.')
        setIsAddingToCart(false) // Ensure loading state is reset on error
      }
    }, 300) // Short simulated delay (e.g., 300ms)
  }

  // --- Conditional Rendering for Loading/Error/NotFound States ---
  if (loading) {
    return <div className="loading-placeholder">Loading Product Details...</div>
  }
  if (error) {
    return <div className="error-placeholder">{error}</div>
  }
  if (!product) {
    // This case might be covered by the 404 error handling, but good as a fallback
    return <div className="loading-placeholder">Product data could not be loaded.</div>
  }

  // --- Main Component Render ---
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Include Toaster for notifications */}
      <Toaster position="top-center" reverseOrder={false} />
      {/* Breadcrumbs Section */}
      <div className="breadcrumb-container">
        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb-link">
            HOME
          </Link>
          <ChevronRight className="breadcrumb-separator" />
          <Link to={`/${product.gender.toLowerCase()}`} className="breadcrumb-link">
            {product.gender.toUpperCase()}
          </Link>
          {/* Conditionally show category breadcrumb */}
          {product.category && (
            <>
              <ChevronRight className="breadcrumb-separator" />
              <Link
                to={`/${product.gender.toLowerCase()}?category=${product.category}`}
                className="breadcrumb-link"
              >
                {product.category.toUpperCase()}
              </Link>
            </>
          )}
          <ChevronRight className="breadcrumb-separator" />
          {/* Current product title */}
          <span className="breadcrumb-current">{product.title.toUpperCase()}</span>
        </nav>
      </div>
      {/* Main Product Details Area */}
      <div className="product-details-container">
        <div className="product-details-grid">
          {/* Image Section (Left) */}
          <div className="product-image-section">
            <div className="product-image-wrapper">
              {/* Construct full image URL */}
              <img
                src={`${API_BASE_URL}${product.image}`}
                alt={product.title}
                className="product-image"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x600?text=Image+Not+Found'
                }} // Fallback
              />
              {/* Out of Stock Badge Overlay */}
              {!product.inStock && <div className="out-of-stock-badge-details">Out of Stock</div>}
            </div>
          </div>
          {/* Info & Actions Section (Right) */}
          <div className="product-info-section">
            {/* Product Title */}
            <h1 className="product-title">{product.title}</h1>
            {/* Product Price */}
            <p className="product-price">PKR {product.price}</p>

            {/* Gender Information */}
            <div className="info-row">
              <h3 className="info-label">Gender</h3>
              <span className="info-value">{product.gender.toUpperCase()}</span>
            </div>

            {/* --- Size Selection --- */}
            {/* Only render if sizes array exists and has items */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="options-section">
                <div className="options-header">
                  <h3 className="info-label">Size</h3>
                  {/* Optional: Link to a size guide modal or page */}
                  <button className="size-guide-link">Size Guide</button>
                </div>
                <div className="options-buttons-container">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      // Disable size buttons if the product is out of stock
                      disabled={!product.inStock}
                      className={`size-button
                        ${selectedSize === size ? 'selected' : ''}
                        ${!product.inStock ? 'disabled' : ''}
                      `}
                      aria-pressed={selectedSize === size} // Accessibility
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* --- End Size Selection --- */}

            {/* --- Color Selection (Optional) --- */}
            {/* Only render if colors array exists and has items */}
            {product.colors && product.colors.length > 0 && (
              <div className="options-section">
                <div className="options-header">
                  <h3 className="info-label">Colors</h3>
                </div>
                <div className="options-buttons-container">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      // Disable color buttons if the product is out of stock
                      disabled={!product.inStock}
                      className={`color-button
                                    ${selectedColor === color ? 'selected' : ''}
                                    ${!product.inStock ? 'disabled' : ''}
                                `}
                      aria-label={`Select color ${color}`}
                      title={color} // Tooltip for color name/hex
                      aria-pressed={selectedColor === color} // Accessibility
                    >
                      {/* Swatch */}
                      <span className="color-swatch" style={{ backgroundColor: color }}></span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* --- End Color Selection --- */}

            {/* --- Add to Cart Button and Status --- */}
            <div className="add-to-cart-section">
              <button
                onClick={handleAddToCart}
                // More robust disable logic
                disabled={
                  !product.inStock || // Can't add if out of stock
                  isAddingToCart || // Can't add while already adding
                  showAddedMessage || // Temporarily disable after adding
                  (product.sizes && product.sizes.length > 0 && !selectedSize) || // Disable if size needed but not selected
                  (product.colors && product.colors.length > 0 && !selectedColor) // Disable if color needed but not selected (if using colors)
                }
                className="add-to-cart-button"
                aria-live="polite" // Announce changes in button text
              >
                {/* Dynamically change button text based on state */}
                {!product.inStock ? (
                  'Out of Stock'
                ) : isAddingToCart ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Adding...
                  </>
                ) : showAddedMessage ? (
                  <>
                    <CheckCircle className="-ml-1 mr-2 h-5 w-5" />
                    Added to Cart!
                  </>
                ) : (
                  'Add To Cart'
                )}
              </button>

              {/* Helper text prompting selection if needed and in stock */}
              {product.inStock &&
                product.sizes?.length > 0 &&
                !selectedSize &&
                !isAddingToCart &&
                !showAddedMessage && (
                  <p className="selection-prompt">Please select a size to add to cart.</p>
                )}
              {/* Add similar prompt for color if using colors */}
              {/* {product.inStock && (product.colors?.length > 0 && !selectedColor) && !isAddingToCart && !showAddedMessage && (
                 <p className="selection-prompt">Please select a color to add to cart.</p>
               )} */}
            </div>

            {/* Product Description Section */}
            {/* Only render if description exists and is not just whitespace */}
            {product.description && product.description.trim() && (
              <div className="description-section">
                <h3 className="description-title">Description</h3>
                {/* Use pre-line to respect newlines from the description */}
                <p className="description-text">{product.description.trim()}</p>
              </div>
            )}

            {/* --- OPTIONAL: Add other sections like Product Details & Composition, Delivery etc. --- */}
            {/* Example Accordion Structure (requires state management for open/closed) */}
            {/* <div className="details-accordion">
                 <button className="accordion-header">Product Details & Composition</button>
                 <div className="accordion-content">...</div>
                 <button className="accordion-header">Deliveries & Returns</button>
                 <div className="accordion-content">...</div>
            </div> */}
          </div>{' '}
          {/* End Info & Actions Section */}
        </div>{' '}
        {/* End Grid */}
      </div>{' '}
      {/* End Main Container */}
      {/* --- Inline CSS for Basic Styling (Consider moving to a CSS file or using Tailwind) --- */}
      <style jsx>{`
            /* General Placeholders */
            .loading-placeholder, .error-placeholder { display: flex; justify-content: center; align-items: center; min-height: 60vh; padding: 1rem; text-align: center; font-size: 1.1rem; color: #6b7280; }
            .error-placeholder { background-color: #fee2e2; color: #b91c1c; font-weight: 500; }

            /* Breadcrumbs */
            .breadcrumb-container { width: 100%; padding: 0.75rem 1rem; /* py-3 px-4 */ background-color: #f3f4f6; /* bg-gray-100 */ border-bottom: 1px solid #e5e7eb; /* border-gray-200 */ }
            .breadcrumb-nav { max-width: 80rem; /* max-w-7xl */ margin-left: auto; margin-right: auto; display: flex; align-items: center; font-size: 0.875rem; /* text-sm */ color: #6b7280; /* text-gray-500 */ }
            .breadcrumb-link { text-transform: uppercase; transition: color 0.2s; }
            .breadcrumb-link:hover { color: #c8a98a; }
            .breadcrumb-current { text-transform: uppercase; font-weight: 500; color: #374151; /* text-gray-700 */ }
            .breadcrumb-separator { height: 1rem; width: 1rem; margin: 0 0.25rem; color: #9ca3af; /* text-gray-400 */ }

            /* Main Layout */
            .product-details-container { max-width: 80rem; margin-left: auto; margin-right: auto; padding: 2rem 1rem; /* py-8 px-4 */ md:padding: 3rem 1.5rem; lg:padding: 4rem 2rem; }
            .product-details-grid { display: flex; flex-direction: column; gap: 2rem; }
            @media (min-width: 1024px) { /* lg breakpoint */
                .product-details-grid { flex-direction: row; gap: 3rem; /* lg:gap-x-12 */ }
            }

            /* Image Section */
            .product-image-section { flex: 1; display: flex; justify-content: center; align-items: flex-start; }
            .product-image-wrapper { background-color: #f9fafb; /* Slightly lighter than breadcrumbs */ border-radius: 0.5rem; /* rounded-lg */ overflow: hidden; width: 100%; max-width: 32rem; /* Adjust as needed */ aspect-ratio: 1 / 1; position: relative; border: 1px solid #f3f4f6; }
            .product-image { display: block; width: 100%; height: 100%; object-fit: cover; /* or contain */ object-position: center; transition: transform 0.3s ease; }
             /* .product-image:hover { transform: scale(1.03); } Optional zoom effect */
            .out-of-stock-badge-details { position: absolute; top: 0.75rem; right: 0.75rem; background-color: rgba(239, 68, 68, 0.9); /* bg-red-500 with opacity */ color: white; font-size: 0.75rem; /* text-xs */ font-weight: 600; padding: 0.25rem 0.6rem; border-radius: 0.25rem; z-index: 10; }

            /* Info Section */
            .product-info-section { flex: 1; display: flex; flex-direction: column; }
            .product-title { font-size: 1.875rem; /* text-3xl */ lg:font-size: 2.25rem; /* text-4xl */ font-weight: 700; /* font-bold */ color: #111827; /* text-gray-900 */ margin-bottom: 0.75rem; line-height: 1.2; }
            .product-price { font-size: 1.5rem; /* text-2xl */ font-weight: 600; /* font-semibold */ color: #1f2937; /* text-gray-800 */ margin-bottom: 1.5rem; }
            .info-row { display: flex; align-items: center; margin-bottom: 1rem; }
            .info-label { font-size: 0.875rem; /* text-sm */ font-weight: 600; color: #111827; width: 5rem; /* Adjust as needed */ text-transform: uppercase; flex-shrink: 0; }
            .info-value { font-size: 0.875rem; color: #4b5563; /* text-gray-700 */ text-transform: uppercase; }

            /* Options (Sizes/Colors) */
            .options-section { margin-bottom: 1.5rem; }
            .options-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
            .size-guide-link { font-size: 0.8rem; /* text-xs */ sm:font-size: 0.875rem; /* sm:text-sm */ font-weight: 500; color: #c8a98a; text-decoration: underline; cursor: pointer; }
            .size-guide-link:hover { color: #a88a6a; }
            .options-buttons-container { display: flex; flex-wrap: wrap; gap: 0.5rem; }

            /* Size Buttons */
            .size-button { padding: 0.375rem 0.75rem; border: 1px solid #d1d5db; /* border-gray-300 */ border-radius: 0.375rem; /* rounded-md */ font-size: 0.875rem; /* text-sm */ transition: all 0.2s ease-in-out; cursor: pointer; background-color: white; color: #374151; /* text-gray-700 */ min-width: 40px; text-align: center; }
            .size-button:hover:not(.selected):not(.disabled) { border-color: #6b7280; /* hover:border-gray-500 */ }
            .size-button.selected { background-color: #c8a98a; color: white; border-color: #c8a98a; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
            .size-button:focus:not(.selected) { outline: none; box-shadow: 0 0 0 2px rgba(200, 169, 138, 0.4); } /* Focus ring */
            .size-button.disabled { opacity: 0.5; cursor: not-allowed; background-color: #f3f4f6; color: #9ca3af; border-color: #e5e7eb; }

            /* Color Buttons (Example) */
            .color-button { width: 2rem; height: 2rem; border-radius: 9999px; /* rounded-full */ border: 2px solid #d1d5db; /* border-gray-300 */ padding: 2px; /* Adjust for border visibility */ transition: all 0.2s ease-in-out; cursor: pointer; background-clip: content-box; /* Show background color inside padding */}
            .color-button:hover:not(.selected):not(.disabled) { border-color: #6b7280; }
            .color-button.selected { border-color: #c8a98a; box-shadow: 0 0 0 1px #c8a98a; } /* Ring effect */
            .color-button:focus { outline: none; box-shadow: 0 0 0 2px rgba(200, 169, 138, 0.4); } /* Focus ring */
            .color-button.disabled { opacity: 0.5; cursor: not-allowed; }
            .color-swatch { display: block; width: 100%; height: 100%; border-radius: 9999px; }

            /* Add to Cart Section */
            .add-to-cart-section { padding-top: 1rem; margin-top: auto; /* Pushes button down if content above is short */ }
            .add-to-cart-button { width: 100%; display: inline-flex; justify-content: center; align-items: center; padding: 0.75rem 1.5rem; /* py-3 px-6 */ border: 1px solid transparent; border-radius: 0.375rem; /* rounded-md */ box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */ font-size: 1rem; /* text-base */ font-weight: 500; /* font-medium */ color: white; background-color: #c8a98a; transition: background-color 0.3s, opacity 0.3s; cursor: pointer; }
            .add-to-cart-button:hover:not(:disabled) { background-color: #b08d6a; /* Darken color */ }
            .add-to-cart-button:disabled { opacity: 0.6; cursor: not-allowed; }
            .add-to-cart-button svg { height: 1.25rem; width: 1.25rem; } /* Size for icons */
             /* Loading spinner animation */
            .add-to-cart-button svg.animate-spin { animation: spin 1s linear infinite; }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
             /* Selection prompt text */
            .selection-prompt { font-size: 0.75rem; /* text-xs */ color: #dc2626; /* text-red-600 */ margin-top: 0.5rem; text-align: center; }

            /* Description Section */
            .description-section { margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; /* border-gray-200 */ }
            .description-title { font-size: 1rem; /* text-base */ font-weight: 600; color: #111827; margin-bottom: 0.5rem; }
            .description-text { font-size: 0.875rem; /* text-sm */ color: #4b5563; /* text-gray-700 */ white-space: pre-line; /* Respect newlines */ line-height: 1.6; /* Improve readability */ word-break: break-word; }

        `}</style>
    </div> // End Page Container
  )
}

export default ProductDetailsPage
