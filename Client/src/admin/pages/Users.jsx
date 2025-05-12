// src/admin/pages/Users.jsx
import React, { useEffect, useState, useCallback } from 'react'
import apiClient from '../../api/axiosConfig' // Adjust path as necessary
import { toast, Toaster } from 'react-hot-toast'
import { Loader2, Edit3, Trash2, Save, XCircle, UserPlus, Users as UsersIcon } from 'lucide-react' // Enhanced icons
import { motion, AnimatePresence } from 'framer-motion'

// Color constants from your theme
const primaryColor = '#003049' // trendzone-dark-blue
const accentColor = '#669BBC' // trendzone-light-blue
const lightGrayText = 'text-slate-500'
const darkGrayText = 'text-slate-700'
const headingColor = `text-[${primaryColor}]`

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  exit: { y: -20, opacity: 0, transition: { duration: 0.2 } },
}

const Users = () => {
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({ fullName: '', email: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await apiClient.get('/admin/users')
      const data = Array.isArray(res.data) ? res.data : res.data.users || []
      setUsers(data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error fetching users')
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.'))
      return
    setDeletingId(id)
    try {
      await apiClient.delete(`/admin/users/${id}`)
      toast.success('User deleted successfully')
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id)) // Optimistic update
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  const handleUpdate = async () => {
    if (!editingUser) return
    setIsUpdating(true)
    try {
      const res = await apiClient.put(`/admin/users/${editingUser}`, formData)
      toast.success('User updated successfully')
      setUsers((prevUsers) => prevUsers.map((user) => (user._id === editingUser ? res.data : user))) // Update specific user
      setEditingUser(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEditClick = (user) => {
    setEditingUser(user._id)
    setFormData({ fullName: user.fullName, email: user.email })
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
    setFormData({ fullName: '', email: '' })
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="px-4 md:px-6 pb-4 md:pb-6 space-y-6"
    >
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold ${headingColor} flex items-center`}>
            <UsersIcon size={28} className={`mr-3 opacity-80 text-[${accentColor}]`} />
            Users Management
          </h1>
          <p className={`mt-1 text-sm ${lightGrayText}`}>View, edit, or delete user accounts.</p>
        </div>
      </motion.div>

      {/* Loading Indicator */}
      {isLoading && (
        <motion.div
          variants={itemVariants}
          className="flex justify-center items-center py-10 text-slate-500"
        >
          <Loader2 className={`animate-spin h-8 w-8 mr-3 text-[${accentColor}]`} />
          <span>Loading users, please wait...</span>
        </motion.div>
      )}

      {/* Users Table Section */}
      {!isLoading && (
        <motion.div
          variants={itemVariants}
          className="bg-white shadow-xl rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead
                className={`bg-gradient-to-r from-[${primaryColor}] to-[${accentColor}] text-white`}
              >
                <tr>
                  <th className="text-left py-3.5 px-5 font-semibold w-[35%]">Full Name</th>
                  <th className="text-left py-3.5 px-5 font-semibold w-[40%]">Email</th>
                  <th className="text-left py-3.5 px-5 font-semibold w-[25%]">Actions</th>
                </tr>
              </thead>
              <motion.tbody variants={containerVariants}>
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => (
                    <motion.tr
                      key={user._id}
                      variants={itemVariants}
                      layout
                      className="border-t border-slate-200 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-3 px-5 align-top text-sm text-slate-700">
                        {editingUser === user._id ? (
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className={`w-full p-2 border border-[${accentColor}] rounded-md focus:ring-2 focus:ring-[${accentColor}] focus:border-[${accentColor}] outline-none text-sm transition-shadow`}
                            autoFocus
                          />
                        ) : (
                          user.fullName
                        )}
                      </td>
                      <td className="py-3 px-5 align-top text-sm text-slate-700">
                        {editingUser === user._id ? (
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`w-full p-2 border border-[${accentColor}] rounded-md focus:ring-2 focus:ring-[${accentColor}] focus:border-[${accentColor}] outline-none text-sm transition-shadow`}
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2.5">
                          {editingUser === user._id ? (
                            <>
                              <button
                                onClick={handleUpdate}
                                disabled={isUpdating}
                                className={`flex items-center justify-center gap-1.5 text-sm px-3 py-1.5 rounded-md bg-green-500 text-white hover:bg-green-600 active:bg-green-700 transition-colors shadow-sm hover:shadow-md disabled:opacity-60 min-w-[80px]`}
                              >
                                {isUpdating ? (
                                  <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                  <Save size={16} />
                                )}
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={isUpdating}
                                className="flex items-center justify-center gap-1.5 text-sm px-3 py-1.5 rounded-md bg-slate-500 text-white hover:bg-slate-600 active:bg-slate-700 transition-colors shadow-sm hover:shadow-md min-w-[80px]"
                              >
                                <XCircle size={16} /> Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleEditClick(user)}
                              className={`flex items-center justify-center gap-1.5 text-sm px-3 py-1.5 rounded-md bg-[${accentColor}] text-white hover:bg-opacity-80 active:bg-opacity-90 transition-all shadow-sm hover:shadow-md min-w-[80px]`}
                            >
                              <Edit3 size={16} /> Edit
                            </button>
                          )}
                          {editingUser !== user._id && (
                            <button
                              onClick={() => handleDelete(user._id)}
                              disabled={deletingId === user._id}
                              className={`flex items-center justify-center gap-1.5 text-sm px-3 py-1.5 rounded-md bg-destructive text-destructive-foreground hover:brightness-90 active:brightness-[.85] transition-all duration-150 shadow-sm hover:shadow-md disabled:opacity-60 min-w-[80px]`}
                            >
                              {deletingId === user._id ? (
                                <Loader2 className="animate-spin h-4 w-4" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-10 text-slate-500 italic">
                      No users found. You can add new users if an option is available.
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Users
