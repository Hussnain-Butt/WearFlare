import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import axios from 'axios'
// Make sure the import path is correct
import { useCart } from '../context/CartContext' // Adjust path if needed
import MensComponents from '@/components/MensComponents'
import NewsLetter from '@/components/NewsLetter'
import arrival_image from '/new_arrival.png'
import AnimatedSection from '@/components/AnimatedSection'
import NewCollection from '@/components/NewCollection'

// Interface matching backend structure
interface Product {
  _id: string
  title: string
  price: string
  category: string
  gender: string
  image: string
}

const categories = ['All', 'Pants', 'Sweatshirt', 'Jackets', 'Shirts']

// Define your API base URL (replace with your actual backend URL)
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app'
// For local dev: const API_BASE_URL = 'http://localhost:5000';

const Men: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [isLoading, setIsLoading] = useState(true) // Loading state
  const [error, setError] = useState<string | null>(null) // Error state
  const { addToCart, totalItems } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    axios
      // Use the API_BASE_URL constant
      .get(`${API_BASE_URL}/api/products?gender=men`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setProducts(res.data)
        } else {
          console.error('Unexpected data format received:', res.data)
          setError('Failed to load products (invalid data format).')
          setProducts([])
        }
      })
      .catch((err) => {
        console.error('Error fetching products:', err)
        setError('Failed to load products. Please try again later.')
        setProducts([]) // Clear products on error
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, []) // Empty dependency array means this runs once on mount

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory)

  // Helper function to format price string for display if needed
  const formatDisplayPrice = (priceStr: string): string => {
    // Example: return `${priceStr} Rs`; or use Intl.NumberFormat for better formatting
    // Assuming the price string already contains currency like "PKR 5,299"
    // or you store it as just "5299" and format here.
    // For now, just returning it as is, plus "Rs" if not already present
    if (
      priceStr &&
      !priceStr.toUpperCase().includes('RS') &&
      !priceStr.toUpperCase().includes('PKR')
    ) {
      return `${priceStr} Rs`
    }
    return priceStr || 'N/A' // Handle null/undefined price
  }

  return (
    <div className="min-h-screen bg-[#eee8e3]">
      <section className="w-full py-10 px-4 md:px-12 bg-[#D3C5B8]  mb-16 sm:my-32">
        {/* Use AnimatedSection if available and desired */}
        {/* <AnimatedSection direction="left"> */}
        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center mb-8 gap-2 sm:gap-3">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 text-sm sm:text-base rounded-full transition-all duration-300 border ${
                selectedCategory === category
                  ? 'bg-[#6b5745] text-white border-[#6b5745]'
                  : 'bg-white text-black border-gray-300 hover:bg-[#f0ebe5] hover:border-gray-400'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading and Error States */}
        {isLoading && <div className="text-center py-10">Loading products...</div>}
        {error && <div className="text-center py-10 text-red-600">{error}</div>}

        {/* Product Grid - Render only if not loading and no error */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex flex-col items-center group bg-white rounded-lg shadow overflow-hidden transform transition duration-300 hover:shadow-lg"
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-square overflow-hidden">
                    <img
                      // Use the API_BASE_URL constant for image source
                      src={`${API_BASE_URL}${product.image}`}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      // Add basic loading/error handling for images
                      loading="lazy" // Lazy load images below the fold
                      onError={(e) => {
                        // Optional: Replace with a placeholder if image fails
                        e.currentTarget.src = '/placeholder-image.png' // Make sure you have a placeholder
                        e.currentTarget.alt = 'Image not available'
                      }}
                    />
                  </div>
                  {/* Product Info */}
                  <div className="p-4 text-center w-full">
                    <p
                      className="text-sm md:text-base text-gray-800 font-medium truncate"
                      title={product.title}
                    >
                      {product.title}
                    </p>
                    <p className="text-sm md:text-base font-semibold mt-1 text-[#B8860B]">
                      {formatDisplayPrice(product.price)}
                    </p>
                    {/* Buttons */}
                    <div className="mt-3 flex flex-col sm:flex-row justify-center gap-2">
                      <button
                        className="px-4 py-2 text-sm bg-[#6b5745] text-white rounded-full hover:bg-[#5d4c3b] transition-colors flex items-center justify-center gap-1"
                        onClick={() => addToCart(product)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Add to Cart
                      </button>
                      <button
                        className="px-4 py-2 text-sm bg-[#8B4513] text-white rounded-full hover:bg-[#70421e] transition-colors"
                        onClick={() => navigate(`/try-on/${product._id}`)} // Navigate to try-on page
                      >
                        Try Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-600">
                No products found{' '}
                {selectedCategory !== 'All' ? `in the "${selectedCategory}" category` : ''}.
              </div>
            )}
          </div>
        )}
        {/* </AnimatedSection> */}
      </section>

      {/* Only show these sections if 'All' category is selected */}
      {selectedCategory === 'All' && !isLoading && !error && (
        <>
          <div className="my-16 sm:my-24 w-full">
            {/* Ensure the image path is correct relative to the public folder or imported */}
            <img src={arrival_image} alt="New Arrivals" className="w-full h-auto object-cover" />
          </div>

          {/* Conditional rendering of other components */}
          {/* <MensComponents /> */}
          <NewCollection />
        </>
      )}

      <NewsLetter />
    </div>
  )
}

export default Men
