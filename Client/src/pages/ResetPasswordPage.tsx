// src/pages/ResetPasswordPage.tsx
import React, { useState, useEffect, FormEvent, useContext } from 'react'
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react' // Added Loader2
import { useParams, useNavigate, Link } from 'react-router-dom'
import bgsignin from '/bg-for-signin.png' // Ensure path is correct
import AuthContext from '../context/AuthContext' // Adjust path if needed
import { toast, Toaster } from 'react-hot-toast'
import axios from 'axios' // Import axios

const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app/' // Or your deployed URL

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState<string>('')
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { token } = useParams<{ token: string }>() // Token from URL
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token link.')
      setTimeout(() => navigate('/login'), 3000)
    }
  }, [token, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

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
      toast.error('Reset token is missing.')
      return
    }

    setIsLoading(true)
    const toastId = toast.loading('Resetting password...')

    try {
      // Use axios PATCH request
      const response = await axios.patch(
        `${API_BASE_URL}/api/auth/reset-password/${token}`, // Send token in URL
        { password, passwordConfirm }, // Send passwords in body
      )

      toast.success(response.data.message || 'Password reset successfully!', {
        id: toastId,
        duration: 4000,
      })

      // Optional: Auto-login
      if (response.data.token && authContext?.setUser) {
        authContext.setUser({ token: response.data.token /* other user details */ })
        sessionStorage.setItem('token', response.data.token) // Use session or local storage
        sessionStorage.setItem('userEmail', response.data.email)
        toast.success('Logged in. Redirecting...')
        setTimeout(() => navigate('/'), 2000) // Redirect home
      } else {
        toast.success('Redirecting to login...')
        setTimeout(() => navigate('/login'), 3000) // Redirect login
      }
    } catch (error: any) {
      toast.dismiss(toastId)
      console.error('Reset Password Axios Error:', error.response?.data || error.message)
      const message =
        error.response?.data?.message || 'Failed to reset password. Link may be invalid or expired.'
      toast.error(message)
    } finally {
      setIsLoading(false) // ** Ensure loading state is always reset **
    }
  }

  // Don't render form if token is clearly missing initially
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <Toaster />
        Redirecting...
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
      <Toaster position="top-center" />
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg backdrop-blur-sm bg-opacity-95">
        <h1 className="text-black text-center text-3xl font-semibold mb-6">Reset Your Password</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* New Password Field */}
          <div>
            <label htmlFor="reset-password" className="form-label">
              New Password
            </label>
            <div className="relative">
              <input
                id="reset-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password (min. 6 chars)"
                className="auth-input pl-10 pr-10"
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
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password Field */}
          <div>
            <label htmlFor="reset-password-confirm" className="form-label">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="reset-password-confirm"
                type={showPasswordConfirm ? 'text' : 'password'}
                placeholder="Confirm new password"
                className="auth-input pl-10 pr-10"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                disabled={isLoading}
              />
              <div className="input-icon left-3">
                <Lock size={20} />
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="password-toggle-button"
                aria-label="Toggle confirm password visibility"
              >
                {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="auth-button w-full mt-6" disabled={isLoading || !token}>
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Reset Password'}
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
      {/* Include shared auth styles if necessary */}
      <style jsx global>{`
        /* ... paste the styles from LoginForm.tsx if needed ... */
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

export default ResetPasswordPage
