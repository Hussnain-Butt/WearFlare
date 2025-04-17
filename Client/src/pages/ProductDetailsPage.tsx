import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext' // Verify path to CartContext
import { ChevronRight, CheckCircle, Camera } from 'lucide-react' // Added Camera icon for Try On
import { toast, Toaster } from 'react-hot-toast' // Import toast

// --- Backend API Base URL ---
// Ensure this matches your backend configuration
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app/' // Or https://backend-production-c8ff.up.railway.app/

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
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false)
  const [showAddedMessage, setShowAddedMessage] = useState<boolean>(false)

  // --- Fetch Product Data Effect ---
  useEffect(() => {
    if (!productId) {
      setError('Product ID is missing from URL.')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    const fetchProduct = async () => {
      try {
        const response = await axios.get<ProductDetail>(`${API_BASE_URL}/api/products/${productId}`)
        if (!response.data || !response.data._id) {
          throw new Error('Invalid product data received from server.')
        }
        setProduct({
          ...response.data,
          inStock: response.data.inStock ?? true,
          sizes: response.data.sizes ?? [],
          colors: response.data.colors ?? [],
        })
      } catch (err: any) {
        console.error('Fetch product error:', err)
        setError(
          err.response?.status === 404 ? 'Product not found.' : 'Failed to load product details.',
        )
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  // --- Add to Cart Handler ---
  const handleAddToCart = () => {
    if (!product || !product.inStock || isAddingToCart) {
      if (product && !product.inStock) toast.error('This item is currently out of stock.')
      return
    }
    if (product.sizes?.length && !selectedSize) {
      toast.error('Please select a size.')
      return
    }
    if (product.colors?.length && !selectedColor) {
      toast.error('Please select a color.')
      return
    }

    setIsAddingToCart(true)
    setShowAddedMessage(false)
    setTimeout(() => {
      try {
        const priceNumber = parseFloat(product.price)
        if (isNaN(priceNumber) || priceNumber < 0) throw new Error('Invalid product price.')

        const cartItemToAdd: CartItem = {
          _id: product._id,
          title: product.title,
          price: priceNumber,
          image: product.image,
          selectedSize: selectedSize,
          selectedColor: selectedColor,
          quantity: 1,
        }
        addToCart(cartItemToAdd)
        setIsAddingToCart(false)
        setShowAddedMessage(true)
        setTimeout(() => setShowAddedMessage(false), 2500)
      } catch (cartError: any) {
        console.error('Add to cart error:', cartError)
        toast.error(cartError.message || 'Could not add item to cart.')
        setIsAddingToCart(false)
      }
    }, 300)
  }

  // --- NEW: Try Now Handler ---
  const handleTryNow = () => {
    if (product && productId) {
      // Navigate to the Try On page, passing the product ID
      navigate(`/try-on/${productId}`)
    } else {
      toast.error('Cannot initiate Try On for this product.')
    }
  }
  // --- End Try Now Handler ---

  // --- Render Logic ---
  if (loading) return <div className="loading-placeholder">Loading Product Details...</div>
  if (error) return <div className="error-placeholder">{error}</div>
  if (!product) return <div className="loading-placeholder">Product data could not be loaded.</div>

  // Determine if selection is needed before enabling AddToCart
  const isSelectionNeeded =
    (product.sizes && product.sizes.length > 0 && !selectedSize) ||
    (product.colors && product.colors.length > 0 && !selectedColor)

  return (
    <div className="min-h-screen bg-white font-sans">
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
          <span className="breadcrumb-current">{product.title.toUpperCase()}</span>
        </nav>
      </div>

      {/* Main Product Details Area */}
      <div className="product-details-container">
        <div className="product-details-grid">
          {/* Image Section (Left) */}
          <div className="product-image-section">
            <div className="product-image-wrapper">
              <img
                src={`${API_BASE_URL}${product.image}`}
                alt={product.title}
                className="product-image"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x600?text=Image+Not+Found'
                }}
              />
              {!product.inStock && <div className="out-of-stock-badge-details">Out of Stock</div>}
            </div>
          </div>

          {/* Info & Actions Section (Right) */}
          <div className="product-info-section">
            <h1 className="product-title">{product.title}</h1>
            <p className="product-price">PKR {product.price}</p>
            <div className="info-row">
              <h3 className="info-label">Gender</h3>
              <span className="info-value">{product.gender.toUpperCase()}</span>
            </div>

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div className="options-section">
                <div className="options-header">
                  <h3 className="info-label">Size</h3>{' '}
                  {/* <button className="size-guide-link">Size Guide</button> */}{' '}
                </div>
                <div className="options-buttons-container">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={!product.inStock}
                      className={`size-button ${selectedSize === size ? 'selected' : ''} ${
                        !product.inStock ? 'disabled' : ''
                      }`}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection (Optional) */}
            {product.colors?.length > 0 && (
              <div className="options-section">
                <div className="options-header">
                  <h3 className="info-label">Colors</h3>
                </div>
                <div className="options-buttons-container">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      disabled={!product.inStock}
                      className={`color-button ${selectedColor === color ? 'selected' : ''} ${
                        !product.inStock ? 'disabled' : ''
                      }`}
                      aria-label={`Select color ${color}`}
                      title={color}
                      aria-pressed={selectedColor === color}
                    >
                      <span className="color-swatch" style={{ backgroundColor: color }}></span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* --- Action Buttons Container --- */}
            <div className="action-buttons-container">
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={
                  !product.inStock || isAddingToCart || showAddedMessage || isSelectionNeeded
                }
                className="add-to-cart-button primary-button" // Add general button styles
                aria-live="polite"
              >
                {!product.inStock ? (
                  'Out of Stock'
                ) : isAddingToCart ? (
                  <>
                    {' '}
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
                    </svg>{' '}
                    Adding...{' '}
                  </>
                ) : showAddedMessage ? (
                  <>
                    {' '}
                    <CheckCircle className="-ml-1 mr-2 h-5 w-5" /> Added!{' '}
                  </>
                ) : (
                  'Add To Cart'
                )}
              </button>

              {/* --- NEW Try Now Button --- */}
              <button
                onClick={handleTryNow}
                // Disable Try Now only if the product is out of stock.
                // Size/color selection might not be needed for Try On. Adjust if needed.
                disabled={!product.inStock}
                className="try-on-button secondary-button" // Add different styles
                aria-label="Try this item on virtually"
              >
                <Camera className="-ml-1 mr-2 h-5 w-5" /> {/* Example icon */}
                Try Now
              </button>
              {/* --- End Try Now Button --- */}

              {/* Selection prompt text */}
              {product.inStock && isSelectionNeeded && !isAddingToCart && !showAddedMessage && (
                <p className="selection-prompt full-width-prompt">
                  Please select {product.sizes?.length && !selectedSize ? 'size' : ''}
                  {product.sizes?.length &&
                  !selectedSize &&
                  product.colors?.length &&
                  !selectedColor
                    ? ' and '
                    : ''}
                  {product.colors?.length && !selectedColor ? 'color' : ''} to add to cart.
                </p>
              )}
            </div>
            {/* --- End Action Buttons Container --- */}

            {/* Product Description Section */}
            {product.description?.trim() && (
              <div className="description-section">
                <h3 className="description-title">Description</h3>
                <p className="description-text">{product.description.trim()}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Inline CSS for Basic Styling --- */}
      {/* (Keep the existing styles from the previous response) */}
      <style jsx>{`
            /* General Placeholders */
            .loading-placeholder, .error-placeholder { display: flex; justify-content: center; align-items: center; min-height: 60vh; padding: 1rem; text-align: center; font-size: 1.1rem; color: #6b7280; }
            .error-placeholder { background-color: #fee2e2; color: #b91c1c; font-weight: 500; }

            /* Breadcrumbs */
            .breadcrumb-container { width: 100%; padding: 0.75rem 1rem; background-color: #f3f4f6; border-bottom: 1px solid #e5e7eb; }
            .breadcrumb-nav { max-width: 80rem; margin-left: auto; margin-right: auto; display: flex; align-items: center; font-size: 0.875rem; color: #6b7280; }
            .breadcrumb-link { text-transform: uppercase; transition: color 0.2s; }
            .breadcrumb-link:hover { color: #c8a98a; }
            .breadcrumb-current { text-transform: uppercase; font-weight: 500; color: #374151; }
            .breadcrumb-separator { height: 1rem; width: 1rem; margin: 0 0.25rem; color: #9ca3af; }

            /* Main Layout */
            .product-details-container { max-width: 80rem; margin-left: auto; margin-right: auto; padding: 2rem 1rem; md:padding: 3rem 1.5rem; lg:padding: 4rem 2rem; }
            .product-details-grid { display: flex; flex-direction: column; gap: 2rem; }
            @media (min-width: 1024px) { .product-details-grid { flex-direction: row; gap: 3rem; } }

            /* Image Section */
            .product-image-section { flex: 1; display: flex; justify-content: center; align-items: flex-start; }
            .product-image-wrapper { background-color: #f9fafb; border-radius: 0.5rem; overflow: hidden; width: 100%; max-width: 32rem; aspect-ratio: 1 / 1; position: relative; border: 1px solid #f3f4f6; }
            .product-image { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center; transition: transform 0.3s ease; }
            .out-of-stock-badge-details { position: absolute; top: 0.75rem; right: 0.75rem; background-color: rgba(239, 68, 68, 0.9); color: white; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.6rem; border-radius: 0.25rem; z-index: 10; }

            /* Info Section */
            .product-info-section { flex: 1; display: flex; flex-direction: column; }
            .product-title { font-size: 1.875rem; lg:font-size: 2.25rem; font-weight: 700; color: #111827; margin-bottom: 0.75rem; line-height: 1.2; }
            .product-price { font-size: 1.5rem; font-weight: 600; color: #1f2937; margin-bottom: 1.5rem; }
            .info-row { display: flex; align-items: center; margin-bottom: 1rem; }
            .info-label { font-size: 0.875rem; font-weight: 600; color: #111827; width: 5rem; text-transform: uppercase; flex-shrink: 0; }
            .info-value { font-size: 0.875rem; color: #4b5563; text-transform: uppercase; }

            /* Options (Sizes/Colors) */
            .options-section { margin-bottom: 1.5rem; }
            .options-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
            .size-guide-link { font-size: 0.8rem; sm:font-size: 0.875rem; font-weight: 500; color: #c8a98a; text-decoration: underline; cursor: pointer; }
            .size-guide-link:hover { color: #a88a6a; }
            .options-buttons-container { display: flex; flex-wrap: wrap; gap: 0.5rem; }
            .size-button { padding: 0.375rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.875rem; transition: all 0.2s ease-in-out; cursor: pointer; background-color: white; color: #374151; min-width: 40px; text-align: center; }
            .size-button:hover:not(.selected):not(.disabled) { border-color: #6b7280; }
            .size-button.selected { background-color: #c8a98a; color: white; border-color: #c8a98a; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
            .size-button:focus:not(.selected) { outline: none; box-shadow: 0 0 0 2px rgba(200, 169, 138, 0.4); }
            .size-button.disabled { opacity: 0.5; cursor: not-allowed; background-color: #f3f4f6; color: #9ca3af; border-color: #e5e7eb; }
            .color-button { width: 2rem; height: 2rem; border-radius: 9999px; border: 2px solid #d1d5db; padding: 2px; transition: all 0.2s ease-in-out; cursor: pointer; background-clip: content-box; }
            .color-button:hover:not(.selected):not(.disabled) { border-color: #6b7280; }
            .color-button.selected { border-color: #c8a98a; box-shadow: 0 0 0 1px #c8a98a; }
            .color-button:focus { outline: none; box-shadow: 0 0 0 2px rgba(200, 169, 138, 0.4); }
            .color-button.disabled { opacity: 0.5; cursor: not-allowed; }
            .color-swatch { display: block; width: 100%; height: 100%; border-radius: 9999px; }

            /* Action Buttons Container */
            .action-buttons-container {
                padding-top: 1rem;
                margin-top: auto; /* Pushes buttons down */
                display: flex;
                flex-direction: column; /* Stack buttons */
                gap: 0.75rem; /* Space between buttons */
            }

            /* General Button Styles (apply to both) */
            .primary-button, .secondary-button {
                width: 100%; display: inline-flex; justify-content: center; align-items: center; padding: 0.75rem 1.5rem; border-radius: 0.375rem; font-size: 1rem; font-weight: 500; transition: background-color 0.3s, opacity 0.3s; cursor: pointer; border: 1px solid transparent; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            }
            .primary-button:disabled, .secondary-button:disabled { opacity: 0.6; cursor: not-allowed; }
            .primary-button svg, .secondary-button svg { height: 1.25rem; width: 1.25rem; } /* Icon size */
            .primary-button svg.animate-spin { animation: spin 1s linear infinite; }

            /* Add to Cart Specific Styles */
            .add-to-cart-button { background-color: #c8a98a; color: white; }
            .add-to-cart-button:hover:not(:disabled) { background-color: #b08d6a; }

            /* Try Now Specific Styles */
            .try-on-button { background-color: #c8a98a; /* SaddleBrown - distinct color */ color: white; }
            .try-on-button:hover:not(:disabled) { background-color: #70421e; /* Darker brown */ }

             /* Selection prompt text */
            .selection-prompt { font-size: 0.75rem; color: #dc2626; margin-top: 0.5rem; text-align: center; }
            .full-width-prompt { width: 100%; /* Ensure prompt takes full width if needed */ }


            /* Description Section */
            .description-section { margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; }
            .description-title { font-size: 1rem; font-weight: 600; color: #111827; margin-bottom: 0.5rem; }
            .description-text { font-size: 0.875rem; color: #4b5563; white-space: pre-line; line-height: 1.6; word-break: break-word; }

             /* Loading spinner keyframes */
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        `}</style>
    </div>
  )
}

export default ProductDetailsPage
