// src/admin/components/AdminSidebar.jsx
import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom' // Added useNavigate
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users2,
  Package,
  ClipboardList,
  PanelLeft,
  ChevronLeft,
  Menu as MenuIcon,
  LogOut, // Added LogOut icon
} from 'lucide-react'

// Color constants
const activeBgColor = 'bg-trendzone-light-blue'
const activeTextColor = 'text-white'
const defaultTextColor = 'text-trendzone-dark-blue'
const hoverBgColor = 'hover:bg-trendzone-light-blue/10'
const logoColor = 'text-trendzone-dark-blue' // Used for Admin Panel text
const logoIconColor = 'text-trendzone-light-blue'

const navItems = [
  { path: '/admin/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/users', name: 'Users', icon: Users2 },
  { path: '/admin/products', name: 'Products', icon: Package },
  { path: '/admin/orders', name: 'Orders', icon: ClipboardList },
]

const SidebarNavLink = ({ to, icon: Icon, label, isSidebarExpanded }) => {
  const location = useLocation()
  const isActuallyActive = location.pathname === to || location.pathname.startsWith(`${to}/`)
  const isDashboardRoute =
    to === '/admin/dashboard' &&
    (location.pathname === '/admin' || location.pathname === '/admin/dashboard')

  return (
    <NavLink
      to={to}
      className={({ isActive: navLinkIsActiveFromProp }) =>
        `flex items-center rounded-md transition-colors duration-150 group
        ${isSidebarExpanded ? 'px-4 py-2.5 my-1' : 'p-3 my-1 justify-center'}
        ${
          isActuallyActive || isDashboardRoute || navLinkIsActiveFromProp
            ? `${activeBgColor} ${activeTextColor} shadow-sm`
            : `${defaultTextColor} ${hoverBgColor} hover:text-trendzone-light-blue`
        }`
      }
      title={!isSidebarExpanded ? label : undefined}
    >
      <Icon size={isSidebarExpanded ? 20 : 24} className="flex-shrink-0" />
      <AnimatePresence>
        {isSidebarExpanded && (
          <motion.span
            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
            animate={{ opacity: 1, width: 'auto', marginLeft: '0.75rem' }}
            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="whitespace-nowrap text-sm font-medium"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  )
}

const AdminSidebar = ({ isExpanded, toggleSidebar }) => {
  const navigate = useNavigate() // Hook for navigation

  const handleLogout = () => {
    // Implement your actual logout logic here
    // e.g., clearing tokens from localStorage, calling a logout API endpoint
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole') // If you store user role
    // Add any other cleanup needed

    navigate('/admin/login') // Redirect to admin login page
    // Optionally, you might want to show a toast notification for successful logout
    // import { toast } from 'react-hot-toast';
    // toast.success('Logged out successfully!');
  }

  const sidebarVariants = {
    expanded: { width: '260px' },
    collapsed: { width: '80px' },
  }

  const logoTextVariants = {
    expanded: { opacity: 1, x: 0, display: 'block', transition: { delay: 0.1, duration: 0.2 } },
    collapsed: {
      opacity: 0,
      x: -10,
      transition: { duration: 0.1 },
      transitionEnd: { display: 'none' },
    },
  }

  const mainMenuSectionVariants = {
    expanded: { opacity: 1, height: 'auto', y: 0, marginTop: '0.5rem', display: 'flex' },
    collapsed: {
      opacity: 0,
      height: 0,
      y: -10,
      marginTop: '0',
      transitionEnd: { display: 'none' },
    },
  }

  const logoutTextVariants = {
    // Specific for logout text animation
    expanded: {
      opacity: 1,
      width: 'auto',
      marginLeft: '0.75rem',
      transition: { delay: 0.1, duration: 0.2 },
    },
    collapsed: { opacity: 0, width: 0, marginLeft: 0, transition: { duration: 0.1 } },
  }

  return (
    <motion.aside
      variants={sidebarVariants}
      initial={false}
      animate={isExpanded ? 'expanded' : 'collapsed'}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`bg-white text-trendzone-dark-blue 
                  fixed left-0 
                  z-30 
                  top-16 md:top-20 
                  h-full md:h-full /* Corrected height calculation */
                  flex flex-col shadow-lg border-r border-slate-200`}
    >
      {/* Header / Brand */}
      <div
        className={`flex items-center shrink-0 ${
          isExpanded ? 'pl-6 pr-4 h-[72px] mt-10' : 'justify-center h-[72px]'
        }`}
      >
        <PanelLeft size={isExpanded ? 28 : 32} className={`${logoIconColor} shrink-0 `} />
        <AnimatePresence>
          {isExpanded && (
            <motion.h1
              variants={logoTextVariants}
              className={`ml-2.5 text-xl font-bold ${logoColor} whitespace-nowrap`} // Applied logoColor
            >
              Admin Panel
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Button and "MAIN MENU" Label section */}
      <motion.div
        variants={mainMenuSectionVariants}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        className={`items-center shrink-0 ${isExpanded ? 'px-4 pb-2' : 'justify-center'}`}
      >
        {isExpanded && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-slate-200 transition-colors mr-2"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={22} />
          </button>
        )}
        {isExpanded && (
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </span>
        )}
      </motion.div>

      {!isExpanded && (
        <div className="flex justify-center items-center py-3 shrink-0">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Expand sidebar"
          >
            <MenuIcon size={24} />
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <nav
        className={`flex-grow overflow-y-auto overflow-x-hidden ${isExpanded ? 'px-3.5' : 'px-2'}`}
      >
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <SidebarNavLink
                to={item.path}
                icon={item.icon}
                label={item.name}
                isSidebarExpanded={isExpanded}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Section - Added at the bottom */}
      <div className={`mt-auto shrink-0 border-t border-slate-200 ${isExpanded ? 'p-3.5' : 'p-2'}`}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center rounded-md text-red-600 hover:bg-red-500/10 transition-colors duration-150 group
            ${isExpanded ? 'px-4 py-2.5' : 'p-3 justify-center'}`}
          title={!isExpanded ? 'Log out' : undefined}
        >
          <LogOut
            size={isExpanded ? 20 : 24}
            className="flex-shrink-0 group-hover:text-red-700 transition-colors"
          />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                variants={logoutTextVariants} // Using specific variant for logout text
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="whitespace-nowrap text-sm font-medium group-hover:text-red-700 transition-colors"
              >
                Log out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}

export default AdminSidebar
