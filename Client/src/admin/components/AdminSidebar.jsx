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
import { GiLoveLetter } from 'react-icons/gi'
import { MdUpcoming } from 'react-icons/md'

const AdminSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false) // ✅ Toggle State
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768) // ✅ Detect Mobile Screens

  // ✅ Detect Screen Resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      className={` text-white h-auto flex flex-col py-16 transition-all duration-300 bg-[#c8a98a] h-screen
        ${isMobile ? 'w-20 items-center' : isExpanded ? 'w-72 px-6' : 'w-20 items-center'}
      `}
    >
      {/* ✅ Toggle Button */}
      {!isMobile && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full flex ${isExpanded ? 'justify-end' : 'justify-center'} mb-6`}
        >
          {isExpanded ? (
            <FaTimes className="text-2xl cursor-pointer" />
          ) : (
            <FaBars className="text-2xl cursor-pointer" />
          )}
        </button>
      )}

      {/* ✅ Navigation Links */}
      <ul className="space-y-6 w-full pt-14">
        <li>
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 px-4 py-2 text-lg rounded-lg hover:bg-[#6b5745] transition-all duration-300 
            ${isExpanded && !isMobile ? 'justify-start' : 'justify-center'}`}
          >
            <FaTachometerAlt className="text-xl" /> {!isMobile && isExpanded && 'Dashboard'}
          </Link>
        </li>
        <li>
          <Link
            to="/admin/dashboard/users"
            className={`flex items-center gap-3 px-4 py-2 text-lg rounded-lg hover:bg-[#6b5745] transition-all duration-300 
            ${isExpanded && !isMobile ? 'justify-start' : 'justify-center'}`}
          >
            <FaUser className="text-xl" /> {!isMobile && isExpanded && 'Users'}
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default AdminSidebar
