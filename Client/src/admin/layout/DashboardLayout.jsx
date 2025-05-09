// src/admin/layouts/DashboardLayout.jsx
import React, { useState, useEffect } from 'react' // Import useState, useEffect
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import { motion } from 'framer-motion' // Import motion

const DashboardLayout = () => {
  const [isExpanded, setIsExpanded] = useState(true) // State lifted here
  const location = useLocation()
  const isAuthenticated =
    !!localStorage.getItem('authToken') && localStorage.getItem('userRole') === 'admin'

  // Auto-collapse sidebar on smaller screens (optional, but good for UX)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // md breakpoint
        setIsExpanded(false)
      } else {
        setIsExpanded(true) // Or remember user preference
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize() // Initial check
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev)
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  const mainContentVariants = {
    expanded: { marginLeft: '260px' }, // Should match expanded sidebar width
    collapsed: { marginLeft: '80px' }, // Should match collapsed sidebar width
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Pass state and toggle function to AdminSidebar */}
      <AdminSidebar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />

      {/* Main Content - Now animates its margin */}
      <motion.main
        variants={mainContentVariants}
        initial={false} // Don't animate on initial load, respect current state
        animate={isExpanded ? 'expanded' : 'collapsed'}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`flex-grow p-4 sm:p-6 md:p-8 overflow-y-auto 
                   pt-16 md:pt-20 /* Padding-top to clear main 'WearFlare' Navbar */`}
      >
        <Outlet />
      </motion.main>
    </div>
  )
}

export default DashboardLayout
