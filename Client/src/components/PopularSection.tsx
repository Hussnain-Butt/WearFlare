import React from 'react'
import girlImage from '/girl-image.png'
import Jackets from '../assets/mens jackets/jacket-1.jpg'
import Shirts from '../assets/mens shirts/shirt-1.jpg'
import Pants from '../assets/men pents/pant-1.jpg'
import SweatShirt from '../assets/men sweatshirts/sweatshirt-1.jpg'
import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'
const PopularSection = () => {
  return (
    <div>
      <section className="w-full py-10 px-6 md:px-12 bg-[#D3C5B8] mt-10 ">
        <h2 className="text-4xl font-medium text-center mb-8 text-[#725D45]">Most Popular</h2>
        <AnimatedSection direction="left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Product 1 */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 w-full">
                <img
                  src={Jackets}
                  alt="Timeless Classic Collection"
                  className="w-full object-cover"
                />
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-800 font-medium">Timeless Classic Collection</p>
                <p className="text-sm font-medium mt-1">9999 Rs</p>
              </div>
            </div>

            {/* Product 2 */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 w-full  h-full">
                <img
                  src={Shirts}
                  alt="Bohemian Rhapsody Attire"
                  className="w-full  h-full object-cover"
                />
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-800 font-medium">Bohemian Rhapsody Attire</p>
                <p className="text-sm font-medium mt-1">8999 Rs</p>
              </div>
            </div>

            {/* Product 3 */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 w-full h-full">
                <img
                  src={Pants}
                  alt="Power Suit Ensemble"
                  className="w-full  h-full object-cover"
                />
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-800 font-medium">Power Suit Ensemble</p>
                <p className="text-sm font-medium mt-1">7999 Rs</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}

export default PopularSection
