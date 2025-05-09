// src/components/NewCollection.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Loader2, ShoppingBag, Eye, XCircle } from 'lucide-react'

interface Product {
  _id: string
  title: string
  price: string
  category: string
  gender: string
  image: string
  isInStock?: boolean
}

const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app'

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
// imageHoverVariants for product card image
const imageHoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] } },
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
                  src={`${API_BASE_URL}${product.image.startsWith('/') ? '' : '/'}${product.image}`}
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
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default NewCollection
