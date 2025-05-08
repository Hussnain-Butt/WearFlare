import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion' // Import motion
import { ShoppingBag, Eye } from 'lucide-react' // Icons for buttons

interface Product {
  _id: string
  title: string
  price: string
  category: string
  gender: string
  image: string
  isInStock?: boolean
}

// Animation Variants
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3, // Faster section fade-in
      staggerChildren: 0.1, // Slightly faster stagger for cards
      when: 'beforeChildren', // Ensure parent animates before children for smoother entry
    },
  },
}

const cardVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.9 }, // Start a bit lower and smaller
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120, // Slightly stiffer spring
      damping: 14, // Good damping
      duration: 0.5, // Explicit duration can help if spring feels too long/short
    },
  },
}

const titleVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: 0.1 },
  },
}

const imageHoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.1, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } }, // Smoother custom ease
}

const buttonHoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 15 } },
  tap: { scale: 0.97 },
}

const PopularSection: React.FC = () => {
  const navigate = useNavigate()
  const [popularProducts, setPopularProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app' // Or your production URL

  useEffect(() => {
    setLoading(true)
    setError(null)

    axios
      .get<any>(`${API_BASE_URL}/api/products?limit=5`)
      .then((res) => {
        let rawProductsData: any[] = []
        if (res.data && Array.isArray(res.data.products)) {
          rawProductsData = res.data.products
        } else if (Array.isArray(res.data)) {
          rawProductsData = res.data
        } else {
          console.warn('Unexpected API response structure for popular products:', res.data)
          setError('Could not parse popular products data.')
          setPopularProducts([])
          return
        }

        const processedProducts: Product[] = rawProductsData
          .map((p) => {
            if (!p || typeof p !== 'object' || !p._id) {
              console.warn('Skipping invalid item in popular products data:', p)
              return null
            }
            return {
              _id: p._id,
              title: p.title ?? 'Untitled Product',
              price: String(p.price ?? '0'),
              image: p.image ?? '',
              gender: p.gender ?? 'Unknown',
              category: p.category ?? 'Uncategorized',
              isInStock: p.isInStock ?? true,
            }
          })
          .filter((p): p is Product => p !== null)

        setPopularProducts(processedProducts.slice(0, 3))
      })
      .catch((err) => {
        console.error('Error fetching popular products:', err)
        setError('Could not load popular products at the moment.')
        setPopularProducts([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [API_BASE_URL])

  const handleViewDetails = (productId: string) => {
    navigate(`/product/${productId}`)
  }

  if (loading) {
    return (
      <section className="bg-trendzone-light-blue/10 py-12 px-4 sm:py-16 sm:px-6 md:py-20 lg:px-8 font-inter">
        <motion.h2
          className="text-trendzone-dark-blue text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-10 md:mb-16"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          Most Popular
        </motion.h2>
        <div className="text-center text-gray-600 text-base sm:text-lg">
          Loading popular items...
        </div>
      </section>
    )
  }

  if (error || popularProducts.length === 0) {
    return (
      <section className="bg-trendzone-light-blue/10 py-12 px-4 sm:py-16 sm:px-6 md:py-20 lg:px-8 font-inter">
        <motion.h2
          className="text-trendzone-dark-blue text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-10 md:mb-16"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          Most Popular
        </motion.h2>
        {error && <p className="text-center text-red-500 text-base sm:text-lg">{error}</p>}
        {!error && popularProducts.length === 0 && (
          <p className="text-center text-gray-500 text-base sm:text-lg">
            No popular products to display right now.
          </p>
        )}
      </section>
    )
  }

  return (
    <motion.section
      className="bg-trendzone-light-blue/10 py-12 px-4 sm:py-16 sm:px-6 md:py-20 lg:px-8 font-inter"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }} // Trigger when 5% of section is visible
    >
      <motion.h2
        className="text-trendzone-dark-blue text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 sm:mb-12 md:mb-16"
        variants={titleVariants} // Use refined title animation
      >
        Most Popular
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
        {popularProducts.map((product) => (
          <motion.div
            key={product._id}
            id={`popular-product-${product._id}`}
            className="group flex flex-col bg-white rounded-xl shadow-lg overflow-hidden" // Removed transition-all, Framer Motion handles it
            variants={cardVariants}
            whileHover={{
              y: -10,
              scale: 1.02,
              boxShadow: '0px 15px 25px -5px rgba(0,0,0,0.1), 0px 10px 10px -5px rgba(0,0,0,0.04)',
            }} // Enhanced hover
            transition={{ type: 'spring', stiffness: 250, damping: 20 }} // Transition for whileHover
          >
            {/* Image Container */}
            <motion.div // For image hover scale, distinct from card lift
              className="relative overflow-hidden cursor-pointer h-72 sm:h-80 md:h-96" // Explicit heights instead of aspect ratio
              onClick={() => product.isInStock && handleViewDetails(product._id)}
              variants={imageHoverVariants}
              initial="rest"
              whileHover="hover"
            >
              {!product.isInStock && (
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow-md">
                  Out of Stock
                </div>
              )}
              <motion.img // Animate the image itself for the scale effect on hover
                src={`${API_BASE_URL}${product.image.startsWith('/') ? '' : '/'}${product.image}`}
                alt={product.title}
                className={`w-full h-full object-cover ${
                  // Removed group-hover:scale-110 and transition
                  !product.isInStock ? 'opacity-60 grayscale' : ''
                }`}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400?text=Image+Unavailable'
                }}
                initial={{ opacity: 0.8, scale: 1.15 }} // Start slightly zoomed and less opaque
                animate={{ opacity: 1, scale: 1 }} // Animate to fully opaque and normal scale
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }} // Custom ease for image load
              />
              {product.isInStock && (
                <motion.div
                  className="absolute inset-0 bg-black flex items-center justify-center"
                  initial={{ opacity: 0, backgroundColor: 'rgba(0,0,0,0)' }}
                  whileHover={{ opacity: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    aria-label="View product details"
                    className="p-3 bg-white text-trendzone-dark-blue rounded-full shadow-lg hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewDetails(product._id)
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.2 }} // Button appears slightly after hover
                  >
                    <Eye className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>

            {/* Product Info & Actions */}
            <div className="p-5 flex flex-col flex-grow">
              <h3
                className="text-lg font-semibold text-trendzone-dark-blue truncate mb-1.5"
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
              <p className="text-md font-bold text-trendzone-dark-blue/80 mb-4">
                PKR {Number(product.price).toLocaleString('en-PK')}
              </p>
              <div className="mt-auto">
                {product.isInStock ? (
                  <motion.button
                    className="w-full px-5 py-2.5 bg-trendzone-dark-blue text-white text-sm font-medium rounded-lg hover:bg-trendzone-light-blue focus:outline-none focus:ring-2 focus:ring-trendzone-light-blue focus:ring-offset-2 flex items-center justify-center gap-2 transition-colors duration-300"
                    onClick={() => handleViewDetails(product._id)}
                    variants={buttonHoverVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    View Product
                  </motion.button>
                ) : (
                  <button
                    className="w-full px-5 py-2.5 bg-gray-200 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed"
                    disabled
                  >
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export default PopularSection
