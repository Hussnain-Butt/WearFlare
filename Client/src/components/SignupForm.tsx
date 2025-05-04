import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom' // Import useNavigate
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
  const navigate = useNavigate() // Initialize useNavigate

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000) // Keep toast visible for 3 seconds
  }

  // --- Validation function for Full Name ---
  const isValidFullName = (name: string): boolean => {
    // Check if the name is empty or consists only of digits
    const trimmedName = name.trim()
    if (!trimmedName) {
      return false // Treat empty or whitespace-only as invalid here too, caught later anyway
    }
    // Regex: ^\d+$ checks if the string consists ONLY of digits from start to end
    const numbersOnlyRegex = /^\d+$/
    return !numbersOnlyRegex.test(trimmedName) // Return true if it's NOT only numbers
  }
  // --- --- --- --- --- --- --- --- --- --- ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Trim inputs before validation
    const trimmedFullName = fullName.trim()
    const trimmedEmail = email.trim()

    // --- Basic empty field validation ---
    if (!trimmedFullName || !trimmedEmail || !password || !confirmPassword) {
      showToast('Please fill in all fields', 'error')
      return
    }

    // --- Full Name specific validation ---
    if (!isValidFullName(trimmedFullName)) {
      showToast('Full Name cannot contain only numbers and cannot be empty.', 'error')
      return // Stop submission
    }
    // --- --- --- --- --- --- --- --- ---

    // --- Password match validation ---
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }

    // --- Optional: Add email format validation ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      showToast('Please enter a valid email address', 'error')
      return
    }
    // --- --- --- --- --- --- --- --- ---

    // --- Optional: Add password strength validation (example: min 8 chars) ---
    if (password.length < 8) {
      showToast('Password must be at least 6 characters long', 'error')
      return
    }
    // --- --- --- --- --- --- --- --- ---

    setIsLoading(true)

    try {
      const response = await fetch(
        'https://backend-production-c8ff.up.railway.app/api/auth/signup',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Send trimmed values
          body: JSON.stringify({ fullName: trimmedFullName, email: trimmedEmail, password }),
        },
      )

      const data = await response.json()
      setIsLoading(false) // Stop loading indicator regardless of outcome

      if (response.ok) {
        showToast('Account created successfully! Redirecting to login...', 'success')
        // Clear form fields after successful signup
        setFullName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login') // Use navigate function
        }, 2000) // Redirect after 2 seconds
      } else {
        // Use the error message from the backend if available, otherwise a generic one
        showToast(data.message || 'Signup failed. Please try again.', 'error')
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Signup Error:', error) // Log the actual error for debugging
      showToast('An error occurred. Please check your connection or try again later.', 'error') // More user-friendly server error
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
            <label htmlFor="fullName" className="text-gray-700 text-sm font-medium block mb-2">
              {' '}
              {/* Added htmlFor */}
              Full Name
            </label>
            <input
              id="fullName" // Added id
              type="text"
              placeholder="Enter your full name"
              className="w-full bg-gray-100 text-black rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-[#c8a98a] transition"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              aria-required="true" // Accessibility
            />
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="text-gray-700 text-sm font-medium block mb-2">
              {' '}
              {/* Added htmlFor */}
              Email Address
            </label>
            <input
              id="email" // Added id
              type="email"
              placeholder="Enter your email"
              className="w-full bg-gray-100 text-black rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-[#c8a98a] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-required="true" // Accessibility
            />
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {' '}
            {/* Adjusted grid for smaller screens */}
            <div>
              <label htmlFor="password" className="text-gray-700 text-sm font-medium block mb-2">
                {' '}
                {/* Added htmlFor */}
                Password
              </label>
              <div className="relative">
                <input
                  id="password" // Added id
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  className="w-full bg-gray-100 text-black rounded-lg py-3 px-4 pr-10 outline-none focus:ring-2 focus:ring-[#c8a98a] transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-required="true" // Accessibility
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'} // Accessibility
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {/* Optional: Show password requirements hint */}
              <p className="text-xs text-gray-500 mt-1">Min. 6 characters</p>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-gray-700 text-sm font-medium block mb-2"
              >
                {' '}
                {/* Added htmlFor */}
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword" // Added id
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="********"
                  className="w-full bg-gray-100 text-black rounded-lg py-3 px-4 pr-10 outline-none focus:ring-2 focus:ring-[#c8a98a] transition"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  aria-required="true" // Accessibility
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  aria-label={
                    showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                  } // Accessibility
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-[#c8a98a] text-white rounded-lg py-3 font-semibold hover:bg-[#b3916b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8a98a] transition transform active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" // Added focus styles and disabled cursor
            disabled={isLoading}
          >
            {isLoading ? (
              <span
                className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-label="Loading"
              ></span> // Added aria-label
            ) : (
              'Create Account'
            )}
          </button>

          {/* Sign-in Link */}
          <p className="text-center text-sm text-gray-600">
            Have an account? {/* Added space */}
            <Link to="/login" className="text-[#c8a98a] font-medium hover:underline ml-1">
              Sign in
            </Link>
          </p>
        </form>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          // Add role="alert" for accessibility
          role="alert"
          aria-live="assertive" // Announces the message immediately
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-md text-white shadow-lg transition-opacity duration-300 ease-in-out ${
            toast ? 'opacity-100' : 'opacity-0' // Smooth fade
          } ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600' // Slightly darker colors
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}

export default SignupForm
