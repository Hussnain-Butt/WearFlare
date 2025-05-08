// src/components/NewsLetter.tsx
import React, { useState } from 'react'
import axios from 'axios'
import { toast, Toaster } from 'react-hot-toast'
import { Loader2, Send } from 'lucide-react' // Added Send icon for button
import { motion } from 'framer-motion'

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://backend-production-c8ff.up.railway.app'
const SUBSCRIBE_ENDPOINT = `${API_BASE_URL}/api/newsletter/subscribe`

// Animation Variants
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.15, when: 'beforeChildren' },
  },
}

const textVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 0.2 } },
}

const NewsLetter: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      toast.error('Please enter your email address.')
      return
    }
    if (!/.+\@.+\..+/.test(trimmedEmail)) {
      toast.error('Please enter a valid email address.')
      return
    }

    setIsLoading(true)
    const toastId = toast.loading('Subscribing...')

    try {
      const response = await axios.post(SUBSCRIBE_ENDPOINT, { email: trimmedEmail })
      toast.dismiss(toastId)
      if (response.status === 201 || response.status === 200) {
        toast.success(response.data.message || 'Subscription successful!')
        setEmail('')
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
    <motion.div
      className="bg-slate-100 py-16 md:py-24 px-6 sm:px-8 text-center font-inter" // Light sophisticated background
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <Toaster position="top-center" reverseOrder={false} />{' '}
      {/* Moved Toaster to top for better visibility */}
      <motion.h3
        className="text-3xl md:text-4xl lg:text-5xl font-serif text-trendzone-dark-blue mb-4 tracking-wider uppercase" // Elegant serif title
        variants={textVariants}
      >
        BE THE FIRST
      </motion.h3>
      <motion.p
        className="text-sm md:text-base text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed"
        variants={textVariants}
      >
        New arrivals. Exclusive previews. First access to sales. <br className="hidden sm:block" />{' '}
        Sign up to stay in the know with TrendZone.
      </motion.p>
      <motion.form
        onSubmit={handleSubscribe}
        className="flex flex-col sm:flex-row items-stretch justify-center max-w-md mx-auto shadow-lg rounded-xl overflow-hidden" // Form container with shadow and rounded corners
        variants={formVariants}
      >
        <label htmlFor="newsletter-email-main" className="sr-only">
          {' '}
          {/* Unique ID for label */}
          Email Address
        </label>
        <input
          id="newsletter-email-main"
          type="email"
          placeholder="Enter your email address"
          className="
            bg-white text-trendzone-dark-blue placeholder-gray-400
            border-0 focus:ring-0  /* Remove default border and ring, focus handled below */
            h-14 px-6 py-3
            w-full sm:flex-grow 
            text-sm font-medium
            focus:outline-none focus:ring-2 focus:ring-trendzone-light-blue focus:ring-inset
            transition duration-200 ease-in-out
            disabled:opacity-70 disabled:cursor-not-allowed
            sm:rounded-l-xl sm:rounded-r-none rounded-t-xl sm:rounded-tr-none
          "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />

        <motion.button
          type="submit"
          className="
            bg-trendzone-dark-blue text-white
            hover:bg-trendzone-light-blue hover:text-trendzone-dark-blue
            h-14 px-6 sm:px-8 py-3
            font-semibold text-xs sm:text-sm uppercase tracking-wider
            w-full sm:w-auto flex-shrink-0
            transition-colors duration-200 ease-in-out
            disabled:opacity-60 disabled:cursor-not-allowed
            inline-flex items-center justify-center
            sm:rounded-r-xl sm:rounded-l-none rounded-b-xl sm:rounded-bl-none
          "
          disabled={isLoading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <>
              <span className="mr-2">SIGN UP</span>
              <Send size={16} />
            </>
          )}
        </motion.button>
      </motion.form>
    </motion.div>
  )
}

export default NewsLetter
