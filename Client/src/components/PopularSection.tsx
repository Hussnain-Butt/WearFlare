// Client/src/components/PopularSection.tsx
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'

interface Product {
  _id: string
  title: string
  price: string
  category: string
  gender: string
  image: string
  isInStock?: boolean
}

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, staggerChildren: 0.1, when: 'beforeChildren' },
  },
}
const cardVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 14, duration: 0.5 },
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
  hover: { scale: 1.05, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } },
}

const PopularSection: React.FC = () => {
  const navigate = useNavigate()
  const [popularProducts, setPopularProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app'

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
          setError('Could not parse popular products data.')
          setPopularProducts([])
          return
        }
        const processedProducts: Product[] = rawProductsData
          .map((p) => {
            if (!p || typeof p !== 'object' || !p._id) return null
            return {
              _id: p._id,
              title: p.title ?? 'Untitled Product',
              price: String(p.price ?? '0'),
              image: p.image ?? '',
              gender: p.gender ?? 'Unknown',
              category: p.category ?? 'Uncategorized',
              isInStock: p.isInStock ?? false,
            }
          })
          .filter((p): p is Product => p !== null)
        setPopularProducts(processedProducts.slice(0, 3))
      })
      .catch((err) => {
        console.error('Error loading popular products:', err)
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
      // CHANGED: bg-muted/10 to bg-background
      <section className="bg-background py-12 px-4 sm:py-16 md:py-20 lg:px-8 font-inter">
        <motion.h2
          className="text-primary text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-10 md:mb-16"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          Most Popular
        </motion.h2>
        <div className="text-center text-muted-foreground text-base sm:text-lg">
          Loading popular items...
        </div>
      </section>
    )
  }

  if (error || popularProducts.length === 0) {
    return (
      // CHANGED: bg-muted/10 to bg-background
      <section className="bg-background py-12 px-4 sm:py-16 md:py-20 lg:px-8 font-inter">
        <motion.h2
          className="text-primary text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-10 md:mb-16"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          Most Popular
        </motion.h2>
        {error && <p className="text-center text-destructive text-base sm:text-lg">{error}</p>}
        {!error && popularProducts.length === 0 && (
          <p className="text-center text-muted-foreground text-base sm:text-lg">
            No popular products to display right now.
          </p>
        )}
      </section>
    )
  }

  return (
    <motion.section
      // CHANGED: bg-muted/10 to bg-background
      className="bg-background py-12 px-4 sm:py-16 md:py-20 lg:px-8 font-inter"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
    >
      <motion.h2
        className="text-primary text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 sm:mb-12 md:mb-16"
        variants={titleVariants}
      >
        Most Popular
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
        {popularProducts.map((product) => (
          <motion.div
            key={product._id}
            id={`popular-product-${product._id}`}
            className="group flex flex-col bg-card rounded-xl shadow-lg overflow-hidden"
            variants={cardVariants}
            whileHover={{
              y: -8,
              scale: 1.015,
              boxShadow: '0px 12px 20px -4px rgba(0,0,0,0.08), 0px 8px 8px -4px rgba(0,0,0,0.03)',
            }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          >
            <motion.div
              className={`relative overflow-hidden h-72 sm:h-80 md:h-96 ${
                product.isInStock ? 'cursor-pointer' : 'cursor-default'
              }`}
              onClick={() => product.isInStock && handleViewDetails(product._id)}
              variants={imageHoverVariants}
              initial="rest"
              whileHover={product.isInStock ? 'hover' : 'rest'}
            >
              {!product.isInStock && (
                <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs font-semibold px-3 py-1.5 rounded-full z-10 shadow-md">
                  Out of Stock
                </div>
              )}
              <motion.img
                src={`${API_BASE_URL}${product.image.startsWith('/') ? '' : '/'}${product.image}`}
                alt={product.title}
                className={`w-full h-full object-cover ${
                  !product.isInStock ? 'opacity-50 grayscale' : ''
                }`}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400?text=Image+Unavailable'
                }}
                initial={{ opacity: 0.7, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              />
              {product.isInStock && (
                <motion.div
                  className="absolute inset-0 bg-[hsla(var(--foreground-hsl),0.0)] flex items-center justify-center"
                  initial={{ opacity: 0, backgroundColor: 'hsla(var(--foreground-hsl),0.0)' }}
                  whileHover={{ opacity: 1, backgroundColor: 'hsla(var(--foreground-hsl),0.3)' }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    aria-label="View product details"
                    className="p-3 bg-card text-primary rounded-full shadow-lg"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                  >
                    <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>

            <div className="p-4 sm:p-5 flex flex-col flex-grow">
              <h3
                className="text-md sm:text-lg font-semibold text-foreground truncate mb-1"
                title={product.title}
              >
                {product.isInStock ? (
                  <Link
                    to={`/product/${product._id}`}
                    className="hover:text-primary transition-colors duration-200"
                  >
                    {product.title}
                  </Link>
                ) : (
                  <span>{product.title}</span>
                )}
              </h3>
              <p className="text-base sm:text-md font-bold text-secondary-foreground mb-3 sm:mb-4">
                PKR {Number(product.price).toLocaleString('en-PK')}
              </p>
              {!product.isInStock && (
                <div className="mt-auto pt-2">
                  <p className="w-full text-center px-4 py-2 bg-muted/50 text-muted-foreground text-sm font-medium rounded-lg">
                    Currently Unavailable
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export default PopularSection
