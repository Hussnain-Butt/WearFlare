// src/pages/CheckoutPage.tsx
import React, { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext' // Adjust path if needed
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { toast, Toaster } from 'react-hot-toast'
import { Loader2, ShoppingBag, ArrowRight, ChevronRight, AlertTriangle } from 'lucide-react' // Added AlertTriangle
import { motion, AnimatePresence } from 'framer-motion'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://backend-production-c8ff.up.railway.app'

// Product and CartItem interfaces (ensure these match your actual data structures)
interface Product {
  _id: string
  image: string
  title: string
  price: number // Assuming price is a number in Product context as well for consistency
  selectedSize?: string | null // Added for consistency with CartItem
  selectedColor?: string | null // Added for consistency with CartItem
  quantity: number // Added for consistency with CartItem
  availableStock: number // Added for consistency with CartItem
  // Add other fields if they exist on your Product model
  category?: string
  gender?: string
}

interface CartItemForContext extends Product {} // CartItem can extend Product if structure is similar

// Animation Variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, staggerChildren: 0.1, when: 'beforeChildren' },
  },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.1 },
  },
}

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const inputGroupVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
  }),
}

const summaryItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

const CheckoutPage: React.FC = () => {
  const { cart, totalPrice, clearCart, totalItems } = useCart()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Pakistan',
  })

  useEffect(() => {
    if (cart.length === 0 && !isSubmitting) {
      toast.error('Your cart is empty. Please add items to proceed.', { id: 'empty-cart-checkout' })
      navigate('/cart')
    }
  }, [cart, navigate, isSubmitting])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (cart.length === 0) {
      toast.error('Your cart is empty.')
      navigate('/shop')
      return
    }

    for (const key in formData) {
      if (key !== 'country' && !(formData as any)[key].trim()) {
        toast.error(`Please fill in ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}.`, {
          id: `validation-${key}`,
        })
        return
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail.trim())) {
      toast.error('Please enter a valid email address.', { id: 'validation-email' })
      return
    }
    if (!/^\+?[0-9\s-()]{7,20}$/.test(formData.customerPhone.trim())) {
      toast.error('Please enter a valid phone number.', { id: 'validation-phone' })
      return
    }

    setIsSubmitting(true)
    const toastId = toast.loading('Placing your order...')

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
      orderItems: cart.map((item: CartItemForContext) => ({
        // Ensure item type matches
        productId: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      })),
      totalPrice: totalPrice,
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/orders`, orderData)
      toast.dismiss(toastId)
      if (response.status === 201) {
        toast.success('Order placed successfully! Thank you.')
        clearCart()
        // Assuming backend returns orderId in response.data
        setTimeout(() => {
          navigate('/order-confirmation', { state: { orderId: response.data.orderId } })
        }, 2000)
      } else {
        throw new Error(response.data.message || 'Unexpected response from server.')
      }
    } catch (error: any) {
      toast.dismiss(toastId)
      const message =
        error.response?.data?.message || 'Failed to place order. Please check details.'
      toast.error(message)
      setIsSubmitting(false)
    }
  }

  if (cart.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-inter">
        <ShoppingBag className="w-16 h-16 text-trendzone-light-blue mb-4" />
        <p className="text-xl text-gray-700 mb-6">Your cart is empty.</p>
        <Link
          to="/shop"
          className="px-6 py-2.5 bg-trendzone-dark-blue text-white rounded-lg hover:bg-trendzone-light-blue hover:text-trendzone-dark-blue transition-colors text-sm font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-100 py-12 sm:py-16 px-4 font-inter"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <Toaster position="top-center" />
      <div className="max-w-5xl mx-auto">
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-trendzone-dark-blue text-center mb-10 md:mb-12"
          variants={titleVariants}
        >
          Shipping Details
        </motion.h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-start">
            {/* Left Column: Shipping Form */}
            <motion.div
              className="md:col-span-2 bg-white p-6 sm:p-8 rounded-xl shadow-xl space-y-6"
              variants={sectionVariants}
            >
              <motion.div variants={inputGroupVariants} custom={0}>
                <h3 className="text-lg font-semibold text-trendzone-dark-blue mb-4 border-b border-gray-200 pb-2.5">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  {[
                    {
                      id: 'customerName',
                      label: 'Full Name',
                      type: 'text',
                      placeholder: 'e.g. Abbas Ali',
                    },
                    {
                      id: 'customerPhone',
                      label: 'Phone Number',
                      type: 'tel',
                      placeholder: '+923078499692',
                    },
                  ].map((field) => (
                    <div key={field.id}>
                      <label
                        htmlFor={field.id}
                        className="block text-xs font-medium text-gray-600 mb-1.5"
                      >
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.id}
                        id={field.id}
                        required
                        value={formData[field.id as keyof typeof formData]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-trendzone-dark-blue placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-trendzone-light-blue focus:border-transparent transition-colors"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <label
                    htmlFor="customerEmail"
                    className="block text-xs font-medium text-gray-600 mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    id="customerEmail"
                    required
                    value={formData.customerEmail}
                    onChange={handleChange}
                    placeholder="harry.potter06082000@gmail.com"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-trendzone-dark-blue placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-trendzone-light-blue focus:border-transparent transition-colors"
                  />
                </div>
              </motion.div>

              <motion.div variants={inputGroupVariants} custom={1}>
                <h3 className="text-lg font-semibold text-trendzone-dark-blue mb-4 border-b border-gray-200 pb-2.5 pt-3">
                  Shipping Address
                </h3>
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="street"
                      className="block text-xs font-medium text-gray-600 mb-1.5"
                    >
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      id="street"
                      required
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="69 j3 block johartown"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-trendzone-dark-blue placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-trendzone-light-blue focus:border-transparent transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
                    {[
                      { id: 'city', label: 'City', type: 'text', placeholder: 'lahore' },
                      {
                        id: 'postalCode',
                        label: 'Postal Code',
                        type: 'text',
                        placeholder: '54000',
                      },
                      {
                        id: 'country',
                        label: 'Country',
                        type: 'text',
                        readOnly: true,
                        placeholder: 'Pakistan',
                      }, // Added placeholder
                    ].map((field) => (
                      <div key={field.id}>
                        <label
                          htmlFor={field.id}
                          className="block text-xs font-medium text-gray-600 mb-1.5"
                        >
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          name={field.id}
                          id={field.id}
                          required={!field.readOnly}
                          value={formData[field.id as keyof typeof formData]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          readOnly={field.readOnly}
                          className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-trendzone-dark-blue placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-trendzone-light-blue focus:border-transparent transition-colors ${
                            field.readOnly ? 'bg-gray-200 cursor-not-allowed' : ''
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Order Summary */}
            <motion.div
              className="md:col-span-1 bg-white p-6 sm:p-8 rounded-xl shadow-xl space-y-6 lg:sticky lg:top-24 py-12"
              variants={sectionVariants}
            >
              <h3 className="text-xl font-semibold text-trendzone-dark-blue mb-5 border-b border-gray-200 pb-3">
                Order Summary
              </h3>
              <div className="space-y-3 text-sm max-h-60 overflow-y-auto pr-2">
                {' '}
                {/* Scrollable items if many */}
                <AnimatePresence>
                  {cart.map(
                    (
                      item: CartItemForContext, // Explicitly type item here
                    ) => (
                      <motion.div
                        key={item._id + (item.selectedSize || '') + (item.selectedColor || '')}
                        className="flex justify-between items-center text-gray-700 py-2"
                        variants={summaryItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {' '}
                          {/* min-w-0 for truncation */}
                          <img
                            src={`${API_BASE_URL}${item.image.startsWith('/') ? '' : '/'}${
                              item.image
                            }`}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded-md border border-gray-200 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            {' '}
                            {/* min-w-0 for truncation */}
                            <span className="block text-xs font-medium text-trendzone-dark-blue truncate">
                              {item.title} (x{item.quantity})
                            </span>
                            {item.selectedSize && (
                              <span className="block text-xs text-gray-500">
                                Size: {item.selectedSize}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-medium text-gray-600 whitespace-nowrap ml-2">
                          PKR {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </motion.div>
                    ),
                  )}
                </AnimatePresence>
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2 mt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">PKR {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-trendzone-dark-blue pt-3 mt-2 border-t border-gray-200">
                  <span>Total Amount (COD)</span>
                  <span>PKR {totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full flex justify-center items-center px-6 py-3 mt-6 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-trendzone-dark-blue hover:bg-trendzone-light-blue hover:text-trendzone-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-trendzone-light-blue disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                ) : (
                  <ShoppingBag className="mr-2 h-5 w-5" />
                )}
                {isSubmitting ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
              </motion.button>
            </motion.div>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

export default CheckoutPage
