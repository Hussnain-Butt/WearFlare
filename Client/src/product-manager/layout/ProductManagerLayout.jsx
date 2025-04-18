import React from 'react'
import { Outlet } from 'react-router-dom'
import ProductManagerSidebar from '../components/ProductManagerSidebar' // Sidebar import karna

const ProductManagerLayout = () => {
  return (
    // Admin layout jaisa style use karein
    <div className="flex min-h-screen bg-gray-100">
      <ProductManagerSidebar /> {/* Yahan PM ka specific sidebar add karein */}
      {/* Main Content Area */}
      <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <Outlet /> {/* Yahaan nested routes (Products, OrdersPage) render honge */}
      </div>
    </div>
  )
}

export default ProductManagerLayout
