import React from 'react'
import Jackets from '../assets/mens jackets/jacket-1.jpg'
import Shirts from '../assets/mens shirts/shirt-1.jpg'
import Pants from '../assets/men pents/pant-1.jpg'
import SweatShirt from '../assets/men sweatshirts/sweatshirt-1.jpg'

const MensComponents = () => {
  return (
    <div>
      {/* New Arrival Section */}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-[#e5dfd8] my-24">
        {/* Jackets image */}
        <div className="relative bg-[#c9c2b8] p-1">
          <img src={Jackets} alt="Man wearing jacket" className="w-full h-[500px] object-cover" />
          <div className="absolute bottom-5 right-5 text-left">
            <p className="text-black font-medium text-lg mb-1">Jackets</p>
          </div>
        </div>

        {/* Shirt image */}
        <div className="relative bg-[#c9c2b8] p-1">
          <img src={Shirts} alt="Man wearing shirt" className="w-full h-[500px] object-cover" />
          <div className="absolute bottom-5 right-5 text-right">
            <p className="text-black font-medium text-lg mb-1">SHIRT</p>
          </div>
        </div>

        {/* Pants image */}
        <div className="relative bg-[#c9c2b8] p-1">
          <img src={Pants} alt="Pants" className="w-full h-[500px] object-cover" />
          <div className="absolute bottom-5 right-5 text-left">
            <p className="text-black font-medium text-lg mb-1">Pants</p>
          </div>
        </div>

        {/* Sweatshirt image */}
        <div className="relative bg-[#c9c2b8] p-1">
          <img
            src={SweatShirt}
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
