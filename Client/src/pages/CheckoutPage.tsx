// src/pages/CheckoutPage.tsx
import React, { useState } from 'react'
import { useCart } from '../context/CartContext' // Adjust path if needed
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast, Toaster } from 'react-hot-toast'
import { Loader2 } from 'lucide-react' // Loading spinner icon

// Define API base URL
const API_BASE_URL = 'http://localhost:5000'

const CheckoutPage: React.FC = () => {
  const { cart, totalPrice, clearCart, totalItems } = useCart()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Pakistan', // Default or make it selectable
  })

  // Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Form Submission Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (cart.length === 0) {
      toast.error('Your cart is empty. Add items before checking out.')
      navigate('/shop') // Redirect to shop
      return
    }
    setIsSubmitting(true)
    toast.loading('Placing your order...') // Show loading toast

    // Prepare order data
    const orderData = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      shippingAddress: {
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      // Map cart items to the structure expected by the backend
      orderItems: cart.map((item) => ({
        productId: item._id,
        title: item.title,
        price: item.price, // Assuming price in cart context is number
        quantity: item.quantity,
        image: item.image,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      })),
      totalPrice: totalPrice, // Get total from cart context
    }

    try {
      // Send data to backend API
      const response = await axios.post(`${API_BASE_URL}/api/orders`, orderData)

      toast.dismiss() // Dismiss loading toast
      if (response.status === 201) {
        toast.success('Order placed successfully! Thank you.')
        clearCart() // Clear the cart
        // Redirect to a success page or home after a delay
        setTimeout(() => {
          navigate('/') // Redirect to homepage
        }, 2500)
      } else {
        // Handle unexpected success status codes if necessary
        throw new Error(response.data.message || 'Unexpected response from server.')
      }
    } catch (error: any) {
      toast.dismiss() // Dismiss loading toast
      console.error('Order submission error:', error.response?.data || error.message)
      // Display specific backend validation errors if available
      const message =
        error.response?.data?.message ||
        'Failed to place order. Please check your details and try again.'
      toast.error(message)
      setIsSubmitting(false) // Re-enable form on error
    }
    // Don't reset submitting state here if navigating away on success
  }

  // Prevent checkout if cart is empty
  if (cart.length === 0 && !isSubmitting) {
    // Could redirect immediately or show a message
    // useEffect(() => { navigate('/cart'); }, [navigate]); // Example redirect
    return <div className="text-center p-10">Your cart is empty. Please add items first.</div>
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2] py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-[#c8a98a] mb-8">Shipping Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="customerName"
                id="customerName"
                required
                value={formData.customerName}
                onChange={handleChange}
                className="checkout-input"
              />
            </div>
            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="customerPhone"
                id="customerPhone"
                required
                value={formData.customerPhone}
                onChange={handleChange}
                className="checkout-input"
                placeholder="+92 3xx xxxxxxx"
              />
            </div>
          </div>
          <div>
            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="customerEmail"
              id="customerEmail"
              required
              value={formData.customerEmail}
              onChange={handleChange}
              className="checkout-input"
              placeholder="you@example.com"
            />
          </div>

          {/* Shipping Address */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  id="street"
                  required
                  value={formData.street}
                  onChange={handleChange}
                  className="checkout-input"
                  placeholder="House No, Street, Area"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="checkout-input"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    id="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="checkout-input"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  {/* Read-only or make it a select if needed */}
                  <input
                    type="text"
                    name="country"
                    id="country"
                    readOnly
                    value={formData.country}
                    className="checkout-input bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Mini */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm text-gray-600">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <span>
                    {item.title} (x{item.quantity}){' '}
                    {item.selectedSize ? `[${item.selectedSize}]` : ''}
                  </span>
                  {/* Calculate item total */}
                  <span>PKR {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t">
                <span>Total Items:</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-800 text-base">
                <span>Total Amount (COD):</span>
                <span>PKR {totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#c8a98a] hover:bg-[#b08d6a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8a98a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  {' '}
                  <Loader2 className="animate-spin mr-2 h-5 w-5" /> Placing Order...{' '}
                </>
              ) : (
                'Place Order (Cash on Delivery)'
              )}
            </button>
          </div>
        </form>
      </div>
      {/* Simple CSS for input styling */}
      <style jsx>{`
        .checkout-input {
          display: block;
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db; /* gray-300 */
          border-radius: 0.375rem; /* rounded-md */
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
          transition: border-color 0.2s, box-shadow 0.2s;
          font-size: 0.875rem; /* text-sm */
        }
        .checkout-input:focus {
          outline: none;
          border-color: #c8a98a;
          box-shadow: 0 0 0 1px #c8a98a, inset 0 1px 2px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  )
}

export default CheckoutPage
