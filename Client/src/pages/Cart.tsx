import React from 'react'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus } from 'lucide-react' // Import icons

// Define API base URL for images
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app'

const Cart = () => {
  // Get updateQuantity function from context
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart()

  // Format price for display
  const formatDisplayPrice = (priceStr: string): string => {
    const num = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''))
    if (isNaN(num)) return priceStr
    // Format as PKR with commas
    return `PKR ${num.toLocaleString('en-PK', {
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

  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-10 pb-20">
      {' '}
      {/* Add padding top/bottom */}
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#B8860B] mb-8 text-center">
          Shopping Cart
        </h2>

        {cart.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-lg shadow">
            <p className="text-xl text-gray-500 mb-6">Your cart is currently empty.</p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-[#B8860B] text-white text-lg font-medium rounded-full hover:bg-[#9e750a] transition duration-300 shadow-md"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-medium text-gray-800 mb-6 border-b pb-3">
                Cart Items ({totalItems})
              </h3>
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={item._id} // Use item._id as key
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-6 last:border-b-0"
                  >
                    {/* Image and Title */}
                    <div className="flex items-center gap-4 flex-grow w-full sm:w-auto">
                      <img
                        src={`${API_BASE_URL}${item.image}`}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.png'
                        }}
                      />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm md:text-base">
                          {item.title}
                        </p>
                        <p className="text-gray-500 text-sm">{formatDisplayPrice(item.price)}</p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 border rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="p-1 text-gray-600 hover:text-red-600 disabled:opacity-50"
                        aria-label="Decrease quantity"
                        disabled={item.quantity <= 1} // Disable if quantity is 1
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-medium text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-1 text-gray-600 hover:text-green-600"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Item Total Price */}
                    <div className="text-right flex-shrink-0 w-24">
                      <p className="font-semibold text-gray-800 text-sm md:text-base">
                        {formatTotalPrice(
                          parseFloat(String(item.price).replace(/[^0-9.]/g, '')) * item.quantity,
                        )}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <div className="flex-shrink-0">
                      <button
                        className="p-2 text-gray-500 hover:text-red-600 transition"
                        // *** THE FIX IS HERE: Use item._id ***
                        onClick={() => {
                          console.log('Removing item:', item._id, item.title) // Log before removing
                          removeFromCart(item._id)
                        }}
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Clear Cart Button */}
              <div className="mt-6 text-right">
                <button onClick={clearCart} className="text-sm text-red-600 hover:underline">
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 bg-white shadow-lg rounded-lg p-6 h-fit sticky top-28">
              {' '}
              {/* Make summary sticky */}
              <h3 className="text-xl font-medium text-gray-800 mb-6 border-b pb-3">
                Order Summary
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatTotalPrice(totalPrice)}</span>
                </div>
                {/* Add Shipping, Tax etc. if needed */}
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>Free</span> {/* Or calculate shipping */}
                </div>
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-semibold text-lg text-gray-900">
                  <span>Total</span>
                  <span>{formatTotalPrice(totalPrice)}</span>{' '}
                  {/* Assuming total includes only items for now */}
                </div>
              </div>
              <button className="w-full px-6 py-3 bg-[#B8860B] text-white text-lg font-medium rounded-full hover:bg-[#9e750a] transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B8860B]">
                Proceed to Checkout
              </button>
              <div className="text-center mt-4">
                <Link
                  to="/shop"
                  className="text-sm text-gray-600 hover:text-[#B8860B] underline transition duration-300"
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
