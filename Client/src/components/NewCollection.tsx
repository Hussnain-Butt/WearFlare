// src/components/NewCollection.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Loader2, Eye, XCircle } from 'lucide-react' // ShoppingBag removed

interface Product {
  _id: string
  title: string
  price: string
  category: string
  gender: string
  image: string
  isInStock?: boolean // Corrected from inStock
}

const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app' // TODO: Move to .env

interface NewCollectionProps {
  genderFilter?: 'Men' | 'Women' | 'Unisex'
  limit?: number
}

// Animation Variants - unchanged
const sectionVariants = {
  /* ... */
}
const titleVariants = {
  /* ... */
}
const productGridVariants = {
  /* ... */
}
const productCardVariants = {
  /* ... */
}
const imageHoverVariants = {
  /* ... */
}

const NewCollection: React.FC<NewCollectionProps> = ({ genderFilter, limit = 4 }) => {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNewCollection = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.append('newCollection', 'true') // Assuming API supports this query param
      if (genderFilter) {
        params.append('gender', genderFilter)
      }
      params.append('limit', String(limit))

      // Assuming API returns Product[] directly, or adjust based on actual structure
      const response = await axios.get<{ products?: Product[]; results?: number } | Product[]>( // More flexible typing
        `${API_BASE_URL}/api/products?${params.toString()}`,
      )

      let rawData: Product[] = []
      if (Array.isArray(response.data)) {
        rawData = response.data
      } else if (response.data && Array.isArray((response.data as any).products)) {
        rawData = (response.data as any).products
      } else {
        console.error('Unexpected API response structure for New Collection:', response.data)
        setProducts([])
        setError('Received invalid data format for new collection.')
        setLoading(false)
        return
      }

      const processedData = rawData.map((p: any) => ({
        // Use any for p if structure is uncertain from API
        _id: p._id,
        title: p.title ?? 'Untitled Product',
        price: String(p.price ?? '0'),
        image: p.image ?? '',
        isInStock: p.isInStock ?? false, // Default to false
        gender: p.gender ?? (genderFilter || 'Unisex'), // Use provided genderFilter or default
        category: p.category ?? 'Uncategorized',
      }))
      setProducts(processedData)
    } catch (err: any) {
      console.error('Error fetching new collection:', err)
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError(
          `Could not find new ${
            genderFilter ? genderFilter.toLowerCase() + "'s " : ''
          }collection items.`,
        )
      } else {
        setError(
          `Could not load new ${
            genderFilter ? genderFilter.toLowerCase() + "'s " : ''
          }collection items.`,
        )
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
      // bg-gray-50 -> bg-muted/10 (or bg-background)
      <div className="bg-muted/10 py-16 md:py-20 px-4 sm:px-6 lg:px-8 text-center font-inter">
        <motion.h2
          // text-trendzone-dark-blue -> text-primary
          className="text-3xl md:text-4xl text-primary font-bold mb-10"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          {collectionTitle}
        </motion.h2>
        <div className="flex justify-center items-center min-h-[250px]">
          {/* text-trendzone-dark-blue -> text-primary */}
          <Loader2 className="animate-spin h-10 w-10 text-primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      // bg-gray-50 -> bg-muted/10
      <div className="bg-muted/10 py-16 md:py-20 px-4 sm:px-6 lg:px-8 text-center font-inter">
        <motion.h2
          // text-trendzone-dark-blue -> text-primary
          className="text-3xl md:text-4xl text-primary font-bold mb-10"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          {collectionTitle}
        </motion.h2>
        {/* Error message styling */}
        {/* bg-red-50 -> bg-destructive/10 */}
        {/* border-red-200 -> border-destructive/30 */}
        {/* text-red-500 (for icon) -> text-destructive */}
        <div className="flex flex-col items-center justify-center text-destructive bg-destructive/10 p-6 rounded-lg border border-destructive/30 max-w-lg mx-auto">
          <XCircle className="w-12 h-12 mb-3 text-destructive" />
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    )
  }

  if (products.length === 0 && !loading) {
    // Ensure not to show this during initial load
    return (
      // bg-gray-50 -> bg-muted/10
      <div className="bg-muted/10 py-16 md:py-20 px-4 sm:px-6 lg:px-8 text-center font-inter">
        <motion.h2
          // text-trendzone-dark-blue -> text-primary
          className="text-3xl md:text-4xl text-primary font-bold mb-10"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          {collectionTitle}
        </motion.h2>
        {/* text-gray-500 -> text-muted-foreground */}
        <p className="text-center text-muted-foreground text-lg">
          Fresh styles coming soon! Check back later for new{' '}
          {genderFilter ? `${genderFilter.toLowerCase()} ` : ''}arrivals.
        </p>
      </div>
    )
  }

  if (products.length === 0) return null // Don't render section if no products and not loading/error

  return (
    <motion.section
      // bg-gray-50 -> bg-muted/10 (or bg-background)
      className="bg-muted/10 py-16 md:py-20 px-4 sm:px-6 lg:px-8 font-inter"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          // text-trendzone-dark-blue -> text-primary
          className="text-3xl md:text-4xl lg:text-5xl text-primary font-bold text-center mb-10 md:mb-14"
          variants={titleVariants}
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
              id={`new-collection-product-card-${product._id}`} // Unique ID prefix
              // bg-white -> bg-card
              className="group flex flex-col bg-card rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              variants={productCardVariants}
              layout
              whileHover={{
                y: -6,
                transition: { type: 'spring', stiffness: 300, damping: 15 },
              }}
            >
              <motion.div
                className={`relative overflow-hidden aspect-[3/4] ${
                  product.isInStock ? 'cursor-pointer' : 'cursor-default'
                }`}
                onClick={() => product.isInStock && handleViewDetails(product._id)}
                variants={imageHoverVariants}
                initial="rest"
                whileHover={product.isInStock ? 'hover' : 'rest'}
              >
                {!product.isInStock && (
                  // bg-red-500/90 -> bg-destructive
                  // text-white -> text-destructive-foreground
                  <div className="absolute top-2.5 right-2.5 bg-destructive text-destructive-foreground text-[10px] font-semibold px-2.5 py-0.5 rounded-full z-20 shadow">
                    Out of Stock
                  </div>
                )}
                <motion.img
                  src={`${API_BASE_URL}${product.image.startsWith('/') ? '' : '/'}${product.image}`}
                  alt={product.title}
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
                    // bg-black with opacity -> bg-foreground with opacity
                    className="absolute inset-0 flex items-center justify-center z-10"
                    initial={{ opacity: 0, backgroundColor: 'hsla(var(--foreground-hsl),0)' }}
                    whileHover={{ opacity: 1, backgroundColor: 'hsla(var(--foreground-hsl),0.15)' }}
                    transition={{ duration: 0.25 }}
                  >
                    <motion.div
                      aria-label="View product details"
                      // bg-white -> bg-card
                      // text-trendzone-dark-blue -> text-primary (or text-card-foreground)
                      className="p-2.5 sm:p-3 bg-card text-primary rounded-full shadow-md scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-250"
                    >
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>

              <div className="p-2.5 sm:p-3 flex flex-col flex-grow justify-between">
                <div>
                  <h3
                    // text-trendzone-dark-blue -> text-foreground (or text-card-foreground)
                    className="text-sm md:text-base font-semibold text-foreground truncate mb-0.5"
                    title={product.title}
                  >
                    {product.isInStock ? (
                      <Link
                        to={`/product/${product._id}`}
                        // hover:text-trendzone-light-blue -> hover:text-accent (or hover:text-primary/80)
                        className="hover:text-accent transition-colors duration-200"
                      >
                        {product.title}
                      </Link>
                    ) : (
                      <span>{product.title}</span>
                    )}
                  </h3>
                  {/* text-trendzone-dark-blue/70 -> text-secondary-foreground (or text-muted-foreground) */}
                  <p className="text-xs md:text-sm font-medium text-secondary-foreground">
                    PKR {Number(product.price).toLocaleString('en-PK')}
                  </p>
                </div>

                {!product.isInStock && (
                  <div className="pt-2 sm:pt-3">
                    {/* bg-slate-100 -> bg-muted/50 */}
                    {/* text-slate-500 -> text-muted-foreground */}
                    <p className="w-full text-center text-xs sm:text-sm px-3 py-2 bg-muted/50 text-muted-foreground font-medium rounded-md">
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
