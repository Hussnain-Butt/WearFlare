// src/Cart.tsx
import React from 'react'
import { useCart } from '../context/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus } from 'lucide-react'

// Define API base URL for images
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app/' // Or your deployed URL

const Cart = () => {
  // Get cart functions and state, including the new URL state
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    clearCart,
    lastVisitedUrl, // *** Get the URL from context ***
  } = useCart()
  const navigate = useNavigate()

  // Format price for display
  const formatDisplayPrice = (price: number): string => {
    return `PKR ${price.toLocaleString('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // Format total price
  const formatTotalPrice = (price: number): string => {
    return `PKR ${price.toLocaleString('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // Handle Checkout Navigation
  const handleProceedToCheckout = () => {
    if (cart.length > 0) {
      navigate('/checkout')
    } else {
      alert('Your cart is empty.')
    }
  }

  // Determine the fallback URL for "Continue Shopping"
  const continueShoppingUrl =
    lastVisitedUrl && lastVisitedUrl !== '/cart' && lastVisitedUrl !== '/checkout'
      ? lastVisitedUrl
      : '/shop' // Default to /shop

  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-10 pb-20 font-sans">
      {' '}
      {/* Added font */}
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#c8a98a] mb-8 text-center">
          Shopping Cart
        </h2>
        {cart.length === 0 ? (
          // Empty Cart Message
          <div className="text-center bg-white p-10 rounded-lg shadow">
            <p className="text-xl text-gray-500 mb-6">Your cart is currently empty.</p>
            <Link
              to="/shop" // Always link to main shop page when cart is empty
              className="inline-block px-6 py-3 bg-[#c8a98a] text-white text-lg font-medium rounded-full hover:bg-[#b08d6a] transition duration-300 shadow-md"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          // Cart Content Grid
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List (Left Column) */}
            <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-6">
              <div className="flex justify-between items-center mb-6 border-b pb-3">
                <h3 className="text-xl font-medium text-gray-800">Cart Items ({totalItems})</h3>
                {/* Clear Cart Button */}
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-800 hover:underline focus:outline-none transition-colors"
                >
                  Clear Cart
                </button>
              </div>
              <div className="space-y-6">
                {/* Map Through Cart Items */}
                {cart.map((item) => (
                  <div
                    key={`${item._id}-${item.selectedSize}-${item.selectedColor}`} // Unique key
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-6 last:border-b-0"
                  >
                    {/* Image & Details */}
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
                        <p className="text-gray-600 text-sm mt-1">
                          {formatDisplayPrice(item.price)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 border border-gray-300 rounded-full px-2 py-1 flex-shrink-0 my-2 sm:my-0">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            item.quantity - 1,
                            item.selectedSize,
                            item.selectedColor,
                          )
                        }
                        className="p-1 text-gray-600 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-full hover:bg-gray-100"
                        aria-label="Decrease quantity"
                        disabled={item.quantity <= 1}
                      >
                        {' '}
                        <Minus size={16} />{' '}
                      </button>
                      <span className="font-medium text-sm w-6 text-center select-none">
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
                        className="p-1 text-gray-600 hover:text-green-600 rounded-full hover:bg-gray-100"
                        aria-label="Increase quantity"
                      >
                        {' '}
                        <Plus size={16} />{' '}
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
                        {' '}
                        <Trash2 size={18} />{' '}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary (Right Column) */}
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
                {/* Add Tax, Discounts here if needed */}
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
              >
                Proceed to Checkout
              </button>
              {/* Continue Shopping Link */}
              <div className="text-center mt-4">
                {/* --- *** UPDATED LINK *** --- */}
                <Link
                  to={continueShoppingUrl} // Use the URL from context or fallback
                  className="text-sm text-gray-600 hover:text-[#c8a98a] underline transition duration-300"
                >
                  Continue Shopping
                </Link>
                {/* --- *** END UPDATE *** --- */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
