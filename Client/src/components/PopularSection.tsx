import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import AnimatedSection from './AnimatedSection'
// Removed useCart import as addToCart is not used directly here
// import { useCart } from '../context/CartContext';

// Define the Product interface (ensure it matches your actual product data structure)
interface Product {
  _id: string
  title: string
  price: string
  image: string
  gender: string // Keep if needed for any potential filtering logic later
  category: string // Keep if needed for any potential filtering logic later
}

const PopularSection: React.FC = () => {
  const navigate = useNavigate()
  const [popularProducts, setPopularProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    // Try fetching with limit, but be prepared to handle a direct array response
    axios
      // We won't strictly type the response here to handle different possible structures
      .get<any>(`https://backend-production-c8ff.up.railway.app/api/products?limit=3`)
      .then((res) => {
        let productsData: Product[] = []

        // Check common structures: { products: [...] } or direct array [...]
        if (res.data && Array.isArray(res.data.products)) {
          // Case 1: Response is { products: [...] }
          productsData = res.data.products
        } else if (Array.isArray(res.data)) {
          // Case 2: Response is directly [...]
          productsData = res.data
        } else {
          // Case 3: Unexpected response structure
          console.warn('Unexpected API response structure for popular products:', res.data)
          setError('Could not parse popular products data.')
        }

        // Ensure we only take up to 3 items, even if limit didn't work or structure was just an array
        setPopularProducts(productsData.slice(0, 3))
      })
      .catch((err) => {
        console.error('Error fetching popular products:', err)
        setError('Could not load popular products.')
        setPopularProducts([]) // Ensure state is empty on error
      })
      .finally(() => {
        setLoading(false)
      })
  }, []) // Empty dependency array means run once on mount

  // --- Navigation Handlers ---
  const handleViewDetails = (productId: string) => {
    navigate(`/product/${productId}`)
  }

  const handleTryNow = (productId: string) => {
    navigate(`/try-on/${productId}`)
  }
  // --- End Handlers ---

  // --- Conditional Rendering ---
  // If loading, show a placeholder (optional)
  if (loading) {
    return (
      <section className="w-full py-12 sm:py-16 px-4 md:px-8 lg:px-12 bg-[#D3C5B8]">
        <h2 className="text-3xl sm:text-4xl font-medium text-center mb-8 sm:mb-12 text-[#725D45]">
          Most Popular
        </h2>
        {/* Optional: Add skeleton loaders here */}
        <div className="text-center text-gray-500">Loading popular items...</div>
      </section>
    )
  }

  // If there was an error fetching OR if fetching succeeded but returned no products
  if (error || popularProducts.length === 0) {
    // Don't render the section at all if there's an error or no popular items
    // You could optionally show an error message instead of returning null
    console.log('PopularSection not rendering due to error or empty data:', {
      error,
      popularProducts,
    })
    return null
  }

  // --- Render Section ---
  return (
    <section className="w-full py-12 sm:py-16 px-4 md:px-8 lg:px-12 bg-[#D3C5B8]">
      <h2 className="text-3xl sm:text-4xl font-medium text-center mb-8 sm:mb-12 text-[#725D45]">
        Most Popular
      </h2>
      <AnimatedSection direction="right">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10 max-w-6xl mx-auto">
          {' '}
          {/* Added max-width and centered */}
          {popularProducts.map((product) => (
            <div
              key={product._id}
              className="flex flex-col items-center group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {' '}
              {/* Combined card styles */}
              {/* Image Container */}
              <div
                className="w-full overflow-hidden cursor-pointer"
                onClick={() => handleViewDetails(product._id)}
              >
                <img
                  src={`https://backend-production-c8ff.up.railway.app${product.image}`}
                  alt={product.title}
                  className="w-full h-64 sm:h-72 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              {/* Details Container */}
              <div className="p-4 text-center w-full">
                <p
                  className="text-sm text-gray-800 font-medium truncate mb-1"
                  title={product.title}
                >
                  {product.title}
                </p>
                <p className="text-sm font-semibold text-gray-900 mb-3">PKR {product.price}</p>
                {/* Buttons Container */}
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#6b5745] text-white text-[10px] sm:text-xs font-medium rounded-full hover:bg-[#5d4c3b] transition-colors duration-300 flex-1 whitespace-nowrap"
                    onClick={() => handleViewDetails(product._id)}
                  >
                    View Details
                  </button>
                  <button
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#8B4513] text-white text-[10px] sm:text-xs font-medium rounded-full hover:bg-[#70421e] transition-colors duration-300 flex-1 whitespace-nowrap"
                    onClick={() => handleTryNow(product._id)}
                  >
                    Try Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  )
}

export default PopularSection
