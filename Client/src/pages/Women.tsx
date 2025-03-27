// src/pages/Men.tsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ShoppingCart } from 'lucide-react'

import { useCart } from '../context/CartContext'
import WomenJackets1 from '../assets/women jacktes/women-jacket-1.jpg'
import WomenJackets2 from '../assets/women jacktes/women-jacket-2.jpg'
import WomenJackets3 from '../assets/women jacktes/women-jacket-3.jpg'
import WomenJackets4 from '../assets/women jacktes/women-jacket-4.jpg'
import WomenJackets5 from '../assets/women jacktes/women-jacket-5.jpg'
import WomenPants1 from '../assets/women pens/women-pents-1.jpg'
import WomenPants2 from '../assets/women pens/women-pents-2.jpg'
import WomenPants3 from '../assets/women pens/women-pents-3.jpg'
import WomenPants4 from '../assets/women pens/women-pents-4.jpg'
import WomenPants5 from '../assets/women pens/women-pents-5.jpg'
import WomenShirts1 from '../assets/women shirts/women-shirt-1.jpg'
import WomenShirts2 from '../assets/women shirts/women-shirt-2.jpg'
import WomenShirts3 from '../assets/women shirts/women-shirt-3.jpg'
import WomenShirts4 from '../assets/women shirts/women-shirt-4.jpg'
import WomenShirts5 from '../assets/women shirts/women-shirt-5.jpg'
import WomenSweatShirts1 from '../assets/women sweatshirts/women-sweat-1.jpg'
import WomenSweatShirts2 from '../assets/women sweatshirts/women-sweat-2.jpg'
import WomenSweatShirts3 from '../assets/women sweatshirts/women-sweat-3.jpg'
import WomenSweatShirts4 from '../assets/women sweatshirts/women-sweat-4.jpg'
import WomenSweatShirts5 from '../assets/women sweatshirts/women-sweat-5.jpg'

import women_banner from '/women_banner.png'
import NewsLetter from '@/components/NewsLetter'
import Features from '@/components/Features'
import WomensComponents from '@/components/WomensComponent'

interface Product {
  id: number
  title: string
  price: string
  category: string
  image: string
}

export const womenProducts = [
  // Jacketss
  {
    id: 1,
    title: 'CASUAL PINK Jackets',
    price: 'PKR 4,500.00',
    category: 'Jackets',
    image: WomenJackets1,
  },
  {
    id: 2,
    title: 'OVERSIZED BLACK Jackets',
    price: 'PKR 5,800.00',
    category: 'Jackets',
    image: WomenJackets2,
  },
  {
    id: 3,
    title: 'TRENDY CROP Jackets',
    price: 'PKR 4,200.00',
    category: 'Jackets',
    image: WomenJackets3,
  },
  {
    id: 4,
    title: 'GRAPHIC PRINT Jackets',
    price: 'PKR 6,000.00',
    category: 'Jackets',
    image: WomenJackets4,
  },
  {
    id: 5,
    title: 'ZIP-UP GREY Jackets',
    price: 'PKR 5,000.00',
    category: 'Jackets',
    image: WomenJackets5,
  },

  // Pants
  {
    id: 6,
    title: 'SKINNY FIT JEANS',
    price: 'PKR 3,800.00',
    category: 'Pants',
    image: WomenPants1,
  },
  {
    id: 7,
    title: 'STRAIGHT LEG COTTON PANTS',
    price: 'PKR 3,500.00',
    category: 'Pants',
    image: WomenPants2,
  },
  {
    id: 8,
    title: 'HIGH-WAISTED CARGO PANTS',
    price: 'PKR 4,200.00',
    category: 'Pants',
    image: WomenPants3,
  },
  {
    id: 9,
    title: 'WIDE-LEG TROUSERS',
    price: 'PKR 4,000.00',
    category: 'Pants',
    image: WomenPants4,
  },
  {
    id: 10,
    title: 'JOGGER STYLE PANTS',
    price: 'PKR 3,900.00',
    category: 'Pants',
    image: WomenPants5,
  },

  {
    id: 11,
    title: 'BASIC BLACK LEGGINGS',
    price: 'PKR 2,800.00',
    category: 'Shirts',
    image: WomenShirts1,
  },
  {
    id: 12,
    title: 'CLASSIC CHINOS',
    price: 'PKR 4,300.00',
    category: 'Shirts',
    image: WomenShirts2,
  },
  {
    id: 13,
    title: 'BAGGY CARGO Shirts',
    price: 'PKR 4,600.00',
    category: 'Shirts',
    image: WomenShirts3,
  },
  {
    id: 14,
    title: 'PAPERBAG WAIST Shirts',
    price: 'PKR 3,700.00',
    category: 'Shirts',
    image: WomenShirts4,
  },
  {
    id: 15,
    title: 'COTTON LOUNGE Shirts',
    price: 'PKR 3,200.00',
    category: 'Shirts',
    image: WomenShirts5,
  },

  // SweatShirts
  {
    id: 16,
    title: 'CLASSIC WHITE SHIRT',
    price: 'PKR 3,200.00',
    category: 'SweatShirt',
    image: WomenSweatShirts1,
  },
  {
    id: 17,
    title: 'FLORAL PRINT BLOUSE',
    price: 'PKR 3,800.00',
    category: 'SweatShirt',
    image: WomenSweatShirts2,
  },
  {
    id: 18,
    title: 'BUTTON-UP DENIM SHIRT',
    price: 'PKR 4,000.00',
    category: 'Shirt',
    image: WomenSweatShirts3,
  },
  {
    id: 19,
    title: 'PUFF SLEEVE SHIRT',
    price: 'PKR 3,600.00',
    category: 'SweatShirt',
    image: WomenSweatShirts4,
  },
  {
    id: 20,
    title: 'OVERSIZED COTTON SHIRT',
    price: 'PKR 4,200.00',
    category: 'SweatShirt',
    image: WomenSweatShirts5,
  },
]

const categories = ['All', 'Jackets', 'Pants', 'Shirts', 'SweatShirt']

const Women: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const { addToCart, totalItems } = useCart()

  const filteredProducts =
    selectedCategory === 'All'
      ? womenProducts
      : womenProducts.filter((product) => product.category === selectedCategory)

  return (
    <div className="min-h-screen bg-[#eee8e3]">
      <div className="w-full py-3 px-8 bg-[#e5dfd8] flex justify-between">
        <div className="flex justify-between">
          <Link to="/" className="text-sm text-gray-700">
            HOME
          </Link>
          <ChevronRight className="h-5" />
          <Link to="/women" className="text-sm text-gray-700">
            WOMEN
          </Link>
        </div>
        <Link to="/cart" className="flex gap-3">
          <span>
            <ShoppingCart />
          </span>{' '}
          Cart ({totalItems})
        </Link>
      </div>

      <section className="w-full py-10 px-6 md:px-12 bg-[#D3C5B8] mt-10 my-32">
        <h2 className="text-4xl font-medium text-center mb-8 text-[#725D45]">
          Women's Western Collection
        </h2>

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

        <div className="flex justify-center items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex flex-col items-center">
                <div className="bg-white h-full p-4 w-full">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-[450px] h-[450px] object-cover"
                  />
                </div>
                <div className="mt-3 text-center fel">
                  <p className="text-sm text-gray-800 font-medium">{product.title}</p>
                  <p className="text-sm font-medium mt-1">{product.price}</p>
                  <div className="flex justify-center items-center gap-3">
                    <button
                      className="mt-2 px-4 py-2 bg-[#6b5745] text-white rounded-full hover:bg-[#5d4c3b] flex gap-3"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                    <button className="mt-2 ml-2 px-4 py-2 bg-[#8B4513] text-white rounded-full hover:bg-[#70421e]">
                      Try Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="my-24">
        <img src={women_banner} alt="" />
      </div>
      <WomensComponents />
      <Features />
      <NewsLetter />
    </div>
  )
}

export default Women
