// src/ProductManager/components/ManagerSidebar.jsx
import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes, FaBoxOpen, FaSignOutAlt } from 'react-icons/fa' // Example icons

const ManagerSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(window.innerWidth >= 768) // Expanded by default on desktop
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const location = useLocation() // To highlight active link
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Adjust expansion based on resize (optional, keeps state consistent)
      if (!mobile && !isExpanded) setIsExpanded(true) // Auto-expand on desktop resize if collapsed
      if (mobile && isExpanded) setIsExpanded(false) // Auto-collapse on mobile resize if expanded
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isExpanded]) // Re-run effect if isExpanded changes

  const toggleSidebar = () => setIsExpanded(!isExpanded)

  const handleLogout = () => {
    localStorage.removeItem('managerToken') // Clear the token
    navigate('/productmanager') // Redirect to login
    // Optionally: Show a toast notification for logout
  }

  const sidebarWidth = isExpanded ? 'w-60' : 'w-20' // Adjusted width
  const linkBaseClass =
    'flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#a1846b] transition-all duration-200'
  const linkActiveClass = 'bg-[#6b5745] shadow-inner' // Active link style

  // Function to check if a link is active (handles nested routes)
  const isActive = (path) => location.pathname.startsWith(`/productmanager${path}`)

  return (
    <aside
      className={`bg-[#c8a98a] text-white h-screen sticky top-0 flex flex-col transition-all duration-300 ${sidebarWidth} ${
        !isExpanded ? 'items-center' : ''
      }`}
    >
      {/* Header / Brand / Toggle */}
      <div
        className={`flex items-center justify-between w-full px-4 py-4 border-b border-[#a1846b] ${
          !isExpanded ? 'justify-center' : ''
        }`}
      >
        {isExpanded && <h1 className="text-xl font-bold whitespace-nowrap">Manager Panel</h1>}
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="text-2xl p-1 focus:outline-none focus:ring-2 focus:ring-white rounded"
        >
          {isExpanded ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto w-full mt-6 px-3 space-y-3">
        {/* Products Link */}
        <Link
          to="/productmanager/products" // Correct path
          className={`${linkBaseClass} ${isActive('/products') ? linkActiveClass : ''} ${
            !isExpanded ? 'justify-center' : 'justify-start'
          }`}
          title="Products"
        >
          <FaBoxOpen className="text-xl flex-shrink-0" />
          {isExpanded && <span className="font-medium">Products</span>}
        </Link>

        {/* Add more manager links here if needed */}
        {/* Example:
                <Link
                    to="/productmanager/orders" // Example path
                    className={`${linkBaseClass} ${isActive('/orders') ? linkActiveClass : ''} ${!isExpanded ? 'justify-center' : 'justify-start'}`}
                    title="Orders" // Tooltip for collapsed view
                >
                    <FaShoppingCart className="text-xl flex-shrink-0" />
                    {isExpanded && <span className="font-medium">Orders</span>}
                </Link>
                */}
      </nav>

      {/* Footer / Logout */}
      <div className="mt-auto p-3 border-t border-[#a1846b]">
        <button
          onClick={handleLogout}
          className={`${linkBaseClass} w-full text-red-200 hover:bg-red-800 hover:text-white ${
            !isExpanded ? 'justify-center' : 'justify-start'
          }`}
          title="Logout"
        >
          <FaSignOutAlt className="text-xl flex-shrink-0" />
          {isExpanded && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default ManagerSidebar
