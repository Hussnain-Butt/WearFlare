// src/components/NewsLetter.tsx
import React, { useState } from 'react'
import axios from 'axios'
import { toast, Toaster } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

// --- API Configuration ---
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app' // Or https://backend-production-c8ff.up.railway.app
const SUBSCRIBE_ENDPOINT = `${API_BASE_URL}/api/newsletter/subscribe`
// --- / ---

const NewsLetter: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Handle form submission
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
        setEmail('') // Clear input field
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
    <div className="bg-[#d3cac0] py-12 md:py-16 px-6 sm:px-8 text-center border-t border-b border-gray-300/50 font-sans">
      <Toaster position="bottom-center" />
      <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#3a3a3a] mb-3 leading-tight tracking-tight">
        BE THE FIRST
      </h3>
      <p className="text-base md:text-lg text-[#5a5a5a] mb-8 max-w-xl mx-auto">
        New arrivals. Exclusive previews. First access to sales. Sign up to stay in the know.
      </p>

      {/* --- Form with Direct Tailwind Classes --- */}
      <form
        onSubmit={handleSubscribe}
        // Use flex, center items, allow wrapping, gap between items
        className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-lg mx-auto"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email Address
        </label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="Enter your email address"
          // Apply styles directly using Tailwind classes
          className="
            bg-[#c8a98a] text-white placeholder-white/70  /* Colors */
            border border-[#c8a98a]                  /* Border */
            h-12 rounded-full px-6 py-2               /* Sizing & Padding */
            w-full sm:w-auto sm:flex-grow             /* Width & Growth */
            text-sm                                  /* Text */
            focus:outline-none focus:border-[#6b5745] /* Focus State */
            focus:ring-2 focus:ring-[#6b5745]/30      /* Focus Ring */
            transition duration-200 ease-in-out      /* Transitions */
            disabled:opacity-70 disabled:cursor-not-allowed /* Disabled State */
          "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />

        <button
          type="submit"
          // Apply styles directly using Tailwind classes
          className="
              bg-[#6b5745] text-white                     /* Colors */
              hover:bg-[#5d4c3b]                          /* Hover State */
              h-12 rounded-full px-8 py-2               /* Sizing & Padding */
              font-semibold text-sm                       /* Text */
              w-full sm:w-auto flex-shrink-0             /* Width & Shrink */
              transition duration-200 ease-in-out      /* Transitions */
              disabled:opacity-70 disabled:cursor-not-allowed /* Disabled State */
              inline-flex items-center justify-center    /* Flex for loader */
            "
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-5 w-5" /> // Keep loader
          ) : (
            'SIGN UP'
          )}
        </button>
      </form>
      {/* --- End Form --- */}

      {/* Remove the <style jsx> block if you are fully using Tailwind */}
      {/*
      <style jsx>{`
         // ... previous styles ...
      `}</style>
      */}
    </div>
  )
}

export default NewsLetter
