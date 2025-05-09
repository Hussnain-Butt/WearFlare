// src/admin/components/AdminSidebar.jsx
import React from 'react' // Removed useState, useEffect as state is now managed by parent
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users2,
  Package,
  ClipboardList,
  PanelLeft,
  ChevronLeft,
  Menu as MenuIcon,
} from 'lucide-react'

// Color constants
const activeBgColor = 'bg-trendzone-light-blue'
const activeTextColor = 'text-white'
const defaultTextColor = 'text-trendzone-dark-blue'
const hoverBgColor = 'hover:bg-trendzone-light-blue/10'
const logoColor = 'text-trendzone-dark-blue'
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

// AdminSidebar now receives isExpanded and toggleSidebar as props
const AdminSidebar = ({ isExpanded, toggleSidebar }) => {
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

  return (
    <motion.aside
      variants={sidebarVariants}
      initial={false} // Respect the initial state from parent
      animate={isExpanded ? 'expanded' : 'collapsed'}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`bg-white text-trendzone-dark-blue 
                  fixed left-0 
                  z-30 
                  top-16 md:top-20 
                  h-full md:h-full 
                  flex flex-col shadow-lg border-r border-slate-200`}
    >
      {/* Header / Brand */}
      <div
        className={`flex items-center shrink-0 ${
          isExpanded ? 'pl-6 pr-4 py-4 pt-10 h-[72px]' : 'justify-center h-[72px]'
        }`}
      >
        <PanelLeft size={isExpanded ? 28 : 32} className={`${logoIconColor} shrink-0`} />
        <AnimatePresence>
          {isExpanded && (
            <motion.h1 variants={logoTextVariants} className="pl-11 text-xl font-bold ">
              Admin Panel
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Button and "MAIN MENU" Label section - Now directly uses toggleSidebar from props */}
      <motion.div
        variants={mainMenuSectionVariants}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        className={`items-center shrink-0 ${isExpanded ? 'px-4 pb-2' : 'justify-center'}`}
      >
        {isExpanded && (
          <button
            onClick={toggleSidebar} // Use prop
            className="p-2 pt-5 rounded-full hover:bg-slate-200 transition-colors mr-2"
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
            onClick={toggleSidebar} // Use prop
            className="p-2  rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Expand sidebar"
          >
            <MenuIcon size={24} />
          </button>
        </div>
      )}

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
                isSidebarExpanded={isExpanded} // Pass prop
              />
            </li>
          ))}
        </ul>
      </nav>
    </motion.aside>
  )
}

export default AdminSidebar
