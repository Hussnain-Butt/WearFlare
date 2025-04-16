import React, { useState, FormEvent } from 'react'
import { Mail } from 'lucide-react'
import bgsignin from '/bg-for-signin.png' // Reuse background or use a different one

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!email) {
      setError('Please enter your email address.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(
        'https://backend-production-c8ff.up.railway.app/api/auth/forgot-password', // Use your backend URL
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        },
      )

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message || 'If an account exists, a reset link has been sent.')
        setEmail('') // Clear email field on success
      } else {
        setError(data.message || 'An error occurred. Please try again.')
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again later.')
      console.error('Forgot Password Error:', err)
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
        <h1 className="text-black text-center text-3xl font-semibold mb-2">Forgot Password</h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="text-gray-700 text-sm font-medium block mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full bg-gray-100 text-black rounded-lg py-3 px-4 pl-10 outline-none focus:ring-2 focus:ring-[#c8a98a] transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required // Basic HTML validation
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Mail size={20} />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#c8a98a] text-white rounded-lg py-3 font-semibold hover:bg-[#996F0B] transition transform active:scale-95 disabled:opacity-50 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              'Send Reset Link'
            )}
          </button>

          {/* Messages */}
          {message && <p className="text-sm text-center text-green-600 mt-4">{message}</p>}
          {error && <p className="text-sm text-center text-red-600 mt-4">{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
