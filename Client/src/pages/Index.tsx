import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User, ShoppingCart, Heart, ShoppingBag } from 'lucide-react';
import Footer from '../components/Footer';
import FashionRevolution from '../components/FashionRevolution';
import autoumnPic from "../../public/Brown Elegant Tender Aesthetic Spring Moodboard Photo Collage Desktop Wallpaper 1.png"
import StudioShowcase from '../components/StudioShowcase';
import girlImage from "../../public/girl-image.png"
import FashionShowcase from '@/components/FashionShowcase';
import StyleHere from '@/components/StyleHere';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
const Index = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">

      {/* main navbar  */}
      <nav className="flex justify-between text-black w-full items-center px-8 py-6 relative z-10">
      <div className="flex gap-8 items-center">
        <Link to="/" className="font-bold">HOME</Link>
        <Link to="#" className="font-bold">MEN</Link>
        <Link to="#" className="font-bold t">WOMEN</Link>
        <Link to="/virtual-fitting-room-creation" className="font-bold">VIRTUAL FITTING ROOM CREATION</Link>
        <Link to="/virtual-fitting-room" className="font-bold">VIRTUAL FITTING ROOM</Link>
        <Link to="/3d-avatar-customization" className="font-bold">3D AVATAR CUSTOMIZATION</Link>
      </div>
      <div className="flex gap-6 items-center">
        <Link to="#"><Search className="h-6 w-6" /></Link>
        <Link to="#"><Heart className="h-6 w-6" /></Link>
        <Link to="#"><User className="h-6 w-6" /></Link>
        <Link to="#"><ShoppingBag className="h-6 w-6" /></Link>
      </div>
    </nav>

      {/* Navigation Bar */}
      <nav className="flex justify-between items-center py-4 px-6 md:px-12">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/834c4203-b1ea-4cb0-8dbe-044cbc51ec0c.png" 
              alt="WearFlare Logo" 
              className="h-10"
            />
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-6 text-gray-800 text-sm">
            <Link to="/" className="font-medium">Home</Link>
            <Link to="#" className="font-medium">Men</Link>
            <Link to="#" className="font-medium">Women</Link>
            <Link to="#" className="font-medium">Avatar</Link>
            <Link to="#" className="font-medium">About Us</Link>
          </div>
        </div>
        
        {/* User Icons */}
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-700 hover:text-black">
            <User className="h-5 w-5" />
          </Link>
          <Link to="#" className="text-gray-700 hover:text-black">
            <ShoppingCart className="h-5 w-5" />
          </Link>
        </div>
      </nav>

<section className="w-full py-12 px-8 md:px-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* First Part - Single Image */}
        <div className="md:col-span-3 flex items-center">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1288&q=80"
            alt="Fashion Model"
            className="w-full h-[200px] object-cover"
          />
        </div>

        {/* Second Part - Text Section */}
        <div className="md:col-span-6 flex flex-col justify-center text-center">
        <h1 className="text-5xl  italic md:text-7xl font-medium text-[#333] tracking-wide leading-[1.3] md:leading-[1.4]">
  Find Your {" "}
<br />
  Style{" "}
  <span className="text-[#B8860B] font-serif italic relative">
     Here
    <svg
      className="absolute -bottom-2 left-0 w-full"
      viewBox="0 0 100 20"
      preserveAspectRatio="none"
    >
      <path
        d="M0,10 Q50,20 100,10"
        stroke="#B8860B"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  </span>
</h1>

        </div>

        {/* Third Part - Search Bar & Image Below */}
        <div className="md:col-span-3 flex flex-col gap-6">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2.5 rounded-full bg-[#e9e2d8] text-gray-800 outline-none"
            />
            <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600">
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Second Image */}
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1288&q=80"
            alt="Fashion Model"
            className="w-full h-[200px] object-cover"
          />

     
        </div>
      </div>
    </section>
      

      
    
      {/* Main Image Section */}
      <section className="w-full px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left - Large Image */}
        <div className="w-full">
          <img 
            src="https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1292&q=80" 
            alt="Fashion Couple"
            className="w-full h-[350px] object-cover"
          />
        </div>
        
        {/* Right - Text Content */}
        <div className="flex flex-col justify-center">
          <p className="text-gray-700 mb-4">
            Inspiring Styles Available here. Find the Best Choices That Will Always Make You Look Stunning
          </p>
          
          <div>
            <Link to="#" className="inline-flex items-center justify-center rounded-full border border-gray-800 px-6 py-2 text-sm text-gray-800 hover:bg-gray-100">
              Shop Now
            </Link>
          </div>
        </div>
      </section>
      
      {/* Most Popular Section */}
      <section className="w-full py-10 px-6 md:px-12 bg-[#D3C5B8] mt-10">
        <h2 className="text-4xl font-medium text-center mb-8 text-[#725D45]">Most Popular</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Product 1 */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 w-full">
              <img 
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                alt="Timeless Classic Collection"
                className="w-full object-cover"
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-800 font-medium">Timeless Classic Collection</p>
              <p className="text-sm font-medium mt-1">$124.90</p>
            </div>
          </div>
          
          {/* Product 2 */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 w-full">
              <img 
                src={girlImage} 
                alt="Bohemian Rhapsody Attire"
                className="w-full object-cover"
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-800 font-medium">Bohemian Rhapsody Attire</p>
              <p className="text-sm font-medium mt-1">$145.50</p>
            </div>
          </div>
          
          {/* Product 3 */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 w-full">
              <img 
                src="https://images.unsplash.com/photo-1516826957135-700dedea698c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                alt="Power Suit Ensemble"
                className="w-full  object-cover"
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-800 font-medium">Power Suit Ensemble</p>
              <p className="text-sm font-medium mt-1">$125.50</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Fashion Revolution Component */}
      <FashionRevolution />

     
      
      <div className='my-10'>
      <FashionShowcase/>
      </div>


      <div className="w-full bg-[#e2d7cf] py-8">
              <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-6 md:px-12">
                {/* Secure Payments */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto md:mx-0">
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto md:mx-0">
                      <path d="M3 9h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                      <path d="M12 3v6" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-lg mb-1">Free Shipping</h3>
                  <p className="text-sm text-gray-700">
                    Shopping with no extra charges - savor the liberty of complimentary shipping on every order.
                  </p>
                </div>
      
                {/* Easy Returns */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto md:mx-0">
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto md:mx-0">
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



      {/* <div>
        <img src={studio} alt="" />
        <StudioShowcase/>
      </div> */}
      {/* Autumn Fashion Sale Banner */}
      <img src={autoumnPic} alt="" className='my-8' />
      {/* <AutumnFashionSale  /> */}
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
