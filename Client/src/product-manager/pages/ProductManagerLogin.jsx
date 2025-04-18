// src/product-manager/pages/ProductManagerLogin.jsx

import React, { useState } from 'react'
// Import the configured Axios instance
import apiClient from '../../api/axiosConfig' // Adjust path as necessary
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react' // Or your icon library

const ProductManagerLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false) // Loading state
  const [error, setError] = useState('') // Error message state
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true) // Start loading
    setError('') // Clear previous errors

    try {
      // Use apiClient and relative path '/pm/login'
      const response = await apiClient.post('/pm/login', {
        username,
        password,
      })

      // Use consistent localStorage keys needed by ProtectedRoute
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('userRole', 'productManager') // Explicitly set role

      setLoading(false) // Stop loading
      navigate('/pm/products') // Navigate to PM dashboard (or '/pm')
    } catch (err) {
      // Handle potential errors
      setLoading(false) // Stop loading on error
      console.error('Product Manager Login Failed:', err.response?.data || err.message)
      // Set specific error message for user feedback
      const message = err.response?.data?.message || 'Invalid credentials or server error.'
      setError(message) // Store error message in state
    }
  }

  // Form structure similar to AdminLogin
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-[#c8a98a] mb-6">
          Product Manager Login
        </h2>

        {/* Display error message if present */}
        {error && (
          <p className="mb-4 text-center text-sm text-red-600 bg-red-100 p-2 rounded border border-red-200">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>
          {/* Username Input */}
          <div className="mb-4">
            <label
              htmlFor="pm-username"
              /* Unique id */ className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="pm-username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required // Basic validation
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-[#c8a98a]
                         focus:border-[#c8a98a]"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="pm-password"
              /* Unique id */ className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="pm-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required // Basic validation
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-[#c8a98a]
                           focus:border-[#c8a98a] pr-10" // Space for icon
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center text-sm
                           text-gray-600 hover:text-gray-800 focus:outline-none px-3"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading} // Disable button when loading
            className={`w-full py-2 px-4 bg-[#c8a98a] text-white font-semibold
                       rounded-lg shadow-md hover:bg-[#a1846b] focus:outline-none
                       focus:ring-2 focus:ring-[#c8a98a] transition-colors
                       ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} // Disabled styling
          >
            {loading ? 'Logging in...' : 'Login'} {/* Change text when loading */}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProductManagerLogin
