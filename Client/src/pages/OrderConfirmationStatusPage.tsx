// src/pages/OrderConfirmationStatusPage.tsx
import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react' // Added Loader2

const OrderConfirmationStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  // Initialize state to 'loading'
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'error'>('loading')
  const [orderId, setOrderId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null) // Optional error message

  useEffect(() => {
    const statusParam = searchParams.get('status')
    const orderIdParam = searchParams.get('orderId')
    const messageParam = searchParams.get('message') // Optional message from backend redirect

    if (statusParam === 'success') {
      setStatus('success')
      setOrderId(orderIdParam)
    } else if (statusParam === 'failed') {
      setStatus('failed')
      setErrorMessage(messageParam || 'The confirmation link may be invalid or expired.')
    } else if (statusParam === 'error') {
      setStatus('error')
      setErrorMessage(messageParam || 'An unexpected error occurred.')
    } else {
      // If no status param, assume something went wrong or page was accessed directly
      setStatus('error')
      setErrorMessage('Invalid confirmation access.')
    }
  }, [searchParams]) // Dependency array

  const renderContent = () => {
    switch (status) {
      case 'loading': // Show loading indicator initially
        return (
          <>
            <Loader2 className="w-12 h-12 text-gray-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Verifying your order confirmation...</p>
          </>
        )
      case 'success':
        return (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Order Confirmed!</h1>
            {orderId && <p className="text-gray-600 mb-1">Order ID: #{orderId}</p>}
            <p className="text-gray-600 mb-6">
              Your order is now being processed. You'll receive another email when it ships
              (typically within 3-4 working days).
            </p>
            {/* <Link
              to="/" // Link to homepage
              className="inline-block px-6 py-2 bg-[#c8a98a] text-white rounded hover:bg-[#b08d6a] transition duration-200"
            >
              Continue Shopping
            </Link> */}
          </>
        )
      case 'failed':
        return (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Confirmation Failed</h1>
            <p className="text-gray-600 mb-6">
              {errorMessage} Please try placing your order again or contact support if the problem
              persists.
            </p>
            <Link
              to="/cart" // Link back to cart
              className="inline-block px-6 py-2 bg-[#c8a98a] text-white rounded hover:bg-[#b08d6a] transition duration-200"
            >
              Return to Cart
            </Link>
          </>
        )
      case 'error':
      default:
        return (
          <>
            <AlertTriangle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">An Error Occurred</h1>
            <p className="text-gray-600 mb-6">
              {errorMessage || 'Something went wrong.'} Please contact customer support for
              assistance.
            </p>
            <Link
              to="/" // Link to homepage
              className="inline-block px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200"
            >
              Go to Homepage
            </Link>
          </>
        )
    }
  }

  return (
    // Added padding top/bottom for better spacing on different screen heights
    <div className="min-h-screen flex items-center justify-center bg-[#F8F6F2] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-lg shadow-xl text-center">
        {renderContent()}
      </div>
    </div>
  )
}

export default OrderConfirmationStatusPage
