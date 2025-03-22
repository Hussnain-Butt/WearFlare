import { Search } from 'lucide-react'
import React from 'react'
import { Button } from 'react-day-picker'

const StyleHere = () => {
  return (
    <div>
      <section className="w-full py-12 px-8 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Image */}
          <div className="md:col-span-2 flex items-center">
            <img 
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1288&q=80" 
              alt="Fashion Model"
              className="w-full h-[180px] object-cover"
            />
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-6 flex flex-col justify-center">
            <h1 className="text-5xl md:text-7xl font-medium text-[#333] tracking-tight">
              Find Your Style 
              <span className="text-[#B8860B] font-serif italic relative">
                Here
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,10 Q50,20 100,10" stroke="#B8860B" strokeWidth="2" fill="none" />
                </svg>
              </span>
            </h1>
            
            {/* Search Box */}
            <div className="mt-12 max-w-md">
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
            </div>
          </div>
          
          {/* Right Image and Text */}
          <div className="md:col-span-4 flex flex-col gap-8">
            <img 
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1288&q=80" 
              alt="Fashion Model"
              className="w-full h-[180px] object-cover"
            />
            
            <div className="space-y-4">
              <p className="text-gray-700 text-lg">
                Inspiring Styles Available here. Find the Best Choices That Will Always Make You Look Stunning
              </p>
              
              <Button className="rounded-full bg-transparent text-black border border-gray-300 hover:bg-gray-100 px-8 py-6">
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Image Section */}
      <section className="w-full">
        <div className="w-full h-[300px] md:h-[400px]">
          <img 
            src="https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1292&q=80" 
            alt="Fashion Couple"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  )
}

export default StyleHere