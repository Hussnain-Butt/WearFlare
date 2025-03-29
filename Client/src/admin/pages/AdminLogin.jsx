// pages/AdminLogin.js
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false) // For toggling password visibility
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        username,
        password,
      })
      localStorage.setItem('adminToken', response.data.token)
      navigate('/admin/dashboard')
    } catch (error) {
      console.error(error)
      alert('Invalid credentials')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* 
        - 'px-4' se mobile screens par side se spacing rahegi.
        - 'flex items-center justify-center' se horizontally & vertically center align hoga.
      */}
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg border border-gray-200">
        {/* 
          - max-w-md se container ki width control hogi. 
          - Agar aapko zyada wide form chahiye to 'max-w-lg' ya 'max-w-xl' use kar sakte hain.
        */}
        <h2 className="text-2xl font-bold text-center text-[#c8a98a] mb-6">Admin Login</h2>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-[#c8a98a] 
                           focus:border-[#c8a98a] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center  text-sm 
                           text-gray-600 hover:text-gray-800 focus:outline-none px-3"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#c8a98a] text-white font-semibold 
                       rounded-lg shadow-md hover:bg-[#a1846b] focus:outline-none 
                       focus:ring-2 focus:ring-[#c8a98a] transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
