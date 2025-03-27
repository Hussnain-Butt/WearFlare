// pages/AdminLogin.js
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/admin/login', { username, password })
      localStorage.setItem('adminToken', response.data.token)
      navigate('/admin/dashboard')
    } catch (error) {
      console.error(error)
      alert('Invalid credentials')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-6xl max-w-sm p-8 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-[#c8a98a] mb-6">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8a98a] focus:border-[#c8a98a]"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8a98a] focus:border-[#c8a98a]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#c8a98a] text-white font-semibold rounded-lg shadow-md hover:bg-[#a1846b] focus:outline-none focus:ring-2 focus:ring-[#c8a98a] transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
