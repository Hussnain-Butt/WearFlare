import React from 'react'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

const Cart = () => {
  const { cart, removeFromCart, totalItems, totalPrice } = useCart()

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex flex-col">
      {/* Navbar */}

      {/* Cart Section */}
      <div className="container mx-auto py-12 px-6 md:px-12">
        <h2 className="text-4xl font-semibold text-[#d19232] mb-6 text-center">Your Cart</h2>

        <div className="bg-white shadow-lg p-8 rounded-lg max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
            <div>
              <p className="text-xl font-medium ">Total Items: {totalItems}</p>
              <p className="text-xl font-medium ">Total Price: PKR {totalPrice.toFixed(2)}</p>
            </div>

            {cart.length > 0 && (
              <div className="flex flex-col items-center mt-6 space-y-4">
                <button className="px-6 py-3 bg-[#c8a98a] text-white text-lg font-medium rounded-full hover:bg-[#6b5745] transition duration-300 shadow-md">
                  Proceed to Checkout
                </button>

                <Link
                  to="/women"
                  className="text-lg text-[#6b5745] underline italic font-medium transition duration-300"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-500 mt-6 text-center">Your cart is empty.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center bg-[#F5EDE2] p-5 rounded-lg shadow-md w-full"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <div className="text-center mt-4">
                    <p className="font-semibold text-[#6b5745]">{item.title}</p>
                    <p className="text-[#c8a98a] font-medium">Price: PKR {item.price}</p>
                    <p className="text-[#c8a98a]">Quantity: {item.quantity}</p>
                    <button
                      className="mt-3 px-4 py-2 bg-[#c8a98a] text-white rounded-full hover:bg-[#6b5745] transition"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart
