// src/pages/Women.tsx (Apply similar changes to Men.tsx)
import React, { useState, useEffect } from 'react'
// *** Import useLocation ***
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ChevronRight, ShoppingCart } from 'lucide-react'
import axios from 'axios'
import { useCart } from '../context/CartContext' // Import useCart
import NewsLetter from '@/components/NewsLetter'
import AnimatedSection from '@/components/AnimatedSection'
import NewCollection from '@/components/NewCollection'

const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app'

interface Product {
  /* ... Interface remains the same ... */ _id: string
  title: string
  price: string
  category: string
  gender: string
  image: string
  isInStock?: boolean
}

// *** Define categories directly or fetch them ***
const categories = ['All', 'Jackets', 'Pants', 'Shirts', 'Sweatshirt'] // Example

const Women: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const navigate = useNavigate()
  const location = useLocation() // Get location object
  const { setLastProductOrigin } = useCart() // Get the function from context

  // *** Initialize category state using location.state ***
  const initialCategory = location.state?.category || 'All'
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // --- Fetch Products Effect (Keep as is) ---
  useEffect(() => {
    setLoading(true)
    setError(null)
    axios
      .get<Product[]>(`${API_BASE_URL}/api/products?gender=Women`)
      // ... .then() and .catch() remain the same ...
      .then((res) => {
        /* process products */ setProducts(
          res.data.map((p) => ({ ...p, isInStock: p.isInStock ?? false })),
        )
      })
      .catch((err) => {
        /* handle error */ setError('Failed to load products.')
      })
      .finally(() => setLoading(false))
  }, []) // Run once on mount

  // --- Scroll Effect (Keep as is) ---
  useEffect(() => {
    if (!loading && products.length > 0 && location.hash && location.hash.startsWith('#product-')) {
      const productIdToScroll = location.hash.substring('#product-'.length)
      if (productIdToScroll) {
        const timer = setTimeout(() => {
          const element = document.getElementById(`product-row-${productIdToScroll}`)
          if (element) {
            console.log(`Scrolling to element: product-row-${productIdToScroll}`)
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            // Optional: Remove hash after scroll
            // navigate(location.pathname, { state: location.state, replace: true });
          } else {
            console.warn(`Element not found for scrolling: product-row-${productIdToScroll}`)
          }
        }, 100)
        return () => clearTimeout(timer)
      }
    }
  }, [loading, products, location.hash, location.state, navigate]) // Add location.state if removing hash

  // Filter products based on state (Keep as is)
  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter(
          (product) => product.category?.toLowerCase() === selectedCategory.toLowerCase(),
        )

  // --- UPDATED Navigation Handler ---
  const handleViewDetails = (productId: string) => {
    // *** Record the origin including the CURRENT selectedCategory BEFORE navigating ***
    setLastProductOrigin(location.pathname, productId, selectedCategory)
    navigate(`/product/${productId}`)
  }

  // Handle Try Now (Keep as is, or also record origin if needed)
  const handleTryNow = (productId: string) => {
    // Optionally track origin here too
    // setLastProductOrigin(location.pathname, productId, selectedCategory);
    navigate(`/try-on/${productId}`)
  }

  // --- Render Component ---
  return (
    <div className="min-h-screen bg-[#eee8e3]">
      <section className="w-full py-10 px-6 md:px-12 bg-[#D3C5B8] mb-16">
        <AnimatedSection direction="left">
          {/* --- Category Filter Buttons --- */}
          {/* Ensure buttons correctly update the selectedCategory state */}
          <div className="flex flex-wrap justify-center mb-8 gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  selectedCategory === category // Highlight based on state
                    ? 'bg-[#6b5745] text-white shadow-md'
                    : 'bg-white text-black hover:bg-[#6b5745] hover:text-white border border-gray-300'
                }`}
                onClick={() => setSelectedCategory(category)} // Update state on click
              >
                {category}
              </button>
            ))}
          </div>

          {/* Loading / Error / Grid Container */}
          <div className="products-container">
            {loading && <div /* Loading indicator */>Loading...</div>}
            {error && <div /* Error message */>{error}</div>}
            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    // *** Ensure product div has the unique ID ***
                    <div
                      key={product._id}
                      id={`product-row-${product._id}`}
                      className="flex flex-col items-center group text-center"
                    >
                      {/* Image Container */}
                      {/* Use updated handleViewDetails on click */}
                      <div
                        className="bg-white p-3 w-full overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 relative cursor-pointer"
                        onClick={() => product.isInStock && handleViewDetails(product._id)}
                      >
                        {/* Out of Stock Badge (Keep as is) */}
                        {!product.isInStock && (
                          <div className="absolute top-2 right-2 bg-red-100 text-red-700 text-[10px] font-semibold px-2 py-0.5 rounded-full z-10 ring-1 ring-inset ring-red-600/20">
                            Out of Stock
                          </div>
                        )}
                        {/* Product Image (Keep as is) */}
                        <img
                          src={`${API_BASE_URL}${product.image}`}
                          alt={product.title}
                          className={`w-full h-64 sm:h-72 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300 rounded-md ${
                            !product.isInStock ? 'opacity-50' : ''
                          }`}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/300?text=No+Image'
                          }} // Fallback
                        />
                      </div>
                      {/* Product Info & Actions */}
                      <div className="mt-3 w-full px-1">
                        {/* Title (Keep as is, or make it clickable with handleViewDetails) */}
                        <p
                          className="text-sm font-medium text-gray-800 truncate"
                          title={product.title}
                        >
                          {/* Optional: Make title clickable too */}
                          {product.isInStock ? (
                            <Link
                              to="#"
                              onClick={(e) => {
                                e.preventDefault()
                                handleViewDetails(product._id)
                              }}
                              className="hover:text-[#6b5745] transition-colors"
                            >
                              {product.title}
                            </Link>
                          ) : (
                            <span>{product.title}</span>
                          )}
                        </p>
                        {/* Price (Keep as is) */}
                        <p className="text-sm font-semibold text-[#6b5745] mt-1">
                          PKR {Number(product.price).toLocaleString('en-PK')}
                        </p>
                        {/* --- Buttons Container / Out of Stock Message --- */}
                        <div className="mt-3 flex flex-col sm:flex-row gap-2 justify-center items-center">
                          {product.isInStock ? (
                            <>
                              {/* Use updated handleViewDetails */}
                              <button
                                className="w-full sm:w-auto px-4 py-2 bg-[#6b5745] text-white text-xs font-medium rounded-full hover:bg-[#5d4c3b] transition-colors duration-300 flex-1 whitespace-nowrap"
                                onClick={() => handleViewDetails(product._id)}
                              >
                                View Details
                              </button>
                              <button
                                className="w-full sm:w-auto px-4 py-2 bg-[#c8a98a] text-white text-xs font-medium rounded-full hover:bg-[#b08d6a] transition-colors duration-300 flex-1 whitespace-nowrap"
                                onClick={() => handleTryNow(product._id)}
                              >
                                Try Now
                              </button>
                            </>
                          ) : (
                            // Out of Stock text (Keep as is)
                            <span className="inline-block mt-1 px-5 py-2 bg-gray-200 text-gray-500 text-xs font-semibold rounded-full w-full sm:w-auto cursor-default">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        {/* --- End Buttons Container --- */}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 col-span-full py-16">
                    No products found in the "{selectedCategory}" category.
                  </p>
                )}
              </div> // End Grid
            )}
          </div>
        </AnimatedSection>
      </section>
      {/* Other sections (Banner, NewCollection, Newsletter) */}
      {selectedCategory === 'All' && !loading && !error && (
        <>
          <div className="my-16 md:my-24">
            <img src="/women_banner.png" alt="Women Banner" className="w-full" />
          </div>
          <NewCollection genderFilter="Women" limit={3} />
        </>
      )}
      {!loading && !error && <NewsLetter />}
    </div>
  )
}

export default Women
