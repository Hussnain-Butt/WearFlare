// src/pages/Cart.tsx
import React from 'react'
import { useCart } from '../context/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://backend-production-c8ff.up.railway.app'

// Animation Variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

const summaryVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 0.2 } },
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

  const formatDisplayPrice = (price: number): string => {
    const numericPrice = typeof price === 'number' && !isNaN(price) ? price : 0
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
            `Stock issue: ${item.title} (Size: ${item.selectedSize}) has only ${item.availableStock} available.`,
            { id: `stock-${item._id}` },
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
    hash: lastViewedProductId ? `#product-card-${lastViewedProductId}` : '', // Ensure ID matches product card
  }
  const continueShoppingState = lastSelectedCategory
    ? { category: lastSelectedCategory }
    : undefined

  return (
    <motion.div
      className="min-h-screen bg-gray-50 pt-12 pb-20 font-inter"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <Toaster position="top-center" />
      <div className="container mx-auto max-w-6xl px-4">
        <motion.h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-trendzone-dark-blue mb-10 md:mb-12 text-center"
          variants={itemVariants}
        >
          Shopping Cart
        </motion.h1>

        {cart.length === 0 ? (
          <motion.div
            className="text-center bg-white p-10 sm:p-16 rounded-xl shadow-lg"
            variants={itemVariants}
          >
            <ShoppingBag
              className="w-16 h-16 md:w-20 md:h-20 text-trendzone-light-blue mx-auto mb-6"
              strokeWidth={1.5}
            />
            <p className="text-xl md:text-2xl text-gray-700 mb-8">Your cart is currently empty.</p>
            <Link
              to="/"
              className="inline-flex items-center px-8 py-3 bg-trendzone-dark-blue text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-trendzone-light-blue hover:text-trendzone-dark-blue transition-colors duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
            {/* Cart Items List */}
            <motion.div
              className="lg:col-span-2 bg-white shadow-xl rounded-xl p-6 sm:p-8"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-trendzone-dark-blue">
                  Cart Items ({totalItems})
                </h3>
                {totalItems > 0 && (
                  <button
                    onClick={() => {
                      clearCart()
                      toast.success('Cart cleared!')
                    }}
                    className="text-xs sm:text-sm text-red-500 hover:text-red-700 font-medium hover:underline focus:outline-none transition-colors"
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
                      layout // Animate layout changes (add/remove)
                      variants={itemVariants} // Use itemVariants for entry
                      initial="hidden" // Start hidden when added
                      animate="visible" // Animate to visible
                      exit="exit" // Animate out on removal
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-gray-100 pb-6 last:border-b-0"
                    >
                      <Link to={`/product/${item._id}`} className="flex-shrink-0">
                        <img
                          src={`${API_BASE_URL}${item.image.startsWith('/') ? '' : '/'}${
                            item.image
                          }`}
                          alt={item.title}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/100?text=N/A'
                          }}
                        />
                      </Link>

                      <div className="flex-grow min-w-0">
                        <Link
                          to={`/product/${item._id}`}
                          className="hover:text-trendzone-light-blue transition-colors"
                        >
                          <h4 className="font-semibold text-sm sm:text-base text-trendzone-dark-blue line-clamp-2">
                            {item.title}
                          </h4>
                        </Link>
                        {item.selectedSize && (
                          <p className="text-xs text-gray-500 mt-0.5">Size: {item.selectedSize}</p>
                        )}
                        {item.selectedColor && (
                          <p className="text-xs text-gray-500">Color: {item.selectedColor}</p>
                        )}
                        <p
                          className={`text-xs mt-1 ${
                            item.quantity > item.availableStock
                              ? 'text-red-600 font-medium'
                              : 'text-gray-500'
                          }`}
                        >
                          (Stock: {item.availableStock})
                        </p>
                      </div>

                      <div className="flex items-center gap-2 border border-gray-200 rounded-md p-1 my-2 sm:my-0 flex-shrink-0">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.quantity - 1,
                              item.selectedSize,
                              item.selectedColor,
                            )
                          }
                          className="p-1.5 text-gray-500 hover:text-red-600 disabled:opacity-40 rounded-md hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          {' '}
                          <Minus size={16} />{' '}
                        </button>
                        <span className="font-medium text-sm w-6 text-center text-trendzone-dark-blue">
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
                          className="p-1.5 text-gray-500 hover:text-green-600 disabled:opacity-40 rounded-md hover:bg-gray-100"
                          disabled={item.quantity >= item.availableStock}
                        >
                          {' '}
                          <Plus size={16} />{' '}
                        </button>
                      </div>

                      <div className="text-sm sm:text-base font-semibold text-trendzone-dark-blue w-24 text-right flex-shrink-0">
                        {formatDisplayPrice(item.price * item.quantity)}
                      </div>

                      <div className="flex-shrink-0 sm:ml-2">
                        <motion.button
                          className="p-2 text-gray-400 hover:text-red-500 transition rounded-full hover:bg-red-50/50"
                          onClick={() =>
                            removeFromCart(item._id, item.selectedSize, item.selectedColor)
                          }
                          aria-label={`Remove ${item.title}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {' '}
                          <Trash2 size={18} />{' '}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              className="lg:col-span-1 bg-white shadow-xl rounded-xl p-6 sm:p-8 h-fit lg:sticky lg:top-24"
              variants={summaryVariants}
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-trendzone-dark-blue mb-6 border-b border-gray-200 pb-4">
                Order Summary
              </h3>
              <div className="space-y-3 mb-6 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-medium text-trendzone-dark-blue">
                    {formatDisplayPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg sm:text-xl text-trendzone-dark-blue">
                  <span>Total</span>
                  <span>{formatDisplayPrice(totalPrice)}</span>
                </div>
              </div>
              <motion.button
                onClick={handleProceedToCheckout}
                className="w-full px-6 py-3 bg-trendzone-dark-blue text-white text-base font-semibold rounded-lg hover:bg-trendzone-light-blue hover:text-trendzone-dark-blue transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-trendzone-light-blue disabled:opacity-60"
                disabled={cart.length === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Proceed to Checkout
              </motion.button>
              <div className="text-center mt-5">
                <Link
                  to={continueShoppingTarget}
                  state={continueShoppingState}
                  className="text-sm text-trendzone-dark-blue hover:text-trendzone-light-blue hover:underline font-medium transition-colors inline-flex items-center group"
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
