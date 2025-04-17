// AdminSidebar.js
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaUser,
  FaBook,
  FaMoneyBill,
  FaChartBar,
} from 'react-icons/fa'
import { MdBorderColor } from 'react-icons/md'
import { GiLoveLetter } from 'react-icons/gi'
import { MdUpcoming } from 'react-icons/md'

const AdminSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false) // Expand/Collapse State
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768) // Mobile Detection

  // ✅ Listen for screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ✅ Toggle sidebar
  const toggleSidebar = () => setIsExpanded(!isExpanded)

  // ** Decide how the sidebar should look on mobile vs. desktop
  //    (You can tweak this logic if you want a different behavior on mobile.)
  //    - Example: if on mobile, we can keep it always collapsed unless user explicitly toggles it.
  const sidebarWidth = !isMobile
    ? isExpanded
      ? 'w-64' // Expanded (desktop)
      : 'w-20' // Collapsed (desktop)
    : 'w-20' // Mobile by default collapsed

  return (
    <aside
      className={`bg-[#c8a98a] text-white h-auto flex flex-col transition-all duration-300 
                  ${sidebarWidth} 
                  ${(!isMobile && !isExpanded) || isMobile ? 'items-center' : ''}`}
    >
      {/* Header / Brand */}
      <div className="flex items-center justify-between w-full px-4 py-4 border-b border-[#a1846b]">
        {!isMobile && isExpanded ? (
          // Expanded: Show brand name
          <h1 className="text-xl font-bold">Admin Panel</h1>
        ) : (
          // Collapsed: Show icon in center
          <div className="flex items-center justify-center w-full"></div>
        )}

        {/* Desktop toggle button (top-right) */}
        {!isMobile && (
          <button onClick={toggleSidebar} className="text-2xl ml-2">
            {isExpanded ? <FaTimes /> : <FaBars />}
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto w-full mt-4">
        <ul className="flex flex-col space-y-2">
          <li>
            <Link
              to="/admin/dashboard/products"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#6b5745] 
                          transition-all duration-300 
                          ${!isMobile && isExpanded ? 'justify-start' : 'justify-center'}`}
            >
              <FaBook className="text-xl" />
              {!isMobile && isExpanded && <span>Products</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default AdminSidebar
