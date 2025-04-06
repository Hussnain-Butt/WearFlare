import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ShoppingCart } from 'lucide-react'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import NewsLetter from '@/components/NewsLetter'
import Features from '@/components/Features'
import WomensComponents from '@/components/WomensComponent'
import { useNavigate } from 'react-router-dom'

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
  const { addToCart, totalItems } = useCart()
  const navigate = useNavigate()
  // Fetch products designated for women
  useEffect(() => {
    axios
      .get(`https://backend-production-c8ff.up.railway.app/api/products?gender=women`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Error fetching products:', err))
  }, [])

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory)

  return (
    <div className="min-h-screen bg-[#eee8e3]">
      {/* Breadcrumb */}
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
          </span>
          Cart ({totalItems})
        </Link>
      </div>

      {/* Product Section */}
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

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="flex flex-col items-center">
              <div className="bg-white p-4 w-full">
                <img
                  src={`https://backend-production-c8ff.up.railway.app${product.image}`}
                  alt={product.title}
                  className="w-[450px] h-[450px] object-cover"
                />
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-800 font-medium">{product.title}</p>
                <p className="text-sm font-medium mt-1">{product.price} Rs</p>
                <div className="flex justify-center items-center gap-3">
                  <button
                    className="mt-2 px-4 py-2 bg-[#6b5745] text-white rounded-full hover:bg-[#5d4c3b]"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="mt-2 ml-2 px-4 py-2 bg-[#8B4513] text-white rounded-full hover:bg-[#70421e]"
                    onClick={() => navigate(`/try-on/${product._id}`)}
                  >
                    Try Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="my-24">
        <img src="/women_banner.png" alt="Women Banner" />
      </div>
      <WomensComponents />
      <Features />
      <NewsLetter />
    </div>
  )
}

export default Women
