import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import axios from 'axios'
// Remove useCart if not used directly on this page (it might be in a shared header)
// import { useCart } from '../context/CartContext';
import MensComponents from '@/components/MensComponents' // Ensure path is correct
import NewsLetter from '@/components/NewsLetter' // Ensure path is correct
import arrival_image from '/new_arrival.png' // Ensure path is correct
import AnimatedSection from '@/components/AnimatedSection' // Ensure path is correct
import NewCollection from '@/components/NewCollection' // Ensure path is correct

// --- Backend API Base URL ---
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app' // Make sure this matches your backend port

// --- Updated Interface ---
interface Product {
  _id: string
  title: string
  price: string // Assuming price is string from backend
  category: string
  gender: string
  image: string
  inStock: boolean // Added inStock field
}

const categories = ['All', 'Pants', 'Sweatshirt', 'Jackets', 'Shirts']

const Men: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [loading, setLoading] = useState(true) // Add loading state
  const [error, setError] = useState<string | null>(null) // Add error state
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true) // Start loading
    setError(null) // Reset error
    axios
      .get<Product[]>(`${API_BASE_URL}/api/products?gender=men`) // Use template literal and base URL
      .then((res) => {
        // Ensure inStock is boolean
        const productsWithStock = res.data.map((p) => ({
          ...p,
          inStock: p.inStock ?? true, // Default to true if missing
        }))
        setProducts(productsWithStock)
      })
      .catch((err) => {
        console.error('Error fetching products:', err)
        setError('Failed to load products. Please try again later.')
      })
      .finally(() => {
        setLoading(false) // Stop loading regardless of outcome
      })
  }, []) // Dependency array is empty, runs once on mount

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory)

  const handleViewDetails = (productId: string) => {
    navigate(`/product/${productId}`)
  }

  const handleTryNow = (productId: string) => {
    navigate(`/try-on/${productId}`)
  }

  return (
    <div className="min-h-screen bg-[#eee8e3]">
      {/* Breadcrumb can be added here if needed */}

      {/* Product Section */}
      <section className="w-full py-10 px-6 md:px-12 bg-[#D3C5B8] mb-16">
        <AnimatedSection direction="left">
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center mb-8 gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-[#6b5745] text-white shadow-md'
                    : 'bg-white text-black hover:bg-[#6b5745] hover:text-white border border-gray-300'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Loading and Error States */}
          {loading && <p className="text-center text-gray-600 py-8">Loading products....</p>}
          {error && <p className="text-center text-red-600 py-8">{error}</p>}

          {/* Product Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product._id} className="flex flex-col items-center group">
                    <div className="bg-white p-4 w-full overflow-hidden rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300 relative">
                      {' '}
                      {/* Added relative positioning */}
                      {/* Out of Stock Overlay/Badge - Conditional */}
                      {!product.inStock && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
                          Out of Stock
                        </div>
                      )}
                      <img
                        src={`${API_BASE_URL}${product.image}`} // Use base URL
                        alt={product.title}
                        // Add dimming effect if out of stock
                        className={`w-full h-64 sm:h-72 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer ${
                          !product.inStock ? 'opacity-50' : ''
                        }`}
                        onClick={() => product.inStock && handleViewDetails(product._id)} // Only allow click if in stock
                      />
                    </div>
                    <div className="mt-3 text-center w-full px-2">
                      <p
                        className="text-sm text-gray-800 font-medium truncate"
                        title={product.title}
                      >
                        {product.title}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {' '}
                        PKR {product.price}
                      </p>
                      {/* --- Buttons Container / Out of Stock Message --- */}
                      <div className="mt-3 flex flex-col sm:flex-row gap-2 justify-center">
                        {product.inStock ? (
                          // Render buttons only if in stock
                          <>
                            <button
                              className="px-4 py-2 bg-[#6b5745] text-white text-xs font-medium rounded-full hover:bg-[#5d4c3b] transition-colors duration-300 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleViewDetails(product._id)}
                              disabled={!product.inStock} // Explicitly disable (though already handled by conditional render)
                            >
                              View Details
                            </button>
                            <button
                              className="px-4 py-2 bg-[#8B4513] text-white text-xs font-medium rounded-full hover:bg-[#70421e] transition-colors duration-300 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleTryNow(product._id)}
                              disabled={!product.inStock} // Explicitly disable
                            >
                              Try Now
                            </button>
                          </>
                        ) : (
                          // Show "Out of Stock" text instead of buttons
                          <span className="inline-block mt-1 px-4 py-2 bg-gray-200 text-gray-500 text-xs font-semibold rounded-full w-full sm:w-auto">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      {/* --- End Buttons Container --- */}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full py-8">
                  No products found matching "{selectedCategory}".
                </p>
              )}
            </div>
          )}
        </AnimatedSection>
      </section>

      {/* Conditional Sections */}
      {selectedCategory === 'All' && (
        <>
          <div className="my-16 md:my-24 w-full">
            <img src={arrival_image} alt="New Arrivals" className="w-full" />
          </div>
          <NewCollection />
        </>
      )}

      <NewsLetter />
    </div>
  )
}

export default Men
