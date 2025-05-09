// src/pages/SignupForm.tsx (or components/SignupForm.tsx)
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { Eye, EyeOff, Loader2, LogIn, Star } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import signup from '../assets/signup.mp4'

const signupBgImageUrl = signup

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://backend-production-c8ff.up.railway.app'
const SIGNUP_API_ENDPOINT = `${API_BASE_URL}/api/auth/signup`

interface ToastState {
  id: number
  message: string
  type: 'success' | 'error'
}

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
  // For Signup, we are primarily using fullName, email, password
  fullName?: string // Added for consistency with state
  password?: string
  confirmPassword?: string
}

// Animation Variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const columnVariants = (delay = 0) => ({
  hidden: { opacity: 0, x: delay === 0 ? -50 : 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay, staggerChildren: 0.1 },
  },
})

// --- DEFINED textItemVariants HERE ---
const textItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
// --- END DEFINITION ---

const formElementVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
}

const SignupForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  // Toast state is not explicitly used in this component with react-hot-toast, but keeping for structure
  // const [toastState, setToastState] = useState<ToastState | null>(null);

  const navigate = useNavigate()

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}
    const trimmedFullName = fullName.trim()
    const trimmedEmail = email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!trimmedFullName) newErrors.fullName = 'Full Name is required.'
    else if (trimmedFullName.length < 2)
      newErrors.fullName = 'Full Name must be at least 2 characters.'
    else if (!/^[A-Za-z\s'-]+$/.test(trimmedFullName))
      newErrors.fullName = 'Full Name contains invalid characters.'

    if (!trimmedEmail) newErrors.email = 'Email is required.'
    else if (!emailRegex.test(trimmedEmail)) newErrors.email = 'Please enter a valid email address.'

    if (!password) newErrors.password = 'Password is required.'
    else if (password.length < 6)
      newErrors.password = 'Password must be at least 6 characters long.'

    if (!confirmPassword) newErrors.confirmPassword = 'Confirm Password is required.'
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.'

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null) // Clear previous general error
    const validationErrors = validateForm()

    if (Object.keys(validationErrors).length > 0) {
      // For simplicity, just show the first error found, or a general message
      const firstError = Object.values(validationErrors)[0]
      toast.error(firstError || 'Please correct the errors in the form.')
      setFormError(firstError || 'Please correct the errors in the form.') // Also set general error
      // If you want to set individual field errors, you'd need a state for that:
      // setErrors(validationErrors); // Assuming you add 'errors' state
      return
    }

    setIsLoading(true)
    const toastId = toast.loading('Creating account...')

    try {
      const response = await axios.post(SIGNUP_API_ENDPOINT, {
        fullName: fullName.trim(),
        email: email.trim(),
        password: password,
      })

      toast.dismiss(toastId)

      if (response.status === 201 || response.status === 200) {
        toast.success(response.data.message || 'Account created successfully! Redirecting...')
        setFullName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setFormError(null)
        setTimeout(() => {
          navigate('/login')
        }, 1500)
      } else {
        throw new Error(response.data.message || 'Signup failed. Please try again.')
      }
    } catch (error: any) {
      toast.dismiss(toastId)
      setIsLoading(false)
      console.error('Signup Error:', error)
      const message =
        error.response?.data?.message || 'An error occurred during signup. Please try again.'
      toast.error(message)
      setFormError(message)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'fullName') setFullName(value)
    else if (name === 'email') setEmail(value)
    else if (name === 'password') setPassword(value)
    else if (name === 'confirmPassword') setConfirmPassword(value)
    if (formError) setFormError(null)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 font-inter p-5 py-12">
      <Toaster position="top-center" reverseOrder={false} />
      <motion.div
        className="flex flex-col md:flex-row w-full max-w-6xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {/* Left Column - Form */}
        <motion.div
          className="w-full md:w-1/2 p-8 sm:p-10 lg:p-14 flex flex-col justify-center order-2 md:order-1"
          variants={columnVariants(0)} // Animate from left
        >
          <Link to="/" className="inline-block mb-8 text-2xl font-bold text-trendzone-dark-blue">
            Wearflare
          </Link>

          <motion.h1
            className="text-2xl sm:text-3xl font-bold text-trendzone-dark-blue mb-2"
            variants={textItemVariants}
          >
            Create an account
          </motion.h1>
          <motion.p className="text-sm text-gray-600 mb-8" variants={textItemVariants}>
            Start your fashion journey with us.
          </motion.p>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <motion.div variants={formElementVariants} custom={2}>
              <label htmlFor="fullName" className="text-xs font-medium text-gray-600 block mb-1.5">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Olivia Rhye"
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm text-trendzone-dark-blue placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-trendzone-light-blue focus:border-transparent transition"
                value={fullName}
                onChange={handleInputChange}
                required
              />
              {/* Placeholder for specific field error if you add 'errors' state */}
            </motion.div>

            <motion.div variants={formElementVariants} custom={3}>
              <label htmlFor="email" className="text-xs font-medium text-gray-600 block mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="olivia@untitled.com"
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm text-trendzone-dark-blue placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-trendzone-light-blue focus:border-transparent transition"
                value={email}
                onChange={handleInputChange}
                required
              />
            </motion.div>

            <motion.div variants={formElementVariants} custom={4}>
              <label htmlFor="password" className="text-xs font-medium text-gray-600 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 pr-10 text-sm text-trendzone-dark-blue placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-trendzone-light-blue focus:border-transparent transition"
                  value={password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-trendzone-dark-blue"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={formElementVariants} custom={5}>
              <label
                htmlFor="confirmPassword"
                className="text-xs font-medium text-gray-600 block mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="********"
                  className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 pr-10 text-sm text-trendzone-dark-blue placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-trendzone-light-blue focus:border-transparent transition"
                  value={confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-trendzone-dark-blue"
                  aria-label={
                    showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                  }
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {formError && ( // General form error display
              <motion.p
                className="text-xs text-red-500 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {formError}
              </motion.p>
            )}

            <motion.button
              type="submit"
              className="w-full bg-trendzone-dark-blue text-white rounded-lg py-3 px-5 font-semibold text-sm hover:bg-trendzone-light-blue hover:text-trendzone-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-trendzone-light-blue transition-colors duration-300 transform active:scale-[0.98] flex items-center justify-center disabled:opacity-60"
              disabled={isLoading}
              variants={formElementVariants}
              custom={6}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Account'}
            </motion.button>
          </form>

          <motion.p
            className="text-center text-sm text-gray-600 mt-8"
            variants={formElementVariants}
            custom={7}
          >
            Already have an account?{' '}
            <Link to="/login" className="text-trendzone-light-blue font-semibold hover:underline">
              Log in
            </Link>
          </motion.p>
        </motion.div>

        {/* Right Column - Image and Quote */}
        <motion.div
          className="w-full md:w-1/2 relative hidden md:flex flex-col justify-end order-1 md:order-2 bg-gray-200"
          variants={columnVariants(0.2)} // Slide from right, slight delay
        >
          <video
            className="w-full h-[720px] object-cover"
            src={signupBgImageUrl}
            autoPlay
            loop
            muted
            playsInline
            poster="/placeholder-video-poster.jpg"
          ></video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

          {/* <motion.div className="relative p-8 lg:p-12 text-white z-10" variants={textItemVariants}>
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="white" strokeWidth={0} />
              ))}
            </div>
            <blockquote className="text-xl lg:text-2xl font-medium leading-relaxed mb-4">
              "We move 10x faster than our peers and stay consistent. While they're bogged down with
              design debt, we're releasing new features."
            </blockquote>
            <p className="font-semibold">Sophie Hall</p>
            <p className="text-sm text-gray-300">Founder, Wearflare Catalog</p>
          </motion.div> */}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SignupForm
