// src/pages/Men.tsx
import React, { useState, useEffect } from 'react'
// *** Import useLocation and useCart ***
import { Link, useNavigate, useLocation } from 'react-router-dom'
// import { ChevronRight } from 'lucide-react'; // Keep if used elsewhere (Not used in this snippet)
import axios from 'axios'
import { useCart } from '../context/CartContext' // *** Import useCart ***

// Components (ensure paths are correct)
import NewsLetter from '@/components/NewsLetter'
import arrival_image from '/new_arrival.png' // Ensure path is correct from public folder
import AnimatedSection from '@/components/AnimatedSection'
import NewCollection from '@/components/NewCollection'

// --- Backend API Base URL ---
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app' // Or your local URL

// --- Product Interface (Keep as is) ---
interface Product {
  _id: string
  title: string
  price: string
  category: string
  gender: string
  image: string
  isInStock?: boolean // Keep optional or ensure backend always provides it
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
  const initialCategory = location.state?.category || 'All' // Default to 'All'
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)

  // --- Fetch Products based on Gender (Keep as is) ---
  useEffect(() => {
    setLoading(true)
    setError(null)
    axios
      .get<Product[]>(`${API_BASE_URL}/api/products?gender=Men`)
      .then((res) => {
        // Ensure isInStock has a default value if missing from API
        const processedProducts = res.data.map((p) => ({
          ...p,
          isInStock: p.isInStock ?? true, // Default to true if undefined/null
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
          } else {
            console.warn(`Element not found for scrolling: product-row-${productIdToScroll}`)
          }
        }, 100)
        return () => clearTimeout(timer)
      }
    }
  }, [loading, products, location.hash, location.state, navigate])

  // --- Filter Products by Selected Category (Keep as is) ---
  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter(
          (product) => product.category.toLowerCase() === selectedCategory.toLowerCase(),
        )

  // --- UPDATED Navigation Handlers (Keep as is) ---
  const handleViewDetails = (productId: string) => {
    setLastProductOrigin(location.pathname, productId, selectedCategory)
    navigate(`/product/${productId}`)
  }

  // Optional: Keep if needed, otherwise remove
  // const handleTryNow = (productId: string) => {
  //   navigate(`/try-on/${productId}`);
  // };

  // --- Render Component ---
  return (
    <div className="min-h-screen bg-[#eee8e3]">
      {' '}
      {/* Light beige background for the whole page */}
      {/* Product Listing Section */}
      <section className="w-full py-10 px-4 sm:px-6 md:px-12 bg-[#D3C5B8] mb-12 md:mb-16">
        {' '}
        {/* Slightly darker beige for this section */}
        <AnimatedSection direction="left">
          {/* Category Filter Buttons (Keep as is) */}
          <div className="flex flex-wrap justify-center mb-8 gap-2 md:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#6b5745] focus:ring-offset-1 ${
                  selectedCategory === category
                    ? 'bg-[#6b5745] text-white shadow-md'
                    : 'bg-white text-black hover:bg-gray-200 border border-gray-300'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Loading State (Keep as is) */}
          {loading && (
            <div className="text-center py-12">
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
            // Adjusted gap for slightly more space
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-8 md:gap-y-12">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  // --- [PROFESSIONAL DESIGN UPDATE START] ---
                  // --- Individual Product Card ---
                  // Added unique ID for scrolling target
                  <div
                    key={product._id}
                    id={`product-row-${product._id}`}
                    // Unified card styling: white background, rounded corners, subtle shadow, hover effect
                    className="group flex flex-col bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                  >
                    {/* Image Container: Make it clickable if in stock */}
                    <div
                      className="relative overflow-hidden cursor-pointer"
                      onClick={() => product.isInStock && handleViewDetails(product._id)}
                    >
                      {/* Out of Stock Badge (Positioned top-right) */}
                      {!product.isInStock && (
                        <div className="absolute top-3 right-3 bg-red-100 text-red-700 text-[10px] font-semibold px-2 py-0.5 rounded-full z-10 ring-1 ring-inset ring-red-600/20">
                          Out of Stock
                        </div>
                      )}
                      {/* Product Image: Adjusted height, added scale transition on hover */}
                      <img
                        src={`${API_BASE_URL}${product.image}`}
                        alt={product.title}
                        className={`w-full h-72 sm:h-80 md:h-[350px] object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 ${
                          !product.isInStock ? 'opacity-50 grayscale-[50%]' : '' // Added subtle grayscale for out of stock
                        }`}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/300?text=No+Image'
                        }} // Fallback
                      />
                    </div>

                    {/* Product Info & Actions: Added padding, adjusted text alignment and spacing */}
                    <div className="p-4 flex flex-col flex-grow">
                      {' '}
                      {/* flex-grow makes this section fill remaining space */}
                      {/* Title: Slightly larger, bold, left-aligned, margin-bottom */}
                      <h3
                        className="text-base font-semibold text-gray-800 truncate mb-1 text-left"
                        title={product.title}
                      >
                        {/* Make title clickable */}
                        {product.isInStock ? (
                          <Link
                            to="#" // Use Link for semantics, prevent default handles navigation
                            onClick={(e) => {
                              e.preventDefault()
                              handleViewDetails(product._id)
                            }}
                            className="hover:text-[#6b5745] transition-colors"
                          >
                            {product.title}
                          </Link>
                        ) : (
                          // Non-clickable title when out of stock
                          <span>{product.title}</span>
                        )}
                      </h3>
                      {/* Price: Left-aligned, margin-bottom */}
                      <p className="text-sm font-semibold text-[#6b5745] mb-3 text-left">
                        PKR {Number(product.price).toLocaleString('en-PK')}
                      </p>
                      {/* --- Buttons Container / Out of Stock Message --- */}
                      {/* Use mt-auto to push buttons to the bottom if card heights vary */}
                      <div className="mt-auto pt-2">
                        {product.isInStock ? (
                          <>
                            {/* View Details Button: Refined styling */}
                            <button
                              className="w-full px-4 py-2.5 bg-[#6b5745] text-white text-sm font-medium rounded-md hover:bg-[#5d4c3b] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#6b5745] focus:ring-offset-2"
                              onClick={() => handleViewDetails(product._id)}
                            >
                              View Details
                            </button>
                            {/* Optional Try Now Button - Uncomment if needed
                            <button
                              className="w-full mt-2 px-4 py-2.5 bg-[#c8a98a] text-[#6b5745] text-sm font-medium rounded-md hover:bg-[#b08d6a] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#c8a98a] focus:ring-offset-2"
                              onClick={() => handleTryNow(product._id)}
                            >
                              Try Now
                            </button>
                             */}
                          </>
                        ) : (
                          // Out of Stock Button (Disabled look): Consistent styling
                          <button
                            className="w-full px-4 py-2.5 bg-gray-200 text-gray-500 text-sm font-medium rounded-md cursor-not-allowed"
                            disabled // Make it a disabled button
                          >
                            Out of Stock
                          </button>
                        )}
                      </div>
                      {/* --- End Buttons Container --- */}
                    </div>
                  </div> // End Product Card
                  // --- [PROFESSIONAL DESIGN UPDATE END] ---
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
      {/* --- Other Sections (Conditional or Static - Keep as is) --- */}
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
