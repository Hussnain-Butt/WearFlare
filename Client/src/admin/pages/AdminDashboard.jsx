import React from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

const barData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  datasets: [
    {
      label: 'Monthly Revenue',
      data: [1200, 1900, 3000, 2500, 3200, 2800, 4000, 3700, 4500],
      backgroundColor: '#c8a98a',
      borderRadius: 4,
    },
  ],
}

const barOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: 'Trend',
      font: { size: 16 },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

const pieData = {
  labels: ['Basic', 'Pro', 'Enterprise'],
  datasets: [
    {
      label: 'Sales',
      data: [40, 35, 25],
      backgroundColor: ['#c8a98a', '#a1846b', '#e1d0c3'],
    },
  ],
}

const pieOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    title: {
      display: true,
      text: 'Sales',
      font: { size: 16 },
    },
  },
}

const AdminDashboard = () => {
  return (
    <div className="min-h-screen   flex bg-gray-100">
      {/* Main Dashboard Content */}
      <main className="flex-1 p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="mt-1 text-gray-600">
              Manage users, view reports, and configure settings from here.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-gray-500 text-sm font-medium">Current MRR</h2>
            <p className="text-2xl font-bold mt-1 text-gray-800">$12.4K</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-gray-500 text-sm font-medium">Current Customers</h2>
            <p className="text-2xl font-bold mt-1 text-gray-800">16,601</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-gray-500 text-sm font-medium">Active Customers</h2>
            <p className="text-2xl font-bold mt-1 text-gray-800">33%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-gray-500 text-sm font-medium">Churn Rate</h2>
            <p className="text-2xl font-bold mt-1 text-gray-800">12%</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow p-4 lg:col-span-2">
            <Bar data={barData} options={barOptions} />
          </div>
          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow p-4">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        {/* Extra Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Transactions</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>Transaction #1234 - $250</li>
              <li>Transaction #1235 - $500</li>
              <li>Transaction #1236 - $1,200</li>
              <li className="text-[#c8a98a] cursor-pointer mt-2">View all transactions</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Support Tickets</h2>
            <p className="text-sm text-gray-600">
              Latest unresolved tickets or user queries can be shown here.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Customer Demographics</h2>
            <p className="text-sm text-gray-600">
              You can integrate a map or region-based chart here.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
