// src/components/ProtectedRoute.js (or similar location)
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children, allowedRoles, loginPath }) => {
  const token = localStorage.getItem('authToken') // Get the single token
  const userRole = localStorage.getItem('userRole') // Get the stored role
  const location = useLocation()

  // 1. Check if token exists
  if (!token) {
    // Not logged in, redirect to the appropriate login page
    // Store the intended location to redirect back after login
    return <Navigate to={loginPath} state={{ from: location }} replace />
  }

  // 2. Check if the user's role is allowed (if roles are specified)
  //    Make sure allowedRoles is always an array
  const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : []
  if (rolesToCheck.length > 0 && (!userRole || !rolesToCheck.includes(userRole))) {
    // Logged in, but role is not allowed for this route
    console.warn(
      `Access Denied: Role '${userRole}' not in allowed roles [${rolesToCheck.join(', ')}] for ${
        location.pathname
      }`,
    )
    // Redirect to a generic 'unauthorized' page or back to a default dashboard/login
    // For simplicity, redirecting back to login, but an unauthorized page is better UX.
    return <Navigate to={loginPath} replace />
    // Or: return <Navigate to="/unauthorized" replace />;
  }

  // 3. If token exists and role is allowed (or no specific roles required), render the child component
  return children
}

export default ProtectedRoute
