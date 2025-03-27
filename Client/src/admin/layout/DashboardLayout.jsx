// components/DashboardLayout.js
import React from 'react'
import { Outlet } from 'react-router-dom' // For nested routes like AdminDashboard
import AdminSidebar from '../components/AdminSidebar'
// import Footer from './Footer'

const DashboardLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="dashboard-container">
        {/* Your admin sidebar or any layout components can go here */}
        <div className="dashboard-content">
          <Outlet /> {/* Nested routes like AdminDashboard will be displayed here */}
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default DashboardLayout
