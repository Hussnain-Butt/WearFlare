// src/layouts/PublicLayout.jsx
import React from 'react'
import { Outlet } from 'react-router-dom' // Yeh zaroori hai child routes ko render karne ke liye

// Apne NavbarComponent aur FooterComponent ke sahi path yahan dein
import NavbarComponent from '../components/NavbarComponent'
import Footer from '../components/Footer'

const PublicLayout = () => {
  return (
    <>
      <NavbarComponent />
      <main style={{ minHeight: 'calc(100vh - 120px)', paddingTop: '60px' }}>
        {' '}
        {/* Example: Adjust paddingTop if navbar is fixed */}
        {/* Outlet woh jagah hai jahan aapke nested public page components render honge */}
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default PublicLayout
