import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import bgsignin from '/bg-for-signin.png'

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email || !password || !confirmPassword) {
      showToast('Please fill in all fields', 'error')
      return
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(
        'https://backend-production-c8ff.up.railway.app/api/auth/signup',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, email, password }),
        },
      )

      const data = await response.json()
      setIsLoading(false)
      if (response.ok) {
        showToast('Account created successfully!', 'success')
      } else {
        showToast(data.message, 'error')
      }
    } catch (error) {
      setIsLoading(false)
      showToast('Server error', 'error')
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
        <h1 className="text-black text-center text-3xl font-semibold mb-6">Sign up</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="text-gray-700 text-sm font-medium block mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full bg-gray-100 text-black rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-[#B8860B] transition"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="text-gray-700 text-sm font-medium block mb-2">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-gray-100 text-black rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-[#B8860B] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700 text-sm font-medium block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  className="w-full bg-gray-100 text-black rounded-lg py-3 px-4 pr-10 outline-none focus:ring-2 focus:ring-[#B8860B] transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium block mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="********"
                  className="w-full bg-gray-100 text-black rounded-lg py-3 px-4 pr-10 outline-none focus:ring-2 focus:ring-[#B8860B] transition"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-[#B8860B] text-white rounded-lg py-3 font-semibold hover:bg-[#996F0B] transition transform active:scale-95 flex items-center justify-center disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Sign-in Link */}
          <p className="text-center text-sm text-gray-600">
            Have an account?
            <Link to="/login" className="text-[#B8860B] font-medium hover:underline ml-1">
              Sign in
            </Link>
          </p>
        </form>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 px-4 py-2 rounded-md text-white shadow-lg ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}

export default SignupForm
