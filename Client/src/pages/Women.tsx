// src/pages/Women.tsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ShoppingBag, Eye, XCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'

// Components
import NewsLetter from '@/components/NewsLetter'
// Assuming women_banner.png is in public folder or imported correctly
// import womenBannerImage from '/women_banner.png'; // If in public
import womenBannerImageImport from '../assets/banner.png' // If you prefer to import for bundler processing
import NewCollection from '@/components/NewCollection'

const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app'

interface Product {
  _id: string
  title: string
  price: string
  category: string
  gender: string
  image: string
  isInStock?: boolean
}

// Adjusted categories for Women if they differ, otherwise keep as is
const categories = ['All', 'Jackets', 'Pants', 'Shirts', 'Sweatshirt'] // Example women categories

// Animation Variants (can be shared with Men.tsx or defined here)
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, when: 'beforeChildren', staggerChildren: 0.1 },
  },
}

const filterButtonContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
}

const filterButtonVariants = {
  hidden: { opacity: 0, y: -15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } },
}

const productGridVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
}

const productCardVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 180, damping: 20, duration: 0.35 },
  },
}

const Women: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { setLastProductOrigin } = useCart()

  const initialCategory = location.state?.category || 'All'
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)

  useEffect(() => {
    setLoading(true)
    setError(null)
    axios
      .get<Product[]>(`${API_BASE_URL}/api/products?gender=Women`)
      .then((res) => {
        const processedProducts = res.data.map((p) => ({
          ...p,
          isInStock: p.isInStock ?? true, // Default to true
        }))
        setProducts(processedProducts)
      })
      .catch((err) => {
        console.error("Error fetching women's products:", err)
        setError('Failed to load products. Please try again later.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!loading && products.length > 0 && location.hash && location.hash.startsWith('#product-')) {
      const productIdToScroll = location.hash.substring('#product-'.length)
      if (productIdToScroll) {
        const timer = setTimeout(() => {
          const element = document.getElementById(`product-card-${productIdToScroll}`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 200)
        return () => clearTimeout(timer)
      }
    }
  }, [loading, products, location.hash, location.state])

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter(
          (product) => product.category?.toLowerCase() === selectedCategory.toLowerCase(),
        )

  const handleViewDetails = (productId: string) => {
    setLastProductOrigin(location.pathname, productId, selectedCategory)
    navigate(`/product/${productId}`)
  }

  // const handleTryNow = (productId: string) => { // Keep if used
  //   navigate(`/try-on/${productId}`);
  // };

  return (
    <motion.div
      className="min-h-screen bg-gray-100 font-inter" // Light background
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <section className="w-full py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-trendzone-dark-blue text-center mb-8 md:mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Women's Collection
          </motion.h1>

          {/* Category Filter Buttons - Pill Background Style */}
          <motion.div
            className="flex justify-center mb-8 md:mb-12 space-x-1 sm:space-x-2"
            variants={filterButtonContainerVariants}
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                variants={filterButtonVariants}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative px-4 py-2 sm:px-5 sm:py-2.5 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                  selectedCategory === category
                    ? 'text-white focus-visible:ring-trendzone-light-blue'
                    : 'text-trendzone-dark-blue hover:bg-gray-200/60 focus-visible:ring-trendzone-dark-blue'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                <span className="relative z-10">{category}</span>
                {selectedCategory === category && (
                  <motion.div
                    className="absolute inset-0 bg-trendzone-dark-blue rounded-md z-0"
                    layoutId="activeWomenCategoryPill" // Unique layoutId for Women's page
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          {loading && (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-trendzone-dark-blue mb-3" />
              <p className="text-md text-gray-600">Loading products...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <XCircle className="h-10 w-10 text-red-500 mb-3" />
              <p className="text-md text-red-600 font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 md:gap-x-6 md:gap-y-10"
              variants={productGridVariants}
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    id={`product-card-${product._id}`}
                    className="group flex flex-col bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                    variants={productCardVariants}
                    layout
                  >
                    <div
                      className="relative overflow-hidden cursor-pointer aspect-[3/4]"
                      onClick={() => product.isInStock && handleViewDetails(product._id)}
                    >
                      {!product.isInStock && (
                        <div className="absolute top-2.5 right-2.5 bg-red-500/90 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-md z-20 shadow">
                          Out of Stock
                        </div>
                      )}
                      <motion.img
                        src={`${API_BASE_URL}${product.image.startsWith('/') ? '' : '/'}${
                          product.image
                        }`}
                        alt={product.title}
                        className={`w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 ${
                          !product.isInStock ? 'opacity-60 grayscale-[0.5]' : ''
                        }`}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400?text=No+Image'
                        }}
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      />
                      {product.isInStock && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center z-10"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1, backgroundColor: 'rgba(0,0,0,0.05)' }}
                          transition={{ duration: 0.25 }}
                        >
                          <motion.button
                            aria-label="View product details"
                            className="p-2.5 bg-white text-trendzone-dark-blue rounded-full shadow-md hover:bg-gray-100 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-250"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewDetails(product._id)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                      <h3
                        className="text-sm md:text-base font-semibold text-trendzone-dark-blue truncate mb-0.5"
                        title={product.title}
                      >
                        {product.isInStock ? (
                          <Link
                            to={`/product/${product._id}`}
                            className="hover:text-trendzone-light-blue transition-colors"
                          >
                            {product.title}
                          </Link>
                        ) : (
                          <span>{product.title}</span>
                        )}
                      </h3>
                      <p className="text-xs md:text-sm font-medium text-trendzone-dark-blue/70 mb-3">
                        PKR {Number(product.price).toLocaleString('en-PK')}
                      </p>
                      <div className="mt-auto">
                        {product.isInStock ? (
                          <motion.button
                            className="w-full px-4 py-2 bg-trendzone-dark-blue text-white text-xs sm:text-sm font-medium rounded-md hover:bg-trendzone-light-blue hover:text-trendzone-dark-blue transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-trendzone-light-blue focus-visible:ring-offset-2 flex items-center justify-center gap-1.5"
                            onClick={() => handleViewDetails(product._id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            View Details
                          </motion.button>
                        ) : (
                          <button
                            className="w-full px-4 py-2 bg-gray-200 text-gray-500 text-xs sm:text-sm font-medium rounded-md cursor-not-allowed"
                            disabled
                          >
                            Out of Stock
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.p
                  className="text-center text-gray-500 col-span-full py-16 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  No products found in "{selectedCategory}". Try a different category!
                </motion.p>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Other sections (Banner, NewCollection, Newsletter) */}
      {selectedCategory === 'All' && !loading && !error && (
        <>
          <motion.div
            className="my-12 md:my-16 w-full px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src={womenBannerImageImport} // Use imported image for women's banner
              alt="Women's Collection Banner"
              className="w-full h-auto object-cover rounded-xl shadow-lg"
            />
          </motion.div>
          <NewCollection genderFilter="Women" limit={4} />{' '}
          {/* Limit 4 for women as well or adjust */}
        </>
      )}

      {!loading && !error && <NewsLetter />}
    </motion.div>
  )
}

export default Women
