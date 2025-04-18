// src/admin/pages/OrdersPage.tsx OR src/shared/pages/OrdersPage.tsx

import React, { useState, useEffect, useCallback } from 'react'
// Import the configured Axios instance
import apiClient from '../../api/axiosConfig' // Adjust path as necessary
import { toast, Toaster } from 'react-hot-toast'
import { CheckCircle, Loader2, XCircle, Ban } from 'lucide-react'

// --- Interface Definitions (Keep as is) ---
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
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'
  paymentMethod: string
  createdAt: string
  updatedAt: string
}
// --- End Interface Definitions ---

const OrdersPage: React.FC = () => {
  // --- State ---
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null)
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // --- Fetch Orders Function ---
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Use apiClient and relative path. Auth token added by interceptor.
      const response = await apiClient.get<Order[]>('/orders') // <-- Use apiClient, relative path

      setOrders(Array.isArray(response.data) ? response.data : [])
    } catch (err: any) {
      // Catch block remains largely the same
      console.error('Error fetching orders:', err.response?.data || err.message)
      setError('Failed to load orders. Please check network or login status.')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, []) // useCallback dependency array is empty

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // --- Confirm Order Handler ---
  const handleConfirmOrder = async (orderId: string) => {
    if (confirmingOrderId || cancellingOrderId) return // Prevent concurrent actions

    setConfirmingOrderId(orderId)
    toast.loading(`Confirming order ${orderId.slice(-6)}...`)

    try {
      // Use apiClient and relative path. Interceptor adds auth header.
      // No need to pass empty object {} as second arg for patch if no body data
      const response = await apiClient.patch<{ order: Order }>(
        `/orders/${orderId}/confirm`, // <-- Use apiClient, relative path
      )

      toast.dismiss() // Dismiss loading toast
      if (response.status === 200 && response.data.order) {
        toast.success(`Order ${orderId.slice(-6)} confirmed successfully! Email sent.`)
        // Update local state immediately with the updated order from response
        setOrders((prevOrders) =>
          prevOrders.map((order) => (order._id === orderId ? { ...response.data.order } : order)),
        )
      } else {
        // If backend responded with 200 but data is unexpected
        throw new Error(response.data.message || 'Unexpected response from server.')
      }
    } catch (error: any) {
      // Handle errors during the API call
      toast.dismiss()
      console.error(`Error confirming order ${orderId}:`, error.response?.data || error.message)
      const message = error.response?.data?.message || 'Failed to confirm order.'
      toast.error(`❌ ${message}`) // Use template literal for clarity
    } finally {
      setConfirmingOrderId(null) // Reset loading state for this specific order
    }
  }

  // --- Cancel/Decline Order Handler ---
  const handleDeclineOrder = async (orderId: string) => {
    // Confirmation dialog
    if (
      !window.confirm(
        `Are you sure you want to cancel order #${orderId.slice(
          -6,
        )}? This may notify the customer.`,
      )
    ) {
      return
    }

    if (cancellingOrderId || confirmingOrderId) return // Prevent concurrent actions

    setCancellingOrderId(orderId)
    toast.loading(`Cancelling order ${orderId.slice(-6)}...`)

    try {
      // Use apiClient and relative path. Interceptor adds auth header.
      const response = await apiClient.patch<{ order: Order }>(
        `/orders/${orderId}/cancel`, // <-- Use apiClient, relative path
      )

      toast.dismiss() // Dismiss loading toast
      if (response.status === 200 && response.data.order) {
        toast.success(`Order ${orderId.slice(-6)} cancelled successfully!`)
        // Update local state immediately
        setOrders((prevOrders) =>
          prevOrders.map((order) => (order._id === orderId ? { ...response.data.order } : order)),
        )
      } else {
        throw new Error(
          response.data.message || 'Unexpected response from server during cancellation.',
        )
      }
    } catch (error: any) {
      // Handle errors during the API call
      toast.dismiss()
      console.error(`Error cancelling order ${orderId}:`, error.response?.data || error.message)
      const message = error.response?.data?.message || 'Failed to cancel order.'
      toast.error(`❌ ${message}`)
    } finally {
      setCancellingOrderId(null) // Reset loading state for this specific order
    }
  }

  // --- Helper to format date (Keep as is) ---
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString('en-PK', {
        /* options */
      })
    } catch (e) {
      console.warn('Error formatting date:', dateString, e)
      return dateString
    }
  }

  // --- Render Logic (JSX remains the same) ---
  return (
    <div className="p-6 md:p-10 min-h-screen bg-[#f9f7f3] font-sans">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-[#c8a98a] mb-8">Incoming Orders</h1>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center mt-10">
          <Loader2 className="animate-spin h-8 w-8 text-[#c8a98a]" />
          <span className="ml-3 text-gray-600">Loading orders...</span>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <p className="text-center text-red-600 bg-red-100 p-4 rounded-md shadow border border-red-200">
          {error}
        </p>
      )}

      {/* No Orders State */}
      {!loading && !error && orders.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg">No incoming orders found.</p>
      )}

      {/* Orders List */}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => {
            // Determine button states based on order status and loading states
            const isConfirming = confirmingOrderId === order._id
            const isCancelling = cancellingOrderId === order._id
            const canConfirm = order.status === 'Pending'
            const canCancel = order.status === 'Pending' || order.status === 'Confirmed'

            return (
              // --- Order Card ---
              <div
                key={order._id}
                className="bg-white p-5 md:p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                {/* Order Header: ID, Date, Status, Actions */}
                <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start gap-3 mb-4">
                  {/* Left Info */}
                  <div className="flex-grow">
                    {/* ... unchanged JSX for header info ... */}
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                      Order #{order._id.slice(-6)}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Placed on: {formatDate(order.createdAt)}
                    </p>
                    <p
                      className={`text-xs sm:text-sm font-medium mt-2 px-2.5 py-0.5 inline-block rounded-full`}
                    >
                      {order.status}
                    </p>
                  </div>
                  {/* Right Action Buttons/Indicators */}
                  <div className="flex items-center gap-2 flex-wrap flex-shrink-0 mt-2 sm:mt-0">
                    {/* ... unchanged JSX for buttons and indicators ... */}
                    {canConfirm && (
                      <button
                        onClick={() => handleConfirmOrder(order._id)}
                        disabled={isConfirming || isCancelling}
                        className="action-button confirm-button"
                      >
                        {isConfirming ? (
                          <Loader2 className="animate-spin mr-1.5 h-4 w-4" />
                        ) : (
                          <CheckCircle className="mr-1.5 h-4 w-4" />
                        )}{' '}
                        {isConfirming ? 'Confirming' : 'Confirm'}{' '}
                      </button>
                    )}
                    {canCancel && (
                      <button
                        onClick={() => handleDeclineOrder(order._id)}
                        disabled={isConfirming || isCancelling}
                        className="action-button cancel-button"
                      >
                        {isCancelling ? (
                          <Loader2 className="animate-spin mr-1.5 h-4 w-4" />
                        ) : (
                          <XCircle className="mr-1.5 h-4 w-4" />
                        )}{' '}
                        {isCancelling ? 'Cancelling' : 'Cancel'}{' '}
                      </button>
                    )}
                    {/* ... status indicators ... */}
                  </div>
                </div>

                {/* Details Grid (Customer/Shipping) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4 border-t border-gray-100 pt-4">
                  {/* ... unchanged JSX for customer/shipping details ... */}
                  <div>
                    <h3 className="details-heading">Customer Details</h3> {/* ... */}{' '}
                  </div>
                  <div>
                    <h3 className="details-heading">Shipping Address</h3> {/* ... */}{' '}
                  </div>
                </div>

                {/* Order Items List */}
                <div>
                  {/* ... unchanged JSX for order items and total ... */}
                  <h3 className="details-heading border-t border-gray-100 pt-4">Items Ordered</h3>
                  <ul className="space-y-2 mt-2">
                    {order.orderItems.map((item, index) => (
                      <li key={`${item.productId}-${index}`} className="...">
                        {' '}
                        {/* ... */}{' '}
                      </li>
                    ))}
                  </ul>
                  <div className="order-total">
                    Total: PKR {order.totalPrice.toFixed(2)} ({order.paymentMethod})
                  </div>
                </div>
              </div> // End Order Card
            )
          })}
        </div> // End Orders List
      )}

      {/* Basic Styles for Admin Order Page */}
      <style jsx>{`
        .action-button {
          font-size: 0.8rem;
          font-weight: 500;
          padding: 0.4rem 0.8rem;
          border-radius: 0.375rem;
          transition: background-color 0.15s ease-in-out, opacity 0.15s ease-in-out;
          display: inline-flex;
          align-items: center;
          border: none;
          cursor: pointer;
        }
        .action-button:disabled {
          opacity: 0.5;
          cursor: wait;
        }
        .confirm-button {
          background-color: #10b981; /* green-500 */
          color: white;
        }
        .confirm-button:hover:not(:disabled) {
          background-color: #059669; /* green-600 */
        }
        .cancel-button {
          background-color: #ef4444; /* red-500 */
          color: white;
        }
        .cancel-button:hover:not(:disabled) {
          background-color: #dc2626; /* red-600 */
        }
        .status-indicator {
          font-size: 0.8rem;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
        }
        .confirmed-indicator {
          color: #047857; /* green-700 */
          background-color: #d1fae5; /* green-100 */
        }
        .cancelled-indicator {
          color: #b91c1c; /* red-700 */
          background-color: #fee2e2; /* red-100 */
        }
        .shipped-indicator {
          color: #1d4ed8; /* blue-700 */
          background-color: #dbeafe; /* blue-100 */
        }
        .delivered-indicator {
          color: #7e22ce; /* purple-700 */
          background-color: #f3e8ff; /* purple-100 */
        }
        .details-heading {
          font-size: 0.95rem;
          font-weight: 600;
          color: #4b5563; /* gray-600 */
          margin-bottom: 0.5rem;
        }
        .details-text {
          font-size: 0.875rem; /* text-sm */
          color: #374151; /* gray-700 */
          margin-bottom: 0.25rem;
          line-height: 1.4;
        }
        .item-attribute {
          font-size: 0.75rem;
          color: #6b7280;
          margin-left: 0.25rem;
        }
        .order-total {
          display: flex;
          justify-content: flex-end;
          font-weight: 700; /* bold */
          color: #1f2937; /* gray-800 */
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e5e7eb; /* gray-200 */
          font-size: 0.95rem;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div> // End Page Container
  )
}

export default OrdersPage
