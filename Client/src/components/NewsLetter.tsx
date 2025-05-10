// src/components/NewsLetter.tsx
import React, { useState } from 'react'
import axios from 'axios'
import { toast, Toaster } from 'react-hot-toast'
import { Loader2, Send } from 'lucide-react'
import { motion } from 'framer-motion'

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://backend-production-c8ff.up.railway.app' // TODO: Ensure VITE_API_URL is in .env
const SUBSCRIBE_ENDPOINT = `${API_BASE_URL}/api/newsletter/subscribe`

// Animation Variants - unchanged
const sectionVariants = {
  /* ... */
}
const textVariants = {
  /* ... */
}
const formVariants = {
  /* ... */
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
      // Basic email validation
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
        setEmail('') // Clear email field on success
      } else {
        // This case might not be hit often if axios throws for non-2xx
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
      // bg-slate-100 -> bg-muted/10 (or bg-background)
      className="bg-muted/10 py-16 md:py-24 px-6 sm:px-8 text-center font-inter"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Toaster for notifications - Consider theming this separately if needed */}
      <Toaster position="top-center" reverseOrder={false} />
      <motion.h3
        // text-trendzone-dark-blue -> text-primary (or text-foreground)
        className="text-3xl md:text-4xl lg:text-5xl font-serif text-primary mb-4 tracking-wider uppercase"
        variants={textVariants}
      >
        BE THE FIRST
      </motion.h3>
      <motion.p
        // text-gray-600 -> text-muted-foreground (or text-secondary-foreground)
        className="text-sm md:text-base text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed"
        variants={textVariants}
      >
        New arrivals. Exclusive previews. First access to sales. <br className="hidden sm:block" />
        Sign up to stay in the know with WearFlare. {/* Changed TrendZone to WearFlare */}
      </motion.p>
      <motion.form
        onSubmit={handleSubscribe}
        // Shadow and rounded corners are good, background will be inherited or can be set to bg-card if desired
        className="flex flex-col sm:flex-row items-stretch justify-center max-w-md mx-auto shadow-lg rounded-xl overflow-hidden"
        variants={formVariants}
      >
        <label htmlFor="newsletter-email-main" className="sr-only">
          Email Address
        </label>
        <input
          id="newsletter-email-main"
          type="email"
          placeholder="Enter your email address"
          className="
            bg-input text-foreground placeholder:text-muted-foreground {/* bg-white -> bg-input (themeable input bg), text-trendzone-dark-blue -> text-foreground, placeholder-gray-400 -> placeholder:text-muted-foreground */}
            border-0 focus:ring-0 {/* Kept, focus handled by next line */}
            h-14 px-6 py-3
            w-full sm:flex-grow
            text-sm font-medium
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset {/* focus:ring-trendzone-light-blue -> focus:ring-ring (themeable focus ring) */}
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
            bg-primary text-primary-foreground {/* bg-trendzone-dark-blue -> bg-primary, text-white -> text-primary-foreground */}
            hover:bg-primary/80 hover:text-primary-foreground {/* hover:bg-trendzone-light-blue hover:text-trendzone-dark-blue -> hover:bg-primary/80 (or hover:bg-accent hover:text-accent-foreground) */}
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
