// src/ProductManager/pages/ManagerLogin.jsx
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react' // Add Loader2
import { toast, Toaster } from 'react-hot-toast' // Use toast for feedback

// Use environment variable for API base URL if possible, otherwise hardcode
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://backend-production-c8ff.up.railway.app'

const ManagerLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false) // Loading state
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      toast.error('Please enter both username and password.')
      return
    }
    setLoading(true)
    const toastId = toast.loading('Logging in...')

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/manager/login`, // Correct URL (removed extra slash)
        {
          username,
          password,
        },
      )
      // Use a specific key for manager token
      localStorage.setItem('managerToken', response.data.token)
      toast.success('Login successful!', { id: toastId })

      // Correct Navigation Path
      navigate('/productmanager/products') // Navigate to the manager's product page
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message)
      const message = error.response?.data?.message || 'Login failed. Check credentials.'
      toast.error(message, { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-[#c8a98a] mb-6">
          Product Manager Login
        </h2>
        <form onSubmit={handleLogin}>
          {/* Username Field */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading} // Disable when loading
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg
                                       focus:outline-none focus:ring-2 focus:ring-[#c8a98a]
                                       focus:border-[#c8a98a]"
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading} // Disable when loading
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                                           focus:outline-none focus:ring-2 focus:ring-[#c8a98a]
                                           focus:border-[#c8a98a] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading} // Disable when loading
                className="absolute inset-y-0 right-0 flex items-center px-3 text-sm
                                           text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading} // Disable button when loading
            className="w-full py-2 px-4 bg-[#c8a98a] text-white font-semibold
                                   rounded-lg shadow-md hover:bg-[#a1846b] focus:outline-none
                                   focus:ring-2 focus:ring-[#c8a98a] transition-colors
                                   flex items-center justify-center disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ManagerLogin
