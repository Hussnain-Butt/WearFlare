// Client/src/components/Navbar.tsx
import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Menu, X } from 'lucide-react'
import AuthContext from '../context/AuthContext'
import { useCart } from '../context/CartContext' // <--- Import useCart
import SearchOverlay from './SearchOverlay'

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showSearchOverlay, setShowSearchOverlay] = useState(false)

  const authContext = useContext(AuthContext)
  if (!authContext) {
    // This error handling is good.
    throw new Error('AuthContext is undefined. Make sure AuthProvider is wrapping the App.')
  }
  const { user, logout } = authContext
  const { totalItems } = useCart() // <--- Get totalItems from CartContext

  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setIsOpen(false) // Close mobile menu on logout
    navigate('/login')
  }

  const closeMobileMenu = () => {
    setIsOpen(false)
  }

  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-40">
      {' '}
      {/* Make navbar sticky */}
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-10">
        {' '}
        {/* Adjusted padding */}
        <div className="flex items-center justify-between h-16 md:h-20">
          {' '}
          {/* Standard height */}
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={closeMobileMenu}>
              <img src="/logoWeb.png" className="h-10 md:h-12 w-auto" alt="WearFlare Logo" />{' '}
              {/* Use height control */}
            </Link>
          </div>
          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 flex-grow justify-center">
            <Link
              to="/"
              className="text-sm lg:text-base font-medium text-gray-700 hover:text-[#c8a98a] transition-colors duration-200"
            >
              Home
            </Link>
            {/* <Link
              to="/shop"
              className="text-sm lg:text-base font-medium text-gray-700 hover:text-[#c8a98a] transition-colors duration-200"
            >
              Shop
            </Link> */}
            <Link
              to="/men"
              className="text-sm lg:text-base font-medium text-gray-700 hover:text-[#c8a98a] transition-colors duration-200"
            >
              Men
            </Link>
            <Link
              to="/women"
              className="text-sm lg:text-base font-medium text-gray-700 hover:text-[#c8a98a] transition-colors duration-200"
            >
              Women
            </Link>
            <Link
              to="/contact"
              className="text-sm lg:text-base font-medium text-gray-700 hover:text-[#c8a98a] transition-colors duration-200"
            >
              Contact Us
            </Link>
            {/* Add other links similarly */}
          </div>
          {/* Icons & Signup Button (Desktop) */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {/* Search Button */}
            <button
              onClick={() => setShowSearchOverlay(true)}
              className="p-2 text-gray-600 hover:text-[#c8a98a] focus:outline-none transition-colors duration-200"
              aria-label="Search Products"
            >
              <Search className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>

            {/* Cart Link with Badge */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-[#c8a98a] transition-colors duration-200"
              aria-label={`Shopping Cart with ${totalItems} items`}
            >
              <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth Button */}
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-[#c8a98a] text-white px-3 py-1.5 lg:px-4 lg:py-2 text-sm rounded-md hover:bg-[#9e750a] transition-colors duration-200 shadow-sm"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/signup"
                className="bg-[#c8a98a] text-white px-3 py-1.5 lg:px-4 lg:py-2 text-sm rounded-md hover:bg-[#9e750a] transition-colors duration-200 shadow-sm"
              >
                Signup
              </Link>
            )}
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {/* Mobile Cart Icon - Placed before Menu button for better flow */}
            <Link
              to="/cart"
              onClick={closeMobileMenu}
              className="relative p-2 mr-2 text-gray-600 hover:text-[#c8a98a] transition-colors duration-200"
              aria-label={`Shopping Cart with ${totalItems} items`}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            {/* Mobile Menu Toggle */}
            <button
              className="p-2 inline-flex items-center justify-center text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 py-4 z-30"
        >
          <div className="px-4 space-y-3">
            {/* Mobile Nav Links */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#c8a98a] hover:bg-gray-50"
            >
              Home
            </Link>
            {/* <Link
              to="/shop"
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#c8a98a] hover:bg-gray-50"
            >
              Shop
            </Link> */}
            <Link
              to="/men"
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#c8a98a] hover:bg-gray-50"
            >
              Men
            </Link>
            <Link
              to="/women"
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#c8a98a] hover:bg-gray-50"
            >
              Women
            </Link>
            <Link
              to="/contact"
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#c8a98a] hover:bg-gray-50"
            >
              Contact Us
            </Link>
            {/* Add other links similarly */}

            {/* Divider */}
            <div className="border-t border-gray-200 pt-4 mt-4"></div>

            {/* Mobile Icons & Signup */}
            <div className="flex items-center justify-between px-3">
              {/* Mobile Search Button */}
              <button
                onClick={() => {
                  setShowSearchOverlay(true)
                  closeMobileMenu()
                }}
                className="p-2 text-gray-600 hover:text-[#c8a98a] transition-colors duration-200"
                aria-label="Search Products"
              >
                <Search className="h-6 w-6" />
              </button>

              {/* Mobile Auth Button - Takes remaining space */}
              <div className="flex-grow text-right">
                {user ? (
                  <button
                    onClick={handleLogout} // Already closes menu
                    className="bg-red-600 text-white px-4 py-2 text-sm rounded-md hover:bg-red-700 transition-colors duration-200 shadow-sm"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/signup"
                    onClick={closeMobileMenu}
                    className="bg-[#c8a98a] text-white px-4 py-2 text-sm rounded-md hover:bg-[#9e750a] transition-colors duration-200 shadow-sm"
                  >
                    Signup
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Search Overlay Render */}
      {showSearchOverlay && <SearchOverlay onClose={() => setShowSearchOverlay(false)} />}
    </nav>
  )
}

export default Navbar
