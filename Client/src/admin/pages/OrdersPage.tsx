// src/admin/pages/OrdersPage.tsx
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast, Toaster } from 'react-hot-toast'
import { CheckCircle, Clock, Loader2, XCircle, Ban } from 'lucide-react'

// Define API base URL - Make sure this is correct for your environment
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app/' // Or https://backend-production-c8ff.up.railway.app/

// --- Interface Definitions ---

// Interface for items within an order
interface OrderItem {
  productId: string // Ensure this matches your backend model's reference ID field name
  title: string
  price: number // Use number if your backend/context uses number
  quantity: number
  image?: string
  selectedSize?: string | null // Allow null if size might not be selected
  selectedColor?: string | null // Allow null if color might not be selected
}

// Interface for the shipping address structure
interface ShippingAddress {
  street: string
  city: string
  postalCode: string
  country: string
}

// Interface for the main Order object (Matches backend model)
interface Order {
  _id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: ShippingAddress
  orderItems: OrderItem[]
  totalPrice: number // Use number if your backend/context uses number
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled' // Use defined statuses
  paymentMethod: string
  createdAt: string // Assuming ISO date string from backend
  updatedAt: string // Assuming ISO date string from backend
}
// --- End Interface Definitions ---

const OrdersPage: React.FC = () => {
  // --- State ---
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true) // Loading state for initial fetch
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null) // Loading state for confirming specific order
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null) // Loading state for cancelling specific order
  const [error, setError] = useState<string | null>(null) // Error message state

  // --- Fetch Orders Function ---
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // TODO: Add authentication headers if admin routes are protected
      // Example: const token = localStorage.getItem('adminToken');
      // const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get<Order[]>(
        `${API_BASE_URL}/api/orders`,
        // config // Add config here if using authentication
      )
      // Ensure data is an array before setting
      setOrders(Array.isArray(response.data) ? response.data : [])
    } catch (err: any) {
      console.error('Error fetching orders:', err.response?.data || err.message)
      setError('Failed to load orders. Please check network or login status.')
      setOrders([]) // Clear orders on error
    } finally {
      setLoading(false)
    }
  }, []) // Empty dependency array - fetch once on mount typically

  // Fetch orders when component mounts
  useEffect(() => {
    fetchOrders()
  }, [fetchOrders]) // Include fetchOrders in dependency array

  // --- Confirm Order Handler ---
  const handleConfirmOrder = async (orderId: string) => {
    if (confirmingOrderId || cancellingOrderId) return // Prevent concurrent actions

    setConfirmingOrderId(orderId)
    toast.loading(`Confirming order ${orderId.slice(-6)}...`)

    try {
      // TODO: Add authentication headers if needed
      // const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.patch<{ order: Order }>(
        `${API_BASE_URL}/api/orders/${orderId}/confirm`,
        // config
      )

      toast.dismiss()
      if (response.status === 200 && response.data.order) {
        toast.success(`Order ${orderId.slice(-6)} confirmed successfully! Email sent.`)
        // Update local state immediately
        setOrders((prevOrders) =>
          prevOrders.map(
            (order) => (order._id === orderId ? { ...response.data.order } : order), // Use full updated order data
          ),
        )
      } else {
        throw new Error(response.data.message || 'Unexpected response from server.')
      }
    } catch (error: any) {
      toast.dismiss()
      console.error(`Error confirming order ${orderId}:`, error.response?.data || error.message)
      const message = error.response?.data?.message || 'Failed to confirm order.'
      toast.error(message)
    } finally {
      setConfirmingOrderId(null)
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
      // TODO: Add authentication headers if needed
      // const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.patch<{ order: Order }>(
        `${API_BASE_URL}/api/orders/${orderId}/cancel`, // Call the cancel endpoint
        // config
      )

      toast.dismiss()
      if (response.status === 200 && response.data.order) {
        toast.success(`Order ${orderId.slice(-6)} cancelled successfully!`)
        // Update local state immediately
        setOrders((prevOrders) =>
          prevOrders.map(
            (order) => (order._id === orderId ? { ...response.data.order } : order), // Use full updated order data
          ),
        )
      } else {
        throw new Error(
          response.data.message || 'Unexpected response from server during cancellation.',
        )
      }
    } catch (error: any) {
      toast.dismiss()
      console.error(`Error cancelling order ${orderId}:`, error.response?.data || error.message)
      const message = error.response?.data?.message || 'Failed to cancel order.'
      toast.error(message)
    } finally {
      setCancellingOrderId(null)
    }
  }

  // --- Helper to format date ---
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A' // Handle cases where date might be null/undefined
    try {
      return new Date(dateString).toLocaleString('en-PK', {
        // Use a locale like en-PK or en-GB/en-US
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // Use AM/PM
      })
    } catch (e) {
      console.warn('Error formatting date:', dateString, e)
      return dateString // Fallback to original string if formatting fails
    }
  }

  // --- Render Logic ---
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
            const isConfirming = confirmingOrderId === order._id
            const isCancelling = cancellingOrderId === order._id
            // Determine if actions are possible (e.g., only for Pending/Confirmed)
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
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                      Order #{order._id.slice(-6)} {/* Show last 6 digits for brevity */}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Placed on: {formatDate(order.createdAt)}
                    </p>
                    {/* Status Badge */}
                    <p
                      className={`text-xs sm:text-sm font-medium mt-2 px-2.5 py-0.5 inline-block rounded-full ${
                        order.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          : order.status === 'Confirmed'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : order.status === 'Delivered'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : order.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                    >
                      {order.status}
                    </p>
                  </div>
                  {/* Right Action Buttons/Indicators */}
                  <div className="flex items-center gap-2 flex-wrap flex-shrink-0 mt-2 sm:mt-0">
                    {/* Confirm Button */}
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
                        )}
                        {isConfirming ? 'Confirming' : 'Confirm'}
                      </button>
                    )}
                    {/* Cancel Button */}
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
                        )}
                        {isCancelling ? 'Cancelling' : 'Cancel'}
                      </button>
                    )}
                    {/* Status Indicators (when no actions possible) */}
                    {order.status === 'Confirmed' &&
                      !canCancel && ( // Show only if cannot be cancelled
                        <span className="status-indicator confirmed-indicator">
                          <CheckCircle className="mr-1 h-4 w-4" /> Confirmed
                        </span>
                      )}
                    {order.status === 'Cancelled' && (
                      <span className="status-indicator cancelled-indicator">
                        <Ban className="mr-1 h-4 w-4" /> Cancelled
                      </span>
                    )}
                    {/* Add indicators for Shipped, Delivered */}
                    {order.status === 'Shipped' && (
                      <span className="status-indicator shipped-indicator">Shipped</span>
                    )}
                    {order.status === 'Delivered' && (
                      <span className="status-indicator delivered-indicator">Delivered</span>
                    )}
                  </div>
                </div>

                {/* Details Grid (Customer/Shipping) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4 border-t border-gray-100 pt-4">
                  <div>
                    <h3 className="details-heading">Customer Details</h3>
                    <p className="details-text">
                      <strong>Name:</strong> {order.customerName}
                    </p>
                    <p className="details-text break-words">
                      <strong>Email:</strong> {order.customerEmail}
                    </p>
                    <p className="details-text">
                      <strong>Phone:</strong> {order.customerPhone}
                    </p>
                  </div>
                  <div>
                    <h3 className="details-heading">Shipping Address</h3>
                    <p className="details-text">{order.shippingAddress.street}</p>
                    <p className="details-text">
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                    </p>
                    <p className="details-text">{order.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Order Items List */}
                <div>
                  <h3 className="details-heading border-t border-gray-100 pt-4">Items Ordered</h3>
                  <ul className="space-y-2 mt-2">
                    {order.orderItems.map((item, index) => (
                      <li
                        key={`${item.productId}-${index}`}
                        className="details-text flex flex-col sm:flex-row sm:justify-between sm:items-center"
                      >
                        {/* Item Details */}
                        <div className="flex-grow mb-1 sm:mb-0">
                          {item.title} (Qty: {item.quantity})
                          {item.selectedSize && (
                            <span className="item-attribute">[{item.selectedSize}]</span>
                          )}
                          {item.selectedColor && (
                            <span className="item-attribute">[{item.selectedColor}]</span>
                          )}
                        </div>
                        {/* Item Subtotal */}
                        <span className="font-medium text-gray-700 flex-shrink-0">
                          PKR {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {/* Order Total */}
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
