// src/pages/ForgotPasswordPage.tsx
import React, { useState, FormEvent } from 'react'
import { Mail } from 'lucide-react'
import bgsignin from '/bg-for-signin.png' // Ensure path is correct
import { toast, Toaster } from 'react-hot-toast' // Use toast for feedback

// Define API base URL
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app' // Or your deployed URL

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  // Removed message/error state in favor of toasts

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      toast.error('Please enter your email address.')
      return
    }
    // Basic email format validation
    if (!/.+\@.+\..+/.test(trimmedEmail)) {
      toast.error('Please enter a valid email address.')
      return
    }

    setIsLoading(true)
    const toastId = toast.loading('Sending reset link...')

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      })

      const data = await response.json()
      toast.dismiss(toastId) // Dismiss loading toast

      if (response.ok) {
        // Always show a generic success message for security
        toast.success(data.message || 'If an account exists, a reset link has been sent.', {
          duration: 5000,
        })
        setEmail('') // Clear email field
      } else {
        // Show backend error or a generic one
        toast.error(data.message || 'Failed to send reset link. Please try again.')
      }
    } catch (err) {
      toast.dismiss(toastId)
      toast.error('Network error. Please check your connection and try again.')
      console.error('Forgot Password Fetch Error:', err)
    } finally {
      setIsLoading(false)
    }
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
        {' '}
        {/* Added slight transparency */}
        <h1 className="text-black text-center text-3xl font-semibold mb-2">Forgot Password</h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          Enter your email address below. If an account exists, we'll send a link to reset your
          password.
        </p>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="text-gray-700 text-sm font-medium block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="auth-input pl-10" // Use consistent class
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <Mail size={20} />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="auth-button w-full" // Use consistent class
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              'Send Reset Link'
            )}
          </button>
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
          padding-right: 1rem; /* px-4 */
          outline: none;
          transition: ring 0.2s;
        }
        .auth-input:focus {
          ring: 2px;
          ring-color: #c8a98a;
        }
        .auth-button {
          background-color: #c8a98a;
          color: white;
          border-radius: 0.5rem; /* rounded-lg */
          padding-top: 0.75rem; /* py-3 */
          padding-bottom: 0.75rem;
          font-weight: 600; /* font-semibold */
          transition: background-color 0.2s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
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

export default ForgotPasswordPage
