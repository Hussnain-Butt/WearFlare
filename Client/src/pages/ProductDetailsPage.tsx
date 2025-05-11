// src/pages/ProductDetailsPage.tsx
import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext' // Assuming this path is correct
import {
  ChevronRight,
  CheckCircle,
  Camera,
  ShoppingBag,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import RelevantProducts from '@/components/RelevantProducts' // Updated import for RelevantProducts

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://backend-production-c8ff.up.railway.app'

interface ProductDetail {
  _id: string
  title: string
  price: string
  category: string // Assuming category is always a string
  gender: string // Assuming gender is always a string
  image: string
  description?: string
  isInStock?: boolean
  sizes?: string[]
  stockDetails?: Record<string, number>
  colors?: string[]
}

// Animation Variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

const columnVariants = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay } },
})

const itemVariants = (delay = 0) => ({
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut', delay } },
})

// Define toast theme options or leave as empty object
const toasterThemeOptions = {
  // Example:
  // success: {
  //   iconTheme: { primary: 'hsl(var(--success))', secondary: 'hsl(var(--success-foreground))' },
  //   style: { background: 'hsl(var(--background))', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))' }
  // },
  // error: {
  //   iconTheme: { primary: 'hsl(var(--destructive))', secondary: 'hsl(var(--destructive-foreground))' },
  //   style: { background: 'hsl(var(--background))', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))' }
  // },
}

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

  useEffect(() => {
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
        if (!response.data || !response.data._id) throw new Error('Invalid product data received.')

        const stockDetailsObject = response.data.stockDetails ?? {}
        const fetchedProduct = {
          ...response.data,
          isInStock: response.data.isInStock ?? false,
          sizes: response.data.sizes ?? [],
          stockDetails: stockDetailsObject,
          colors: response.data.colors ?? [],
          // Ensure category and gender have default values if API might omit them,
          // though the interface implies they are required.
          category: response.data.category || 'Unknown Category',
          gender: response.data.gender || 'Unisex',
        }
        setProduct(fetchedProduct)

        if (fetchedProduct.sizes && fetchedProduct.sizes.length > 0) {
          const firstAvailableSize = fetchedProduct.sizes.find(
            (size) => stockDetailsObject[size] > 0,
          )
          setSelectedSize(firstAvailableSize || fetchedProduct.sizes[0] || null)
        }
        if (fetchedProduct.colors && fetchedProduct.colors.length > 0 && !selectedColor) {
          setSelectedColor(fetchedProduct.colors[0])
        }
      } catch (err: any) {
        console.error('Fetch product error:', err)
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404)
            setError('Product not found. It might have been moved or does not exist.')
          else if (err.request)
            setError('Network error. Please check your internet connection and try again.')
          else setError('Failed to load product details. Please try again later.')
        } else {
          setError('An unexpected error occurred while fetching product data.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  const handleSelectSize = (size: string) => setSelectedSize(size)
  const handleSelectColor = (color: string) => setSelectedColor(color)

  const hasSizes = product?.sizes && product.sizes.length > 0
  const hasColors = product?.colors && product.colors.length > 0

  const stockForSelectedSize = useMemo(() => {
    if (!product) return 0
    if (hasSizes && selectedSize && product.stockDetails) {
      return product.stockDetails[selectedSize] ?? 0
    }
    // If no sizes, check general isInStock. Assume infinite stock if isInStock is true and no sizes.
    return product.isInStock ? Infinity : 0
  }, [product, hasSizes, selectedSize])

  const isSelectedSizeAvailable = stockForSelectedSize > 0

  const handleAddToCart = () => {
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
      toast.error(`Size ${selectedSize} is currently out of stock.`)
      return
    }

    const currentCartItem = cart.find(
      (item) =>
        item._id === product._id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor,
    )
    const currentQuantityInCart = currentCartItem ? currentCartItem.quantity : 0

    if (stockForSelectedSize !== Infinity && currentQuantityInCart + 1 > stockForSelectedSize) {
      toast.error(
        `Maximum stock (${stockForSelectedSize}) for ${
          selectedSize ? `size ${selectedSize} ` : ''
        }${selectedColor ? `color ${selectedColor} ` : ''}reached.`,
      )
      return
    }

    setIsAddingToCart(true)
    setShowAddedMessage(false)
    setTimeout(() => {
      try {
        const priceNumber = parseFloat(product.price)
        if (isNaN(priceNumber)) {
          console.error('Invalid product price format:', product.price)
          throw new Error('Product price is invalid.')
        }
        addToCart({
          _id: product._id,
          title: product.title,
          price: priceNumber,
          image: product.image,
          selectedSize,
          selectedColor,
          quantity: 1,
          availableStock: stockForSelectedSize, // Pass the calculated stock for this variant
        })
        setIsAddingToCart(false)
        setShowAddedMessage(true)
        setTimeout(() => setShowAddedMessage(false), 2000)
      } catch (cartError: any) {
        toast.error(cartError.message || 'Could not add item to cart.')
        setIsAddingToCart(false)
      }
    }, 100) // Short delay for visual feedback
  }

  const handleTryNow = () => {
    if (product && productId && product.isInStock) {
      navigate(`/try-on/${productId}`)
    } else if (product && !product.isInStock) {
      toast.error('This item is out of stock and cannot be tried on.')
    } else {
      toast.error('Try On is currently unavailable for this product.')
    }
  }

  const isAddToCartDisabled =
    !product?.isInStock ||
    isAddingToCart ||
    showAddedMessage ||
    (hasSizes && !selectedSize) ||
    (hasColors && !selectedColor) ||
    (hasSizes && selectedSize && !isSelectedSizeAvailable)

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)] bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )

  if (error || !product)
    return (
      <motion.div
        className="flex flex-col justify-center items-center min-h-[calc(100vh-150px)] p-8 text-center bg-destructive/10 text-destructive"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AlertTriangle className="w-16 h-16 mb-4 text-destructive/70" />
        <p className="font-semibold text-xl mb-2">Oops! Product Unavailable.</p>
        <p className="text-md mb-6">
          {error || 'The product you are looking for could not be loaded.'}
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition text-sm font-medium shadow hover:shadow-md"
        >
          Back to Homepage
        </Link>
      </motion.div>
    )

  return (
    <>
      <motion.div
        className="min-h-screen bg-background font-inter"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Toaster
          position="top-center"
          containerClassName="!z-[99999]"
          toastOptions={toasterThemeOptions}
        />
        <div className="w-full px-4 py-4 bg-muted/50 border-b border-border sticky top-0 z-40 backdrop-blur-sm">
          <nav
            className="max-w-7xl mx-auto flex items-center flex-wrap text-xs text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-primary transition-colors">
              HOME
            </Link>
            <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-muted-foreground/70" />
            <Link
              to={`/${product.gender.toLowerCase()}`}
              className="hover:text-primary transition-colors uppercase"
            >
              {product.gender}
            </Link>
            {product.category && (
              <>
                <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-muted-foreground/70" />
                <Link
                  to={`/${product.gender.toLowerCase()}?category=${encodeURIComponent(
                    product.category,
                  )}`}
                  className="hover:text-primary transition-colors uppercase"
                >
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-muted-foreground/70" />
            <span className="font-medium text-foreground uppercase truncate max-w-[150px] sm:max-w-[200px] md:max-w-xs">
              {product.title}
            </span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto mt-8 mb-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
            <motion.div
              className="flex justify-center items-start md:sticky md:top-24"
              variants={columnVariants(0)}
            >
              <div className="bg-card rounded-xl overflow-hidden w-full max-w-lg aspect-[4/5] relative shadow-lg">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={product.image}
                    src={`${API_BASE_URL}${product.image.startsWith('/') ? '' : '/'}${
                      product.image
                    }`}
                    alt={product.title}
                    className="block w-full h-full object-cover object-center"
                    loading="lazy"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/600x800?text=Image+Not+Available'
                    }}
                    initial={{ opacity: 0.5, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.5, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: 'circOut' }}
                  />
                </AnimatePresence>
                {!product.isInStock && (
                  <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground text-xs font-semibold px-3 py-1 rounded-full z-10 shadow">
                    Out of Stock
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div className="flex flex-col pt-4 md:pt-0" variants={columnVariants(0.15)}>
              <motion.h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2"
                variants={itemVariants(0)}
              >
                {product.title}
              </motion.h1>
              <motion.p
                className="text-xl lg:text-2xl font-semibold text-primary mb-6"
                variants={itemVariants(0.05)}
              >
                PKR {Number(product.price).toLocaleString('en-PK')}
              </motion.p>

              {hasSizes && (
                <motion.div className="mb-7" variants={itemVariants(0.1)}>
                  <div className="flex justify-between items-center mb-2.5">
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
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
                          className={`py-2 px-4 border rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 min-w-[48px] text-center relative group ${
                            isSelected
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm focus-visible:ring-primary'
                              : 'bg-input text-foreground border-border hover:border-primary/70 focus-visible:ring-primary'
                          } ${
                            !isAvailable
                              ? 'bg-muted/50 border-muted text-muted-foreground/70 cursor-not-allowed !shadow-none line-through decoration-destructive/70 decoration-1 opacity-70'
                              : 'hover:bg-primary/10'
                          }`}
                          aria-pressed={isSelected}
                          title={!isAvailable ? `${size} - Out of stock` : `Select size ${size}`}
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

              {hasColors && product.colors && product.colors.length > 0 && (
                <motion.div className="mb-7" variants={itemVariants(0.12)}>
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-2.5">
                    Select Color
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <motion.button
                        key={color}
                        onClick={() => handleSelectColor(color)}
                        className={`w-9 h-9 rounded-full border-2 transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary flex items-center justify-center shadow-sm hover:shadow-md
                                     ${
                                       selectedColor === color
                                         ? 'ring-2 ring-offset-background ring-primary border-primary'
                                         : 'border-border hover:border-primary/70'
                                     }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        aria-label={`Select color ${color}`}
                        title={`Select color ${color}`}
                        aria-pressed={selectedColor === color}
                        whileHover={{ scale: 1.1, boxShadow: '0px 0px 8px rgba(0,0,0,0.2)' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {selectedColor === color && (
                          <CheckCircle size={18} className="text-white mix-blend-difference" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {product.description?.trim() && (
                <motion.div
                  className="mt-2 mb-8 pt-6 pb-5 border-t border-border"
                  variants={itemVariants(0.15)}
                >
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-2.5">
                    Product Description
                  </h3>
                  <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                    {product.description.trim()}
                  </div>
                </motion.div>
              )}

              <motion.div
                className="mt-auto pt-6 border-t border-border"
                variants={itemVariants(0.2)}
              >
                <AnimatePresence>
                  {((hasSizes && !selectedSize) ||
                    (hasColors && !selectedColor) ||
                    (hasSizes && selectedSize && !isSelectedSizeAvailable)) &&
                    product.isInStock &&
                    !isAddingToCart &&
                    !showAddedMessage && (
                      <motion.div
                        className="mb-2 text-left h-5" // Ensure consistent height for message area
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                        key="selection-error-message"
                      >
                        {hasSizes && !selectedSize && (
                          <p className="text-xs text-destructive font-medium">
                            Please select a size.
                          </p>
                        )}
                        {hasColors && !selectedColor && (!hasSizes || selectedSize) && (
                          <p className="text-xs text-destructive font-medium">
                            Please select a color.
                          </p>
                        )}
                        {hasSizes && selectedSize && !isSelectedSizeAvailable && (
                          <p className="text-xs text-destructive font-medium">
                            Size {selectedSize} is out of stock.
                          </p>
                        )}
                      </motion.div>
                    )}
                </AnimatePresence>
                {!product.isInStock && (
                  <motion.div
                    className="mb-2 text-left h-5" // Ensure consistent height
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key="out-of-stock-message"
                  >
                    <p className="text-sm text-destructive font-semibold">
                      This product is currently out of stock.
                    </p>
                  </motion.div>
                )}
                {/* Adjust height if no message is shown but space is needed before buttons */}
                {product.isInStock &&
                  !isAddingToCart &&
                  !showAddedMessage &&
                  !(
                    (hasSizes && !selectedSize) ||
                    (hasColors && !selectedColor) ||
                    (hasSizes && selectedSize && !isSelectedSizeAvailable)
                  ) && <div className="h-5 mb-2"></div>}

                <div className="flex flex-col sm:flex-row gap-3 mt-1">
                  <motion.button
                    onClick={handleAddToCart}
                    disabled={isAddToCartDisabled}
                    className={`flex-1 inline-flex items-center justify-center px-6 py-3.5 border border-transparent rounded-lg shadow-sm text-base font-semibold transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring ${
                      isAddingToCart
                        ? 'bg-primary/80 text-primary-foreground cursor-wait'
                        : showAddedMessage
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : isAddToCartDisabled
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:bg-primary/80'
                    }`}
                    whileHover={
                      !isAddToCartDisabled && !isAddingToCart && !showAddedMessage
                        ? { scale: 1.02 }
                        : {}
                    }
                    whileTap={
                      !isAddToCartDisabled && !isAddingToCart && !showAddedMessage
                        ? { scale: 0.98 }
                        : {}
                    }
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
                    className={`flex-1 inline-flex items-center justify-center px-6 py-3.5 border rounded-lg shadow-sm text-base font-semibold transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring ${
                      !product.isInStock
                        ? 'border-border text-muted-foreground bg-muted/50 cursor-not-allowed'
                        : 'border-primary text-primary bg-transparent hover:bg-primary/5'
                    }`}
                    aria-label="Try this item on virtually"
                    whileHover={product.isInStock ? { scale: 1.02 } : {}}
                    whileTap={product.isInStock ? { scale: 0.98 } : {}}
                  >
                    <Camera className="mr-2 h-5 w-5" /> Try Now
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Relevant Products Section */}
        {product && product._id && product.gender && (
          <RelevantProducts
            currentProductId={product._id}
            gender={product.gender} // product.gender is guaranteed to be a string by fetch logic
            category={product.category} // product.category is also guaranteed
            limit={4} // Show up to 4 relevant products
          />
        )}
      </motion.div>
    </>
  )
}

export default ProductDetailsPage
