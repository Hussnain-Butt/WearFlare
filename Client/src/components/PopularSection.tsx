// src/components/PopularSection.tsx (assuming this is the file path)
import React, { useEffect, useState } from 'react'
// *** Re-add Link import ***
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import AnimatedSection from './AnimatedSection' // Ensure this path is correct

// --- Updated Product Interface ---
interface Product {
  _id: string
  title: string
  price: string
  category: string
  gender: string
  image: string
  isInStock?: boolean // Keep optional or ensure backend always provides it
}

const PopularSection: React.FC = () => {
  const navigate = useNavigate()
  const [popularProducts, setPopularProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  // Ensure this matches your actual backend API URL
  const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app' // Or your production URL

  useEffect(() => {
    setLoading(true)
    setError(null)

    // Fetch products
    axios
      // Fetching more initially in case some items are invalid, will slice later
      .get<any>(`${API_BASE_URL}/api/products?limit=5`) // Fetch a bit more just in case
      .then((res) => {
        let rawProductsData: any[] = []

        // Determine the actual array of products from the response
        // Adjust this based on your ACTUAL API response structure for /api/products
        if (res.data && Array.isArray(res.data.products)) {
          rawProductsData = res.data.products // If response is { products: [...] }
        } else if (Array.isArray(res.data)) {
          rawProductsData = res.data // If response is [...]
        } else {
          console.warn('Unexpected API response structure for popular products:', res.data)
          setError('Could not parse popular products data.')
          setPopularProducts([])
          return
        }

        // Process fetched data
        const processedProducts: Product[] = rawProductsData
          .map((p) => {
            // Basic validation for each item
            if (!p || typeof p !== 'object' || !p._id) {
              console.warn('Skipping invalid item in popular products data:', p)
              return null // Skip this item
            }
            // *** THE FIX IS HERE: Changed 'inStock' to 'isInStock' ***
            return {
              _id: p._id,
              title: p.title ?? 'Untitled Product',
              price: String(p.price ?? '0'),
              image: p.image ?? '',
              gender: p.gender ?? 'Unknown',
              category: p.category ?? 'Uncategorized',
              isInStock: p.isInStock ?? true, // Correct property name, default to true
            }
          })
          .filter((p): p is Product => p !== null) // Filter out any null items

        // Set state with the processed and limited data (ensure max 3)
        setPopularProducts(processedProducts.slice(0, 3))
      })
      .catch((err) => {
        console.error('Error fetching popular products:', err)
        setError('Could not load popular products at the moment.')
        setPopularProducts([]) // Clear products on error
      })
      .finally(() => {
        setLoading(false)
      })
  }, []) // Empty dependency array means run once on mount

  // --- Navigation Handlers ---
  const handleViewDetails = (productId: string) => {
    navigate(`/product/${productId}`)
  }

  // Optional: Keep if needed
  // const handleTryNow = (productId: string) => {
  //   navigate(`/try-on/${productId}`);
  // };
  // --- End Handlers ---

  // --- Conditional Rendering ---
  if (loading) {
    return (
      <section className="popular-section-container bg-[#D3C5B8] py-12 px-4 md:py-16 lg:px-8">
        <h2 className="section-title text-[#725D45] mb-8 sm:mb-12">Most Popular</h2>
        <div className="text-center text-gray-600">Loading popular items...</div>
      </section>
    )
  }

  // Do not render the section if there's an error or no products
  if (error || popularProducts.length === 0) {
    if (error) console.error('PopularSection Error:', error)
    if (!error && popularProducts.length === 0) console.log('No popular products to display.')
    // Optionally render a message or return null
    // return <section className="popular-section-container bg-[#D3C5B8] py-12 px-4 md:py-16 lg:px-8"><p className="text-center text-gray-500">Could not load popular items.</p></section>;
    return null
  }

  // --- Render Section ---
  return (
    <section className="popular-section-container bg-[#D3C5B8] py-12 px-4 md:py-16 lg:px-8">
      <h2 className="section-title text-[#725D45] text-3xl sm:text-4xl font-medium text-center mb-8 sm:mb-12">
        Most Popular
      </h2>
      <AnimatedSection direction="right">
        {/* Using Tailwind classes directly for the grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-8 md:gap-y-12 max-w-6xl mx-auto">
          {popularProducts.map((product) => (
            // Product Card Start - Using the exact same structure as Men.tsx
            <div
              key={product._id}
              id={`popular-product-${product._id}`} // Use a unique prefix if needed
              // Unified card styling from Men.tsx
              className="group flex flex-col bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              {/* Image Container */}
              <div
                className="relative overflow-hidden cursor-pointer"
                // Only allow click if in stock
                onClick={() => product.isInStock && handleViewDetails(product._id)}
              >
                {/* Out of Stock Badge */}
                {!product.isInStock && (
                  <div className="absolute top-3 right-3 bg-red-100 text-red-700 text-[10px] font-semibold px-2 py-0.5 rounded-full z-10 ring-1 ring-inset ring-red-600/20">
                    Out of Stock
                  </div>
                )}
                {/* Product Image */}
                <img
                  src={`${API_BASE_URL}${product.image}`}
                  alt={product.title}
                  className={`w-full h-72 sm:h-80 md:h-[350px] object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 ${
                    !product.isInStock ? 'opacity-50 grayscale-[50%]' : '' // Style for out of stock
                  }`}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300?text=No+Image'
                  }} // Fallback
                />
              </div>

              {/* Product Info & Actions */}
              <div className="p-4 flex flex-col flex-grow">
                {/* Title */}
                <h3
                  className="text-base font-semibold text-gray-800 truncate mb-1 text-left"
                  title={product.title}
                >
                  {/* Make title clickable only if in stock */}
                  {product.isInStock ? (
                    <Link
                      to="#" // Using '#' and onClick to prevent page reload but maintain link semantics
                      onClick={(e) => {
                        e.preventDefault() // Prevent default link behavior
                        handleViewDetails(product._id)
                      }}
                      className="hover:text-[#6b5745] transition-colors"
                    >
                      {product.title}
                    </Link>
                  ) : (
                    // Non-clickable title when out of stock
                    <span>{product.title}</span>
                  )}
                </h3>
                {/* Price */}
                <p className="text-sm font-semibold text-[#6b5745] mb-3 text-left">
                  PKR {Number(product.price).toLocaleString('en-PK')}
                </p>
                {/* Buttons Container / Out of Stock Message */}
                <div className="mt-auto pt-2">
                  {product.isInStock ? (
                    <>
                      {/* View Details Button */}
                      <button
                        className="w-full px-4 py-2.5 bg-[#6b5745] text-white text-sm font-medium rounded-md hover:bg-[#5d4c3b] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#6b5745] focus:ring-offset-2"
                        onClick={() => handleViewDetails(product._id)}
                      >
                        View Details
                      </button>
                      {/* Optional Try Now Button - Uncomment if needed
                      <button
                        className="w-full mt-2 px-4 py-2.5 bg-[#c8a98a] text-[#6b5745] text-sm font-medium rounded-md hover:bg-[#b08d6a] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#c8a98a] focus:ring-offset-2"
                        onClick={() => handleTryNow(product._id)}
                      >
                        Try Now
                      </button>
                      */}
                    </>
                  ) : (
                    // Out of Stock Button (Disabled look)
                    <button
                      className="w-full px-4 py-2.5 bg-gray-200 text-gray-500 text-sm font-medium rounded-md cursor-not-allowed"
                      disabled // Make it explicitly disabled
                    >
                      Out of Stock
                    </button>
                  )}
                </div>
                {/* End Buttons Container */}
              </div>
            </div>
            // Product Card End
          ))}
        </div>
      </AnimatedSection>

      {/* Removing the <style jsx> block as Tailwind classes are used directly */}
    </section>
  )
}

export default PopularSection
