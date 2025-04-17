// src/pages/ResetPasswordPage.tsx
import React, { useState, useEffect, FormEvent, useContext } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import bgsignin from '/bg-for-signin.png' // Ensure path is correct
import AuthContext from '../context/AuthContext' // Adjust path if needed
import { toast, Toaster } from 'react-hot-toast' // Use toast for feedback

// Define API base URL
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app' // Or your deployed URL

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState<string>('')
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  // Removed message/error state in favor of toasts
  const { token } = useParams<{ token: string }>() // Get token from URL
  const navigate = useNavigate()
  const authContext = useContext(AuthContext) // Optional: for auto-login

  // Validate token presence early
  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token in URL.')
      // Redirect to login after a short delay
      setTimeout(() => navigate('/login'), 3000)
    }
  }, [token, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Client-side validation
    if (!password || !passwordConfirm) {
      toast.error('Please fill in both password fields.')
      return
    }
    if (password !== passwordConfirm) {
      toast.error('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.')
      return
    }
    if (!token) {
      toast.error('Reset token is missing. Cannot proceed.') // Should be caught by useEffect but good fallback
      return
    }

    setIsLoading(true)
    const toastId = toast.loading('Resetting password...')

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/reset-password/${token}`, // Send token in URL
        {
          method: 'PATCH', // Use PATCH method
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password, passwordConfirm }), // Send passwords in body
        },
      )

      const data = await response.json()
      toast.dismiss(toastId) // Dismiss loading toast

      if (response.ok) {
        toast.success(data.message || 'Password reset successfully!', { duration: 4000 })

        // Optional: Automatically log the user in if token is returned
        if (data.token && authContext && authContext.setUser) {
          // Check if setUser exists
          authContext.setUser({ token: data.token /* add other user details if needed */ })
          sessionStorage.setItem('token', data.token) // Or localStorage
          toast.success('Logged in successfully. Redirecting...')
          setTimeout(() => navigate('/'), 2000) // Redirect to home
        } else {
          // Otherwise, redirect to login page
          toast.success('Redirecting to login...')
          setTimeout(() => navigate('/login'), 3000)
        }
      } else {
        // Show specific error from backend or a generic one
        toast.error(data.message || 'Failed to reset password. Link may be invalid or expired.')
      }
    } catch (err) {
      toast.dismiss(toastId)
      toast.error('Network error. Please check connection and try again.')
      console.error('Reset Password Fetch Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Render null or a message if token is definitely missing from the start
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Invalid Request: Reset token is missing. Redirecting...
        <Toaster />
      </div>
    )
  }

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
        <h1 className="text-black text-center text-3xl font-semibold mb-6">Reset Your Password</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* New Password Field */}
          <div>
            <label className="text-gray-700 text-sm font-medium block mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password (min. 6 chars)"
                className="auth-input pl-10 pr-10" // Use consistent class
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <Lock size={20} />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password Field */}
          <div>
            <label className="text-gray-700 text-sm font-medium block mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                placeholder="Confirm new password"
                className="auth-input pl-10 pr-10" // Use consistent class
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                disabled={isLoading}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <Lock size={20} />
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition p-1"
                aria-label={showPasswordConfirm ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="auth-button w-full mt-6" // Added margin-top
            disabled={isLoading || !token} // Disable if loading or token missing
          >
            {isLoading ? (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              'Reset Password'
            )}
          </button>

          {/* Link back to Login */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Remembered your password?
            <Link to="/login" className="text-[#c8a98a] font-medium hover:underline ml-1">
              Sign in
            </Link>
          </p>
        </form>
      </div>
      {/* Add shared auth styles */}
      <style jsx global>{`
        .auth-input {
          width: 100%;
          background-color: #f3f4f6; /* bg-gray-100 */
          color: #111827; /* text-black */
          border-radius: 0.5rem; /* rounded-lg */
          padding-top: 0.75rem; /* py-3 */
          padding-bottom: 0.75rem;
          padding-left: 2.5rem; /* pl-10 */
          padding-right: 1rem; /* px-4 default */
          outline: none;
          border: 1px solid #d1d5db; /* Add border */
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .auth-input:focus {
          border-color: #c8a98a;
          box-shadow: 0 0 0 1px #c8a98a;
        }
        /* Adjust right padding for password inputs with eye icon */
        input[type='password'] + button,
        input[type='text'] + button {
          right: 0.75rem; /* Adjust icon position */
        }
        input[type='password'].pr-10,
        input[type='text'].pr-10 {
          padding-right: 2.5rem; /* pr-10 */
        }

        .auth-button {
          background-color: #c8a98a;
          color: white;
          border-radius: 0.5rem; /* rounded-lg */
          padding-top: 0.75rem; /* py-3 */
          padding-bottom: 0.75rem;
          font-weight: 600; /* font-semibold */
          transition: background-color 0.2s, transform 0.1s, opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
        }
        .auth-button:hover:not(:disabled) {
          background-color: #b08d6a; /* Darken #c8a98a */
        }
        .auth-button:active:not(:disabled) {
          transform: scale(0.98);
        }
        .auth-button:disabled {
          opacity: 0.5;
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

export default ResetPasswordPage
