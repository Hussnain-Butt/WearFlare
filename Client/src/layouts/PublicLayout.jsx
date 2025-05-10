// src/layouts/PublicLayout.jsx
import React from 'react'
import { Outlet } from 'react-router-dom'

// Apne NavbarComponent aur FooterComponent ke sahi path yahan dein
// Assuming NavbarComponent is your Navbar.tsx, let's rename for clarity.
import Navbar from '../components/Navbar' // Make sure the path and component name match your Navbar file
import Footer from '../components/Footer' // Make sure the path and component name match your Footer file

const PublicLayout = () => {
  // Agar aapka Navbar fixed height ka hai (e.g., h-16 ya h-20 in Tailwind),
  // toh aap us height ko yahan paddingTop ke liye use kar sakte hain.
  // Example: Navbar is 4rem (h-16) high.
  const navbarHeightClass = 'pt-16 md:pt-20' // Adjust based on your Navbar's actual height classes

  return (
    // This div will be a flex child of App.tsx's main div.
    // flex-grow will allow the main content to push the footer down.
    <div className="flex flex-col flex-grow">
      <Navbar />
      <main className={`flex-grow ${navbarHeightClass}`}>
        {/*
          paddingTop:
          Agar aapka Navbar `position: fixed` ya `sticky` hai aur uski height hai,
          toh content ko Navbar ke neeche se shuru karne ke liye paddingTop zaroori hai.
          Maine upar `navbarHeightClass` mein example diya hai. Apne Navbar ki height ke hisaab se adjust karein.
          Agar Navbar fixed/sticky nahi hai, toh paddingTop ki zaroorat nahi.

          minHeight:
          `flex-grow` on this main tag and its parent div should handle pushing the footer down
          and ensuring content takes available space. Explicit minHeight might not be needed.
          If you still find footer overlapping, you can add a min-height class like `min-h-[calc(100vh-NAV_HEIGHT-FOOTER_HEIGHT)]`
          but dynamic calculation with flexbox is generally preferred.
        */}
        <Outlet /> {/* Child public page components render here */}
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
