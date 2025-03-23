import React from 'react'
import arrival_image from "../../public/new_arrival.png"
const MensComponents = () => {
  return (
    <div>
        
            {/* New Arrival Section */}
      <div className="my-24">
      <img src={arrival_image} alt="" />
      </div>

{/* Main Grid Layout */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-[#e5dfd8] my-24">
        {/* Jackets image */}
        <div className="relative bg-[#c9c2b8] p-1">
          <img 
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1287&auto=format&fit=crop" 
            alt="Man wearing jacket" 
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute bottom-5 right-5 text-left">
            <p className="text-black font-medium text-lg mb-1">Jackets</p>
            
          </div>
        </div>
        
        {/* Shirt image */}
        <div className="relative bg-[#c9c2b8] p-1">
          <img 
            src="https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1287&auto=format&fit=crop" 
            alt="Man wearing shirt" 
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute bottom-5 right-5 text-right">
            <p className="text-black font-medium text-lg mb-1">SHIRT</p>
            
          </div>
        </div>
        
        {/* Pants image */}
        <div className="relative bg-[#c9c2b8] p-1">
          <img 
            src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1287&auto=format&fit=crop" 
            alt="Pants" 
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute bottom-5 right-5 text-left">
            <p className="text-black font-medium text-lg mb-1">Pants</p>
            
          </div>
        </div>
        
        {/* Sweatshirt image */}
        <div className="relative bg-[#c9c2b8] p-1">
          <img 
            src="https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1287&auto=format&fit=crop" 
            alt="Man wearing sweatshirt" 
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute bottom-5 right-5 text-right">
            <p className="text-black font-medium text-lg mb-1">SWEATSHIRT</p>
            
          </div>
        </div>
      </div>


    </div>
  )
}

export default MensComponents