// src/pages/Men.tsx
import React, { useState, useEffect } from 'react'
// *** Import useLocation and useCart ***
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react' // Keep if used elsewhere
import axios from 'axios'
import { useCart } from '../context/CartContext' // *** Import useCart ***

// Components (ensure paths are correct)
import NewsLetter from '@/components/NewsLetter'
import arrival_image from '/new_arrival.png' // Ensure path is correct from public folder
import AnimatedSection from '@/components/AnimatedSection'
import NewCollection from '@/components/NewCollection'

// --- Backend API Base URL ---
// Make sure this matches your Cart.tsx and context if using localhost
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app' // Or 'https://backend-production-c8ff.up.railway.app'

// --- Product Interface (Keep as is) ---
interface Product {
  _id: string
  title: string
  price: string
  category: string
  gender: string
  image: string
  isInStock?: boolean
}

// --- Define categories ---
const categories = ['All', 'Pants', 'Sweatshirt', 'Jackets', 'Shirts'] // Your Men categories

const Men: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation() // *** Get location object ***
  const { setLastProductOrigin } = useCart() // *** Get the function from context ***

  // *** Initialize category state using location.state passed from Cart ***
  const initialCategory = location.state?.category || 'All' // Default to 'All' if no state provided
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)

  // --- Fetch Products based on Gender (Keep as is) ---
  useEffect(() => {
    setLoading(true)
    setError(null)
    axios
      .get<Product[]>(`${API_BASE_URL}/api/products?gender=Men`)
      .then((res) => {
        const processedProducts = res.data.map((p) => ({
          ...p,
          isInStock: p.isInStock ?? false,
        }))
        setProducts(processedProducts)
      })
      .catch((err) => {
        console.error("Error fetching men's products:", err)
        setError('Failed to load products. Please try again later.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, []) // Runs once on component mount

  // --- Scroll Effect (Handles scrolling when navigating back with hash) ---
  useEffect(() => {
    // Only run if loading is done, products exist, and there's a hash
    if (!loading && products.length > 0 && location.hash && location.hash.startsWith('#product-')) {
      const productIdToScroll = location.hash.substring('#product-'.length)
      if (productIdToScroll) {
        // Use a small delay to ensure the element is rendered
        const timer = setTimeout(() => {
          const element = document.getElementById(`product-row-${productIdToScroll}`)
          if (element) {
            console.log(`Scrolling to element: product-row-${productIdToScroll}`)
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            // Optional: remove hash after scrolling to clean up URL
            // navigate(location.pathname, { state: location.state, replace: true });
          } else {
            console.warn(`Element not found for scrolling: product-row-${productIdToScroll}`)
          }
        }, 100) // 100ms delay, adjust if needed

        return () => clearTimeout(timer) // Cleanup timer on component unmount or re-run
      }
    }
    // Dependencies ensure this runs when loading finishes or hash changes
  }, [loading, products, location.hash, location.state, navigate])

  // --- Filter Products by Selected Category (Keep as is) ---
  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter(
          (product) => product.category.toLowerCase() === selectedCategory.toLowerCase(),
        )

  // --- UPDATED Navigation Handlers ---
  const handleViewDetails = (productId: string) => {
    // *** Record the origin (URL, Product ID, Category) BEFORE navigating ***
    setLastProductOrigin(location.pathname, productId, selectedCategory)
    navigate(`/product/${productId}`) // Navigate to product detail page
  }

  const handleTryNow = (productId: string) => {
    // Optionally record origin here too if it leads to adding to cart
    // setLastProductOrigin(location.pathname, productId, selectedCategory);
    navigate(`/try-on/${productId}`) // Navigate to virtual try-on page
  }

  // --- Render Component ---
  return (
    <div className="min-h-screen bg-[#eee8e3]">
      {/* Product Listing Section */}
      <section className="w-full py-10 px-4 sm:px-6 md:px-12 bg-[#D3C5B8] mb-12 md:mb-16">
        <AnimatedSection direction="left">
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center mb-8 gap-2 md:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#6b5745] focus:ring-offset-1 ${
                  selectedCategory === category // Style based on state
                    ? 'bg-[#6b5745] text-white shadow-md'
                    : 'bg-white text-black hover:bg-gray-200 border border-gray-300'
                }`}
                onClick={() => setSelectedCategory(category)} // Update state on click
              >
                {category}
              </button>
            ))}
          </div>

          {/* Loading State (Keep as is) */}
          {loading && (
            <div className="text-center py-12">
              {/* Spinner */}
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#6b5745] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          )}
          {/* Error State (Keep as is) */}
          {error && <p className="text-center text-red-600 font-medium py-8">{error}</p>}

          {/* Product Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 md:gap-x-6 gap-y-8 md:gap-y-10">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  // --- Individual Product Card ---
                  // *** ADD UNIQUE ID to the wrapper div ***
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
                  </div> // End Product Card
                )) // End map
              ) : (
                // Message when no products match the filter (Keep as is)
                <p className="text-center text-gray-500 col-span-full py-10">
                  No products found{' '}
                  {selectedCategory !== 'All' ? `in category "${selectedCategory}"` : 'for men'}.
                </p>
              )}
            </div> // End Grid
          )}
        </AnimatedSection>
      </section>

      {/* --- Other Sections (Conditional or Static) --- */}
      {/* Logic for showing banner/new collection based on 'All' category (Keep as is) */}
      {selectedCategory === 'All' && !loading && !error && (
        <>
          <div className="my-12 md:my-16 w-full px-4 sm:px-0">
            <img
              src={arrival_image}
              alt="New Arrivals"
              className="w-full object-cover rounded-lg shadow-md"
            />
          </div>
          <NewCollection genderFilter="Men" limit={4} />
        </>
      )}

      {/* Newsletter Section (Keep as is) */}
      {!loading && !error && <NewsLetter />}
    </div> // End Page Container
  )
}

export default Men
