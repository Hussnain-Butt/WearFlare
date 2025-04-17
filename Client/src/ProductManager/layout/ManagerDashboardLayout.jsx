// src/ProductManager/layout/ManagerDashboardLayout.jsx
import React from 'react'
import { Outlet } from 'react-router-dom' // Outlet renders the nested route component
import ManagerSidebar from '../components/ManagerSidebar' // Create this sidebar

const ManagerDashboardLayout = () => {
  // Add logic here for checking manager authentication if needed
  // e.g., check localStorage for 'managerToken' and redirect if not found

  return (
    <div className="flex min-h-screen bg-gray-100">
      {' '}
      {/* Adjust bg color as needed */}
      <ManagerSidebar /> {/* Sidebar specific to the manager */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        {' '}
        {/* Main content area */}
        <Outlet /> {/* This is where ManagerProducts, etc., will render */}
      </main>
    </div>
  )
}

export default ManagerDashboardLayout
