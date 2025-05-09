// src/admin/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react'
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
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Users,
  Activity,
  AlertTriangle,
  DollarSign,
  HelpCircle,
  MapPin,
  RefreshCw, // For Refresh button
  Loader2, // For Loading spinner
} from 'lucide-react'
import axios from 'axios' // For API calls

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

// Define colors from your theme
const primaryColor = '#003049' // trendzone-dark-blue
const accentColor = '#669BBC' // trendzone-light-blue
const lightGrayText = 'text-slate-500'
const darkGrayText = 'text-slate-700'
const headingColor = `text-[${primaryColor}]` // Use arbitrary value for Tailwind

// API Base URL - Adjust if your environment variable is different or you want to hardcode
const API_URL = 'https://backend-production-c8ff.up.railway.app/api'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07, // Slightly faster stagger
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 120, damping: 14 }, // Adjusted spring
  },
}

// Reusable StatCard component with loading state
const StatCard = ({ title, value, icon: Icon, iconColor = accentColor, isLoading }) => (
  <motion.div
    variants={itemVariants}
    className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow duration-300 min-h-[120px] flex flex-col justify-between"
  >
    {isLoading ? (
      <div className="flex justify-center items-center h-full py-4">
        <Loader2 className="animate-spin h-8 w-8 text-slate-400" />
      </div>
    ) : (
      <>
        <div className="flex items-center justify-between mb-1">
          <h3 className={`text-sm font-medium ${lightGrayText} uppercase tracking-wider`}>
            {title}
          </h3>
          {Icon && <Icon size={22} style={{ color: iconColor }} className="opacity-80" />}
        </div>
        <p className={`text-3xl font-bold ${headingColor}`}>{value}</p>
      </>
    )}
  </motion.div>
)

// Reusable InfoCard component with loading state
const InfoCard = ({ title, children, icon: Icon, isLoading }) => (
  <motion.div
    variants={itemVariants}
    className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col min-h-[150px]"
  >
    {isLoading ? (
      <div className="flex justify-center items-center h-full py-4">
        <Loader2 className="animate-spin h-8 w-8 text-slate-400" />
      </div>
    ) : (
      <>
        <div className="flex items-center mb-3">
          {Icon && <Icon size={20} className={`mr-2.5 ${headingColor} opacity-90`} />}
          <h2 className={`text-lg font-semibold ${headingColor}`}>{title}</h2>
        </div>
        <div className="text-sm text-slate-600 flex-grow">{children}</div>
      </>
    )}
  </motion.div>
)

const AdminDashboard = () => {
  // State for dashboard data
  const [keyMetrics, setKeyMetrics] = useState({
    currentMRR: '0',
    currentCustomers: 0,
    activeCustomers: '0',
    churnRate: '0',
  })
  const [revenueTrend, setRevenueTrend] = useState({ labels: [], data: [] })
  const [salesByPlan, setSalesByPlan] = useState({ labels: [], data: [] })
  const [recentTransactions, setRecentTransactions] = useState([])

  // Combined loading state for all initial fetches
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    setIsLoading(true)
    setError('')
    const token = localStorage.getItem('authToken')
    if (!token) {
      setError('Authentication token not found. Please log in.')
      setIsLoading(false)
      // Optionally redirect to login page here
      return
    }
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    }

    try {
      const [metricsRes, revenueRes, salesRes, transactionsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/dashboard/key-metrics`, config),
        axios.get(`${API_URL}/admin/dashboard/revenue-trend`, config),
        axios.get(`${API_URL}/admin/dashboard/sales-by-plan`, config),
        axios.get(`${API_URL}/admin/dashboard/recent-transactions`, config),
      ])

      setKeyMetrics(metricsRes.data)
      setRevenueTrend(revenueRes.data)
      setSalesByPlan(salesRes.data)
      setRecentTransactions(transactionsRes.data)
    } catch (err) {
      console.error(
        'Error fetching dashboard data:',
        err.response ? err.response.data : err.message,
      )
      setError(err.response?.data?.message || 'Failed to load dashboard data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // Optional: Polling
    // const intervalId = setInterval(fetchData, 60000);
    // return () => clearInterval(intervalId);
  }, [])

  // Chart data and options setup
  const barChartData = {
    labels:
      revenueTrend.labels && revenueTrend.labels.length > 0
        ? revenueTrend.labels
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], // Default labels
    datasets: [
      {
        label: 'Monthly Revenue',
        data:
          revenueTrend.data && revenueTrend.data.length > 0 ? revenueTrend.data : Array(9).fill(0), // Default data
        backgroundColor: accentColor,
        hoverBackgroundColor: primaryColor,
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 'flex',
        maxBarThickness: 50,
      },
    ],
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Revenue Trend',
        font: { size: 18, weight: '600' },
        color: primaryColor,
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 4,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { color: darkGrayText, font: { size: 12 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: darkGrayText, font: { size: 12 } },
      },
    },
  }

  const pieChartData = {
    labels:
      salesByPlan.labels && salesByPlan.labels.length > 0
        ? salesByPlan.labels
        : ['Basic', 'Pro', 'Enterprise'], // Default labels
    datasets: [
      {
        label: 'Sales Distribution',
        data: salesByPlan.data && salesByPlan.data.length > 0 ? salesByPlan.data : [0, 0, 0], // Default data
        backgroundColor: [accentColor, primaryColor, '#A0C8E0'],
        hoverBackgroundColor: ['#5AA9D8', '#002233', '#8BC1E1'],
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  }

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: darkGrayText, font: { size: 12 }, boxWidth: 15, padding: 20 },
      },
      title: {
        display: true,
        text: 'Sales by Plan',
        font: { size: 18, weight: '600' },
        color: primaryColor,
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 4,
        displayColors: true,
        callbacks: {
          label: function (context) {
            let label = context.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed !== null) {
              label += context.parsed + '%'
            }
            return label
          },
        },
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 md:space-y-8"
    >
      {/* Header Section with Refresh Button */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap justify-between items-center gap-4"
      >
        <div>
          <h1 className={`text-3xl md:text-4xl font-bold ${headingColor}`}>Dashboard</h1>
          <p className={`mt-1 ${lightGrayText}`}>
            Welcome back! Here's an overview of your store's performance.
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={isLoading}
          className={`flex items-center gap-2 py-2 px-4 rounded-lg bg-white text-[${primaryColor}] border border-slate-300 hover:bg-slate-50 shadow-sm active:bg-slate-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
          title="Refresh Data"
        >
          <RefreshCw size={18} className={`${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </motion.div>

      {error && (
        <motion.div
          variants={itemVariants}
          className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl shadow"
        >
          <p>
            <strong>Error:</strong> {error}
          </p>
        </motion.div>
      )}

      {/* Stats Cards Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
      >
        <StatCard
          title="Current MRR"
          value={`$${(keyMetrics.currentMRR || 0).toLocaleString()}`}
          icon={DollarSign}
          isLoading={isLoading}
          iconColor="#27AE60"
        />
        <StatCard
          title="Total Customers"
          value={(keyMetrics.currentCustomers || 0).toLocaleString()}
          icon={Users}
          isLoading={isLoading}
          iconColor="#2980B9"
        />
        <StatCard
          title="Active Customers"
          value={`${keyMetrics.activeCustomers || 0}%`}
          icon={Activity}
          isLoading={isLoading}
          iconColor="#F39C12"
        />
      </motion.div>

      {/* Charts Section Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-5 lg:col-span-2 hover:shadow-xl transition-shadow duration-300 min-h-[380px] md:min-h-[420px] flex flex-col"
        >
          {isLoading ? (
            <div className="flex-grow flex justify-center items-center">
              <Loader2 className="animate-spin h-12 w-12 text-slate-400" />
            </div>
          ) : (
            <Bar data={barChartData} options={barChartOptions} />
          )}
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow duration-300 min-h-[380px] md:min-h-[420px] flex flex-col"
        >
          {isLoading ? (
            <div className="flex-grow flex justify-center items-center">
              <Loader2 className="animate-spin h-12 w-12 text-slate-400" />
            </div>
          ) : (
            <Pie data={pieChartData} options={pieChartOptions} />
          )}
        </motion.div>
      </motion.div>

      {/* Extra Info Cards Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
      >
        <InfoCard title="Recent Transactions" icon={TrendingUp} isLoading={isLoading}>
          {recentTransactions.length > 0 ? (
            <ul className="space-y-2.5">
              {recentTransactions.map((order) => (
                <li key={order._id} className="pb-1 border-b border-slate-100 last:border-b-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-700">
                      {order.customerName || 'N/A'}
                    </span>
                    <span className="font-semibold text-[${primaryColor}]">
                      ${Number(order.totalPrice || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString()} -{' '}
                    <span
                      className={`capitalize px-1.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'Confirmed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </li>
              ))}
              <li className={`pt-2`}>
                <a
                  href="/admin/orders"
                  className={`text-[${accentColor}] hover:underline font-medium text-sm`}
                >
                  View all transactions →
                </a>
              </li>
            </ul>
          ) : (
            <p className="text-slate-500 italic">
              {isLoading ? 'Loading transactions...' : 'No recent transactions found.'}
            </p>
          )}
        </InfoCard>

        <InfoCard
          title="Support Tickets"
          icon={HelpCircle}
          isLoading={isLoading /* Replace with actual loading state for tickets */}
        >
          <p>
            <strong className={`text-[${primaryColor}]`}>3 new tickets</strong> require attention.
            Prioritize critical issues first for better customer satisfaction.
            <a
              href="#"
              className={`block mt-3 text-[${accentColor}] hover:underline font-medium text-sm`}
            >
              Go to support center →
            </a>
          </p>
        </InfoCard>

        <InfoCard
          title="User Demographics"
          icon={MapPin}
          isLoading={isLoading /* Replace with actual loading state for demographics */}
        >
          <p>
            Current insights show a primary user base in{' '}
            <strong className={`text-[${primaryColor}]`}>North America (65%)</strong>, followed by{' '}
            <strong className={`text-[${primaryColor}]`}>Europe (25%)</strong>.
            <a
              href="#"
              className={`block mt-3 text-[${accentColor}] hover:underline font-medium text-sm`}
            >
              View detailed report →
            </a>
          </p>
        </InfoCard>
      </motion.div>
    </motion.div>
  )
}

export default AdminDashboard
