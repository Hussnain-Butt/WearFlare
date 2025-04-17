// src/ProductManager/components/ProtectedRoute.jsx
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const ProtectedRoute = () => {
  const token = localStorage.getItem('managerToken')
  const location = useLocation() // Get current location

  if (!token) {
    // User not logged in, redirect them to the login page
    // Pass the current location in state so we can redirect back after login (optional)
    return <Navigate to="/productmanager" state={{ from: location }} replace />
  }

  // User is logged in, render the child route content
  // The ManagerDashboardLayout will be rendered here via Outlet in App.jsx
  return <Outlet />
}

export default ProtectedRoute
