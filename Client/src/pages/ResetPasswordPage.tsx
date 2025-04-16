import React, { useState, useEffect, FormEvent, useContext } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import bgsignin from '/bg-for-signin.png' // Reuse background
import AuthContext from '../context/AuthContext' // Import AuthContext if you want to log user in

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState<string>('')
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')
  const { token } = useParams<{ token: string }>() // Get token from URL
  const navigate = useNavigate()
  const authContext = useContext(AuthContext) // Get context if needed

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.')
      // Optionally redirect if no token
      // navigate('/login');
    }
  }, [token, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!password || !passwordConfirm) {
      setError('Please fill in both password fields.')
      return
    }

    if (password !== passwordConfirm) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (!token) {
      setError('Reset token is missing.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(
        `https://backend-production-c8ff.up.railway.app/api/auth/reset-password/${token}`, // Use your backend URL + token
        {
          method: 'PATCH', // Use PATCH as per backend route
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password, passwordConfirm }), // Send both passwords
        },
      )

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message || 'Password reset successfully! Redirecting to login...')
        // Optionally log the user in directly using the returned token
        if (data.token && authContext) {
          authContext.setUser({ token: data.token })
          sessionStorage.setItem('token', data.token) // Or localStorage based on preference
          setTimeout(() => navigate('/'), 2000) // Redirect to home after delay
        } else {
          setTimeout(() => navigate('/login'), 3000) // Redirect to login after delay
        }
      } else {
        setError(data.message || 'Failed to reset password. The link might be invalid or expired.')
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again later.')
      console.error('Reset Password Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-gray-100 py-10 px-5"
      style={{
        backgroundImage: `url(${bgsignin})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">
        <h1 className="text-black text-center text-3xl font-semibold mb-6">Reset Your Password</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* New Password Field */}
          <div>
            <label className="text-gray-700 text-sm font-medium block mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                className="w-full bg-gray-100 text-black rounded-lg py-3 px-4 pl-10 pr-10 outline-none focus:ring-2 focus:ring-[#c8a98a] transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Lock size={20} />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password Field */}
          <div>
            <label className="text-gray-700 text-sm font-medium block mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                placeholder="********"
                className="w-full bg-gray-100 text-black rounded-lg py-3 px-4 pl-10 pr-10 outline-none focus:ring-2 focus:ring-[#c8a98a] transition"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Lock size={20} />
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                aria-label={showPasswordConfirm ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#c8a98a] text-white rounded-lg py-3 font-semibold hover:bg-[#996F0B] transition transform active:scale-95 disabled:opacity-50 flex items-center justify-center"
            disabled={isLoading || !token}
          >
            {isLoading ? (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              'Reset Password'
            )}
          </button>

          {/* Messages */}
          {message && <p className="text-sm text-center text-green-600 mt-4">{message}</p>}
          {error && <p className="text-sm text-center text-red-600 mt-4">{error}</p>}

          {/* Link back to Login */}
          {!message &&
            !error && ( // Only show if no message is displayed
              <p className="text-center text-sm text-gray-600 mt-4">
                Remember your password?
                <Link to="/login" className="text-[#c8a98a] font-medium hover:underline ml-1">
                  Sign in
                </Link>
              </p>
            )}
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage
