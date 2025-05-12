import React, { useState, useContext, FormEvent, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { Eye, EyeOff, Loader2, User as UserIcon, Lock as LockIcon } from 'lucide-react' // LogIn, Star not used
import { toast, Toaster } from 'react-hot-toast'
import AuthContext from '../context/AuthContext' // Ensure path is correct
import LoginBgVideo from '../assets/login.mp4' // Renamed for clarity

// Reusing the same background image as signup for consistency, or choose a different one
// const loginBgImageUrl = LoginBgVideo

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
  const [formError, setFormError] = useState<string | null>(null)

  const authContext = useContext(AuthContext)
  if (!authContext) {
    console.error('AuthContext is undefined.')
    // Optionally, render a fallback or throw an error
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-destructive">
        Auth context error. Please try refreshing.
      </div>
    )
  }
  const { setUser } = authContext
  const navigate = useNavigate()

  // --- Logic Functions (validateForm, handleSubmit, useEffect for rememberedEmail) - UNCHANGED ---
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
      const response = await axios.post(LOGIN_API_ENDPOINT, { email: email.trim(), password })
      toast.dismiss(toastId)
      if (response.data && response.data.token) {
        toast.success('Logged in successfully!')
        setUser({
          token: response.data.token,
          email: response.data.email,
          name: response.data.name,
          role: response.data.role, // Assuming role is part of response
          _id: response.data._id, // Assuming _id is part of response
        })
        if (rememberMe) {
          localStorage.setItem('token', response.data.token)
          localStorage.setItem(
            'user',
            JSON.stringify({
              email: response.data.email,
              name: response.data.name,
              role: response.data.role,
              _id: response.data._id,
            }),
          )
        } else {
          sessionStorage.setItem('token', response.data.token)
          sessionStorage.setItem(
            'user',
            JSON.stringify({
              email: response.data.email,
              name: response.data.name,
              role: response.data.role,
              _id: response.data._id,
            }),
          )
        }
        // Redirect based on role
        if (response.data.role === 'admin') {
          navigate('/admin/dashboard')
        } else if (response.data.role === 'productManager') {
          navigate('/pm/products')
        } else {
          navigate('/')
        }
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
    const rememberedUser = localStorage.getItem('user')
    if (rememberedUser) {
      try {
        const parsedUser = JSON.parse(rememberedUser)
        if (parsedUser.email) setEmail(parsedUser.email)
        setRememberMe(true)
      } catch (e) {
        console.error('Failed to parse remembered user from localStorage', e)
      }
    }
  }, [])
  // --- END Logic Functions ---

  // Toaster theme options (optional, customize as needed from previous examples)
  const toasterThemeOptions = {
    /* ... */
  }

  return (
    // UPDATED: bg-gray-100 -> bg-background
    <div className="min-h-screen w-full flex items-center justify-center bg-background font-inter p-5 py-12">
      <Toaster position="top-center" reverseOrder={false} toastOptions={toasterThemeOptions} />
      <motion.div
        // UPDATED: bg-white -> bg-card
        className="flex flex-col md:flex-row w-full max-w-6xl mx-auto bg-card shadow-2xl rounded-xl overflow-hidden"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {/* Left Column - Form */}
        <motion.div
          // Background inherited from parent (bg-card)
          className="w-full md:w-1/2 p-8 sm:p-10 lg:p-14 flex flex-col justify-center order-2 md:order-1"
          variants={columnVariants(0)}
        >
          {/* UPDATED: text-trendzone-dark-blue -> text-primary (or text-card-foreground) */}
          <Link to="/" className="inline-block mb-8 text-2xl font-bold text-primary">
            Wearflare
          </Link>

          <motion.h1
            // UPDATED: text-trendzone-dark-blue -> text-card-foreground (or text-primary)
            className="text-2xl sm:text-3xl font-bold text-card-foreground mb-2"
            variants={textItemVariants}
          >
            Welcome back
          </motion.h1>
          {/* UPDATED: text-gray-600 -> text-muted-foreground (relative to card bg) */}
          <motion.p className="text-sm text-muted-foreground mb-8" variants={textItemVariants}>
            Welcome back! Please enter your details.
          </motion.p>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <motion.div variants={formElementVariants} custom={0}>
              {/* UPDATED: text-gray-600 -> text-muted-foreground */}
              <label
                htmlFor="login-email"
                className="text-xs font-medium text-muted-foreground block mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                {/* UPDATED: text-gray-400 -> text-muted-foreground */}
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <UserIcon size={18} />
                </span>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="olivia@untitled.com"
                  autoComplete="email"
                  // UPDATED: Input field styling
                  className="w-full bg-input border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-primary transition"
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
                className="text-xs font-medium text-muted-foreground block mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <LockIcon size={18} />
                </span>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  autoComplete="current-password"
                  className="w-full bg-input border border-border rounded-lg py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-primary transition"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (formError) setFormError(null)
                  }}
                  required
                />
                {/* UPDATED: Icon text color */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
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
              {/* UPDATED: text-gray-600 -> text-muted-foreground */}
              <label className="flex items-center space-x-2 cursor-pointer select-none text-muted-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  // UPDATED: Checkbox theming (text-primary for checked color, border-border for border)
                  className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                  disabled={isLoading}
                />
                <span>Remember for 30 days</span>
              </label>
              {/* UPDATED: text-trendzone-light-blue -> text-accent (or text-primary) */}
              <Link
                to="/forgot-password"
                className="font-semibold text-trendzone-light-blue hover:text-trendzone-light-blue"
              >
                Forgot password
              </Link>
            </motion.div>

            {formError && (
              // UPDATED: text-red-500 -> text-destructive
              <motion.p
                className="text-xs text-destructive text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {formError}
              </motion.p>
            )}

            <motion.button
              type="submit"
              // UPDATED: Button styling
              className="w-full bg-primary text-primary-foreground rounded-lg py-3 px-5 font-semibold text-sm hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors duration-300 transform active:scale-[0.98] flex items-center justify-center disabled:opacity-60"
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
            // UPDATED: text-gray-600 -> text-muted-foreground
            className="text-center text-sm text-muted-foreground mt-8"
            variants={formElementVariants}
            custom={4}
          >
            Don't have an account?{' '}
            {/* UPDATED: text-trendzone-light-blue -> text-accent (or text-primary) */}
            <Link
              to="/signup"
              className="text-trendzone-light-blue font-semibold hover:underline hover:text-trendzone-light-blue"
            >
              Sign up
            </Link>
          </motion.p>
        </motion.div>

        {/* Right Column - Image and Quote */}
        <motion.div
          // UPDATED: bg-gray-200 -> bg-muted (fallback for video area)
          className="w-full md:w-1/2 relative hidden md:flex flex-col justify-end order-1 md:order-2 bg-muted"
          variants={columnVariants(0.2)}
        >
          <video
            className="w-full h-[620px] object-cover" // Height can be md:h-full
            src={LoginBgVideo}
            autoPlay
            loop
            muted
            playsInline
            poster="/placeholder-video-poster.jpg"
          ></video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          {/* Quote section (commented out in original, keeping it commented) */}
          {/* <motion.div className="relative p-8 lg:p-12 text-white z-10" variants={textItemVariants}> ... </motion.div> */}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginForm
