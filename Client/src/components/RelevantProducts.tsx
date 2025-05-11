// src/components/RelevantProducts.tsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Loader2, AlertTriangle, ImageOff, Eye } from 'lucide-react' // Added Eye icon
import { motion } from 'framer-motion'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://backend-production-c8ff.up.railway.app'

interface Product {
  _id: string
  title: string
  price: string
  image: string
  gender: string
  category?: string
  isInStock?: boolean
}

interface RelevantProductsProps {
  currentProductId: string
  gender: string
  category?: string
  limit?: number
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
}

// Replicated from Men.tsx for consistency in image hover
const imageHoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] } },
}

const RelevantProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [imageError, setImageError] = useState(false)
  const imageUrl = `${API_BASE_URL}${product.image.startsWith('/') ? '' : '/'}${product.image}`
  const isProductInStock = product.isInStock ?? false

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isProductInStock) {
      e.preventDefault()
    }
  }

  return (
    <Link
      to={isProductInStock ? `/product/${product._id}` : '#'}
      className="group block w-full h-full" // group class is important for group-hover effects
      aria-label={`View details for ${product.title}${!isProductInStock ? ' (Out of Stock)' : ''}`}
      onClick={handleCardClick}
    >
      <div
        className={`bg-card border border-border rounded-xl overflow-hidden shadow-sm h-full flex flex-col transition-all duration-300 ease-in-out 
                    ${
                      isProductInStock
                        ? 'hover:shadow-lg transform hover:-translate-y-1'
                        : 'opacity-70 cursor-default'
                    }`}
      >
        {/* Image container - motion.div for direct hover effects on image if needed */}
        <motion.div
          className={`relative overflow-hidden aspect-[4/5] w-full bg-muted/50 
                      ${isProductInStock ? 'cursor-pointer' : 'cursor-default'}`}
          // variants={imageHoverVariants} // Using direct group-hover on img for scale
          // initial="rest"
          // whileHover={isProductInStock ? "hover" : "rest"} // This could be used if img scale is also motion variant based
        >
          {imageError ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
              <ImageOff size={40} className="mb-2 opacity-70" />
              <span className="text-xs">Image unavailable</span>
            </div>
          ) : (
            <>
              {!isProductInStock && (
                <div className="absolute top-2.5 right-2.5 bg-destructive text-destructive-foreground text-[10px] font-semibold px-2.5 py-0.5 rounded-full z-20 shadow">
                  Out of Stock
                </div>
              )}
              <motion.img // Added motion.img for consistency if variants are used later
                src={imageUrl}
                alt={product.title}
                className={`w-full h-full object-cover object-center transition-opacity duration-300 
                            ${
                              isProductInStock
                                ? 'group-hover:scale-105'
                                : 'opacity-60 grayscale-[0.5]'
                            }`}
                loading="lazy"
                onError={() => setImageError(true)}
                initial={{ opacity: 0.7 }} // Initial opacity for gentle load-in
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                // variants={isProductInStock ? imageHoverVariants : {}} // Apply scale variant only if in stock
                // initial="rest"
                // whileHover="hover"
              />
              {isProductInStock && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center z-10"
                  initial={{ opacity: 0, backgroundColor: 'hsla(var(--foreground-hsl), 0)' }} // Assuming foreground-hsl is defined in your Tailwind theme
                  whileHover={{
                    // This will trigger when hovering the image container directly
                    opacity: 1,
                    backgroundColor: 'hsla(var(--foreground-hsl), 0.15)', // Or use 'bg-black/15' or 'bg-foreground/15'
                  }}
                  // The group-hover on the parent Link component will also trigger this if preferred:
                  // initial={{ opacity: 0 }}
                  // animate={{ opacity: product.isHovered ? 1 : 0 }} // Requires state management for isHovered
                  // For simplicity with group-hover:
                  // className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 bg-black/0 group-hover:bg-black/15 transition-all duration-250"
                  transition={{ duration: 0.25 }}
                >
                  <motion.div
                    aria-label="View product details"
                    className="p-2.5 sm:p-3 bg-card text-primary rounded-full shadow-md 
                               opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 
                               transition-all duration-250 ease-in-out"
                  >
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>

        {/* Product Info */}
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <h3
            className={`text-sm sm:text-base font-medium text-foreground mb-1 line-clamp-2 
                        ${isProductInStock ? 'group-hover:text-primary transition-colors' : ''}`}
            title={product.title}
          >
            {product.title}
          </h3>
          <p className="text-sm font-semibold text-primary mt-auto pt-1">
            PKR {Number(product.price).toLocaleString('en-PK')}
          </p>
          {!isProductInStock && (
            <p className="text-xs text-center text-muted-foreground mt-2 p-1.5 bg-muted/60 rounded-md">
              Currently Unavailable
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

const RelevantProducts: React.FC<RelevantProductsProps> = ({
  currentProductId,
  gender,
  category,
  limit = 4,
}) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRelevantProducts = async () => {
      setLoading(true)
      setError(null)
      setProducts([])

      try {
        let apiUrl = `${API_BASE_URL}/api/products?gender=${gender.toLowerCase()}&limit=${
          limit + 5
        }`
        if (category && typeof category === 'string' && category.trim() !== '') {
          apiUrl += `&category=${encodeURIComponent(category)}`
        }

        const response = await axios.get<Product[]>(apiUrl)
        const rawData = Array.isArray(response.data)
          ? response.data
          : (response.data as any)?.products

        if (!Array.isArray(rawData)) {
          console.error('Unexpected API response structure for relevant products:', response.data)
          setError('Failed to load similar products due to unexpected data format.')
          setProducts([])
          setLoading(false)
          return
        }

        const processedProducts = rawData.map((p: any) => ({
          _id: p._id,
          title: p.title ?? 'Untitled Product',
          price: String(p.price ?? '0'),
          image: p.image ?? '',
          gender: p.gender ?? gender,
          category: p.category ?? 'Uncategorized',
          isInStock: p.isInStock ?? false,
        }))

        const relevant = processedProducts.filter((p) => p._id !== currentProductId).slice(0, limit)

        setProducts(relevant)
      } catch (err) {
        console.error('Error fetching relevant products:', err)
        setError('Could not load similar products at this time.')
      } finally {
        setLoading(false)
      }
    }

    if (gender && currentProductId) {
      fetchRelevantProducts()
    } else {
      setLoading(false)
    }
  }, [currentProductId, gender, category, limit])

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center bg-muted/30">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (error && products.length === 0) {
    return (
      <div className="py-12 text-center text-destructive bg-muted/30">
        <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-80" />
        <p className="font-medium">{error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="py-10 sm:py-16 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          You Might Also Like
        </motion.h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <RelevantProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RelevantProducts
