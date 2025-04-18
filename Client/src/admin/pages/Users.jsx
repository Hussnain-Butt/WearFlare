// src/admin/pages/Users.jsx (or .js)

import React, { useEffect, useState, useCallback } from 'react'
// Import the configured Axios instance
import apiClient from '../../api/axiosConfig' // Adjust path as necessary
import { toast, Toaster } from 'react-hot-toast'
import { Loader2 } from 'lucide-react' // For loading indicators

const Users = () => {
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null) // ID of the user being edited
  const [formData, setFormData] = useState({ fullName: '', email: '' }) // Form data for editing
  const [isLoading, setIsLoading] = useState(false) // Loading state for fetching users
  const [isUpdating, setIsUpdating] = useState(false) // Loading state for update action
  const [deletingId, setDeletingId] = useState(null) // ID of user being deleted for loading indicator

  // Fetch users function using useCallback for stability
  const fetchUsers = useCallback(async () => {
    setIsLoading(true) // Start loading
    try {
      // Use apiClient and relative path. Auth token added by interceptor.
      const res = await apiClient.get('/admin/users') // <-- Use apiClient, relative path

      // Ensure the response data is an array before setting state
      const data = Array.isArray(res.data) ? res.data : res.data.users || []
      setUsers(data)
    } catch (err) {
      console.error('Error fetching users:', err.response?.data || err.message)
      toast.error(err.response?.data?.message || 'Error fetching users')
      setUsers([]) // Reset to empty array on error
    } finally {
      setIsLoading(false) // Stop loading
    }
  }, []) // No dependencies needed if it doesn't rely on external props/state

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers]) // Include fetchUsers in dependency array

  // Handle deleting a user
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    setDeletingId(id) // Show loading specifically for this delete button
    try {
      // Use apiClient and relative path. Auth token added by interceptor.
      await apiClient.delete(`/admin/users/${id}`) // <-- Use apiClient, relative path

      toast.success('User deleted successfully')
      fetchUsers() // Refresh the user list
    } catch (err) {
      console.error('Delete failed:', err.response?.data || err.message)
      toast.error(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeletingId(null) // Stop loading for this delete button
    }
  }

  // Handle updating a user
  const handleUpdate = async () => {
    if (!editingUser) return // Should not happen if button is shown correctly
    setIsUpdating(true) // Show loading state for save button
    try {
      // Use apiClient and relative path. Auth token added by interceptor.
      await apiClient.put(`/admin/users/${editingUser}`, formData) // <-- Use apiClient, relative path

      toast.success('User updated successfully')
      setEditingUser(null) // Exit edit mode
      fetchUsers() // Refresh the user list
    } catch (err) {
      console.error('Update failed:', err.response?.data || err.message)
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setIsUpdating(false) // Stop loading state for save button
    }
  }

  // Set up the form for editing when the Edit button is clicked
  const handleEditClick = (user) => {
    setEditingUser(user._id)
    setFormData({ fullName: user.fullName, email: user.email })
  }

  // Cancel editing mode
  const handleCancelEdit = () => {
    setEditingUser(null)
    setFormData({ fullName: '', email: '' }) // Clear form data
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6 sm:p-8">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Users Management</h1>

      {/* Loading Indicator for initial fetch */}
      {isLoading && (
        <div className="flex justify-center items-center my-4">
          <Loader2 className="animate-spin h-6 w-6 text-[#c8a98a]" />
          <span className="ml-2">Loading Users...</span>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table className="w-full bg-white shadow rounded-lg overflow-hidden min-w-full">
          <thead className="bg-[#c8a98a] text-white">
            <tr>
              <th className="text-left py-3 px-4 w-[30%]">Full Name</th>
              <th className="text-left py-3 px-4 w-[40%]">Email</th>
              <th className="text-left py-3 px-4 w-[30%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Conditional rendering based on loading and data */}
            {!isLoading && Array.isArray(users) && users.length > 0
              ? users.map((user) => (
                  <tr key={user._id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 align-top">
                      {' '}
                      {/* Use align-top for better alignment during edit */}
                      {editingUser === user._id ? (
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="border p-1 rounded w-full text-sm"
                        />
                      ) : (
                        user.fullName
                      )}
                    </td>
                    <td className="py-3 px-4 align-top">
                      {editingUser === user._id ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="border p-1 rounded w-full text-sm"
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      {' '}
                      {/* Use gap for spacing */}
                      {editingUser === user._id ? (
                        <>
                          {/* Save Button */}
                          <button
                            onClick={handleUpdate}
                            disabled={isUpdating}
                            className={`bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm flex items-center justify-center min-w-[60px] ${
                              isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {isUpdating ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save'}
                          </button>
                          {/* Cancel Button */}
                          <button
                            onClick={handleCancelEdit}
                            disabled={isUpdating}
                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm min-w-[60px]"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        // Edit Button
                        <button
                          onClick={() => handleEditClick(user)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm min-w-[60px]"
                        >
                          Edit
                        </button>
                      )}
                      {/* Delete Button - Show only if not editing this user */}
                      {editingUser !== user._id && (
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={deletingId === user._id} // Disable only the one being deleted
                          className={`bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm flex items-center justify-center min-w-[60px] ${
                            deletingId === user._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {deletingId === user._id ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                          ) : (
                            'Delete'
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              : // Show message only if not loading and no users found
                !isLoading && (
                  <tr>
                    <td colSpan="3" className="text-center py-6 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users
