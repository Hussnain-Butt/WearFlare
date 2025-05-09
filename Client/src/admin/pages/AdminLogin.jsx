// src/admin/pages/AdminLogin.jsx (or .tsx)
import React, { useState } from 'react'
import apiClient from '../../api/axiosConfig' // Adjust the path as necessary
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await apiClient.post('/admin/login', {
        username,
        password,
      })
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('userRole', 'admin')
      setLoading(false)
      navigate('/admin/dashboard')
    } catch (err) {
      setLoading(false)
      console.error('Admin Login Failed:', err.response?.data || err.message)
      const message = err.response?.data?.message || 'Invalid credentials or server error.'
      setError(message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-xl">
        <h2 className="text-3xl font-semibold text-center text-trendzone-dark-blue">Admin Login</h2>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-center text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Field */}
          <div>
            <label htmlFor="admin-username" className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              id="admin-username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={`w-full px-4 py-2.5 mt-1 border border-gray-300 rounded-lg
                         placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-trendzone-light-blue 
                         focus:border-trendzone-light-blue transition-shadow duration-150 ease-in-out`}
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg
                           placeholder-gray-400 pr-10
                           focus:outline-none focus:ring-2 focus:ring-trendzone-light-blue 
                           focus:border-trendzone-light-blue transition-shadow duration-150 ease-in-out`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-0 flex items-center px-3
                           text-gray-500 hover:text-trendzone-dark-blue focus:outline-none 
                           transition-colors duration-150`}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 px-4 bg-trendzone-dark-blue text-white font-semibold 
                       rounded-lg shadow-sm hover:bg-admin-primary-hover focus:outline-none {/* Kept admin-primary-hover for darker shade, or you can define trendzone-dark-blue-hover */}
                       focus:ring-2 focus:ring-offset-2 focus:ring-trendzone-light-blue 
                       transition-all duration-150 ease-in-out
                       ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
