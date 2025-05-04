import React from 'react'
import { useCart } from '../context/CartContext' // Make sure path is correct
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus } from 'lucide-react'
import { toast } from 'react-hot-toast' // Import toast for potential messages

// Define API base URL for images
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app' // Use environment variable ideally

const Cart = () => {
  // Get cart functions and state
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

  // Format price function (robust check for number)
  const formatDisplayPrice = (price: number): string => {
    const numericPrice = typeof price === 'number' && !isNaN(price) ? price : 0
    return `PKR ${numericPrice.toLocaleString('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // Format total price function
  const formatTotalPrice = (price: number): string => {
    const numericPrice = typeof price === 'number' && !isNaN(price) ? price : 0
    return `PKR ${numericPrice.toLocaleString('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // Handle Proceed to Checkout
  const handleProceedToCheckout = () => {
    if (cart.length > 0) {
      // Optional: Check if any item quantity exceeds its available stock *again* before checkout
      let stockIssue = false
      cart.forEach((item) => {
        if (item.quantity > item.availableStock) {
          toast.error(
            `Stock issue: ${item.title} (Size: ${item.selectedSize}) has only ${item.availableStock} available. Please adjust quantity.`,
          )
          stockIssue = true
        }
      })
      if (!stockIssue) {
        navigate('/checkout')
      }
    } else {
      toast.error('Your cart is empty.') // Use toast instead of alert
    }
  }

  // Construct Continue Shopping target URL and state
  const continueShoppingTarget = {
    pathname: lastProductListUrl || '/', // Fallback to home if no specific URL tracked
    hash: lastViewedProductId ? `#product-${lastViewedProductId}` : '',
  }
  const continueShoppingState = lastSelectedCategory
    ? { category: lastSelectedCategory }
    : undefined

  // --- Component Render ---
  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-10 pb-20 font-sans">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#c8a98a] mb-8 text-center">
          Shopping Cart
        </h2>

        {cart.length === 0 ? (
          // Empty Cart View
          <div className="text-center bg-white p-10 rounded-lg shadow">
            <p className="text-xl text-gray-500 mb-6">Your cart is currently empty.</p>
            <Link
              to="/" // Always link to home for empty cart start shopping
              className="inline-block px-6 py-3 bg-[#c8a98a] text-white text-lg font-medium rounded-full hover:bg-[#b08d6a] transition duration-300 shadow-md"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          // Cart Content View
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-6">
              <div className="flex justify-between items-center mb-6 border-b pb-3">
                <h3 className="text-xl font-medium text-gray-800">Cart Items ({totalItems})</h3>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-800 hover:underline focus:outline-none transition-colors"
                >
                  Clear Cart
                </button>
              </div>
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    // Use a more reliable key if color can be null/undefined
                    key={`${item._id}-${item.selectedSize || 'no-size'}-${
                      item.selectedColor || 'no-color'
                    }`}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-6 last:border-b-0"
                  >
                    {/* Item Image & Details */}
                    <div className="flex items-center gap-4 flex-grow w-full sm:w-auto">
                      <img
                        src={`${API_BASE_URL}${item.image}`}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-md flex-shrink-0 border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/80?text=No+Img'
                        }}
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2">
                          {item.title}
                        </p>
                        {item.selectedSize && (
                          <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                        )}
                        {item.selectedColor && (
                          <p className="text-xs text-gray-500">Color: {item.selectedColor}</p>
                        )}
                        {/* Display available stock (Optional but helpful) */}
                        <p
                          className={`text-xs mt-1 ${
                            item.quantity > item.availableStock
                              ? 'text-red-600 font-semibold'
                              : 'text-gray-500'
                          }`}
                        >
                          (Available: {item.availableStock})
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          {formatDisplayPrice(item.price)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 border border-gray-300 rounded-full px-2 py-1 flex-shrink-0 my-2 sm:my-0">
                      {/* Minus Button */}
                      <button
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            item.quantity - 1, // Send the TARGET quantity
                            item.selectedSize,
                            item.selectedColor,
                          )
                        }
                        className="p-1 text-gray-600 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-full hover:bg-gray-100"
                        aria-label="Decrease quantity"
                        disabled={item.quantity <= 1} // Disable if quantity is 1
                      >
                        <Minus size={16} />
                      </button>

                      <span className="font-medium text-sm w-6 text-center select-none">
                        {item.quantity}
                      </span>

                      {/* Plus Button */}
                      <button
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            item.quantity + 1, // Send the TARGET quantity
                            item.selectedSize,
                            item.selectedColor,
                          )
                        }
                        className="p-1 text-gray-600 hover:text-green-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-full hover:bg-gray-100"
                        aria-label="Increase quantity"
                        // **** Disable if current quantity is already at or above available stock ****
                        disabled={item.quantity >= item.availableStock}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Item Total Price */}
                    <div className="text-right flex-shrink-0 w-24 font-semibold text-gray-800 text-sm md:text-base">
                      {formatTotalPrice(item.price * item.quantity)}
                    </div>

                    {/* Remove Button */}
                    <div className="flex-shrink-0">
                      <button
                        className="p-2 text-gray-500 hover:text-red-600 transition rounded-full hover:bg-red-50"
                        onClick={() =>
                          removeFromCart(item._id, item.selectedSize, item.selectedColor)
                        }
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 bg-white shadow-lg rounded-lg p-6 h-fit sticky top-28">
              <h3 className="text-xl font-medium text-gray-800 mb-6 border-b pb-3">
                Order Summary
              </h3>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatTotalPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                {/* You can add Tax, Discounts here if needed */}
              </div>
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between font-semibold text-lg text-gray-900">
                  <span>Total</span>
                  <span>{formatTotalPrice(totalPrice)}</span>
                </div>
              </div>
              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full px-6 py-3 bg-[#c8a98a] text-white text-lg font-medium rounded-full hover:bg-[#b08d6a] transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8a98a]"
                disabled={cart.length === 0} // Disable if cart is empty
              >
                Proceed to Checkout
              </button>
              {/* Continue Shopping Link */}
              <div className="text-center mt-4">
                <Link
                  to={continueShoppingTarget} // Use constructed target object
                  state={continueShoppingState} // Pass category state if available
                  className="text-sm text-gray-600 hover:text-[#c8a98a] underline transition duration-300"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
