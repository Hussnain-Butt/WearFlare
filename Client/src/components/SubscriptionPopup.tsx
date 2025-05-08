// src/components/SubscriptionPopup.tsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { toast, Toaster } from 'react-hot-toast' // Assuming you have Toaster in your main layout or here
import { X, Loader2, Mail } from 'lucide-react'

// --- API Configuration (copied from NewsLetter) ---
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app'
const SUBSCRIBE_ENDPOINT = `${API_BASE_URL}/api/newsletter/subscribe`
// --- / ---

// Placeholder for the background image - Replace with your actual image
const popupBackgroundImageUrl =
  'https://images.pexels.com/photos/31886201/pexels-photo-31886201/free-photo-of-black-and-white-fashion-portrait-on-nyc-rooftop.jpeg?auto=compress&cs=tinysrgb&w=600'
// A more generic placeholder that fits the theme:
// const popupBackgroundImageUrl = 'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

// Animation Variants
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 20, duration: 0.4 },
  },
  exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.3 } },
}

const SubscriptionPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 5000) // Show after 8 seconds

    return () => clearTimeout(timer) // Cleanup timer on unmount
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    // Optionally, set a cookie/localStorage item here to not show again for this session/day
    // localStorage.setItem('popupShown', 'true');
  }

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      toast.error('Please enter your email address.')
      return
    }
    if (!/.+@.+\..+/.test(trimmedEmail)) {
      toast.error('Please enter a valid email address.')
      return
    }

    setIsLoading(true)
    const toastId = toast.loading('Subscribing...')

    try {
      const response = await axios.post(SUBSCRIBE_ENDPOINT, { email: trimmedEmail })
      toast.dismiss(toastId)
      if (response.status === 201 || response.status === 200) {
        toast.success(
          response.data.message || 'Subscription successful! Check your email for the discount.',
        )
        setEmail('')
        setTimeout(handleClose, 1500) // Close popup after successful subscription
      } else {
        throw new Error(response.data.message || 'Subscription failed.')
      }
    } catch (error: any) {
      toast.dismiss(toastId)
      console.error('Subscription error:', error.response?.data || error.message)
      const errorMessage = error.response?.data?.message || 'Subscription failed. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} /> {/* Ensure Toaster is rendered */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-10 font-inter"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={handleClose} // Close on backdrop click
          >
            <motion.div
              className="relative w-full max-w-lg md:max-w-xl lg:max-w-2xl bg-gray-300 rounded-xl shadow-2xl overflow-hidden"
              style={{
                backgroundImage: `url('${popupBackgroundImageUrl}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              {/* Semi-transparent overlay for text readability */}
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>

              {/* Close Button */}
              <motion.button
                className="absolute top-3 right-3 md:top-4 md:right-4 z-20 text-white/70 hover:text-white transition-colors"
                onClick={handleClose}
                aria-label="Close newsletter popup"
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>

              <div className="relative z-10 p-6 py-10 sm:p-8 md:p-10 text-center text-white">
                <motion.h2
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  Get 30% off your first order
                </motion.h2>
                <motion.p
                  className="text-sm sm:text-base text-white/80 mb-6 md:mb-8"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  Join our newsletter to receive the latest updates and promotions from Wearflare!
                </motion.p>

                <motion.form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row items-stretch gap-0 max-w-md mx-auto overflow-hidden shadow-md border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <label htmlFor="popup-newsletter-email" className="sr-only">
                    Email Address
                  </label>
                  <div className="relative flex-grow">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                    <input
                      id="popup-newsletter-email"
                      type="email"
                      placeholder="ENTER YOUR EMAIL"
                      className="
                        bg-white text-trendzone-dark-blue placeholder-gray-500
                        h-12 sm:h-14 w-full pl-12 pr-4 py-2 
                        text-sm font-medium
                        focus:outline-none focus:ring-2 focus:ring-trendzone-light-blue
                        transition duration-200 ease-in-out
                        disabled:opacity-70
                    
                      "
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    className="
                      bg-trendzone-dark-blue text-white
                      hover:bg-trendzone-light-blue hover:text-trendzone-dark-blue
                      h-12 sm:h-14 px-6 sm:px-8 py-2
                      font-semibold text-xs sm:text-sm uppercase tracking-wider
                      w-full sm:w-auto flex-shrink-0
                      transition duration-200 ease-in-out
                      disabled:opacity-70 disabled:cursor-not-allowed
                      inline-flex items-center justify-center
                    mt-2 sm:mt-0
                    "
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'SUBSCRIBE'}
                  </button>
                </motion.form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default SubscriptionPopup
