// src/pages/LoginForm.tsx
import React, { useState, useContext, FormEvent, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { Eye, EyeOff, Loader2, LogIn, Star, User as UserIcon, Lock as LockIcon } from 'lucide-react' // Added UserIcon, LockIcon
import { toast, Toaster } from 'react-hot-toast'
import AuthContext from '../context/AuthContext' // Ensure path is correct

// Reusing the same background image as signup for consistency, or choose a different one
const loginBgImageUrl =
  'https://images.pexels.com/photos/12185654/pexels-photo-12185654.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://backend-production-c8ff.up.railway.app'
const LOGIN_API_ENDPOINT = `${API_BASE_URL}/api/auth/login`

// Animation Variants (can be shared from a common file if desired)
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

const textItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const formElementVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
}

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [rememberMe, setRememberMe] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formError, setFormError] = useState<string | null>(null) // For general form errors

  const authContext = useContext(AuthContext)
  if (!authContext) {
    console.error('AuthContext is undefined.')
    return <div>Error: Auth context not available.</div>
  }
  const { setUser } = authContext
  const navigate = useNavigate()

  const validateForm = () => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      setFormError('Please enter both email and password.')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError('Please enter a valid email address.')
      return false
    }
    setFormError(null)
    return true
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      if (formError) toast.error(formError)
      return
    }

    setIsLoading(true)
    const toastId = toast.loading('Signing in...')

    try {
      const response = await axios.post(LOGIN_API_ENDPOINT, {
        email: email.trim(),
        password,
      })

      toast.dismiss(toastId)

      if (response.data && response.data.token) {
        toast.success('Logged in successfully!')
        setUser({
          token: response.data.token,
          email: response.data.email,
          name: response.data.name /* include other user data */,
        })

        if (rememberMe) {
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('userEmail', response.data.email)
          localStorage.setItem('userName', response.data.name)
        } else {
          sessionStorage.setItem('token', response.data.token)
          sessionStorage.setItem('userEmail', response.data.email)
          sessionStorage.setItem('userName', response.data.name)
        }
        navigate('/')
      } else {
        throw new Error(response.data.message || 'Login failed: Invalid response.')
      }
    } catch (error: any) {
      toast.dismiss(toastId)
      setIsLoading(false)
      console.error('Login Error:', error)
      const message =
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      toast.error(message)
      setFormError(message)
    }
  }

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('userEmail')
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 font-inter">
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
          variants={columnVariants(0)}
        >
          <Link to="/" className="inline-block mb-8 text-2xl font-bold text-trendzone-dark-blue">
            Wearflare
          </Link>

          <motion.h1
            className="text-2xl sm:text-3xl font-bold text-trendzone-dark-blue mb-2"
            variants={textItemVariants}
          >
            Welcome back
            {/* Optional: Personalize if user info is available, e.g., from a previous session */}
            {/* {authContext.user?.name ? `, ${authContext.user.name.split(' ')[0]}` : ''} */}
          </motion.h1>
          <motion.p className="text-sm text-gray-600 mb-8" variants={textItemVariants}>
            Welcome back! Please enter your details.
          </motion.p>

          {/* Optional Google Log in Button */}
          {/* <motion.button className="..." variants={formElementVariants} custom={0}> ... </motion.button> */}
          {/* <motion.div className="..." variants={formElementVariants} custom={1}> OR divider </motion.div> */}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <motion.div variants={formElementVariants} custom={0}>
              {' '}
              {/* Adjusted custom index if Google/OR are removed */}
              <label
                htmlFor="login-email"
                className="text-xs font-medium text-gray-600 block mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <UserIcon size={18} />
                </span>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="olivia@untitled.com"
                  autoComplete="email"
                  className="w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-sm text-trendzone-dark-blue placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-trendzone-light-blue focus:border-transparent transition"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (formError) setFormError(null)
                  }}
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={formElementVariants} custom={1}>
              <label
                htmlFor="login-password"
                className="text-xs font-medium text-gray-600 block mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <LockIcon size={18} />
                </span>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  autoComplete="current-password"
                  className="w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-10 pr-10 text-sm text-trendzone-dark-blue placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-trendzone-light-blue focus:border-transparent transition"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (formError) setFormError(null)
                  }}
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

            <motion.div
              className="flex items-center justify-between text-sm"
              variants={formElementVariants}
              custom={2}
            >
              <label className="flex items-center space-x-2 cursor-pointer select-none text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-gray-300 text-trendzone-light-blue focus:ring-trendzone-light-blue focus:ring-offset-0" // Adjusted checkbox
                  disabled={isLoading}
                />
                <span>Remember for 30 days</span>
              </label>
              <Link
                to="/forgot-password"
                className="font-semibold text-trendzone-light-blue hover:underline"
              >
                Forgot password
              </Link>
            </motion.div>

            {formError && (
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
              custom={3}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Log in'}
            </motion.button>
          </form>

          <motion.p
            className="text-center text-sm text-gray-600 mt-8"
            variants={formElementVariants}
            custom={4}
          >
            Don't have an account?{' '}
            <Link to="/signup" className="text-trendzone-light-blue font-semibold hover:underline">
              Sign up
            </Link>
          </motion.p>
        </motion.div>

        {/* Right Column - Image and Quote */}
        <motion.div
          className="w-full md:w-1/2 relative hidden md:flex flex-col justify-end order-1 md:order-2 bg-gray-200"
          variants={columnVariants(0.2)}
        >
          <img
            src={loginBgImageUrl}
            alt="Stylish background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>{' '}
          {/* Adjusted gradient */}
          <motion.div className="relative p-8 lg:p-12 text-white z-10" variants={textItemVariants}>
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="white" strokeWidth={0} />
              ))}
            </div>
            <blockquote className="text-xl lg:text-2xl xl:text-3xl font-medium leading-snug xl:leading-normal mb-4">
              "We move 10x faster than our peers and stay consistent. While they're bogged down with
              design debt, we're releasing new features."
            </blockquote>
            <p className="font-semibold text-lg">Sophie Hall</p>
            <p className="text-sm text-gray-200">Founder, Wearflare Catalog</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginForm
