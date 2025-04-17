// components/DashboardLayout.js
import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <Outlet /> {/* Renders nested routes like AdminDashboard */}
      </div>
    </div>
  )
}

export default DashboardLayout
