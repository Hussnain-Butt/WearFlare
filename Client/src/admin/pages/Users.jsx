import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast, Toaster } from 'react-hot-toast'

const Users = () => {
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({ fullName: '', email: '' })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://backend-production-c8ff.up.railway.app/api/admin/users')
      const data = Array.isArray(res.data) ? res.data : res.data.users || []
      setUsers(data)
    } catch (err) {
      toast.error('Error fetching users')
      setUsers([])
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backend-production-c8ff.up.railway.app/api/admin/users/${id}`)
      toast.success('User deleted successfully')
      fetchUsers()
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://backend-production-c8ff.up.railway.app/api/admin/users/${editingUser}`,
        formData,
      )
      toast.success('User updated successfully')
      setEditingUser(null)
      fetchUsers()
    } catch (err) {
      toast.error('Update failed')
    }
  }

  const handleEditClick = (user) => {
    setEditingUser(user._id)
    setFormData({ fullName: user.fullName, email: user.email })
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6 sm:p-8">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Users Management</h1>
      <div className="w-full overflow-x-auto">
        <table className="w-full bg-white shadow rounded-lg overflow-hidden min-w-full">
          <thead className="bg-[#c8a98a] text-white">
            <tr>
              <th className="text-left py-3 px-4 w-1/3">Full Name</th>
              <th className="text-left py-3 px-4 w-1/3">Email</th>
              <th className="text-left py-3 px-4 w-1/3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border-t border-gray-200">
                  <td className="py-2 px-4">
                    {editingUser === user._id ? (
                      <input
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      user.fullName
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editingUser === user._id ? (
                      <input
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="py-2 px-4 flex space-x-2">
                    {editingUser === user._id ? (
                      <button
                        onClick={handleUpdate}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick(user)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
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
