// src/pages/ProductDetailsPage.tsx
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext' // Verify path is correct
import { ChevronRight, CheckCircle, Camera, XCircle } from 'lucide-react' // Icons
import { toast, Toaster } from 'react-hot-toast'

// --- Backend API Base URL ---
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app' // Adjust if your backend runs elsewhere

// --- Product Detail Interface from API ---
interface ProductDetail {
  _id: string
  title: string
  price: string // Keeping as string for display consistency from backend
  category: string
  gender: string
  image: string // Backend relative path like /uploads/image.jpg
  description?: string
  isInStock?: boolean // Virtual property: overall stock status (any size > 0)
  sizes?: string[] // Array of available sizes e.g., ['S', 'M', 'L']
  stockDetails?: Record<string, number> // Map-like object { 'S': 10, 'M': 0, 'L': 5 }
  colors?: string[] // Optional: If you implement color variants
}

// --- Cart Item Interface (Must match CartContext definition including availableStock) ---
interface CartItemForContext {
  _id: string
  title: string
  price: number // Use number type for calculations in cart
  image: string
  selectedSize: string | null // Size is mandatory if product has sizes
  selectedColor?: string | null // Optional color
  quantity: number
  availableStock: number // *** This MUST be included ****
}

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>() // Get product ID from URL params
  const navigate = useNavigate()
  const { addToCart, cart } = useCart() // Access cart context and current cart state

  // --- Component State ---
  const [product, setProduct] = useState<ProductDetail | null>(null) // Holds fetched product data
  const [loading, setLoading] = useState<boolean>(true) // Loading indicator state
  const [error, setError] = useState<string | null>(null) // Error message state
  const [selectedSize, setSelectedSize] = useState<string | null>(null) // Tracks the user's selected size
  const [selectedColor, setSelectedColor] = useState<string | null>(null) // Tracks selected color (if applicable)
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false) // Loading state for AddToCart button
  const [showAddedMessage, setShowAddedMessage] = useState<boolean>(false) // State to show "Added!" message

  // --- Derived State ---
  // Check if the currently selected size has stock > 0
  const stockForSelectedSize =
    selectedSize && product?.stockDetails ? product.stockDetails[selectedSize] ?? 0 : 0
  const isSelectedSizeAvailable = stockForSelectedSize > 0

  // Helper booleans for readability
  const hasSizes = product?.sizes && product.sizes.length > 0
  const hasColors = product?.colors && product.colors.length > 0 // Keep if using colors

  // --- Fetch Product Data Effect ---
  useEffect(() => {
    if (!productId) {
      setError('Product ID is missing from the URL.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    setSelectedSize(null)
    setSelectedColor(null)
    setProduct(null)

    const fetchProduct = async () => {
      try {
        const response = await axios.get<ProductDetail>(`${API_BASE_URL}/api/products/${productId}`)

        if (!response.data || !response.data._id) {
          throw new Error('Invalid product data received from the server.')
        }

        // Ensure stockDetails is an object even if null/undefined from backend
        const stockDetailsObject = response.data.stockDetails ?? {}

        setProduct({
          ...response.data,
          isInStock: response.data.isInStock ?? false,
          sizes: response.data.sizes ?? [],
          stockDetails: stockDetailsObject, // Set the validated object
          colors: response.data.colors ?? [],
        })

        // Auto-select first AVAILABLE size if sizes exist
        if (response.data.sizes && response.data.sizes.length > 0) {
          const firstAvailableSize = response.data.sizes.find(
            (size) => stockDetailsObject[size] > 0,
          )
          setSelectedSize(firstAvailableSize || null) // Select first available or null if none are
        }
      } catch (err: any) {
        console.error('Fetch product error:', err)
        if (err.response?.status === 404) {
          setError('Product not found.')
        } else if (err.request) {
          setError('Could not connect to the server. Please check your connection.')
        } else {
          setError('Failed to load product details. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  // --- Size Selection Handler ---
  const handleSelectSize = (size: string) => {
    setSelectedSize(size)
  }

  // --- Add to Cart Handler ---
  const handleAddToCart = () => {
    // Prevent action if already processing or product unavailable
    if (!product || !product.isInStock || isAddingToCart || showAddedMessage) {
      if (product && !product.isInStock) toast.error('This item is currently out of stock.')
      return
    }

    // Check if required selections are made
    if (hasSizes && !selectedSize) {
      toast.error('Please select a size first.')
      return
    }
    if (hasColors && !selectedColor) {
      toast.error('Please select a color first.')
      return
    }

    // --- CRITICAL STOCK CHECK for the SELECTED size ---
    // Re-check just before adding
    if (hasSizes && selectedSize && !isSelectedSizeAvailable) {
      toast.error(`Sorry, size ${selectedSize} is currently out of stock.`)
      return // Stop the process
    }

    // --- Check against current cart quantity ---
    const currentCartItem = cart.find(
      (item) => item._id === product._id && item.selectedSize === selectedSize, // && item.selectedColor === selectedColor // Add color if needed
    )
    const currentQuantityInCart = currentCartItem ? currentCartItem.quantity : 0

    // Check if adding one more exceeds available stock (using derived stockForSelectedSize)
    if (currentQuantityInCart + 1 > stockForSelectedSize && hasSizes) {
      toast.error(
        `Cannot add more. You already have ${currentQuantityInCart} (max: ${stockForSelectedSize}) of Size ${selectedSize} in your cart.`,
      )
      return
    }

    setIsAddingToCart(true)
    setShowAddedMessage(false)

    // Simulate adding to cart (can be immediate, backend handles final check)
    setTimeout(() => {
      try {
        const priceNumber = parseFloat(product.price)
        if (isNaN(priceNumber) || priceNumber < 0) {
          console.error('Invalid product price:', product.price)
          throw new Error('Product price is invalid.')
        }

        // *** CONSTRUCT THE ITEM OBJECT *INCLUDING* availableStock ***
        const cartItemToAdd: CartItemForContext = {
          _id: product._id,
          title: product.title,
          price: priceNumber,
          image: product.image,
          selectedSize: selectedSize,
          selectedColor: selectedColor,
          quantity: 1, // Add one item at a time from this page
          availableStock: stockForSelectedSize, // <-- PASS THE CALCULATED STOCK for the selected size
        }

        addToCart(cartItemToAdd) // Call the function from CartContext

        setIsAddingToCart(false)
        setShowAddedMessage(true)
        setTimeout(() => setShowAddedMessage(false), 2500)
      } catch (cartError: any) {
        console.error('Add to cart error:', cartError)
        toast.error(cartError.message || 'Could not add item to cart.')
        setIsAddingToCart(false)
      }
    }, 100) // Short delay for visual feedback if needed
  }

  // --- Try Now Handler ---
  const handleTryNow = () => {
    if (product && productId && product.isInStock) {
      navigate(`/try-on/${productId}`)
    } else if (product && !product.isInStock) {
      toast.error('Cannot try on an item that is out of stock.')
    } else {
      toast.error('Cannot initiate Try On for this product.')
    }
  }

  // --- Render Logic ---

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div
          className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-[#c8a98a] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] p-8 text-center bg-red-50 text-red-700 border border-red-200 rounded-md">
        <XCircle className="w-12 h-12 mb-4 text-red-500" />
        <p className="font-semibold text-lg">Error Loading Product</p>
        <p>{error}</p>
        <Link
          to="/"
          className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Go Home
        </Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] p-8 text-center text-gray-600">
        <p className="font-semibold text-lg">Product not found or data could not be loaded.</p>
        <Link
          to="/"
          className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Go Home
        </Link>
      </div>
    )
  }

  // Calculate AddToCart button disabled state
  const isAddToCartDisabled =
    !product.isInStock ||
    isAddingToCart ||
    showAddedMessage ||
    (hasSizes && !selectedSize) ||
    (hasColors && !selectedColor) ||
    (hasSizes && selectedSize && !isSelectedSizeAvailable)

  return (
    <div className="min-h-screen bg-white font-sans">
      <Toaster position="top-center" reverseOrder={false} containerClassName="!z-[9999]" />{' '}
      {/* Ensure Toaster is on top */}
      {/* Breadcrumbs Section */}
      <div className="w-full px-4 py-3 bg-gray-50 border-b border-gray-200">
        <nav
          className="max-w-7xl mx-auto flex items-center flex-wrap text-xs text-gray-500"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="uppercase hover:text-[#c8a98a] transition-colors mr-1">
            HOME
          </Link>
          <ChevronRight className="h-3.5 w-3.5 mx-1 text-gray-400 shrink-0" />
          <Link
            to={`/${product.gender.toLowerCase()}`}
            className="uppercase hover:text-[#c8a98a] transition-colors mr-1"
          >
            {product.gender}
          </Link>
          {product.category && (
            <>
              <ChevronRight className="h-3.5 w-3.5 mx-1 text-gray-400 shrink-0" />
              {/* For now, just display category. Make linkable if you have category pages */}
              <span className="uppercase font-medium text-gray-700">{product.category}</span>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5 mx-1 text-gray-400 shrink-0" />
          <span
            className="uppercase font-semibold text-gray-800 ml-1 truncate"
            title={product.title}
          >
            {product.title}
          </span>
        </nav>
      </div>
      {/* Main Product Details Area */}
      <div className="max-w-7xl mx-auto mt-8 mb-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section (Left) */}
          <div className="flex justify-center items-start">
            <div className="bg-white rounded-md overflow-hidden w-full max-w-lg aspect-[3/4] relative border border-gray-200">
              <img
                src={`${API_BASE_URL}${product.image}`}
                alt={product.title}
                className={`block w-full h-full object-cover object-center transition-opacity duration-300 ${
                  !product.isInStock ? 'opacity-60' : ''
                }`}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://via.placeholder.com/600x800?text=Image+Not+Available'
                }}
              />
              {!product.isInStock && (
                <div className="absolute top-3 right-3 bg-red-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-md z-10">
                  Out of Stock
                </div>
              )}
            </div>
          </div>
          {/* Info & Actions Section (Right) */}
          <div className="flex flex-col pt-4 md:pt-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <p className="text-xl lg:text-2xl font-semibold text-gray-800 mb-5">
              PKR {Number(product.price).toLocaleString('en-PK')}
            </p>

            {/* Size Selection Area */}
            {hasSizes && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                    Select Size
                  </h3>
                  {/* Optional Size Guide Link */}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes?.map((size) => {
                    const sizeStock = product.stockDetails?.[size] ?? 0
                    const isAvailable = sizeStock > 0
                    const isSelected = selectedSize === size

                    return (
                      <button
                        key={size}
                        onClick={() => handleSelectSize(size)}
                        disabled={!isAvailable} // Disable button if stock is 0
                        className={`
                          py-2 px-4 border rounded-md text-sm font-medium transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#c8a98a] relative min-w-[48px] text-center group
                          ${
                            isSelected
                              ? 'bg-[#c8a98a] text-white border-[#c8a98a] shadow-sm font-semibold'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                          }
                          ${
                            !isAvailable
                              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed !shadow-none'
                              : 'hover:bg-gray-50'
                          }
                        `}
                        aria-pressed={isSelected}
                        title={!isAvailable ? `${size} - Out of stock` : `Select size ${size}`}
                      >
                        {size}
                        {/* Red line-through effect for unavailable sizes */}
                        {!isAvailable && (
                          <span className="absolute inset-x-0 bottom-[4px] h-[1.5px] bg-red-400 group-hover:bg-red-400 transform scale-x-105"></span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Color Selection Area (Example - Adapt if using) */}
            {hasColors && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-2">
                  Select Color
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors?.map((color) => {
                    const isSelected = selectedColor === color
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        disabled={!product.isInStock} // General stock check for color button
                        className={`
                            w-8 h-8 rounded-full border-2 p-0.5 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8a98a]
                            ${
                              isSelected
                                ? 'border-[#c8a98a]'
                                : 'border-gray-300 hover:border-gray-400'
                            }
                            ${!product.isInStock ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        aria-label={`Select color ${color}`}
                        title={color}
                        aria-pressed={isSelected}
                      >
                        <span
                          className="block w-full h-full rounded-full border border-black/5"
                          style={{ backgroundColor: color }}
                        ></span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Description Section */}
            {product.description?.trim() && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-3">
                  Description
                </h3>
                <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                  {product.description.trim()}
                </p>
              </div>
            )}

            {/* --- Action Buttons Container --- */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              {/* Selection Prompt Text */}
              {product.isInStock && !isAddingToCart && !showAddedMessage && (
                <div className="mb-4 text-center h-5">
                  {' '}
                  {/* Reserve space */}
                  {hasSizes && !selectedSize && (
                    <p className="text-xs text-red-600 font-medium">Please select size.</p>
                  )}
                  {hasColors && !selectedColor && (
                    <p className="text-xs text-red-600 font-medium">Please select color.</p>
                  )}
                  {hasSizes && selectedSize && !isSelectedSizeAvailable && (
                    <p className="text-xs text-red-600 font-medium">
                      Size {selectedSize} is currently out of stock.
                    </p>
                  )}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAddToCartDisabled}
                  className={`
                    flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8a98a]
                    ${
                      isAddToCartDisabled
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-[#c8a98a] hover:bg-[#b08d6a]'
                    }
                  `}
                  aria-live="polite"
                >
                  {isAddingToCart ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  ) : showAddedMessage ? (
                    <CheckCircle className="-ml-1 mr-2 h-5 w-5" />
                  ) : hasSizes && selectedSize && !isSelectedSizeAvailable ? (
                    <XCircle className="-ml-1 mr-2 h-5 w-5" />
                  ) : null}
                  {isAddingToCart
                    ? 'Adding...'
                    : showAddedMessage
                    ? 'Added!'
                    : hasSizes && selectedSize && !isSelectedSizeAvailable
                    ? 'Size Unavailable'
                    : 'Add To Cart'}
                </button>

                {/* Try Now Button */}
                <button
                  onClick={handleTryNow}
                  disabled={!product.isInStock} // Only disable if product overall is OOS
                  className={`
                    flex-1 inline-flex items-center justify-center px-6 py-3 border rounded-md shadow-sm text-base font-medium transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8a98a]
                    ${
                      !product.isInStock
                        ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                        : 'border-[#c8a98a] text-[#c8a98a] bg-white hover:bg-gray-50'
                    }
                  `}
                  aria-label="Try this item on virtually"
                >
                  <Camera className="-ml-1 mr-2 h-5 w-5" />
                  Try Now
                </button>
              </div>
            </div>
          </div>{' '}
          {/* End Info Section */}
        </div>{' '}
        {/* End Grid */}
      </div>{' '}
      {/* End Container */}
      {/* NO <style jsx> block here */}
    </div> // End Page Container
  )
}

export default ProductDetailsPage
