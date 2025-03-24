import React from 'react'
import girlImage from "/girl-image.png"

const PopularSection = () => {
  return (
    <div>
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
    </div>
  )
}

export default PopularSection