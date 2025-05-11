// Client/src/components/Navbar.tsx
import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Menu, X } from 'lucide-react'
import AuthContext from '../context/AuthContext' // Path check karein
import { useCart } from '../context/CartContext' // Path check karein
import SearchOverlay from './SearchOverlay' // Path check karein
import Logo from '../assets/Logo.jpg' // Path check karein

const NavLink: React.FC<{
  to: string
  children: React.ReactNode
  onClick?: () => void
  isMobile?: boolean
}> = ({ to, children, onClick, isMobile = false }) => {
  const baseDesktopClasses =
    // text-trendzone-dark-blue -> text-foreground (for general readability) or text-primary
    // hover:text-trendzone-light-blue -> hover:text-accent (or hover:text-primary/80)
    'relative text-sm lg:text-base font-medium text-foreground hover:text-trendzone-dark-blue-text-hsl transition-colors duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm'
  const baseMobileClasses =
    // text-trendzone-dark-blue -> text-foreground
    // hover:text-trendzone-light-blue -> hover:text-accent
    // hover:bg-muted/50 - already good
    // focus-visible:bg-muted - already good
    // focus-visible:text-foreground - already good
    'block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-trendzone-dark-blue-text-hsl hover:bg-muted/50 transition-colors duration-200 focus:outline-none focus-visible:bg-muted focus-visible:text-foreground'

  return (
    <Link to={to} className={isMobile ? baseMobileClasses : baseDesktopClasses} onClick={onClick}>
      {children}
      {!isMobile && (
        // bg-trendzone-light-blue -> bg-accent (or bg-primary)
        <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-accent group-hover:w-full transition-all duration-300"></span>
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
    setIsOpen(false)
    navigate('/login')
  }

  const closeMobileMenu = () => {
    setIsOpen(false)
  }

  return (
    <nav className="bg-background shadow-md w-full sticky top-0 z-40">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 md:h-20">
          {/* ---- DESKTOP VIEW ITEMS ---- */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/men">Men</NavLink>
            <NavLink to="/women">Women</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>

          <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Link
              to="/"
              // text-trendzone-dark-blue -> text-primary (for brand color) or text-foreground
              className="text-2xl md:text-3xl font-bold text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              <img src={Logo} alt="Logo" className="w-80" />{' '}
              {/* Image logo is not themeable by CSS color */}
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4 lg:space-x-5">
            <button
              onClick={() => setShowSearchOverlay(true)}
              // text-trendzone-dark-blue -> text-foreground
              // hover:text-trendzone-light-blue -> hover:text-accent
              className="p-2 text-foreground hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Search Products"
            >
              <Search className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>

            <Link
              to="/cart"
              // text-trendzone-dark-blue -> text-foreground
              // hover:text-trendzone-light-blue -> hover:text-accent
              className="relative p-2 text-foreground hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full transition-all duration-200 hover:scale-110"
              aria-label={`Shopping Cart with ${totalItems} items`}
            >
              <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-destructive-foreground transform translate-x-1/2 -translate-y-1/2 bg-destructive rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <button
                onClick={handleLogout}
                // bg-trendzone-dark-blue -> bg-primary
                // text-primary-foreground is good
                // hover:bg-trendzone-light-blue -> hover:bg-primary/80 (or hover:bg-accent)
                className="bg-primary text-primary-foreground px-4 py-2 lg:px-5 text-sm rounded-full hover:bg-primary/80 transition-all duration-200 shadow-sm font-medium hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                // border-trendzone-dark-blue -> border-primary
                // text-trendzone-dark-blue -> text-primary
                // hover:bg-trendzone-dark-blue -> hover:bg-primary
                // hover:text-primary-foreground is good
                className="border border-primary text-primary px-4 py-2 lg:px-5 text-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-200 shadow-sm font-medium hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
              >
                Sign In
              </Link>
            )}
          </div>
          {/* ---- END DESKTOP VIEW ITEMS ---- */}

          {/* ---- MOBILE VIEW ITEMS ---- */}
          <div className="md:hidden flex-shrink-0">
            <Link
              to="/"
              onClick={closeMobileMenu}
              // text-trendzone-dark-blue -> text-primary (brand color) or text-foreground
              className="text-2xl font-bold text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              WearFlare
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <Link
              to="/cart"
              onClick={closeMobileMenu}
              // text-trendzone-dark-blue -> text-foreground
              // hover:text-trendzone-light-blue -> hover:text-accent
              className="relative p-2 mr-2 text-foreground hover:text-accent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
              aria-label={`Shopping Cart with ${totalItems} items`}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-destructive-foreground transform translate-x-1/2 -translate-y-1/2 bg-destructive rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              // text-trendzone-dark-blue -> text-foreground
              // hover:text-trendzone-light-blue -> hover:text-accent
              className="p-2 inline-flex items-center justify-center text-foreground hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
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

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`
          md:hidden absolute top-full left-0 w-full bg-background shadow-lg border-t border-border py-4 z-30
          transition-all duration-300 ease-in-out transform
          ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'}
        `}
      >
        {isOpen && (
          <div className="px-4 space-y-3">
            <NavLink to="/" onClick={closeMobileMenu} isMobile>
              Home
            </NavLink>
            <NavLink to="/men" onClick={closeMobileMenu} isMobile>
              Men
            </NavLink>
            <NavLink to="/women" onClick={closeMobileMenu} isMobile>
              Women
            </NavLink>
            <NavLink to="/contact" onClick={closeMobileMenu} isMobile>
              Contact
            </NavLink>
            <div className="border-t border-border pt-4 mt-4"></div>
            <div className="flex items-center justify-between px-3">
              <button
                onClick={() => {
                  setShowSearchOverlay(true)
                  closeMobileMenu()
                }}
                // text-trendzone-dark-blue -> text-foreground
                // hover:text-trendzone-light-blue -> hover:text-accent
                className="p-2 text-foreground hover:text-accent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
                aria-label="Search Products"
              >
                <Search className="h-6 w-6" />
              </button>

              <div className="flex-grow text-right">
                {user ? (
                  <button
                    onClick={handleLogout}
                    // bg-trendzone-dark-blue -> bg-primary
                    // text-primary-foreground is good
                    // hover:bg-trendzone-light-blue -> hover:bg-primary/80
                    className="bg-primary text-primary-foreground px-4 py-2 text-sm rounded-full hover:bg-primary/80 transition-all duration-200 shadow-sm font-medium hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    // bg-trendzone-dark-blue -> bg-primary
                    // text-primary-foreground is good
                    // hover:bg-trendzone-light-blue -> hover:bg-primary/80
                    className="bg-primary text-primary-foreground px-4 py-2 text-sm rounded-full hover:bg-primary/80 transition-all duration-200 shadow-sm font-medium hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
