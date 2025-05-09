// src/pages/Women.tsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Eye, XCircle } from 'lucide-react' // ShoppingBag icon removed from here as it was on the button
import { useCart } from '../context/CartContext'

// Components
import NewsLetter from '@/components/NewsLetter'
import womenBannerImageImport from '../assets/banner-women.jpg'
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

const categories = ['All', 'Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Accessories'] // Adjusted categories

// Animation Variants
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

const imageHoverVariants = {
  // For product card image hover
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] } },
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
          isInStock: p.isInStock ?? false, // Default to false if not provided by backend
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
  }, []) // API_BASE_URL is stable, no need in deps if not changing

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

  return (
    <motion.div
      className="min-h-screen bg-slate-50 font-inter" // Using a very light gray
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

          {/* Category Filter Buttons */}
          <motion.div
            className="flex justify-center flex-wrap mb-8 md:mb-12 gap-1.5 sm:gap-2"
            variants={filterButtonContainerVariants}
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                variants={filterButtonVariants}
                whileHover={{ y: -2, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                whileTap={{ scale: 0.97 }}
                className={`relative px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                  selectedCategory === category
                    ? 'text-white focus-visible:ring-trendzone-light-blue'
                    : 'text-trendzone-dark-blue hover:bg-slate-200/70 focus-visible:ring-trendzone-dark-blue'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                <span className="relative z-10">{category}</span>
                {selectedCategory === category && (
                  <motion.div
                    className="absolute inset-0 bg-trendzone-dark-blue rounded-md z-0"
                    layoutId="activeWomenCategoryPill"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          {loading && (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-trendzone-dark-blue mb-3" />
              <p className="text-md text-slate-600">Loading products...</p>
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
              className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 md:gap-x-5 md:gap-y-8"
              variants={productGridVariants}
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    id={`product-card-${product._id}`}
                    className="group flex flex-col bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                    variants={productCardVariants}
                    layout
                    whileHover={{
                      y: -6,
                      transition: { type: 'spring', stiffness: 300, damping: 15 },
                    }}
                  >
                    <motion.div // Image container
                      className={`relative overflow-hidden aspect-[3/4] ${
                        product.isInStock ? 'cursor-pointer' : 'cursor-default'
                      }`}
                      onClick={() => product.isInStock && handleViewDetails(product._id)}
                      variants={imageHoverVariants}
                      initial="rest"
                      whileHover={product.isInStock ? 'hover' : 'rest'}
                    >
                      {!product.isInStock && (
                        <div className="absolute top-2.5 right-2.5 bg-red-500/90 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full z-20 shadow">
                          Out of Stock
                        </div>
                      )}
                      <motion.img
                        src={`${API_BASE_URL}${product.image.startsWith('/') ? '' : '/'}${
                          product.image
                        }`}
                        alt={product.title}
                        // MODIFIED LINE: Changed w-96 h-96 to w-full h-full
                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                          !product.isInStock ? 'opacity-50 grayscale-[0.6]' : ''
                        }`}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400?text=No+Image'
                        }}
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      />
                      {product.isInStock && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center z-10"
                          initial={{ opacity: 0, backgroundColor: 'rgba(0,0,0,0)' }}
                          whileHover={{ opacity: 1, backgroundColor: 'rgba(0,0,0,0.15)' }}
                          transition={{ duration: 0.25 }}
                        >
                          <motion.div
                            aria-label="View product details"
                            className="p-2.5 sm:p-3 bg-white text-trendzone-dark-blue rounded-full shadow-md scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-250"
                          >
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                          </motion.div>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Product Info Section */}
                    {/* MODIFIED LINE: Changed padding from p-3 sm:p-4 to p-2.5 sm:p-3 */}
                    <div className="p-2.5 sm:p-3 flex flex-col flex-grow justify-between">
                      <div>
                        <h3
                          className="text-sm md:text-base font-semibold text-trendzone-dark-blue truncate mb-0.5"
                          title={product.title}
                        >
                          {product.isInStock ? (
                            <Link
                              to={`/product/${product._id}`}
                              className="hover:text-trendzone-light-blue transition-colors duration-200"
                            >
                              {product.title}
                            </Link>
                          ) : (
                            <span>{product.title}</span>
                          )}
                        </h3>
                        <p className="text-xs md:text-sm font-medium text-trendzone-dark-blue/70">
                          PKR {Number(product.price).toLocaleString('en-PK')}
                        </p>
                      </div>

                      {!product.isInStock && (
                        <div className="pt-2 sm:pt-3">
                          <p className="w-full text-center text-xs sm:text-sm px-3 py-2 bg-slate-100 text-slate-500 font-medium rounded-md">
                            Currently Unavailable
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.p
                  className="text-center text-slate-500 col-span-full py-16 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  No products found in "{selectedCategory}". Explore other styles!
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
              src={womenBannerImageImport}
              alt="Women's Collection Banner"
              className="w-full h-auto object-cover rounded-xl shadow-lg"
            />
          </motion.div>
          <NewCollection genderFilter="Women" limit={4} />
        </>
      )}

      {!loading && !error && <NewsLetter />}
    </motion.div>
  )
}

export default Women
