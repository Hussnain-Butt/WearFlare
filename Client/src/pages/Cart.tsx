// src/pages/Cart.tsx
import React from 'react'
import { useCart } from '../context/CartContext' // Path check karein
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast' // Ensure react-hot-toast is installed
import { motion, AnimatePresence } from 'framer-motion'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://backend-production-c8ff.up.railway.app' // TODO: .env

// Animation Variants - unchanged
const pageVariants = {
  /* ... */
}
const itemVariants = {
  /* ... */
}
const summaryVariants = {
  /* ... */
}

const Cart: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    clearCart,
    lastProductListUrl,
    lastViewedProductId,
    lastSelectedCategory,
  } = useCart()
  const navigate = useNavigate()

  const formatDisplayPrice = (price: number | string): string => {
    // Allow string input for price
    const numericPrice = Number(price) // Convert to number
    return `PKR ${numericPrice.toLocaleString('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const handleProceedToCheckout = () => {
    if (cart.length > 0) {
      let stockIssue = false
      cart.forEach((item) => {
        if (item.quantity > item.availableStock) {
          toast.error(
            `Stock issue: ${item.title} (Size: ${item.selectedSize || 'N/A'}) has only ${
              item.availableStock
            } available.`,
            { id: `stock-${item._id}-${item.selectedSize}` },
          )
          stockIssue = true
        }
      })
      if (!stockIssue) navigate('/checkout')
    } else {
      toast.error('Your cart is empty.')
    }
  }

  const continueShoppingTarget = {
    pathname: lastProductListUrl || '/',
    hash: lastViewedProductId ? `#product-card-${lastViewedProductId}` : '',
  }
  const continueShoppingState = lastSelectedCategory
    ? { state: { category: lastSelectedCategory } } // Pass category in state
    : undefined

  // Toaster theme options (optional, customize as needed)
  const toasterThemeOptions = {
    style: {
      background: 'hsl(var(--card))', // Use card background for toast
      color: 'hsl(var(--card-foreground))', // Use card text color
      border: `1px solid hsl(var(--border))`,
    },
    success: {
      style: {
        background: 'hsl(var(--success-bg-hsl, 145 63% 42%))', // Default success HSL if not in theme
        color: 'hsl(var(--success-text-hsl, 0 0% 100%))', // Default success text HSL
      },
      iconTheme: {
        primary: 'hsl(var(--success-text-hsl, 0 0% 100%))',
        secondary: 'hsl(var(--success-bg-hsl, 145 63% 42%))',
      },
    },
    error: {
      style: {
        background: 'hsl(var(--destructive-bg-hsl, 0 72% 51%))', // Default destructive HSL
        color: 'hsl(var(--destructive-foreground))',
      },
      iconTheme: {
        primary: 'hsl(var(--destructive-foreground))',
        secondary: 'hsl(var(--destructive-bg-hsl, 0 72% 51%))',
      },
    },
  }

  return (
    <motion.div
      // bg-gray-50 -> bg-background
      className="min-h-screen bg-background pt-12 pb-20 font-inter"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <Toaster position="top-center" toastOptions={toasterThemeOptions} />
      <div className="container mx-auto max-w-6xl px-4">
        <motion.h1
          // text-trendzone-dark-blue -> text-primary (or text-foreground)
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-10 md:mb-12 text-center"
          variants={itemVariants}
        >
          Shopping Cart
        </motion.h1>

        {cart.length === 0 ? (
          <motion.div
            // bg-white -> bg-card
            className="text-center bg-card p-10 sm:p-16 rounded-xl shadow-lg"
            variants={itemVariants}
          >
            {/* text-trendzone-light-blue -> text-accent (or text-primary) */}
            <ShoppingBag
              className="w-16 h-16 md:w-20 md:h-20 text-accent mx-auto mb-6"
              strokeWidth={1.5}
            />
            {/* text-gray-700 -> text-card-foreground (or text-muted-foreground if on card) */}
            <p className="text-xl md:text-2xl text-card-foreground mb-8">
              Your cart is currently empty.
            </p>
            <Link
              to="/"
              // bg-trendzone-dark-blue text-white -> bg-primary text-primary-foreground
              // hover:bg-trendzone-light-blue hover:text-trendzone-dark-blue -> hover:bg-primary/80 (or hover:bg-accent hover:text-accent-foreground)
              className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground text-sm sm:text-base font-semibold rounded-lg hover:bg-primary/80 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
            {/* Cart Items List */}
            <motion.div
              // bg-white -> bg-card
              className="lg:col-span-2 bg-card shadow-xl rounded-xl p-6 sm:p-8"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                {/* text-trendzone-dark-blue -> text-card-foreground (or text-primary) */}
                <h3 className="text-xl sm:text-2xl font-semibold text-card-foreground">
                  Cart Items ({totalItems})
                </h3>
                {totalItems > 0 && (
                  <button
                    onClick={() => {
                      clearCart()
                      toast.success('Cart cleared!')
                    }}
                    // text-red-500 hover:text-red-700 -> text-destructive hover:text-destructive/80
                    className="text-xs sm:text-sm text-destructive hover:text-destructive/80 font-medium hover:underline focus:outline-none transition-colors"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
              <motion.div className="space-y-6" layout>
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={`${item._id}-${item.selectedSize || 'no-size'}-${
                        item.selectedColor || 'no-color'
                      }`}
                      layout
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      // border-gray-100 -> border-border/50 (lighter border inside card)
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-border/50 pb-6 last:border-b-0"
                    >
                      <Link to={`/product/${item._id}`} className="flex-shrink-0">
                        <img
                          src={`${API_BASE_URL}${item.image.startsWith('/') ? '' : '/'}${
                            item.image
                          }`}
                          alt={item.title}
                          // border-gray-200 -> border-border
                          className="w-24 h-24 object-cover rounded-lg border border-border"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/100?text=N/A'
                          }}
                        />
                      </Link>

                      <div className="flex-grow min-w-0">
                        <Link
                          to={`/product/${item._id}`}
                          // hover:text-trendzone-light-blue -> hover:text-accent
                          className="hover:text-accent transition-colors"
                        >
                          {/* text-trendzone-dark-blue -> text-card-foreground */}
                          <h4 className="font-semibold text-sm sm:text-base text-card-foreground line-clamp-2">
                            {item.title}
                          </h4>
                        </Link>
                        {/* text-gray-500 -> text-muted-foreground */}
                        {item.selectedSize && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Size: {item.selectedSize}
                          </p>
                        )}
                        {item.selectedColor && (
                          <p className="text-xs text-muted-foreground">
                            Color: {item.selectedColor}
                          </p>
                        )}
                        <p
                          className={`text-xs mt-1 ${
                            // text-red-600 -> text-destructive
                            item.quantity > item.availableStock
                              ? 'text-destructive font-medium'
                              : 'text-muted-foreground' // text-gray-500
                          }`}
                        >
                          (Stock: {item.availableStock})
                        </p>
                      </div>

                      {/* border-gray-200 -> border-border */}
                      <div className="flex items-center gap-2 border border-border rounded-md p-1 my-2 sm:my-0 flex-shrink-0">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.quantity - 1,
                              item.selectedSize,
                              item.selectedColor,
                            )
                          }
                          // text-gray-500 hover:text-red-600 -> text-muted-foreground hover:text-destructive
                          // hover:bg-gray-100 -> hover:bg-muted/50
                          className="p-1.5 text-muted-foreground hover:text-destructive disabled:opacity-40 rounded-md hover:bg-muted/50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        {/* text-trendzone-dark-blue -> text-card-foreground */}
                        <span className="font-medium text-sm w-6 text-center text-card-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.quantity + 1,
                              item.selectedSize,
                              item.selectedColor,
                            )
                          }
                          // text-gray-500 hover:text-green-600 -> text-muted-foreground hover:text-green-600 (keeping green for positive action)
                          // hover:bg-gray-100 -> hover:bg-muted/50
                          className="p-1.5 text-muted-foreground hover:text-green-600 disabled:opacity-40 rounded-md hover:bg-muted/50"
                          disabled={item.quantity >= item.availableStock}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* text-trendzone-dark-blue -> text-card-foreground */}
                      <div className="text-sm sm:text-base font-semibold text-card-foreground w-24 text-right flex-shrink-0">
                        {formatDisplayPrice(item.price * item.quantity)}
                      </div>

                      <div className="flex-shrink-0 sm:ml-2">
                        <motion.button
                          // text-gray-400 hover:text-red-500 -> text-muted-foreground hover:text-destructive
                          // hover:bg-red-50/50 -> hover:bg-destructive/10
                          className="p-2 text-muted-foreground hover:text-destructive transition rounded-full hover:bg-destructive/10"
                          onClick={() =>
                            removeFromCart(item._id, item.selectedSize, item.selectedColor)
                          }
                          aria-label={`Remove ${item.title}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              // bg-white -> bg-card
              className="lg:col-span-1 bg-card shadow-xl rounded-xl p-6 sm:p-8 h-fit lg:sticky lg:top-24" // Assuming Navbar height is around 6rem/96px for sticky top
              variants={summaryVariants}
            >
              {/* text-trendzone-dark-blue -> text-card-foreground */}
              {/* border-gray-200 -> border-border */}
              <h3 className="text-xl sm:text-2xl font-semibold text-card-foreground mb-6 border-b border-border pb-4">
                Order Summary
              </h3>
              {/* text-gray-700 -> text-card-foreground (or text-muted-foreground if less emphasis) */}
              <div className="space-y-3 mb-6 text-sm text-card-foreground">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  {/* text-trendzone-dark-blue -> text-card-foreground */}
                  <span className="font-medium text-card-foreground">
                    {formatDisplayPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  {/* text-green-600 for Free Shipping is fine */}
                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>
              {/* border-gray-200 -> border-border */}
              <div className="border-t border-border pt-4 mb-6">
                {/* text-trendzone-dark-blue -> text-card-foreground */}
                <div className="flex justify-between font-bold text-lg sm:text-xl text-card-foreground">
                  <span>Total</span>
                  <span>{formatDisplayPrice(totalPrice)}</span>
                </div>
              </div>
              <motion.button
                onClick={handleProceedToCheckout}
                // bg-trendzone-dark-blue text-white -> bg-primary text-primary-foreground
                // hover:bg-trendzone-light-blue hover:text-trendzone-dark-blue -> hover:bg-primary/80
                // focus-visible:ring-trendzone-light-blue -> focus-visible:ring-ring
                className="w-full px-6 py-3 bg-primary text-primary-foreground text-base font-semibold rounded-lg hover:bg-primary/80 transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring disabled:opacity-60"
                disabled={cart.length === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Proceed to Checkout
              </motion.button>
              <div className="text-center mt-5">
                <Link
                  to={continueShoppingTarget.pathname}
                  state={continueShoppingState?.state} // Correctly pass state
                  // text-trendzone-dark-blue -> text-primary (or text-accent)
                  // hover:text-trendzone-light-blue -> hover:text-accent/80
                  className="text-sm text-primary hover:text-accent hover:underline font-medium transition-colors inline-flex items-center group"
                >
                  <ArrowLeft
                    size={16}
                    className="mr-1.5 transition-transform duration-200 group-hover:-translate-x-1"
                  />
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Cart
