// src/components/NewCollection.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Loader2, ShoppingBag, Eye, XCircle } from 'lucide-react'

interface Product {
  _id: string
  image: string
  title: string
  price: string | number
  inStock: boolean
  category?: string
  gender?: string
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://backend-production-c8ff.up.railway.app'

interface NewCollectionProps {
  genderFilter?: 'Men' | 'Women' | 'Unisex'
  limit?: number
}

// Animation Variants
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, staggerChildren: 0.1, when: 'beforeChildren' },
  },
}

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const productGridVariants = {
  hidden: {}, // Parent doesn't need opacity if children handle it
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
}

const productCardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 150, damping: 20, duration: 0.4 },
  },
}

const NewCollection: React.FC<NewCollectionProps> = ({ genderFilter, limit = 4 }) => {
  // Default limit to 4 for a row
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNewCollection = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.append('newCollection', 'true')
      if (genderFilter) {
        params.append('gender', genderFilter)
      }
      params.append('limit', String(limit))

      const response = await axios.get<Product[]>(
        `${API_BASE_URL}/api/products?${params.toString()}`,
      )
      if (Array.isArray(response.data)) {
        const processedData = response.data.map((p) => ({
          ...p,
          _id: p._id,
          title: p.title ?? 'Untitled Product',
          price: String(p.price ?? '0'),
          image: p.image ?? '',
          inStock: p.inStock ?? true,
          gender: p.gender,
        }))
        setProducts(processedData)
      } else {
        setProducts([])
        setError('Received invalid data format.')
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError('Could not find new collection items.')
      } else {
        setError('Could not load new collection items.')
      }
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [genderFilter, limit])

  useEffect(() => {
    fetchNewCollection()
  }, [fetchNewCollection])

  const handleViewDetails = (productId: string) => {
    if (!productId) return
    navigate(`/product/${productId}`)
  }

  const collectionTitle = genderFilter ? `${genderFilter}'s New Arrivals` : 'Discover New Arrivals'

  if (loading) {
    return (
      <div className="bg-gray-50 py-16 md:py-20 px-4 sm:px-6 lg:px-8 text-center font-inter">
        <motion.h2
          className="text-3xl md:text-4xl text-trendzone-dark-blue font-bold mb-10"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          {collectionTitle}
        </motion.h2>
        <div className="flex justify-center items-center min-h-[250px]">
          <Loader2 className="animate-spin h-10 w-10 text-trendzone-dark-blue" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-50 py-16 md:py-20 px-4 sm:px-6 lg:px-8 text-center font-inter">
        <motion.h2
          className="text-3xl md:text-4xl text-trendzone-dark-blue font-bold mb-10"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          {collectionTitle}
        </motion.h2>
        <div className="flex flex-col items-center justify-center text-red-500 bg-red-50 p-6 rounded-lg border border-red-200 max-w-lg mx-auto">
          <XCircle className="w-12 h-12 mb-3" />
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="bg-gray-50 py-16 md:py-20 px-4 sm:px-6 lg:px-8 text-center font-inter">
        <motion.h2
          className="text-3xl md:text-4xl text-trendzone-dark-blue font-bold mb-10"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          {collectionTitle}
        </motion.h2>
        <p className="text-center text-gray-500 text-lg">
          Fresh styles coming soon! Check back later for new{' '}
          {genderFilter ? `${genderFilter.toLowerCase()} ` : ''}arrivals.
        </p>
      </div>
    )
  }

  return (
    <motion.section
      className="bg-gray-50 py-16 md:py-20 px-4 sm:px-6 lg:px-8 font-inter" // Light background for the section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl text-trendzone-dark-blue font-bold text-center mb-10 md:mb-14"
          variants={titleVariants} // Reusing titleVariants from Men.tsx if applicable, or define new ones
        >
          {collectionTitle}
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12"
          variants={productGridVariants}
        >
          {products.map((product) => (
            <motion.div
              key={product._id}
              id={`new-collection-product-${product._id}`} // Unique ID
              className="group flex flex-col bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              variants={productCardVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 250, damping: 15 }}
            >
              <div
                className="relative overflow-hidden cursor-pointer aspect-[3/4]" // Product image aspect ratio
                onClick={() => product.inStock && handleViewDetails(product._id)}
              >
                {!product.inStock && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full z-20 shadow">
                    Out of Stock
                  </div>
                )}
                <motion.img
                  src={`${API_BASE_URL}${product.image.startsWith('/') ? '' : '/'}${product.image}`}
                  alt={product.title}
                  className={`w-full h-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-105 ${
                    !product.inStock ? 'opacity-50 grayscale' : ''
                  }`}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400?text=No+Image'
                  }}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                />
                {product.inStock && (
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
                  {product.inStock ? (
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
                  {product.inStock ? (
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
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default NewCollection
