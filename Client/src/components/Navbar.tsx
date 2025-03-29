import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom' // ✅ Import useNavigate
import { Search, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react'
import AuthContext from '../context/AuthContext' // ✅ Import AuthContext
import logo from '/logoWeb.png'
// import logos from "/logo.jpg"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const authContext = useContext(AuthContext)
  if (!authContext) {
    throw new Error('AuthContext is undefined. Make sure AuthProvider is wrapping the App.')
  }
  const { user, logout } = authContext // ✅ Get user and logout function from AuthContext

  const navigate = useNavigate() // ✅ Now use useNavigate() here

  const handleLogout = () => {
    logout()
    navigate('/login') // ✅ Redirect to login page after logout
  }

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="max-w-10xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className=" mb-3">
            <img src={logo} className="w-[90px]" alt="" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 flex-grow justify-center">
            <Link to="/" className="font-bold hover:text-[#B8860B] capitalize">
              Home
            </Link>
            <Link to="/shop" className="font-bold hover:text-[#B8860B] capitalize">
              Shop
            </Link>
            <Link to="/men" className="font-bold hover:text-[#B8860B] capitalize">
              Men
            </Link>
            <Link to="/women" className="font-bold hover:text-[#B8860B] capitalize">
              Women
            </Link>

            <Link
              to="/3d-avatar-customization"
              className="font-bold hover:text-[#B8860B] capitalize"
            >
              3D Avatar Customization
            </Link>
            {/* <Link to="/virtual-fitting-room-creation" className="font-bold hover:text-[#B8860B] capitalize">Virtual Fitting Room Creation</Link>
            <Link to="/virtual-fitting-room" className="font-bold hover:text-[#B8860B] capitalize">Virtual Fitting Room</Link> */}

            <Link to="/contact" className="font-bold hover:text-[#B8860B] capitalize">
              Contact Us{' '}
            </Link>
          </div>

          {/* Icons & Signup Button */}
          <div className="hidden md:flex gap-6 items-center flex-shrink-0">
            <Link to="/search">
              <Search className="h-6 w-6 hover:text-[#B8860B]" />
            </Link>
            <Link to="/cart">
              <ShoppingCart className="h-6 w-6 hover:text-[#B8860B]" />
            </Link>

            {user ? (
              // 🔴 Logout Button when user is logged in
              <button
                onClick={handleLogout}
                className="bg-[#B8860B] text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            ) : (
              // 🟢 Signup Button when user is NOT logged in
              <Link
                to="/signup"
                className="bg-[#B8860B] text-white px-4 py-2 rounded-md hover:bg-[#996F0B] transition"
              >
                Signup
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col gap-8 pb-10 mt-10">
            <Link
              to="/"
              className="font-bold hover:text-[#B8860B] capitalize hover:bg-slate-200 w-full py-3 px-5 transition-all"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="font-bold hover:text-[#B8860B] capitalize hover:bg-slate-200 w-full py-3 px-5 transition-all"
            >
              Shop
            </Link>
            <Link
              to="/men"
              className="font-bold hover:text-[#B8860B] capitalize hover:bg-slate-200 w-full py-3 px-5 transition-all"
            >
              Men
            </Link>
            <Link
              to="/women"
              className="font-bold hover:text-[#B8860B] capitalize hover:bg-slate-200 w-full py-3 px-5 transition-all"
            >
              Women
            </Link>

            <Link
              to="/3d-avatar-customization"
              className="font-bold hover:text-[#B8860B] capitalize hover:bg-slate-200 w-full py-3 px-5 transition-all"
            >
              3D Avatar Customization
            </Link>
            {/* <Link to="/virtual-fitting-room-creation" className="font-bold hover:text-[#B8860B] capitalize hover:bg-slate-200 w-full py-3 px-5 transition-all">Virtual Fitting Room Creation</Link>
            <Link to="/virtual-fitting-room" className="font-bold hover:text-[#B8860B] capitalize hover:bg-slate-200 w-full py-3 px-5 transition-all">Virtual Fitting Room</Link> */}

            <Link
              to="/contact"
              className="font-bold hover:text-[#B8860B] capitalize hover:bg-slate-200 w-full py-3 px-5 transition-all"
            >
              Contact Us
            </Link>

            {/* Mobile Icons & Signup */}
            <div className="flex gap-6 mt-4 px-5">
              <Link to="/search">
                <Search className="h-6 w-6 hover:text-[#B8860B]" />
              </Link>
              <Link to="/cart">
                <ShoppingCart className="h-6 w-6 hover:text-[#B8860B]" />
              </Link>

              {user ? (
                // 🔴 Logout Button when user is logged in
                <button
                  onClick={logout}
                  className="bg-[#B8860B] text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  Logout
                </button>
              ) : (
                // 🟢 Signup Button when user is NOT logged in
                <Link
                  to="/signup"
                  className="bg-[#B8860B] text-white px-4 py-2 rounded-md hover:bg-[#996F0B] transition"
                >
                  Signup
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
