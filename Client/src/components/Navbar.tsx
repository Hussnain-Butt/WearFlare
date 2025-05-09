// Client/src/components/Navbar.tsx
import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Menu, X } from 'lucide-react'
import AuthContext from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import SearchOverlay from './SearchOverlay'
import Logo from '../assets/Logo.jpg'

const NavLink: React.FC<{
  to: string
  children: React.ReactNode
  onClick?: () => void
  isMobile?: boolean
}> = ({ to, children, onClick, isMobile = false }) => {
  const baseDesktopClasses =
    'relative text-sm lg:text-base font-medium text-trendzone-dark-blue hover:text-trendzone-light-blue transition-colors duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-trendzone-light-blue focus-visible:ring-offset-2 rounded-sm'
  const baseMobileClasses =
    'block px-3 py-2 rounded-md text-base font-medium text-trendzone-dark-blue hover:text-trendzone-light-blue hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus-visible:bg-gray-200 focus-visible:text-trendzone-dark-blue'

  return (
    <Link to={to} className={isMobile ? baseMobileClasses : baseDesktopClasses} onClick={onClick}>
      {children}
      {!isMobile && (
        <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-trendzone-light-blue group-hover:w-full transition-all duration-300"></span>
      )}
    </Link>
  )
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showSearchOverlay, setShowSearchOverlay] = useState(false)

  const authContext = useContext(AuthContext)
  if (!authContext) {
    throw new Error('AuthContext is undefined. Make sure AuthProvider is wrapping the App.')
  }
  const { user, logout } = authContext
  const { totalItems } = useCart()

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
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main flex container for navbar items */}
        <div className="relative flex items-center justify-between h-16 md:h-20">
          {/* ---- DESKTOP VIEW ITEMS ---- */}

          {/* Navlinks (Left on Desktop) */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/men">Men</NavLink>
            <NavLink to="/women">Women</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>

          {/* Logo (Center on Desktop - Absolutely Positioned) */}
          <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Link
              to="/"
              className="text-2xl md:text-3xl font-bold text-trendzone-dark-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-trendzone-light-blue focus-visible:ring-offset-2 rounded-sm"
            >
              <img src={Logo} alt="Logo" className="w-80" />
            </Link>
          </div>

          {/* Icons & Auth (Right on Desktop) */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-5">
            <button
              onClick={() => setShowSearchOverlay(true)}
              className="p-2 text-trendzone-dark-blue hover:text-trendzone-light-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-trendzone-light-blue rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Search Products"
            >
              <Search className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>

            <Link
              to="/cart"
              className="relative p-2 text-trendzone-dark-blue hover:text-trendzone-light-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-trendzone-light-blue rounded-full transition-all duration-200 hover:scale-110"
              aria-label={`Shopping Cart with ${totalItems} items`}
            >
              <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="bg-trendzone-dark-blue text-white px-4 py-2 lg:px-5 text-sm rounded-full hover:bg-trendzone-light-blue transition-all duration-200 shadow-sm font-medium hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-trendzone-light-blue focus-visible:ring-offset-2"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="border border-trendzone-dark-blue text-trendzone-dark-blue px-4 py-2 lg:px-5 text-sm rounded-full hover:bg-trendzone-dark-blue hover:text-white transition-all duration-200 shadow-sm font-medium hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-trendzone-dark-blue focus-visible:ring-offset-1"
              >
                Sign In
              </Link>
            )}
          </div>
          {/* ---- END DESKTOP VIEW ITEMS ---- */}

          {/* ---- MOBILE VIEW ITEMS ---- */}
          {/* Logo (Left on Mobile) */}
          <div className="md:hidden flex-shrink-0">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="text-2xl font-bold text-trendzone-dark-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-trendzone-light-blue focus-visible:ring-offset-2 rounded-sm"
            >
              WearFlare
            </Link>
          </div>

          {/* Mobile Menu Button & Cart (Right on Mobile) */}
          <div className="md:hidden flex items-center">
            <Link
              to="/cart"
              onClick={closeMobileMenu}
              className="relative p-2 mr-2 text-trendzone-dark-blue hover:text-trendzone-light-blue transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-trendzone-light-blue rounded-full"
              aria-label={`Shopping Cart with ${totalItems} items`}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="p-2 inline-flex items-center justify-center text-trendzone-dark-blue hover:text-trendzone-light-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-trendzone-light-blue rounded-md"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          {/* ---- END MOBILE VIEW ITEMS ---- */}
        </div>
      </div>

      {/* Mobile Menu - unchanged */}
      <div
        id="mobile-menu"
        className={`
          md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 py-4 z-30
          transition-all duration-300 ease-in-out transform
          ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'}
        `}
      >
        {isOpen && (
          <div className="px-4 space-y-3">
            <NavLink to="/" onClick={closeMobileMenu} isMobile>
              Home
            </NavLink>
            <NavLink to="/new-arrivals" onClick={closeMobileMenu} isMobile>
              New Arrivals
            </NavLink>
            <NavLink to="/shop" onClick={closeMobileMenu} isMobile>
              Shop
            </NavLink>
            <NavLink to="/contact" onClick={closeMobileMenu} isMobile>
              Contact
            </NavLink>
            <NavLink to="/about-us" onClick={closeMobileMenu} isMobile>
              About Us
            </NavLink>

            <div className="border-t border-gray-200 pt-4 mt-4"></div>

            <div className="flex items-center justify-between px-3">
              <button
                onClick={() => {
                  setShowSearchOverlay(true)
                  closeMobileMenu()
                }}
                className="p-2 text-trendzone-dark-blue hover:text-trendzone-light-blue transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-trendzone-light-blue rounded-full"
                aria-label="Search Products"
              >
                <Search className="h-6 w-6" />
              </button>

              <div className="flex-grow text-right">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="bg-trendzone-dark-blue text-white px-4 py-2 text-sm rounded-full hover:bg-trendzone-light-blue transition-all duration-200 shadow-sm font-medium hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-trendzone-light-blue focus-visible:ring-offset-2"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="bg-trendzone-dark-blue text-white px-4 py-2 text-sm rounded-full hover:bg-trendzone-light-blue transition-all duration-200 shadow-sm font-medium hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-trendzone-light-blue focus-visible:ring-offset-2"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {showSearchOverlay && <SearchOverlay onClose={() => setShowSearchOverlay(false)} />}
    </nav>
  )
}

export default Navbar
