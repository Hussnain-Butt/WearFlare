import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, ShoppingCart } from 'lucide-react'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import AnimatedSection from '@/components/AnimatedSection'
// Assuming NewsLetter is also desired on Shop page
import NewsLetter from '@/components/NewsLetter'

const categories = ['All', 'Shirts', 'Jackets', 'Sweatshirt', 'Pants']
const itemsPerPage = 8 // Or adjust as needed

interface Product {
  _id: string
  title: string
  price: string
  category: string
  gender: string
  image: string
}

// Define your API base URL
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app'

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart, totalItems } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    // Fetch all products (no gender filter)
    axios
      .get(`${API_BASE_URL}/api/products`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setProducts(res.data)
        } else {
          console.error('Unexpected data format:', res.data)
          setError('Failed to load products.')
          setProducts([])
        }
      })
      .catch((err) => {
        console.error('Error fetching products:', err)
        setError('Could not fetch products. Please try again later.')
        setProducts([])
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter(
          (product) => product.category.toLowerCase() === selectedCategory.toLowerCase(),
        )

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  // Format price for display
  const formatDisplayPrice = (priceStr: string): string => {
    const num = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''))
    if (isNaN(num)) return priceStr
    return `${num.toLocaleString('en-IN')} Rs`
  }

  return (
    <div className="min-h-screen bg-[#eee8e3]">
      {/* Breadcrumb */}
      <div className="w-full py-3 px-4 sm:px-8 bg-[#e5dfd8] flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-1">
          <Link to="/" className="text-xs sm:text-sm text-gray-700 hover:underline">
            HOME
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-500" />
          <span className="text-xs sm:text-sm text-gray-900 font-medium">SHOP</span>
        </div>
        <Link to="/cart" className="relative p-2 text-gray-600 hover:text-[#B8860B]">
          <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {totalItems}
            </span>
          )}
        </Link>
      </div>

      {/* Product Section */}
      <section className="w-full py-10 px-4 md:px-12 lg:px-16 mt-10 mb-16">
        <AnimatedSection direction="left">
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center mb-8 gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 text-sm sm:text-base rounded-full transition-all duration-300 border ${
                  selectedCategory.toLowerCase() === category.toLowerCase()
                    ? 'bg-[#6b5745] text-white border-[#6b5745]'
                    : 'bg-white text-black border-gray-300 hover:bg-[#f0ebe5] hover:border-gray-400'
                }`}
                onClick={() => {
                  setSelectedCategory(category)
                  setCurrentPage(1) // Reset to first page on category change
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Loading / Error State */}
          {isLoading && <div className="text-center py-10 text-gray-700">Loading products...</div>}
          {error && <div className="text-center py-10 text-red-600">{error}</div>}

          {/* Product Grid */}
          {!isLoading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {displayedProducts.length > 0 ? (
                  displayedProducts.map((product) => (
                    <div
                      key={product._id}
                      className="flex flex-col items-center group transition-shadow duration-300 hover:shadow-md"
                    >
                      <div className="bg-white p-4 w-full aspect-square flex items-center justify-center overflow-hidden rounded-t-md">
                        <img
                          src={`${API_BASE_URL}${product.image}`}
                          alt={product.title}
                          className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.png'
                          }}
                        />
                      </div>
                      <div className="w-full pt-3 pb-4 px-4 text-center bg-[#D3C5B8] rounded-b-md">
                        <p
                          className="text-sm md:text-base text-gray-800 font-medium truncate mb-1"
                          title={product.title}
                        >
                          {product.title}
                        </p>
                        <p className="text-sm md:text-base font-semibold text-[#504235] mb-3">
                          {formatDisplayPrice(product.price)}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                          <button
                            className="w-full sm:w-auto px-5 py-2.5 bg-[#7f6a59] text-white rounded-full text-sm font-medium hover:bg-[#6b5745] transition-colors duration-200 flex items-center justify-center gap-1.5"
                            onClick={() => addToCart(product)}
                          >
                            <ShoppingCart size={16} />
                            Add to Cart
                          </button>
                          <button
                            className="w-full sm:w-auto px-5 py-2.5 bg-[#B8860B] text-white rounded-full text-sm font-medium hover:bg-[#9e750a] transition-colors duration-200"
                            onClick={() => navigate(`/try-on/${product._id}`)}
                          >
                            Try Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-600">
                    No products found
                    {selectedCategory !== 'All' ? ` in the "${selectedCategory}" category` : ''}.
                  </div>
                )}
              </div>

              {/* Pagination - Only show if more than one page */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      className={`px-4 py-2 rounded-full text-sm transition-all duration-300 border ${
                        currentPage === index + 1
                          ? 'bg-[#6b5745] text-white border-[#6b5745]'
                          : 'bg-white text-black border-gray-300 hover:bg-[#f0ebe5] hover:border-gray-400'
                      }`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </AnimatedSection>
      </section>

      {/* Include Newsletter at the bottom */}
      <NewsLetter />
    </div>
  )
}

export default Shop
