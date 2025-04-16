import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import MensComponents from '@/components/MensComponents'
import NewsLetter from '@/components/NewsLetter'
import arrival_image from '/new_arrival.png'
import AnimatedSection from '@/components/AnimatedSection'
import NewCollection from '@/components/NewCollection'

interface Product {
  _id: string
  title: string
  price: string
  category: string
  gender: string
  image: string
}

const categories = ['All', 'Pants', 'Sweatshirt', 'Jackets', 'Shirts']

const Men: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const { totalItems } = useCart() // Keep for cart icon in header
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`https://backend-production-c8ff.up.railway.app/api/products?gender=men`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Error fetching products:', err))
  }, [])

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory)

  const handleViewDetails = (productId: string) => {
    navigate(`/product/${productId}`)
  }

  // --- Function for Try Now navigation ---
  const handleTryNow = (productId: string) => {
    navigate(`/try-on/${productId}`)
  }
  // --- End Function ---

  return (
    <div className="min-h-screen bg-[#eee8e3]">
      {/* Breadcrumb */}

      {/* Product Section */}
      <section className="w-full py-10 px-6 md:px-12 bg-[#D3C5B8] mb-16">
        <AnimatedSection direction="left">
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center mb-8 gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-[#6b5745] text-white shadow-md'
                    : 'bg-white text-black hover:bg-[#6b5745] hover:text-white border border-gray-300'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {' '}
            {/* Increased gap-y */}
            {filteredProducts.map((product) => (
              <div key={product._id} className="flex flex-col items-center group">
                <div className="bg-white p-4 w-full overflow-hidden rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={`https://backend-production-c8ff.up.railway.app${product.image}`}
                    alt={product.title}
                    className="w-full h-64 sm:h-72 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => handleViewDetails(product._id)} // Click image goes to details
                  />
                </div>
                <div className="mt-3 text-center w-full px-2">
                  <p className="text-sm text-gray-800 font-medium truncate" title={product.title}>
                    {product.title}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-1"> PKR {product.price}</p>
                  {/* --- Buttons Container --- */}
                  <div className="mt-3 flex flex-col sm:flex-row gap-2 justify-center">
                    {' '}
                    {/* Flex container for buttons */}
                    <button
                      className="px-4 py-2 bg-[#6b5745] text-white text-xs font-medium rounded-full hover:bg-[#5d4c3b] transition-colors duration-300 flex-1" // flex-1 to take available space
                      onClick={() => handleViewDetails(product._id)}
                    >
                      View Details
                    </button>
                    <button
                      className="px-4 py-2 bg-[#8B4513] text-white text-xs font-medium rounded-full hover:bg-[#70421e] transition-colors duration-300 flex-1" // flex-1 to take available space
                      onClick={() => handleTryNow(product._id)} // Use the navigation function
                    >
                      Try Now
                    </button>
                  </div>
                  {/* --- End Buttons Container --- */}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Conditional Sections */}
      {selectedCategory === 'All' && (
        <>
          <div className="my-16 md:my-24 w-full">
            <img src={arrival_image} alt="New Arrivals" className="w-full" />
          </div>
          <NewCollection />
        </>
      )}

      <NewsLetter />
    </div>
  )
}

export default Men
