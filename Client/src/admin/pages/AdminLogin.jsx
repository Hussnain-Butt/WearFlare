// src/admin/pages/AdminLogin.jsx (or .js, ensure consistency with filename)

import React, { useState } from 'react'
// Import the configured Axios instance
import apiClient from '../../api/axiosConfig' // Adjust the path as necessary
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react' // Or your preferred icon library

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false) // Optional: Add loading state
  const [error, setError] = useState('') // Optional: Add error state for feedback
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true) // Start loading
    setError('') // Clear previous errors

    try {
      // Use apiClient and relative path '/admin/login'
      // The baseURL ('https://backend-production-c8ff.up.railway.app/api') is added by apiClient
      const response = await apiClient.post('/admin/login', {
        username,
        password,
      })

      // Use consistent localStorage keys
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('userRole', 'admin') // Explicitly set role for admin

      setLoading(false) // Stop loading
      navigate('/admin/dashboard') // Navigate to admin dashboard
    } catch (err) {
      // Use 'err' consistently for error object
      setLoading(false) // Stop loading on error
      console.error('Admin Login Failed:', err.response?.data || err.message)
      // Set specific error message for user feedback
      const message = err.response?.data?.message || 'Invalid credentials or server error.'
      setError(message) // Store error message in state
      // Keep the alert or replace with state-based error display
      // alert(message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-[#c8a98a] mb-6">Admin Login</h2>

        {/* Optional: Display error message */}
        {error && (
          <p className="mb-4 text-center text-sm text-red-600 bg-red-100 p-2 rounded border border-red-200">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>
          {/* Username Field */}
          <div className="mb-4">
            <label
              htmlFor="admin-username"
              /* Use unique id */ className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="admin-username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required // Add basic validation
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-[#c8a98a]
                         focus:border-[#c8a98a]"
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label
              htmlFor="admin-password"
              /* Use unique id */ className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required // Add basic validation
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
                       ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} // Style for disabled state
          >
            {loading ? 'Logging in...' : 'Login'} {/* Change button text when loading */}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
