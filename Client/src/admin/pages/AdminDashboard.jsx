import React from 'react'

const AdminDashboard = () => {
  return (
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 p-5">
        <div className="mt-5">
          <h1 className="text-3xl font-semibold text-gray-800">Welcome to Admin Dashboard</h1>
          <p className="mt-3 text-gray-600">
            Manage users, view reports, and configure settings from here.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
