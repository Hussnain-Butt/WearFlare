import React from 'react'
import { Link } from 'react-router-dom'
import { Search, User, ShoppingCart, Heart, ShoppingBag } from 'lucide-react'
import Footer from '../components/Footer'
import FashionRevolution from '../components/FashionRevolution'
import autoumnPic from '../../public/Brown Elegant Tender Aesthetic Spring Moodboard Photo Collage Desktop Wallpaper 1.png'
import StudioShowcase from '../components/StudioShowcase'
import girlImage from '../../public/girl-image.png'
import FashionShowcase from '@/components/FashionShowcase'
import StyleHere from '@/components/StyleHere'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'
import Features from '@/components/Features'
import PopularSection from '@/components/PopularSection'
import Faqs from '@/components/Faqs'
import banner1 from '../../public/banner-1.jpg'
import banner2 from '../../public/banner-2.jpg'
import banner3 from '../../public/banner-3.jpg'

const Index = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <section className="w-full py-12 px-8 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* First Part - Single Image */}
          <div className="md:col-span-3 flex items-center animate__animated animate__backInLeft">
            <img src={banner2} alt="Fashion Model" className="w-[180px]  object-cover" />
          </div>

          {/* Second Part - Text Section */}
          <div className="md:col-span-6 flex flex-col justify-center text-center">
            <h1 className="text-5xl italic md:text-7xl font-bold text-[#333] tracking-wide leading-[1.3] md:leading-[1.4] animate__animated animate__bounce">
              Find Your <br />
              Style{' '}
              <span className="text-[#B8860B] font-serif italic relative">
                Here
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <path d="M0,10 Q50,20 100,10" stroke="#B8860B" strokeWidth="2" fill="none" />
                </svg>
              </span>
            </h1>
          </div>

          {/* Third Part - Search Bar & Image Below */}
          <div className="md:col-span-3 flex flex-col gap-6 animate__animated animate__backInRight">
            {/* Search Box */}

            {/* Second Image */}
            <img src={banner3} alt="Fashion Model" className="w-full  object-cover" />
          </div>
        </div>
      </section>

      {/* Main Image Section */}
      <section className="w-full px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-6 animate__animated animate__flash">
        {/* Left - Large Image */}
        <div className="w-full">
          <img src={banner1} alt="Fashion Couple" className="w-full h-[450px] object-cover" />
        </div>

        {/* Right - Text Content */}
        <div className="flex flex-col justify-center">
          <p className="text-gray-700 mb-4">
            Inspiring Styles Available here. Find the Best Choices That Will Always Make You Look
            Stunning
          </p>

          <div>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-full border border-gray-800 px-28 py-2 text-sm text-gray-800 hover:bg-gray-100"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Most Popular Section */}
      <PopularSection />

      {/* Fashion Revolution Component */}
      <FashionRevolution />

      <Faqs />

      <div className="my-10">
        <FashionShowcase />
      </div>

      <Features />

      {/* Autumn Fashion Sale Banner */}
      <img src={autoumnPic} alt="" className="my-8 w-full" />
      {/* <AutumnFashionSale  /> */}
    </div>
  )
}

export default Index
