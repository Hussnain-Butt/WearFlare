import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { ChevronRight, ShoppingCart, CheckCircle } from 'lucide-react'

interface ProductDetail {
  _id: string
  title: string
  price: string
  category: string
  gender: string
  image: string
  description?: string
  sizes?: string[]
  colors?: string[]
  fit?: string
}

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { addToCart, totalItems } = useCart()

  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false)
  const [showAddedMessage, setShowAddedMessage] = useState<boolean>(false)

  useEffect(() => {
    if (!productId) {
      setError('Product ID is missing.')
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      try {
        const response = await axios.get<ProductDetail>(
          `https://backend-production-c8ff.up.railway.app/api/products/${productId}`,
        )
        setProduct(response.data)
      } catch (err) {
        setError('Failed to load product details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleAddToCart = () => {
    if (product && !isAddingToCart) {
      if (product.colors?.length && !selectedColor) {
        alert('Please select a color.')
        return
      }
      if (product.sizes?.length && !selectedSize) {
        alert('Please select a size.')
        return
      }

      setIsAddingToCart(true)
      setShowAddedMessage(false)

      setTimeout(() => {
        addToCart({
          ...product,
          selectedSize,
          selectedColor,
          price: parseFloat(product.price),
          quantity: 1,
        })
        setIsAddingToCart(false)
        setShowAddedMessage(true)
        setTimeout(() => setShowAddedMessage(false), 2500)
      }, 500)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
        <div className="text-gray-500">Loading Product...</div>
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

  return (
    <div className="min-h-screen bg-white">
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
            {product.category && (
              <>
                <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row lg:gap-x-12 xl:gap-x-16">
          <div className="lg:w-1/2 mb-8 lg:mb-0 flex justify-center items-start">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-w-1 aspect-h-1 w-full max-w-lg">
              <img
                src={`https://backend-production-c8ff.up.railway.app${product.image}`}
                alt={product.title}
                className="w-full h-full object-center object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="lg:w-1/2 flex flex-col">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{product.title}</h1>
            <p className="text-2xl font-semibold text-gray-800 mb-6">PKR {product.price}</p>

            {/* Gender */}
            <div className="mb-4 flex items-center">
              <h3 className="text-sm font-semibold text-gray-900 w-20 uppercase">Gender</h3>
              <span className="text-sm text-gray-700 uppercase">{product.gender}</span>
            </div>

            {/* Size Options */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 w-20 uppercase">Size</h3>
                  <button className="text-xs sm:text-sm font-medium text-[#c8a98a] hover:text-yellow-700 underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 border rounded-md text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#c8a98a] min-w-[40px] text-center ${
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

            {/* Color Options */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 w-20 uppercase">Colors</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 p-0.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#c8a98a] transition-all ${
                        selectedColor === color
                          ? 'border-[#c8a98a] ring-1 ring-[#c8a98a]'
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                      aria-label={`Select color ${color}`}
                      title={color}
                    >
                      <span
                        className="block w-full h-full rounded-full"
                        style={{ backgroundColor: color }}
                      ></span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="pt-4">
              <button
                onClick={handleAddToCart}
                disabled={
                  isAddingToCart ||
                  showAddedMessage ||
                  (product.colors?.length && !selectedColor) ||
                  (product.sizes?.length && !selectedSize)
                }
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
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

              {((product.colors?.length && !selectedColor) ||
                (product.sizes?.length && !selectedSize)) &&
                !isAddingToCart &&
                !showAddedMessage && (
                  <p className="text-xs text-red-600 mt-2 text-center">
                    Please select color and size
                  </p>
                )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-10 pt-6 border-t border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-700 whitespace-pre-line break-words">
                  {product.description.trim()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage
