// src/admin/pages/OrdersPage.tsx
import React, { useState, useEffect, useCallback } from 'react'
import apiClient from '../../api/axiosConfig'
import { toast, Toaster } from 'react-hot-toast'
import { CheckCircle, Loader2, XCircle, Ban, ShoppingBag, RefreshCw } from 'lucide-react' // Added ShoppingBag, RefreshCw
import { motion, AnimatePresence } from 'framer-motion'

// Color constants from your theme
const primaryColor = '#003049' // trendzone-dark-blue
const accentColor = '#669BBC' // trendzone-light-blue
const lightGrayText = 'text-slate-500'
const headingColor = `text-[${primaryColor}]`

// Interface Definitions (Same as before)
interface OrderItem {
  productId: string
  title: string
  price: number
  quantity: number
  image?: string
  selectedSize?: string | null
  selectedColor?: string | null
}
interface ShippingAddress {
  street: string
  city: string
  postalCode: string
  country: string
}
interface Order {
  _id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: ShippingAddress
  orderItems: OrderItem[]
  totalPrice: number
  status:
    | 'Pending'
    | 'Confirmed'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled'
    | 'Awaiting User Confirmation' // Added 'Awaiting User Confirmation'
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 110, damping: 15 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [actionStates, setActionStates] = useState<
    Record<string, 'confirming' | 'cancelling' | null>
  >({})
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<Order[]>('/orders')
      setOrders(Array.isArray(response.data) ? response.data : [])
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load orders.')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleOrderAction = async (orderId: string, action: 'confirm' | 'cancel') => {
    if (actionStates[orderId]) return // Prevent multiple actions on same order

    setActionStates((prev) => ({
      ...prev,
      [orderId]: action === 'confirm' ? 'confirming' : 'cancelling',
    }))
    const actionText = action === 'confirm' ? 'Confirming' : 'Cancelling'
    const toastId = toast.loading(`${actionText} order #${orderId.slice(-6)}...`)

    try {
      const response = await apiClient.patch<{ order: Order }>(`/orders/${orderId}/${action}`)
      toast.dismiss(toastId)
      if (response.status === 200 && response.data.order) {
        toast.success(`Order #${orderId.slice(-6)} ${action}ed successfully!`)
        setOrders((prevOrders) =>
          prevOrders.map((order) => (order._id === orderId ? { ...response.data.order } : order)),
        )
      } else {
        throw new Error(response.data.message || `Unexpected server response during ${action}.`)
      }
    } catch (error: any) {
      toast.dismiss(toastId)
      const message = error.response?.data?.message || `Failed to ${action} order.`
      toast.error(`❌ ${message}`)
    } finally {
      setActionStates((prev) => ({ ...prev, [orderId]: null }))
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString('en-US', {
        // Using en-US for wider compatibility example
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    } catch (e) {
      return dateString
    }
  }

  const getStatusPillClass = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return `bg-yellow-100 text-yellow-700 border-yellow-300`
      case 'Confirmed':
        return `bg-green-100 text-green-700 border-green-300`
      case 'Shipped':
        return `bg-blue-100 text-blue-700 border-blue-300`
      case 'Delivered':
        return `bg-purple-100 text-purple-700 border-purple-300`
      case 'Cancelled':
        return `bg-red-100 text-red-700 border-red-300`
      case 'Awaiting User Confirmation':
        return `bg-orange-100 text-orange-700 border-orange-300`
      default:
        return `bg-slate-100 text-slate-600 border-slate-300`
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 min-h-screen"
    >
      <Toaster position="top-right" containerClassName="mt-20" />

      <motion.div
        variants={itemVariants}
        className="flex flex-wrap justify-between items-center gap-4"
      >
        <div className="flex items-center">
          <ShoppingBag size={32} className={`mr-3 text-[${accentColor}] opacity-90`} />
          <h1 className={`text-2xl sm:text-3xl font-bold ${headingColor}`}>Incoming Orders</h1>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className={`flex items-center gap-2 py-2 px-4 rounded-lg bg-white text-[${primaryColor}] border border-slate-300 hover:bg-slate-50 shadow-sm active:bg-slate-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
          title="Refresh Orders"
        >
          <RefreshCw size={18} className={`${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </motion.div>

      {loading &&
        !orders.length && ( // Show main loader only if no orders are displayed yet
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-center items-center py-20 text-slate-500"
          >
            <Loader2 className={`animate-spin h-12 w-12 mb-4 text-[${accentColor}]`} />
            <p className="text-lg">Loading incoming orders...</p>
          </motion.div>
        )}

      {!loading && error && (
        <motion.p
          variants={itemVariants}
          className="text-center text-red-600 bg-red-50 p-4 rounded-xl shadow border border-red-200"
        >
          {error}
        </motion.p>
      )}

      {!loading && !error && orders.length === 0 && (
        <motion.p
          variants={itemVariants}
          className="text-center text-slate-500 py-20 text-lg italic"
        >
          No incoming orders at the moment.
        </motion.p>
      )}

      {!loading && !error && orders.length > 0 && (
        <motion.div variants={containerVariants} className="space-y-6">
          {orders.map((order) => {
            const currentAction = actionStates[order._id]
            const canConfirm = order.status === 'Pending'
            const canCancel = order.status === 'Pending' || order.status === 'Confirmed'

            return (
              <motion.div
                key={order._id}
                variants={itemVariants}
                layout // Animate layout changes (e.g., on filter/sort if added later)
                className="bg-white p-5 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200/70"
              >
                <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start gap-x-4 gap-y-3 mb-4">
                  <div className="flex-grow">
                    <h2 className={`text-lg sm:text-xl font-semibold ${headingColor}`}>
                      Order #{order._id.slice(-6)}
                    </h2>
                    <p className={`text-xs sm:text-sm ${lightGrayText} mt-0.5`}>
                      Placed: {formatDate(order.createdAt)}
                    </p>
                    <span
                      className={`text-xs font-semibold mt-2 px-3 py-1 inline-block rounded-full border ${getStatusPillClass(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap flex-shrink-0 mt-1 sm:mt-0">
                    {canConfirm && (
                      <button
                        onClick={() => handleOrderAction(order._id, 'confirm')}
                        disabled={!!currentAction}
                        className="action-btn confirm-btn-style"
                      >
                        {currentAction === 'confirming' ? (
                          <Loader2 className="animate-spin mr-1.5 h-4 w-4" />
                        ) : (
                          <CheckCircle className="mr-1.5 h-4 w-4" />
                        )}
                        {currentAction === 'confirming' ? 'Confirming' : 'Confirm'}
                      </button>
                    )}
                    {canCancel && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to cancel order #${order._id.slice(-6)}?`,
                            )
                          ) {
                            handleOrderAction(order._id, 'cancel')
                          }
                        }}
                        disabled={!!currentAction}
                        className="action-btn cancel-btn-style"
                      >
                        {currentAction === 'cancelling' ? (
                          <Loader2 className="animate-spin mr-1.5 h-4 w-4" />
                        ) : (
                          <XCircle className="mr-1.5 h-4 w-4" />
                        )}
                        {currentAction === 'cancelling' ? 'Cancelling' : 'Cancel'}
                      </button>
                    )}
                    {/* Display status text if no actions are available */}
                    {!canConfirm && !canCancel && order.status !== 'Pending' && (
                      <span className={`status-text-indicator ${getStatusPillClass(order.status)}`}>
                        {order.status === 'Confirmed' && <CheckCircle className="mr-1.5 h-4 w-4" />}
                        {order.status === 'Cancelled' && <Ban className="mr-1.5 h-4 w-4" />}
                        {order.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4 border-t border-slate-100 pt-4">
                  <div>
                    <h3 className="details-heading-style">Customer Details</h3>
                    <p className="details-text-style">
                      <strong>Name:</strong> {order.customerName}
                    </p>
                    <p className="details-text-style break-words">
                      <strong>Email:</strong> {order.customerEmail}
                    </p>
                    <p className="details-text-style">
                      <strong>Phone:</strong> {order.customerPhone}
                    </p>
                  </div>
                  <div>
                    <h3 className="details-heading-style">Shipping Address</h3>
                    <p className="details-text-style">{order.shippingAddress.street}</p>
                    <p className="details-text-style">
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                    </p>
                    <p className="details-text-style">{order.shippingAddress.country}</p>
                  </div>
                </div>

                <div>
                  <h3 className="details-heading-style border-t border-slate-100 pt-4">
                    Items Ordered
                  </h3>
                  {order.orderItems?.length > 0 ? (
                    <ul className="space-y-2.5 mt-2">
                      {order.orderItems.map((item, index) => (
                        <li
                          key={`${item.productId}-${index}`}
                          className="details-text-style flex flex-col sm:flex-row sm:justify-between sm:items-start border-b border-slate-100 pb-2.5 last:border-b-0"
                        >
                          <div className="flex-grow mb-1 sm:mb-0 pr-2">
                            {item.title}{' '}
                            <span className="text-slate-500">(Qty: {item.quantity})</span>
                            {item.selectedSize && (
                              <span className="item-attr-style">[{item.selectedSize}]</span>
                            )}
                            {/* Add selectedColor if you use it */}
                          </div>
                          <span className={`font-semibold text-[${primaryColor}] flex-shrink-0`}>
                            PKR {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="details-text-style italic text-slate-500 mt-2">
                      No items in this order.
                    </p>
                  )}
                  <div className="order-total-style">
                    Total: PKR {order.totalPrice.toFixed(2)} <span>({order.paymentMethod})</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      <style jsx>{`
        .action-btn {
          font-size: 0.8rem;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          border: 1px solid transparent;
          cursor: pointer;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .confirm-btn-style {
          background-color: ${accentColor};
          color: white;
          border-color: ${accentColor};
        }
        .confirm-btn-style:hover:not(:disabled) {
          background-color: ${primaryColor};
          border-color: ${primaryColor};
        }
        .cancel-btn-style {
          background-color: #f87171; /* Lighter Red */
          color: white;
          border-color: #f87171;
        }
        .cancel-btn-style:hover:not(:disabled) {
          background-color: #ef4444;
          border-color: #ef4444;
        } /* Standard Red */

        .status-text-indicator {
          font-size: 0.8rem;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          padding: 0.375rem 0.75rem;
          border-radius: 9999px;
          border-width: 1px;
        }

        .details-heading-style {
          font-size: 0.95rem;
          font-weight: 600;
          color: ${primaryColor};
          opacity: 0.9;
          margin-bottom: 0.625rem;
        }
        .details-text-style {
          font-size: 0.875rem;
          color: #374151;
          margin-bottom: 0.375rem;
          line-height: 1.5;
        }
        .item-attr-style {
          font-size: 0.75rem;
          color: #6b7280;
          margin-left: 0.375rem;
          background-color: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
        }

        .order-total-style {
          display: flex;
          justify-content: flex-end;
          align-items: baseline;
          font-weight: 700;
          color: ${primaryColor};
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
          font-size: 1rem;
        }
        .order-total-style span {
          font-size: 0.8rem;
          color: ${lightGrayText};
          margin-left: 0.25rem;
          font-weight: 500;
        }
      `}</style>
    </motion.div>
  )
}

export default OrdersPage
