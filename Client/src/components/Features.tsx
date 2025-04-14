import React from 'react'

const Features = () => {
  return (
    <div>
      <div className="w-full bg-[#e2d7cf] py-8 my-16">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-6 md:px-12">
          {/* Secure Payments */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto md:mx-0"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="font-medium text-lg mb-1">Secure Payments</h3>
            <p className="text-sm text-gray-700">
              Shop with confidence knowing that your transactions are safeguarded.
            </p>
          </div>

          {/* Free Shipping */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto md:mx-0"
              >
                <path d="M3 9h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                <path d="M12 3v6" />
              </svg>
            </div>
            <h3 className="font-medium text-lg mb-1">Free Shipping</h3>
            <p className="text-sm text-gray-700">
              Shopping with no extra charges - savor the liberty of complimentary shipping on every
              order.
            </p>
          </div>

          {/* Easy Returns */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto md:mx-0"
              >
                <path d="M9 14 4 9l5-5" />
                <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
              </svg>
            </div>
            <h3 className="font-medium text-lg mb-1">Easy Returns</h3>
            <p className="text-sm text-gray-700">
              With our hassle-free Easy Returns, changing your mind has never been more convenient.
            </p>
          </div>

          {/* Order Tracking */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto md:mx-0"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h3 className="font-medium text-lg mb-1">Order Tracking</h3>
            <p className="text-sm text-gray-700">
              Stay in the loop with our Order Tracking feature - from checkout to your doorstep.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features
