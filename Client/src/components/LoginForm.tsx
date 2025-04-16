import React, { useState, useContext, FormEvent } from 'react'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext' // ✅ Import AuthContext
import bgsignin from '/bg-for-signin.png'

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [rememberMe, setRememberMe] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const authContext = useContext(AuthContext)
  if (!authContext) {
    throw new Error('AuthContext is undefined. Make sure AuthProvider is wrapping the app.')
  }
  const { setUser } = authContext
  const navigate = useNavigate()

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      showToast('Please fill in all fields', 'error')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(
        'https://backend-production-c8ff.up.railway.app/api/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password }),
        },
      )

      const data = await response.json()
      setIsLoading(false)

      if (response.ok) {
        showToast('Logged in successfully!', 'success')
        setUser({ token: data.token })

        // ✅ Store token in LocalStorage if Remember Me is checked
        if (rememberMe) {
          localStorage.setItem('token', data.token)
        } else {
          sessionStorage.setItem('token', data.token)
        }

        navigate('/')
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
        <h1 className="text-black text-center text-3xl font-semibold mb-6">Sign in</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <label className="text-gray-700 text-sm font-medium block mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-gray-100 text-black rounded-lg py-3 px-4 pl-10 outline-none focus:ring-2 focus:ring-[#c8a98a] transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <User size={20} />
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-gray-700 text-sm font-medium block mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                className="w-full bg-gray-100 text-black rounded-lg py-3 px-4 pl-10 pr-10 outline-none focus:ring-2 focus:ring-[#c8a98a] transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Lock size={20} />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm mt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-gray-600 text-sm">Remember Me</span>
            </label>

            <Link to="/forgot-password" className="text-[#7A68A6] text-sm hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Sign in Button */}
          <button
            type="submit"
            className="w-full bg-[#c8a98a] text-white rounded-lg py-3 font-semibold hover:bg-[#996F0B] transition transform active:scale-95 disabled:opacity-50 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              'Sign in'
            )}
          </button>

          {/* Sign-up Link */}
          <p className="text-center text-sm text-gray-600">
            No account?
            <Link to="/signup" className="text-[#c8a98a] font-medium hover:underline ml-1">
              Sign up
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

export default LoginForm
