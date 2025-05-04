// src/pages/ForgotPasswordPage.tsx
import React, { useState, FormEvent } from 'react'
import { Mail, Loader2 } from 'lucide-react' // Added Loader2
import bgsignin from '/bg-for-signin.png' // Ensure path is correct
import { toast, Toaster } from 'react-hot-toast'
import axios from 'axios' // Import axios

const API_BASE_URL = 'http://localhost:5000' // Or your deployed URL

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmedEmail = email.trim()

    if (!trimmedEmail || !/.+\@.+\..+/.test(trimmedEmail)) {
      toast.error('Please enter a valid email address.')
      return
    }

    setIsLoading(true)
    const toastId = toast.loading('Sending reset link...')

    try {
      // Use axios POST request
      const response = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, {
        email: trimmedEmail,
      })

      toast.success(response.data.message || 'If an account exists, a reset link has been sent.', {
        id: toastId,
        duration: 5000,
      })
      setEmail('') // Clear email field on success
    } catch (error: any) {
      toast.dismiss(toastId)
      console.error('Forgot Password Axios Error:', error.response?.data || error.message)
      const message =
        error.response?.data?.message || 'Failed to send reset link. Please try again later.'
      toast.error(message)
    } finally {
      setIsLoading(false) // ** Ensure loading state is always reset **
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
      <Toaster position="top-center" />
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg backdrop-blur-sm bg-opacity-95">
        <h1 className="text-black text-center text-3xl font-semibold mb-2">Forgot Password</h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          Enter your email. If an account exists, we'll send a reset link.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="forgot-email" className="form-label">
              Email Address
            </label>
            <div className="relative">
              <input
                id="forgot-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="auth-input pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <div className="input-icon left-3">
                <Mail size={20} />
              </div>
            </div>
          </div>

          <button type="submit" className="auth-button w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Send Reset Link'}
          </button>
        </form>
      </div>
      {/* Include shared auth styles if this component is rendered standalone */}
      <style jsx global>{`
        .form-label {
          display: block;
          margin-bottom: 0.375rem;
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
          padding-right: 1rem;
          outline: none;
          border: 1px solid #d1d5db;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .auth-input.pr-10 {
          padding-right: 2.5rem;
        }
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

export default ForgotPasswordPage
