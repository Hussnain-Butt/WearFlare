// src/pages/Men.tsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import Pant1 from '../assets/men pents/pant-1.jpg'
import Pant2 from '../assets/men pents/pant-2.jpg'
import Pant3 from '../assets/men pents/pant-3.jpg'
import Pant4 from '../assets/men pents/pant-4.jpg'
import Pant5 from '../assets/men pents/pant-5.jpg'
import Jacket1 from '../assets/mens jackets/jacket-1.jpg'
import Jacket2 from '../assets/mens jackets/jacket-2.jpg'
import Jacket3 from '../assets/mens jackets/jacket-3.jpg'
import Jacket4 from '../assets/mens jackets/jacket-4.jpg'
import Jacket5 from '../assets/mens jackets/jacket-5.jpg'
import Shirt1 from '../assets/mens shirts/shirt-1.jpg'
import Shirt2 from '../assets/mens shirts/shirt-2.jpg'
import Shirt3 from '../assets/mens shirts/shirt-3.jpg'
import Shirt4 from '../assets/mens shirts/shirt-4.jpg'
import Shirt5 from '../assets/mens shirts/shirt-5.jpg'
import SweatShirt1 from '../assets/men sweatshirts/sweatshirt-1.jpg'
import SweatShirt2 from '../assets/men sweatshirts/sweatshirt-2.jpg'
import SweatShirt3 from '../assets/men sweatshirts/sweatshirt-3.jpg'
import SweatShirt4 from '../assets/men sweatshirts/sweatshirt-4.jpg'
import SweatShirt5 from '../assets/men sweatshirts/sweatshirt-5.jpg'

import MensComponents from '@/components/MensComponents'
import NewsLetter from '@/components/NewsLetter'

interface Product {
  id: number
  title: string
  price: string
  category: string
  image: string
}

export const menProducts = [
  // Pants
  { id: 1, title: 'BLACK BLENDED Pants', price: 'PKR 3,592.00', category: 'Pants', image: Pant1 },
  {
    id: 2,
    title: 'GRAY BLENDED FORMAL Pants',
    price: 'PKR 18,990.00',
    category: 'Pants',
    image: Pant2,
  },
  {
    id: 3,
    title: 'NAVY BLUE COTTON Pants',
    price: 'PKR 3,192.00',
    category: 'Pants',
    image: Pant3,
  },
  {
    id: 4,
    title: 'WHITE EMBROIDERED Pants',
    price: 'PKR 5,200.00',
    category: 'Pants',
    image: Pant4,
  },
  {
    id: 5,
    title: 'WHITE EMBROIDERED Pants',
    price: 'PKR 5,200.00',
    category: 'Pants',
    image: Pant5,
  },

  // SweatShirts
  {
    id: 6,
    title: 'CLASSIC Jackets',
    price: 'PKR 4,500.00',
    category: 'Jackets',
    image: Jacket1,
  },
  {
    id: 7,
    title: 'ELEGANT WHITE Jackets',
    price: 'PKR 6,800.00',
    category: 'Jackets',
    image: Jacket2,
  },
  {
    id: 8,
    title: 'BROWN COTTON Jackets',
    price: 'PKR 3,900.00',
    category: 'Jackets',
    image: Jacket3,
  },
  {
    id: 9,
    title: 'FORMAL BLACK Jackets',
    price: 'PKR 7,500.00',
    category: 'Jackets',
    image: Jacket4,
  },

  {
    id: 10,
    title: 'FORMAL BLACK Jackets',
    price: 'PKR 7,500.00',
    category: 'Jackets',
    image: Jacket5,
  },

  // Shirts
  {
    id: 11,
    title: 'ELEGANT Shirt ATTIRE',
    price: 'PKR 25,000.00',
    category: 'Shirts',
    image: Shirt1,
  },
  {
    id: 12,
    title: 'ROYAL BLUE Shirt SHERWANI',
    price: 'PKR 35,000.00',
    category: 'Shirts',
    image: Shirt2,
  },
  {
    id: 13,
    title: 'GOLDEN EMBROIDERED Shirt SHERWANI',
    price: 'PKR 40,000.00',
    category: 'Shirts',
    image: Shirt3,
  },
  {
    id: 14,
    title: 'TRADITIONAL MAROON Shirt SUIT',
    price: 'PKR 30,000.00',
    category: 'Shirts',
    image: Shirt4,
  },
  {
    id: 15,
    title: 'TRADITIONAL MAROON Shirt SUIT',
    price: 'PKR 30,000.00',
    category: 'Shirts',
    image: Shirt5,
  },
  // Shirts
  {
    id: 16,
    title: 'COMFY SWEATSHIRT',
    price: 'PKR 2,999.00',
    category: 'Sweatshirt',
    image: SweatShirt1,
  },
  {
    id: 17,
    title: 'STYLISH HOODED SWEATSHIRT',
    price: 'PKR 4,200.00',
    category: 'Sweatshirt',
    image: SweatShirt2,
  },
  {
    id: 18,
    title: 'CASUAL GREY SWEATSHIRT',
    price: 'PKR 3,800.00',
    category: 'Sweatshirt',
    image: SweatShirt3,
  },
  {
    id: 19,
    title: 'OVERSIZED BLACK SWEATSHIRT',
    price: 'PKR 5,000.00',
    category: 'Sweatshirt',
    image: SweatShirt4,
  },
  {
    id: 20,
    title: 'OVERSIZED BLACK SWEATSHIRT',
    price: 'PKR 5,000.00',
    category: 'Sweatshirt',
    image: SweatShirt5,
  },
]

const categories = ['All', 'Pants', 'Sweatshirt', 'Jackets', 'Shirts']

const Men: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const { addToCart, totalItems } = useCart()

  const filteredProducts =
    selectedCategory === 'All'
      ? menProducts
      : menProducts.filter((product) => product.category === selectedCategory)

  return (
    <div className="min-h-screen bg-[#eee8e3]">
      <div className="w-full py-3 px-8 bg-[#e5dfd8] flex justify-between">
        <div className="flex justify-between">
          <Link to="/" className="text-sm text-gray-700">
            HOME
          </Link>
          <ChevronRight className="h-5" />
          <Link to="/men" className="text-sm text-gray-700">
            MEN
          </Link>
        </div>
        <Link to="/cart" className="relative">
          🛒 Cart ({totalItems})
        </Link>
      </div>

      <section className="w-full py-10 px-6 md:px-12 bg-[#D3C5B8] mt-10 my-32">
        <h2 className="text-4xl font-medium text-center mb-8 text-[#725D45]">Men's Western</h2>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center mb-6 gap-3">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-[#6b5745] text-white'
                  : 'bg-white text-black hover:bg-[#6b5745] hover:text-white'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="flex flex-col items-center">
              <div className="bg-white p-4 w-full">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-[450px] h-[450px] object-cover"
                />
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-800 font-medium">{product.title}</p>
                <p className="text-sm font-medium mt-1">{product.price}</p>
                <button
                  className="mt-2 px-4 py-2 bg-[#6b5745] text-white rounded-full hover:bg-[#5d4c3b]"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart 🛒
                </button>
                <button className="mt-2 ml-2 px-4 py-2 bg-[#8B4513] text-white rounded-full hover:bg-[#70421e]">
                  Try Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <MensComponents />
      <NewsLetter />
    </div>
  )
}

export default Men
