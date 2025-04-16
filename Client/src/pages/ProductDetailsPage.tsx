// src/pages/ProductDetailsPage.tsx

import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { ChevronRight, ShoppingCart, CheckCircle } from 'lucide-react' // Added CheckCircle for feedback

// Define a more detailed Product interface
interface ProductDetail {
  _id: string
  title: string
  price: string
  category: string
  gender: string
  image: string
  description?: string
  sizes?: string[]
  colors?: string[] // Assuming colors are valid CSS color names/hex codes
  fit?: string // Example: Add fit information
  // Add any other relevant fields from your API response
}

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()

  // --- State ---
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false) // State for button feedback
  const [showAddedMessage, setShowAddedMessage] = useState<boolean>(false) // State for success message

  // --- Context ---
  const { addToCart, totalItems } = useCart()

  // --- Effect for Fetching Data ---
  useEffect(() => {
    if (!productId) {
      setError('Product ID is missing.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    const fetchProduct = async () => {
      try {
        const response = await axios.get<ProductDetail>(
          `https://backend-production-c8ff.up.railway.app/api/products/${productId}`,
        )
        const fetchedProduct = response.data
        setProduct(fetchedProduct)

        // Auto-select first available size and color if they exist
        if (fetchedProduct.sizes && fetchedProduct.sizes.length > 0) {
          setSelectedSize(fetchedProduct.sizes[0])
        }
        if (fetchedProduct.colors && fetchedProduct.colors.length > 0) {
          setSelectedColor(fetchedProduct.colors[0])
        }
      } catch (err) {
        console.error('Error fetching product details:', err)
        setError('Failed to load product details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId]) // Re-run effect if productId changes

  // --- Event Handlers ---
  const handleAddToCart = () => {
    if (product && !isAddingToCart) {
      // Optional: Check if size/color selection is required and selected
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        alert('Please select a size.')
        return
      }
      if (product.colors && product.colors.length > 0 && !selectedColor) {
        alert('Please select a color.')
        return
      }

      setIsAddingToCart(true) // Indicate loading state
      setShowAddedMessage(false)

      // Simulate adding delay (optional, remove in production)
      setTimeout(() => {
        addToCart({
          ...product,
          // Pass selected variants if your cart context handles them
          // selectedSize: selectedSize,
          // selectedColor: selectedColor,
        })
        setIsAddingToCart(false)
        setShowAddedMessage(true) // Show success message

        // Hide success message after a few seconds
        setTimeout(() => setShowAddedMessage(false), 2500)
      }, 500) // 0.5 second delay example
    }
  }

  // --- Render Loading/Error/Not Found ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
        <div className="text-gray-500">Loading Product...</div>
        {/* You could add a spinner here */}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-red-50 p-4">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
        <p className="text-gray-600">Product not found.</p>
      </div>
    )
  }

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="w-full py-3 px-4 sm:px-8 bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <nav
            className="flex items-center text-xs sm:text-sm text-gray-500"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-[#c8a98a] transition-colors">
              HOME
            </Link>
            <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
            <Link
              to={`/${product.gender.toLowerCase()}`}
              className="hover:text-[#c8a98a] transition-colors uppercase"
            >
              {product.gender}
            </Link>
            {/* Optional: Add Category Link */}
            {product.category && (
              <>
                <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
                {/* Assuming you have category pages like /men/shirts */}
                <Link
                  to={`/${product.gender.toLowerCase()}?category=${product.category}`}
                  className="hover:text-[#c8a98a] transition-colors uppercase"
                >
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
            <span className="font-medium text-gray-700 uppercase">{product.title}</span>
          </nav>
        </div>
      </div>
      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row lg:gap-x-12 xl:gap-x-16">
          {/* Product Image Column */}
          <div className="lg:w-1/2 mb-8 lg:mb-0 flex justify-center items-start">
            {/* In a real scenario, you might have multiple images and thumbnails */}
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-w-1 aspect-h-1 w-full max-w-lg">
              <img
                src={`https://backend-production-c8ff.up.railway.app${product.image}`}
                alt={product.title}
                className="w-full h-full object-center object-cover" // Ensure image covers the area
                loading="lazy"
              />
            </div>
          </div>
          {/* Product Details Column */}
          <div className="lg:w-1/2 flex flex-col">
            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              {product.title}
            </h1>

            {/* Product Price */}
            <p className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
              PKR {product.price}
            </p>

            {/* Color Options */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Color:{' '}
                  <span className="text-gray-600 font-normal">
                    {selectedColor || 'Select a color'}
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 p-0.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#c8a98a] transition-all ${
                        selectedColor === color
                          ? 'border-[#c8a98a] ring-1 ring-[#c8a98a]'
                          : 'border-gray-300'
                      }`}
                      aria-label={`Select color ${color}`}
                      title={color} // Show color name on hover
                    >
                      {/* Inner div for the actual color */}
                      <span
                        className="block w-full h-full rounded-full"
                        style={{ backgroundColor: color }}
                      ></span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Options */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    Size:{' '}
                    <span className="text-gray-600 font-normal">
                      {selectedSize || 'Select a size'}
                    </span>
                  </h3>
                  {/* Optional: Size Guide Link/Modal */}
                  <button className="text-xs sm:text-sm font-medium text-[#c8a98a] hover:text-yellow-700 underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#c8a98a] ${
                        selectedSize === size
                          ? 'bg-[#c8a98a] text-white border-[#c8a98a] shadow-sm'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button & Feedback */}
            <div className="mt-auto pt-6">
              {' '}
              {/* Pushes button towards bottom */}
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || showAddedMessage} // Disable while adding or showing success
                className={`w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#c8a98a] hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8a98a] transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {isAddingToCart ? (
                  <>
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
            </div>

            {/* Description & Details */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              {/* Description Section */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none">
                    {' '}
                    {/* Using prose for potential markdown */}
                    {product.description}
                  </p>
                </div>
              )}

              {/* Fit Information Section */}
              {product.fit && (
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Details</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Fit:</span> {product.fit}
                  </p>
                  {/* Add more details here if available (Material, Care, etc.) */}
                  {/* <p className="text-sm text-gray-600 mt-1"><span className="font-medium text-gray-800">Material:</span> 100% Cotton</p> */}
                </div>
              )}

              {/* Fallback if no description/fit */}
              {!product.description && !product.fit && (
                <p className="text-sm text-gray-500">More product details coming soon.</p>
              )}
            </div>
          </div>{' '}
          {/* End Product Details Column */}
        </div>{' '}
        {/* End Main Content Grid */}
      </div>{' '}
      {/* End Max Width Container */}
    </div> // End Root Div
  )
}

export default ProductDetailsPage
