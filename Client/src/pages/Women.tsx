import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom' // Import useNavigate
import { ChevronRight, ShoppingCart } from 'lucide-react' // Keep icons if needed for header/elsewhere
import axios from 'axios'
import { useCart } from '../context/CartContext' // Keep for totalItems if header exists
import NewsLetter from '@/components/NewsLetter'
import Features from '@/components/Features' // This component wasn't used below, but kept the import
import WomensComponents from '@/components/WomensComponent' // This component wasn't used below, but kept the import
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

const categories = ['All', 'Jackets', 'Pants', 'Shirts', 'Sweatshirt']

const Women: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  // Removed addToCart, kept totalItems (assuming a header cart icon might exist)
  const { totalItems } = useCart()
  const navigate = useNavigate() // Initialize useNavigate

  useEffect(() => {
    axios
      .get(`https://backend-production-c8ff.up.railway.app//api/products?gender=women`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Error fetching products:', err))
  }, [])

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory)

  // --- Navigation handlers ---
  const handleViewDetails = (productId: string) => {
    navigate(`/product/${productId}`)
  }

  const handleTryNow = (productId: string) => {
    navigate(`/try-on/${productId}`)
  }
  // --- End Handlers ---

  return (
    <div className="min-h-screen bg-[#eee8e3]">
      {/* === You might want to add the Breadcrumb/Header here like in Men.tsx === */}

      {/* Product Section */}
      <section className="w-full py-10 px-6 md:px-12 bg-[#D3C5B8]  mb-16 ">
        {' '}
        {/* Adjusted margin */}
        <AnimatedSection direction="left">
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center mb-8 gap-3">
            {' '}
            {/* Increased bottom margin */}
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  // Added text-sm
                  selectedCategory === category
                    ? 'bg-[#6b5745] text-white shadow-md' // Added shadow
                    : 'bg-white text-black hover:bg-[#6b5745] hover:text-white border border-gray-300' // Added border
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
            {/* Adjusted grid and gap */}
            {filteredProducts.map((product) => (
              <div key={product._id} className="flex flex-col items-center group">
                {' '}
                {/* Added group */}
                <div className="bg-white p-4 w-full overflow-hidden rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300">
                  {' '}
                  {/* Added hover shadow, rounded */}
                  <img
                    src={`https://backend-production-c8ff.up.railway.app/${product.image}`}
                    alt={product.title}
                    className="w-full h-64 sm:h-72 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer" // Adjusted height, added hover scale and cursor
                    onClick={() => handleViewDetails(product._id)} // Make image clickable
                  />
                </div>
                <div className="mt-3 text-center w-full px-2">
                  {' '}
                  {/* Added width and padding */}
                  <p className="text-sm text-gray-800 font-medium truncate" title={product.title}>
                    {product.title}
                  </p>{' '}
                  {/* Added truncate */}
                  {/* Ensure price format is consistent, maybe use PKR prefix */}
                  <p className="text-sm font-semibold text-gray-900 mt-1">PKR {product.price}</p>
                  {/* --- Buttons Container --- */}
                  <div className="mt-3 flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      className="px-4 py-2 bg-[#6b5745] text-white text-xs font-medium rounded-full hover:bg-[#5d4c3b] transition-colors duration-300 flex-1"
                      onClick={() => handleViewDetails(product._id)} // Navigate to details
                    >
                      View Details {/* Changed text */}
                    </button>
                    <button
                      className="px-4 py-2 bg-[#c8a98a] text-white text-xs font-medium rounded-full hover:bg-[#70421e] transition-colors duration-300 flex-1"
                      onClick={() => handleTryNow(product._id)} // Navigate to try-on
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
          {' '}
          {/* Use Fragment */}
          <div className="my-16 md:my-24">
            <img src="/women_banner.png" alt="Women Banner" className="w-full" />
          </div>
          <NewCollection />
          {/* <WomensComponents /> */} {/* If you want to show this */}
          <NewsLetter /> {/* Moved Newsletter inside conditional block */}
        </>
      )}

      {/* Show Newsletter only once if not in conditional block */}
      {/* {selectedCategory !== 'All' && <NewsLetter />} */}
      {/* OR place NewsLetter outside the conditional block entirely if it should always show */}
      {/* <NewsLetter /> */}
    </div>
  )
}

export default Women
