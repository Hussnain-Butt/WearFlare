// src/pages/ProductDetailsPage.tsx
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext' // Verify path is correct
import { ChevronRight, CheckCircle, Camera, XCircle } from 'lucide-react' // Icons
import { toast, Toaster } from 'react-hot-toast'

// --- Backend API Base URL ---
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app' // Adjust if your backend runs elsewhere

// --- Updated Product Detail Interface ---
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

// --- Cart Item Interface (Ensure matches CartContext definition) ---
interface CartItem {
  _id: string
  title: string
  price: number // Use number type for calculations in cart
  image: string
  selectedSize: string | null // Size is mandatory if product has sizes
  selectedColor?: string | null // Optional color
  quantity: number
}

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>() // Get product ID from URL params
  const navigate = useNavigate()
  const { addToCart } = useCart() // Access cart context

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
  const isSelectedSizeAvailable = !!(
    selectedSize &&
    product?.stockDetails &&
    product.stockDetails[selectedSize] > 0
  )

  // Helper booleans for readability
  const hasSizes = product?.sizes && product.sizes.length > 0
  const hasColors = product?.colors && product.colors.length > 0 // Keep if using colors

  // --- Fetch Product Data Effect ---
  useEffect(() => {
    // Validate productId
    if (!productId) {
      setError('Product ID is missing from the URL.')
      setLoading(false)
      return
    }

    // Reset state for new product load
    setLoading(true)
    setError(null)
    setSelectedSize(null)
    setSelectedColor(null)
    setProduct(null) // Clear previous product data

    const fetchProduct = async () => {
      try {
        // Fetch product details from the backend API
        const response = await axios.get<ProductDetail>(`${API_BASE_URL}/api/products/${productId}`)

        // Basic validation of received data
        if (!response.data || !response.data._id) {
          throw new Error('Invalid product data received from the server.')
        }

        // Set product state, ensuring defaults for potentially missing fields
        setProduct({
          ...response.data,
          isInStock: response.data.isInStock ?? false, // Use backend virtual, default false
          sizes: response.data.sizes ?? [], // Default to empty array
          stockDetails: response.data.stockDetails ?? {}, // Default to empty object
          colors: response.data.colors ?? [], // Default to empty array (if using colors)
        })
      } catch (err: any) {
        // Handle fetch errors (network, 404, etc.)
        console.error('Fetch product error:', err)
        if (err.response?.status === 404) {
          setError('Product not found.')
        } else if (err.request) {
          setError('Could not connect to the server. Please check your connection.')
        } else {
          setError('Failed to load product details. Please try again.')
        }
      } finally {
        // Always stop loading indicator
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId]) // Re-run effect if productId changes

  // --- Size Selection Handler ---
  const handleSelectSize = (size: string) => {
    // Update the selected size state
    // We allow selecting an OOS size to show feedback, but block adding to cart later
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
      // Keep if using colors
      toast.error('Please select a color first.')
      return
    }

    // --- CRITICAL STOCK CHECK for the SELECTED size ---
    if (hasSizes && selectedSize && !isSelectedSizeAvailable) {
      toast.error(`Sorry, size ${selectedSize} is currently out of stock.`)
      return // Stop the process
    }
    // --- End Stock Check ---

    // Set loading state for the button
    setIsAddingToCart(true)
    setShowAddedMessage(false) // Hide previous success message

    // Simulate adding to cart (actual stock check/decrement is on backend during checkout)
    setTimeout(() => {
      try {
        // Validate and convert price string to number for cart logic
        const priceNumber = parseFloat(product.price)
        if (isNaN(priceNumber) || priceNumber < 0) {
          console.error('Invalid product price:', product.price)
          throw new Error('Product price is invalid.')
        }

        // Create the item object to add to the cart context
        const cartItemToAdd: CartItem = {
          _id: product._id,
          title: product.title,
          price: priceNumber,
          image: product.image,
          selectedSize: selectedSize, // Include selected size
          selectedColor: selectedColor, // Include selected color (if applicable)
          quantity: 1, // Add one item at a time
        }

        addToCart(cartItemToAdd) // Call the function from CartContext

        // Update button state to show success
        setIsAddingToCart(false)
        setShowAddedMessage(true)
        // Automatically hide the "Added!" message after a short delay
        setTimeout(() => setShowAddedMessage(false), 2500)
      } catch (cartError: any) {
        // Handle errors during cart addition (e.g., price conversion failed)
        console.error('Add to cart error:', cartError)
        toast.error(cartError.message || 'Could not add item to cart.')
        setIsAddingToCart(false) // Reset button state on error
      }
    }, 300) // Small delay to simulate processing
  }

  // --- Try Now Handler ---
  const handleTryNow = () => {
    // Allow Try Now if the product is generally in stock (specific size might not matter for Try On)
    if (product && productId && product.isInStock) {
      navigate(`/try-on/${productId}`) // Navigate to the Try On route
    } else if (product && !product.isInStock) {
      toast.error('Cannot try on an item that is out of stock.')
    } else {
      toast.error('Cannot initiate Try On for this product.')
    }
  }

  // --- Render Logic ---

  // Loading State
  if (loading) {
    return (
      <div className="loading-placeholder">
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

  // Error State
  if (error) {
    return <div className="error-placeholder">{error}</div>
  }

  // Product Not Found / Data Issue State
  if (!product) {
    return <div className="error-placeholder">Product data could not be loaded.</div>
  }

  // Calculate AddToCart button disabled state based on multiple factors
  const isAddToCartDisabled =
    !product.isInStock || // Product is generally out of stock
    isAddingToCart || // Action already in progress
    showAddedMessage || // Success message is being shown
    (hasSizes && !selectedSize) || // Size is required but not selected
    (hasColors && !selectedColor) || // Color is required but not selected (if applicable)
    (hasSizes && selectedSize && !isSelectedSizeAvailable) // Size is selected, but specifically out of stock

  return (
    <div className="min-h-screen bg-white font-sans">
      <Toaster position="top-center" reverseOrder={false} containerClassName="toaster-z-index" />
      {/* Breadcrumbs Section */}
      <div className="breadcrumb-container">
        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb-link hover:text-[#c8a98a]">
            HOME
          </Link>
          <ChevronRight className="breadcrumb-separator" />
          <Link
            to={`/${product.gender.toLowerCase()}`}
            className="breadcrumb-link hover:text-[#c8a98a]"
          >
            {product.gender.toUpperCase()}
          </Link>
          {product.category && (
            <>
              <ChevronRight className="breadcrumb-separator" />
              {/* Link category dynamically if possible, otherwise just display */}
              <span className="breadcrumb-link">{product.category.toUpperCase()}</span>
              {/*
                <Link to={`/${product.gender.toLowerCase()}?category=${encodeURIComponent(product.category)}`} className="breadcrumb-link hover:text-[#c8a98a]">
                    {product.category.toUpperCase()}
                </Link>
                */}
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
                // Apply dimming if overall product is out of stock
                className={`product-image ${!product.isInStock ? 'opacity-60' : ''}`}
                loading="lazy"
                onError={(e) => {
                  // Fallback image if the original fails to load
                  e.currentTarget.src =
                    'https://via.placeholder.com/600x800?text=Image+Not+Available'
                }}
              />
              {/* Out of Stock Badge based on overall isInStock */}
              {!product.isInStock && <div className="out-of-stock-badge-details">Out of Stock</div>}
            </div>
          </div>
          {/* Info & Actions Section (Right) */}
          <div className="product-info-section">
            {/* Product Title */}
            <h1 className="product-title">{product.title}</h1>
            {/* Product Price */}
            <p className="product-price">PKR {Number(product.price).toLocaleString('en-PK')}</p>
            {/* Gender Info */}
            <div className="info-row">
              <h3 className="info-label">Gender</h3>
              <span className="info-value">{product.gender.toUpperCase()}</span>
            </div>

            {/* Size Selection Area */}
            {hasSizes && (
              <div className="options-section">
                <div className="options-header">
                  <h3 className="info-label">Select Size</h3>
                  {/* Optional Size Guide Link */}
                  {/* <button className="size-guide-link">Size Guide</button> */}
                </div>
                <div className="options-buttons-container">
                  {product.sizes?.map((size) => {
                    // Check stock for this specific size
                    const isSizeAvailable = product.stockDetails?.[size] > 0
                    const isSelected = selectedSize === size

                    return (
                      <button
                        key={size}
                        onClick={() => handleSelectSize(size)}
                        // Disable the button if this specific size has 0 stock
                        disabled={!isSizeAvailable}
                        className={`size-button ${isSelected ? 'selected' : ''} ${
                          !isSizeAvailable ? 'disabled unavailable' : '' // Add specific class for OOS styling
                        }`}
                        aria-pressed={isSelected} // Accessibility for selected state
                        title={!isSizeAvailable ? `${size} - Out of stock` : `Select size ${size}`}
                      >
                        {size}
                        {/* Visual indicator for unavailable size */}
                        {!isSizeAvailable && <span className="oos-indicator"></span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Color Selection Area (Conditional) */}
            {hasColors && ( // Only render if product has color options
              <div className="options-section">
                <div className="options-header">
                  <h3 className="info-label">Select Color</h3>
                </div>
                <div className="options-buttons-container">
                  {product.colors?.map((color) => {
                    const isSelected = selectedColor === color
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        // Assuming color doesn't affect stock, disable only if overall product is OOS
                        disabled={!product.isInStock}
                        className={`color-button ${isSelected ? 'selected' : ''} ${
                          !product.isInStock ? 'disabled' : ''
                        }`}
                        aria-label={`Select color ${color}`}
                        title={color}
                        aria-pressed={isSelected}
                      >
                        {/* Use background color for the swatch */}
                        <span className="color-swatch" style={{ backgroundColor: color }}></span>
                      </button>
                    )
                  })}
                  {/* // */}
                </div>
              </div>
            )}
            {/* Product Description Section */}
            {product.description?.trim() && ( // Only render if description exists and is not just whitespace
              <div className="description-section">
                <h3 className="description-title">Description</h3>
                <p className="description-text">{product.description.trim()}</p>
              </div>
            )}
            {/* --- Action Buttons Container --- */}
            <div className="action-buttons-container">
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAddToCartDisabled} // Use the calculated disabled state
                className="add-to-cart-button primary-button"
                aria-live="polite" // Announces changes for screen readers
              >
                {/* Dynamic Button Text */}
                {!product.isInStock ? (
                  'Out of Stock' // Overall OOS
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
                  </> // Success state
                ) : hasSizes && selectedSize && !isSelectedSizeAvailable ? (
                  <>
                    {' '}
                    <XCircle className="-ml-1 mr-2 h-5 w-5" /> Size Unavailable{' '}
                  </> // Specific size OOS
                ) : (
                  'Add To Cart' // Default state
                )}
              </button>

              {/* Try Now Button */}
              <button
                onClick={handleTryNow}
                // Disable only if the product is generally out of stock
                disabled={!product.isInStock}
                className="try-on-button secondary-button"
                aria-label="Try this item on virtually"
              >
                <Camera className="-ml-1 mr-2 h-5 w-5" />
                Try Now
              </button>

              {/* Selection Prompt Text - Show relevant prompts */}
              {product.isInStock && !isAddingToCart && !showAddedMessage && (
                <div className="prompt-messages-container">
                  {hasSizes && !selectedSize && (
                    <p className="selection-prompt">Please select size.</p>
                  )}
                  {hasColors && !selectedColor && (
                    <p className="selection-prompt">Please select color.</p>
                  )}
                  {/* Specific message if selected size is out of stock */}
                  {hasSizes && selectedSize && !isSelectedSizeAvailable && (
                    <p className="selection-prompt error-prompt">
                      Size {selectedSize} is currently out of stock.
                    </p>
                  )}
                </div>
              )}
            </div>
            {/* --- End Action Buttons Container --- */}
          </div>{' '}
          {/* End Info Section */}
        </div>{' '}
        {/* End Grid */}
      </div>{' '}
      {/* End Container */}
      {/* --- Inline CSS for Styling --- */}
      <style jsx>{`
        /* Ensure toaster is above other elements if needed */
        :global(.toaster-z-index) {
          z-index: 9999;
        }

        /* General Placeholders */
        .loading-placeholder,
        .error-placeholder {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          padding: 2rem;
          text-align: center;
          font-size: 1.1rem;
          color: #6b7280;
        }
        .error-placeholder {
          background-color: #fef2f2;
          color: #b91c1c;
          font-weight: 500;
          border: 1px solid #fecaca;
          border-radius: 0.375rem;
        }

        /* Breadcrumbs */
        .breadcrumb-container {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        @media (min-width: 768px) {
          .breadcrumb-container {
            padding: 1rem 1.5rem;
          }
        }
        .breadcrumb-nav {
          max-width: 80rem;
          margin-left: auto;
          margin-right: auto;
          display: flex;
          align-items: center;
          flex-wrap: wrap; /* Allow wrapping on small screens */
          font-size: 0.75rem; /* Smaller font */
          color: #6b7280;
        }
        .breadcrumb-link {
          text-transform: uppercase;
          transition: color 0.2s;
          margin-right: 0.25rem;
        }
        .breadcrumb-link:hover {
          color: #c8a98a;
        }
        .breadcrumb-current {
          text-transform: uppercase;
          font-weight: 600;
          color: #1f2937;
          margin-left: 0.25rem;
        }
        .breadcrumb-separator {
          height: 0.9rem;
          width: 0.9rem;
          margin: 0 0.25rem;
          color: #9ca3af;
          flex-shrink: 0;
        } /* Prevent separator shrinking */

        /* Main Layout */
        .product-details-container {
          max-width: 80rem;
          margin: 2rem auto;
          padding: 0 1rem;
        }
        @media (min-width: 768px) {
          .product-details-container {
            margin: 3rem auto;
            padding: 0 1.5rem;
          }
        }
        @media (min-width: 1024px) {
          .product-details-container {
            margin: 4rem auto;
            padding: 0 2rem;
          }
        }
        .product-details-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .product-details-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 3rem;
          }
        }
        @media (min-width: 1024px) {
          .product-details-grid {
            gap: 4rem;
          }
        }

        /* Image Section */
        .product-image-section {
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
        .product-image-wrapper {
          background-color: #ffffff;
          border-radius: 0.375rem;
          overflow: hidden;
          width: 100%;
          max-width: 36rem; /* Max width for image */
          aspect-ratio: 3 / 4; /* Common aspect ratio for clothing */
          position: relative;
          border: 1px solid #e5e7eb;
        }
        .product-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover; /* Ensure image covers */
          object-position: center;
          transition: opacity 0.3s ease;
        }
        .product-image.opacity-60 {
          opacity: 0.6;
        } /* Dimmed image style */
        .out-of-stock-badge-details {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background-color: rgba(220, 38, 38, 0.9); /* Red */
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.6rem;
          border-radius: 0.25rem;
          z-index: 10;
        }

        /* Info Section */
        .product-info-section {
          display: flex;
          flex-direction: column;
          padding-top: 1rem;
        } /* Add padding for mobile */
        @media (min-width: 768px) {
          .product-info-section {
            padding-top: 0;
          }
        }
        .product-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }
        @media (min-width: 1024px) {
          .product-title {
            font-size: 2.125rem;
            margin-bottom: 0.75rem;
          }
        }
        .product-price {
          font-size: 1.375rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }
        @media (min-width: 1024px) {
          .product-price {
            font-size: 1.625rem;
            margin-bottom: 2rem;
          }
        }
        .info-row {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }
        .info-label {
          font-weight: 600;
          color: #374151;
          width: 6rem;
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .info-value {
          color: #4b5563;
          text-transform: uppercase;
        }

        /* Options (Sizes/Colors) */
        .options-section {
          margin-bottom: 1.5rem;
        }
        @media (min-width: 1024px) {
          .options-section {
            margin-bottom: 2rem;
          }
        }
        .options-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        .size-guide-link {
          font-size: 0.8rem;
          font-weight: 500;
          color: #c8a98a;
          text-decoration: underline;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        .size-guide-link:hover {
          color: #a88a6a;
        }
        .options-buttons-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }
        .size-button {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease-in-out;
          cursor: pointer;
          background-color: white;
          color: #374151;
          min-width: 48px;
          text-align: center;
          position: relative; /* For indicator */
        }
        .size-button:hover:not(.selected):not(.disabled) {
          border-color: #9ca3af;
          background-color: #f9fafb;
        }
        .size-button.selected {
          background-color: #c8a98a;
          color: white;
          border-color: #c8a98a;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
          font-weight: 600;
        }
        .size-button:focus:not(.selected) {
          outline: none;
          box-shadow: 0 0 0 2px rgba(200, 169, 138, 0.5);
        }
        /* Unavailable Size Style */
        .size-button.unavailable {
          background-color: #f8f8f8;
          color: #b0b0b0;
          border-color: #e5e7eb;
          cursor: not-allowed;
          text-decoration: line-through;
          text-decoration-color: #ef4444;
        }
        .size-button.unavailable:hover {
          border-color: #e5e7eb;
          background-color: #f8f8f8;
        } /* Prevent hover */
        .oos-indicator {
          /* Tiny line at bottom */
          position: absolute;
          bottom: 3px;
          left: 25%;
          width: 50%;
          height: 1px;
          background-color: #f87171;
          border-radius: 1px;
        }
        /* Base disabled style (for overall OOS) */
        .size-button.disabled:not(.unavailable) {
          opacity: 0.5;
          cursor: not-allowed;
          background-color: #f3f4f6;
          border-color: #e5e7eb;
        }

        /* Color Swatch Styles */
        .color-button {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 9999px;
          border: 2px solid #e5e7eb;
          padding: 2px;
          transition: all 0.2s ease-in-out;
          cursor: pointer;
          background-clip: content-box;
        }
        .color-button:hover:not(.selected):not(.disabled) {
          border-color: #9ca3af;
        }
        .color-button.selected {
          border-color: #c8a98a;
          box-shadow: 0 0 0 2px #c8a98a;
        }
        .color-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(200, 169, 138, 0.5);
        }
        .color-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .color-swatch {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          border: 1px solid rgba(0, 0, 0, 0.05);
        } /* Subtle border for light colors */

        /* Action Buttons Container */
        .action-buttons-container {
          margin-top: auto; /* Pushes to bottom */
          padding-top: 1.5rem;
          border-top: 1px solid #f3f4f6;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        @media (min-width: 1024px) {
          .action-buttons-container {
            padding-top: 2rem;
          }
        }

        /* General Button Styles */
        .primary-button,
        .secondary-button {
          width: 100%;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          padding: 0.75rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.9rem;
          font-weight: 600;
          transition: background-color 0.2s, border-color 0.2s, color 0.2s, opacity 0.2s;
          cursor: pointer;
          border: 1px solid transparent;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
        .primary-button:disabled,
        .secondary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .primary-button svg,
        .secondary-button svg {
          height: 1.125rem;
          width: 1.125rem;
        } /* Icon size */

        /* Add to Cart Specific Styles */
        .add-to-cart-button {
          background-color: #c8a98a;
          color: white;
        }
        .add-to-cart-button:hover:not(:disabled) {
          background-color: #b08d6a;
        }
        .add-to-cart-button:disabled {
          background-color: #dcd1c7;
        } /* Distinct disabled color */

        /* Try Now Specific Styles */
        .try-on-button {
          background-color: transparent;
          color: #c8a98a;
          border: 1px solid #c8a98a;
        }
        .try-on-button:hover:not(:disabled) {
          background-color: #fdf9f6;
          border-color: #b08d6a;
          color: #b08d6a;
        }
        .try-on-button:disabled {
          border-color: #e5e7eb;
          color: #9ca3af;
          background-color: #f9fafb;
        }

        /* Selection Prompt Text */
        .prompt-messages-container {
          margin-top: 0.5rem;
          text-align: center;
        }
        .selection-prompt {
          font-size: 0.8rem;
          color: #b91c1c;
          font-weight: 500;
          line-height: 1.4;
        }
        .error-prompt {
          color: #b91c1c;
        } /* Already red */

        /* Description Section */
        .description-section {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }
        @media (min-width: 1024px) {
          .description-section {
            margin-top: 2.5rem;
            padding-top: 2rem;
          }
        }
        .description-title {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.75rem;
        }
        .description-text {
          font-size: 0.875rem;
          color: #4b5563;
          white-space: pre-line;
          line-height: 1.6;
          word-break: break-word;
        }

        /* Loading spinner keyframes */
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default ProductDetailsPage
