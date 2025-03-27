import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { menProducts } from '../pages/Men'
import { womenProducts } from '../pages/Women'

const categories = ['All', 'Shirts', 'Jackets', 'Sweatshirt', 'Pants']
const allProducts = [...menProducts, ...womenProducts]
const itemsPerPage = 8

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const { addToCart, totalItems } = useCart()

  const filteredProducts =
    selectedCategory === 'All'
      ? allProducts
      : allProducts.filter((product) => product.category === selectedCategory)

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

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
        <Link to="/cart" className="relative">
          🛒 Cart ({totalItems})
        </Link>
      </div>

      <section className="w-full py-10 px-6 md:px-12 bg-[#D3C5B8] mt-10 my-32">
        <h2 className="text-4xl font-medium text-center mb-8 text-[#725D45]">Shop Clothing</h2>

        <div className="flex flex-wrap justify-center mb-6 gap-3">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-[#6b5745] text-white'
                  : 'bg-white text-black hover:bg-[#6b5745] hover:text-white'
              }`}
              onClick={() => {
                setSelectedCategory(category)
                setCurrentPage(1)
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <div key={product.id} className="flex flex-col items-center">
              <div className="bg-white p-4 w-full">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-[450px] h-[450px] object-cover" // Set a fixed height and width
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
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`mx-1 px-4 py-2 rounded-full transition-all duration-300 ${
                currentPage === index + 1
                  ? 'bg-[#6b5745] text-white'
                  : 'bg-white text-black hover:bg-[#6b5745] hover:text-white'
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Shop
