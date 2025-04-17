// src/pages/LoginForm.tsx
import React, { useState, useContext, FormEvent, useEffect } from 'react'
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react' // Added Loader2
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext' // Ensure path is correct
import bgsignin from '/bg-for-signin.png' // Ensure path is correct
import axios from 'axios' // Import axios
import { toast, Toaster } from 'react-hot-toast' // Import toast

const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app/' // Or https://backend-production-c8ff.up.railway.app/

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [rememberMe, setRememberMe] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const authContext = useContext(AuthContext)
  // Add null check for context for type safety
  if (!authContext) {
    // Handle context not being available, maybe redirect or show error
    // For now, we can throw or return null, but a proper app should handle this
    console.error('AuthContext is undefined. Make sure AuthProvider is wrapping the app.')
    return <div>Error: Auth context not available.</div> // Or throw new Error(...)
  }
  const { setUser } = authContext
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password) {
      toast.error('Please enter both email and password.')
      return
    }

    setIsLoading(true)
    const toastId = toast.loading('Signing in...') // Show loading toast

    try {
      // Use axios for consistency
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email: trimmedEmail, password }, // Send trimmed email
      )

      toast.dismiss(toastId) // Dismiss loading toast

      // Axios typically throws for non-2xx, but check data just in case
      if (response.data && response.data.token) {
        toast.success('Logged in successfully!')
        setUser({ token: response.data.token /* include other user data if needed */ }) // Update context

        // Store token based on rememberMe
        if (rememberMe) {
          localStorage.setItem('token', response.data.token) // Persist longer
          localStorage.setItem('userEmail', response.data.email) // Optionally store email
        } else {
          sessionStorage.setItem('token', response.data.token) // Session only
          sessionStorage.setItem('userEmail', response.data.email)
        }

        navigate('/') // Redirect to homepage
      } else {
        // This case might not be reached often with axios, primarily handled in catch
        throw new Error(response.data.message || 'Login failed: Invalid response from server.')
      }
    } catch (error: any) {
      toast.dismiss(toastId) // Dismiss loading toast on error too
      console.error('Login Fetch Error:', error.response?.data || error.message)
      // Show specific error from backend response if available
      const message =
        error.response?.data?.message ||
        'Login failed. Please check credentials or try again later.'
      toast.error(message)
    } finally {
      setIsLoading(false) // **Ensure loading state is always reset**
    }
  }

  // Prefill email if remembered
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('userEmail')
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-gray-100 py-10 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${bgsignin})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Toaster position="top-center" /> {/* Add Toaster */}
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg backdrop-blur-sm bg-opacity-95">
        <h1 className="text-black text-center text-3xl font-semibold mb-6">Sign in</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <label htmlFor="login-email" className="form-label">
              Email
            </label>
            <div className="relative">
              <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                className="auth-input pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <div className="input-icon left-3">
                <User size={20} />
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="login-password" className="form-label">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                autoComplete="current-password"
                className="auth-input pl-10 pr-10" // Ensure right padding for icon
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <div className="input-icon left-3">
                <Lock size={20} />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm mt-2">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#c8a98a] focus:ring-[#c8a98a]"
                disabled={isLoading}
              />
              <span className="text-gray-600">Remember Me</span>
            </label>
            <Link to="/forgot-password" className="text-[#c8a98a] hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Sign in Button */}
          <button type="submit" className="auth-button w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign in'}
          </button>

          {/* Sign-up Link */}
          <p className="text-center text-sm text-gray-600">
            No account?
            <Link to="/signup" className="text-[#c8a98a] font-medium hover:underline ml-1">
              Sign up
            </Link>
          </p>
        </form>
      </div>
      {/* Shared Auth Styles (Add if not globally defined) */}
      <style jsx global>{`
        .form-label {
          display: block;
          margin-bottom: 0.375rem; /* mb-1.5 */
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }
        .auth-input {
          width: 100%;
          background-color: #f3f4f6;
          color: #1f2937;
          border-radius: 0.5rem;
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
          padding-left: 2.5rem;
          padding-right: 1rem; /* default */
          outline: none;
          border: 1px solid #d1d5db;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .auth-input.pr-10 {
          padding-right: 2.5rem;
        } /* Add padding for password eye */
        .auth-input:focus {
          border-color: #c8a98a;
          box-shadow: 0 0 0 1px #c8a98a;
        }
        .auth-input:disabled {
          background-color: #e5e7eb;
          cursor: not-allowed;
        }
        .input-icon {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          pointer-events: none;
        }
        .password-toggle-button {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          background: none;
          border: none;
          padding: 0.25rem;
          cursor: pointer;
        }
        .password-toggle-button:hover {
          color: #374151;
        }
        .auth-button {
          background-color: #c8a98a;
          color: white;
          border-radius: 0.5rem;
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
          font-weight: 600;
          transition: background-color 0.2s, transform 0.1s, opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          width: 100%;
        }
        .auth-button:hover:not(:disabled) {
          background-color: #b08d6a;
        }
        .auth-button:active:not(:disabled) {
          transform: scale(0.98);
        }
        .auth-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default LoginForm
