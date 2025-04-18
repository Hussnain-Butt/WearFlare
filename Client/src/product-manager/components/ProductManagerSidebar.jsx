// src/product-manager/components/ProductManagerSidebar.jsx

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// Apne pasand ke icons import karein
import { FaBook, FaBars, FaTimes } from 'react-icons/fa'
import { MdBorderColor } from 'react-icons/md'

const ProductManagerSidebar = () => {
  // State logic for expansion and mobile view
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // Effect to handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Function to toggle sidebar expansion
  const toggleSidebar = () => setIsExpanded(!isExpanded)

  // Determine sidebar width based on state
  const sidebarWidth = !isMobile
    ? isExpanded
      ? 'w-64' // Expanded width
      : 'w-20' // Collapsed width
    : 'w-20' // Mobile default width

  return (
    // Sidebar container with styling similar to AdminSidebar
    <aside
      className={`bg-[#c8a98a] text-white h-auto flex flex-col transition-all duration-300
                  ${sidebarWidth}
                  ${(!isMobile && !isExpanded) || isMobile ? 'items-center' : ''}`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between w-full px-4 py-4 border-b border-[#a1846b]">
        {/* Conditional Rendering for Title/Placeholder */}
        {!isMobile && isExpanded ? (
          // If not mobile and expanded, show the title
          <h1 className="text-xl font-bold">Product Manager</h1>
        ) : (
          // Otherwise, show an empty centered div (placeholder when collapsed/mobile)
          <div className="flex items-center justify-center w-full"></div>
        )}

        {/* Toggle Button (Only on Desktop) */}
        {!isMobile && (
          <button onClick={toggleSidebar} className="text-2xl ml-auto pl-2">
            {' '}
            {/* Use ml-auto to push button right */}
            {isExpanded ? <FaTimes /> : <FaBars />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto w-full mt-4">
        <ul className="flex flex-col space-y-2">
          {/* Products Link */}
          <li>
            <Link
              to="/pm/products" // Correct path for PM products
              className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#6b5745]
                          transition-all duration-300
                          ${!isMobile && isExpanded ? 'justify-start' : 'justify-center'}`} // Adjust justification
            >
              <FaBook className="text-xl" /> {/* Icon */}
              {/* Show text only if not mobile and expanded */}
              {!isMobile && isExpanded && <span>Products</span>}
            </Link>
          </li>

          {/* Orders Link */}
          <li>
            <Link
              to="/pm/orders" // Correct path for PM orders
              className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#6b5745]
                          transition-all duration-300
                          ${!isMobile && isExpanded ? 'justify-start' : 'justify-center'}`} // Adjust justification
            >
              <MdBorderColor className="text-xl" /> {/* Icon */}
              {/* Show text only if not mobile and expanded */}
              {!isMobile && isExpanded && <span>Orders</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default ProductManagerSidebar
