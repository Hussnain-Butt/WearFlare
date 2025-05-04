// src/Cart.tsx
import React from 'react'
import { useCart } from '../context/CartContext' // Make sure path is correct
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus } from 'lucide-react'

// Define API base URL for images
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app' // Your deployed URL or https://backend-production-c8ff.up.railway.app for local dev

const Cart = () => {
  // Get cart functions and state, including the NEW specific product origin state
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    clearCart,
    // --- Get ALL needed origin state from context ---
    lastProductListUrl,
    lastViewedProductId,
    lastSelectedCategory,
  } = useCart() // Ensure useCart provides all these values from the updated context
  const navigate = useNavigate()

  // Format price for display (Keep this function as is)
  const formatDisplayPrice = (price: number): string => {
    return `PKR ${price.toLocaleString('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // Format total price (Keep this function as is)
  const formatTotalPrice = (price: number): string => {
    return `PKR ${price.toLocaleString('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // Handle Checkout Navigation (Keep this function as is)
  const handleProceedToCheckout = () => {
    if (cart.length > 0) {
      navigate('/checkout')
    } else {
      alert('Your cart is empty.')
    }
  }

  // --- LOGIC CHANGE: Determine the "Continue Shopping" target object (URL + Hash) ---
  const continueShoppingTarget = {
    pathname: lastProductListUrl || '/', // Use last tracked URL or fallback to homepage
    hash: lastViewedProductId ? `#product-${lastViewedProductId}` : '', // Add hash for scrolling
  }

  // --- LOGIC CHANGE: Determine the state object to pass (for category filter) ---
  const continueShoppingState = lastSelectedCategory
    ? { category: lastSelectedCategory }
    : undefined

  // --- Component Render (Layout/Design EXACTLY as your original) ---
  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-10 pb-20 font-sans">
      {' '}
      {/* Added font */}
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#c8a98a] mb-8 text-center">
          Shopping Cart
        </h2>
        {cart.length === 0 ? (
          // Empty Cart Message (Layout as original, link points to '/')
          <div className="text-center bg-white p-10 rounded-lg shadow">
            <p className="text-xl text-gray-500 mb-6">Your cart is currently empty.</p>
            <Link
              to="/" // Fallback to homepage
              className="inline-block px-6 py-3 bg-[#c8a98a] text-white text-lg font-medium rounded-full hover:bg-[#b08d6a] transition duration-300 shadow-md"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          // Cart Content Grid (Layout as original)
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List (Left Column - Layout as original) */}
            <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-6">
              <div className="flex justify-between items-center mb-6 border-b pb-3">
                <h3 className="text-xl font-medium text-gray-800">Cart Items ({totalItems})</h3>
                {/* Clear Cart Button (As original) */}
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-800 hover:underline focus:outline-none transition-colors"
                >
                  Clear Cart
                </button>
              </div>
              <div className="space-y-6">
                {/* Map Through Cart Items (Layout as original) */}
                {cart.map((item) => (
                  <div
                    key={`${item._id}-${item.selectedSize}-${item.selectedColor}`} // Unique key
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-6 last:border-b-0"
                  >
                    {/* Image & Details (Layout as original) */}
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

                    {/* Quantity Controls (Layout as original) */}
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

                    {/* Item Total Price (Layout as original) */}
                    <div className="text-right flex-shrink-0 w-24 font-semibold text-gray-800 text-sm md:text-base">
                      {formatTotalPrice(item.price * item.quantity)}
                    </div>

                    {/* Remove Button (Layout as original) */}
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

            {/* Order Summary (Right Column - Layout as original) */}
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
              {/* Checkout Button (Layout as original) */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full px-6 py-3 bg-[#c8a98a] text-white text-lg font-medium rounded-full hover:bg-[#b08d6a] transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8a98a]"
                disabled={cart.length === 0}
              >
                Proceed to Checkout
              </button>
              {/* Continue Shopping Link (Layout as original, FUNCTIONALITY updated) */}
              <div className="text-center mt-4">
                {/* --- FUNCTIONALITY CHANGE IS HERE in the 'to' and 'state' props --- */}
                <Link
                  to={continueShoppingTarget} // Use the target object with URL/Hash
                  state={continueShoppingState} // Pass the category state
                  className="text-sm text-gray-600 hover:text-[#c8a98a] underline transition duration-300"
                  // --- The className is EXACTLY as in your original code ---
                >
                  Continue Shopping
                </Link>
                {/* --- END FUNCTIONALITY CHANGE --- */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
