// src/pages/ProductDetailsPage.tsx
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import {
  ChevronRight,
  CheckCircle,
  Camera,
  XCircle,
  ShoppingBag,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://backend-production-c8ff.up.railway.app'

interface ProductDetail {
  _id: string
  title: string
  price: string
  category: string
  gender: string
  image: string
  description?: string
  isInStock?: boolean
  sizes?: string[]
  stockDetails?: Record<string, number>
  colors?: string[]
}

interface CartItemForContext {
  _id: string
  title: string
  price: number
  image: string
  selectedSize: string | null
  selectedColor?: string | null
  quantity: number
  availableStock: number
}

// Animation Variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const columnVariants = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay } },
})

const itemVariants = (delay = 0) => ({
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut', delay } },
})

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { addToCart, cart } = useCart()

  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false)
  const [showAddedMessage, setShowAddedMessage] = useState<boolean>(false)

  const stockForSelectedSize =
    selectedSize && product?.stockDetails ? product.stockDetails[selectedSize] ?? 0 : 0
  const isSelectedSizeAvailable = stockForSelectedSize > 0
  const hasSizes = product?.sizes && product.sizes.length > 0
  const hasColors = product?.colors && product.colors.length > 0

  useEffect(() => {
    // ... (Fetch Product Logic - remains the same)
    if (!productId) {
      setError('Product ID is missing.')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    setSelectedSize(null)
    setSelectedColor(null)
    setProduct(null)
    const fetchProduct = async () => {
      try {
        const response = await axios.get<ProductDetail>(`${API_BASE_URL}/api/products/${productId}`)
        if (!response.data || !response.data._id) throw new Error('Invalid product data.')
        const stockDetailsObject = response.data.stockDetails ?? {}
        setProduct({
          ...response.data,
          isInStock: response.data.isInStock ?? false,
          sizes: response.data.sizes ?? [],
          stockDetails: stockDetailsObject,
          colors: response.data.colors ?? [],
        })
        if (response.data.sizes && response.data.sizes.length > 0) {
          const firstAvailableSize = response.data.sizes.find(
            (size) => stockDetailsObject[size] > 0,
          )
          setSelectedSize(firstAvailableSize || response.data.sizes[0] || null) // Select first available, then first, then null
        }
      } catch (err: any) {
        // ... (Error handling for fetch remains the same)
        if (err.response?.status === 404) setError('Product not found.')
        else if (err.request) setError('Network error. Please check connection.')
        else setError('Failed to load product details.')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  const handleSelectSize = (size: string) => setSelectedSize(size)
  const handleSelectColor = (color: string) => setSelectedColor(color)

  const handleAddToCart = () => {
    // ... (Add to Cart Logic - remains the same, using toast)
    if (!product || !product.isInStock || isAddingToCart || showAddedMessage) {
      if (product && !product.isInStock) toast.error('This item is out of stock.')
      return
    }
    if (hasSizes && !selectedSize) {
      toast.error('Please select a size.')
      return
    }
    if (hasColors && !selectedColor) {
      toast.error('Please select a color.')
      return
    }
    if (hasSizes && selectedSize && !isSelectedSizeAvailable) {
      toast.error(`Size ${selectedSize} is out of stock.`)
      return
    }

    const currentCartItem = cart.find(
      (item) =>
        item._id === product._id &&
        item.selectedSize === selectedSize /* && item.selectedColor === selectedColor */,
    )
    const currentQuantityInCart = currentCartItem ? currentCartItem.quantity : 0
    if (currentQuantityInCart + 1 > stockForSelectedSize && hasSizes) {
      toast.error(`Max ${stockForSelectedSize} of Size ${selectedSize} can be added.`)
      return
    }

    setIsAddingToCart(true)
    setShowAddedMessage(false)
    setTimeout(() => {
      try {
        const priceNumber = parseFloat(product.price)
        if (isNaN(priceNumber)) throw new Error('Invalid product price.')
        addToCart({
          _id: product._id,
          title: product.title,
          price: priceNumber,
          image: product.image,
          selectedSize,
          selectedColor,
          quantity: 1,
          availableStock: stockForSelectedSize,
        })
        setIsAddingToCart(false)
        setShowAddedMessage(true)
        setTimeout(() => setShowAddedMessage(false), 2000)
      } catch (cartError: any) {
        toast.error(cartError.message || 'Could not add to cart.')
        setIsAddingToCart(false)
      }
    }, 100)
  }

  const handleTryNow = () => {
    if (product && productId && product.isInStock) navigate(`/try-on/${productId}`)
    else if (product && !product.isInStock) toast.error('Cannot try on an out-of-stock item.')
    else toast.error('Cannot initiate Try On.')
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
        {' '}
        {/* Adjusted min-height */}
        <Loader2 className="h-12 w-12 animate-spin text-trendzone-dark-blue" />
      </div>
    )

  if (error || !product)
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-150px)] p-8 text-center bg-red-50 text-red-700">
        <AlertTriangle className="w-16 h-16 mb-4 text-red-400" />
        <p className="font-semibold text-xl mb-2">Oops! Something went wrong.</p>
        <p className="text-md mb-6">{error || 'Product data could not be loaded.'}</p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-trendzone-dark-blue text-white rounded-lg hover:bg-trendzone-light-blue hover:text-trendzone-dark-blue transition text-sm font-medium"
        >
          Go Home
        </Link>
      </div>
    )

  const isAddToCartDisabled =
    !product.isInStock ||
    isAddingToCart ||
    showAddedMessage ||
    (hasSizes && !selectedSize) ||
    (hasColors && !selectedColor) ||
    (hasSizes && selectedSize && !isSelectedSizeAvailable)

  return (
    <motion.div
      className="min-h-screen bg-white font-inter"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <Toaster position="top-center" containerClassName="!z-[99999]" />

      {/* Breadcrumbs - Minimalist */}
      <div className="w-full px-4 py-4 bg-gray-50 border-b border-gray-200">
        <nav
          className="max-w-7xl mx-auto flex items-center flex-wrap text-xs text-gray-500"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-trendzone-dark-blue transition-colors">
            HOME
          </Link>
          <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-gray-400" />
          <Link
            to={`/${product.gender.toLowerCase()}`}
            className="hover:text-trendzone-dark-blue transition-colors uppercase"
          >
            {product.gender}
          </Link>
          {product.category && (
            <>
              <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-gray-400" />
              <Link
                to={`/${product.gender.toLowerCase()}?category=${product.category}`}
                className="hover:text-trendzone-dark-blue transition-colors uppercase"
              >
                {product.category}
              </Link>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-gray-400" />
          <span className="font-medium text-trendzone-dark-blue uppercase truncate">
            {product.title}
          </span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto mt-8 mb-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Image Section */}
          <motion.div className="flex justify-center items-start" variants={columnVariants(0)}>
            <div className="bg-gray-100 rounded-xl overflow-hidden w-full max-w-lg aspect-[4/5] relative shadow-lg">
              <AnimatePresence mode="wait">
                <motion.img
                  key={product.image} // Re-animate if image source changes (e.g. color variant)
                  src={`${API_BASE_URL}${product.image.startsWith('/') ? '' : '/'}${product.image}`}
                  alt={product.title}
                  className="block w-full h-full object-cover object-center"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://via.placeholder.com/600x800?text=Image+Not+Available'
                  }}
                  initial={{ opacity: 0.5, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.5, scale: 1.05 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </AnimatePresence>
              {!product.isInStock && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow">
                  Out of Stock
                </div>
              )}
            </div>
          </motion.div>

          {/* Info & Actions Section */}
          <motion.div className="flex flex-col pt-4 md:pt-0" variants={columnVariants(0.15)}>
            <motion.h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-trendzone-dark-blue mb-2"
              variants={itemVariants(0)}
            >
              {product.title}
            </motion.h1>
            <motion.p
              className="text-xl lg:text-2xl font-semibold text-trendzone-dark-blue mb-6"
              variants={itemVariants(0.05)}
            >
              PKR {Number(product.price).toLocaleString('en-PK')}
            </motion.p>

            {hasSizes && (
              <motion.div className="mb-7" variants={itemVariants(0.1)}>
                <div className="flex justify-between items-center mb-2.5">
                  <h3 className="text-sm font-semibold text-trendzone-dark-blue uppercase tracking-wide">
                    Select Size
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes?.map((size) => {
                    const sizeStock = product.stockDetails?.[size] ?? 0
                    const isAvailable = sizeStock > 0
                    const isSelected = selectedSize === size
                    return (
                      <motion.button
                        key={size}
                        onClick={() => isAvailable && handleSelectSize(size)}
                        disabled={!isAvailable}
                        className={`py-2 px-4 border rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 min-w-[44px] text-center relative group ${
                          isSelected
                            ? 'bg-trendzone-dark-blue text-white border-trendzone-dark-blue shadow-sm'
                            : 'bg-white text-trendzone-dark-blue border-gray-300 hover:border-trendzone-dark-blue'
                        } ${
                          !isAvailable
                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed !shadow-none line-through decoration-red-500/70 decoration-1'
                            : 'hover:bg-gray-50'
                        }`}
                        aria-pressed={isSelected}
                        title={!isAvailable ? `${size} - Out of stock` : size}
                        whileHover={isAvailable ? { y: -1 } : {}}
                        whileTap={isAvailable ? { scale: 0.97 } : {}}
                      >
                        {size}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Color Selection (If implemented) */}
            {/* ... similar styling to sizes ... */}

            <motion.div
              className="mt-auto pt-6 border-t border-gray-200"
              variants={itemVariants(0.2)}
            >
              {product.isInStock && !isAddingToCart && !showAddedMessage && (
                <div className="mb-3 text-left h-5">
                  {' '}
                  {/* Reserve space */}
                  {hasSizes && !selectedSize && (
                    <p className="text-xs text-red-500 font-medium">Please select a size.</p>
                  )}
                  {hasSizes && selectedSize && !isSelectedSizeAvailable && (
                    <p className="text-xs text-red-500 font-medium">
                      Size {selectedSize} is out of stock.
                    </p>
                  )}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={isAddToCartDisabled}
                  className={`flex-1 inline-flex items-center justify-center px-6 py-3.5 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-trendzone-light-blue ${
                    isAddingToCart || showAddedMessage
                      ? showAddedMessage
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-trendzone-light-blue'
                      : isAddToCartDisabled
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-trendzone-dark-blue hover:bg-trendzone-light-blue hover:text-trendzone-dark-blue'
                  }`}
                  whileHover={!isAddToCartDisabled ? { scale: 1.02 } : {}}
                  whileTap={!isAddToCartDisabled ? { scale: 0.98 } : {}}
                >
                  {isAddingToCart ? (
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  ) : showAddedMessage ? (
                    <CheckCircle className="mr-2 h-5 w-5" />
                  ) : (
                    <ShoppingBag className="mr-2 h-5 w-5" />
                  )}
                  {isAddingToCart ? 'Adding...' : showAddedMessage ? 'Added!' : 'Add To Cart'}
                </motion.button>

                <motion.button
                  onClick={handleTryNow}
                  disabled={!product.isInStock}
                  className={`flex-1 inline-flex items-center justify-center px-6 py-3.5 border rounded-lg shadow-sm text-base font-semibold transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-trendzone-dark-blue ${
                    !product.isInStock
                      ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'border-trendzone-dark-blue text-trendzone-dark-blue bg-white hover:bg-trendzone-dark-blue/5'
                  }`}
                  aria-label="Try this item on virtually"
                  whileHover={product.isInStock ? { scale: 1.02 } : {}}
                  whileTap={product.isInStock ? { scale: 0.98 } : {}}
                >
                  <Camera className="mr-2 h-5 w-5" /> Try Now
                </motion.button>
              </div>
            </motion.div>

            {product.description?.trim() && (
              <motion.div
                className="mt-8 pt-6 border-t border-gray-200"
                variants={itemVariants(0.15)}
              >
                <h3 className="text-sm font-semibold text-trendzone-dark-blue uppercase tracking-wide mb-2.5">
                  Description
                </h3>
                <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                  {product.description.trim()}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductDetailsPage
