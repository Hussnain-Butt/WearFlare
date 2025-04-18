// src/components/NewCollection.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AnimatedSection from './AnimatedSection' // Ensure path is correct
import { Loader2 } from 'lucide-react' // For loading indicator

// --- Product Interface (Should match backend data structure) ---
interface Product {
  _id: string // Use _id from MongoDB
  image: string // Path from backend (e.g., /uploads/...)
  title: string // Use 'title' consistently
  price: string | number // Allow both string/number from API
  inStock: boolean // Expect inStock status
  category?: string
  gender?: string // Ensure gender is available
  isNewCollection?: boolean // Keep this if needed for other logic, but filtering happens via API now
}

// --- API Base URL ---
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://backend-production-c8ff.up.railway.app'

// --- NEW: Props Interface ---
interface NewCollectionProps {
  genderFilter?: 'Men' | 'Women' | 'Unisex' // Make gender prop optional but specific
  limit?: number // Optional limit for how many items to show
}
// --- END NEW ---

const NewCollection: React.FC<NewCollectionProps> = ({ genderFilter, limit = 6 }) => {
  // Destructure props, provide default limit
  const navigate = useNavigate()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // --- Fetch Data using useEffect ---
  const fetchNewCollection = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // --- UPDATED API CALL ---
      // Use the main /api/products endpoint and add query parameters dynamically
      const params = new URLSearchParams()
      params.append('newCollection', 'true') // Always fetch new collection items

      if (genderFilter) {
        // Add gender filter ONLY if genderFilter prop is provided
        params.append('gender', genderFilter)
      }
      params.append('limit', String(limit)) // Add limit parameter

      console.log(`[NewCollection] Fetching with params: ${params.toString()}`) // Log parameters

      const response = await axios.get<Product[]>(
        `${API_BASE_URL}/api/products?${params.toString()}`,
      )
      // --- END UPDATED API CALL ---

      if (Array.isArray(response.data)) {
        const processedData = response.data.map((p) => ({
          ...p,
          _id: p._id,
          title: p.title ?? 'Untitled Product',
          price: String(p.price ?? '0'),
          image: p.image ?? '',
          inStock: p.inStock ?? true,
          gender: p.gender, // Make sure gender is included
        }))
        setProducts(processedData)
      } else {
        console.warn('API did not return an array for new collection:', response.data)
        setProducts([])
        setError('Received invalid data format for new collection.')
      }
    } catch (err: any) {
      // Keep existing error handling
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        console.error(
          'Error fetching new collection: Endpoint not found (404). Did you define the route and filters?',
        )
        setError('Could not find the new collection items.')
      } else {
        console.error('Error fetching new collection:', err.response?.data || err.message)
        setError('Could not load new collection items. Please try again later.')
      }
      setProducts([])
    } finally {
      setLoading(false)
    }
    // Add genderFilter and limit to useCallback dependencies
  }, [genderFilter, limit])

  useEffect(() => {
    fetchNewCollection()
  }, [fetchNewCollection]) // fetchNewCollection will change if genderFilter or limit changes

  // --- Navigation Handlers (Keep as is) ---
  const handleViewDetails = (productId: string) => {
    if (!productId) return
    navigate(`/product/${productId}`)
  }

  const handleTryNow = (productId: string) => {
    if (!productId) return
    navigate(`/try-on/${productId}`)
  }

  // --- Render Logic (Keep mostly as is, adjust title maybe) ---
  const collectionTitle = genderFilter ? `${genderFilter}'s New Collection` : 'New Collection'

  if (loading) {
    return (
      <div className="bg-[#eee8e3] py-12 md:py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl text-[#6b5745] font-serif mb-8">{collectionTitle}</h2>
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="animate-spin h-10 w-10 text-[#c8a98a]" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#eee8e3] py-12 md:py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl text-[#6b5745] font-serif mb-8">{collectionTitle}</h2>
        <p className="text-red-600 bg-red-100 p-4 rounded border border-red-200 max-w-md mx-auto">
          {error}
        </p>
      </div>
    )
  }

  // No changes needed in the JSX structure below, just the title update
  return (
    <div className="bg-[#eee8e3] py-12 md:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-3xl md:text-4xl text-[#6b5745] font-serif">{collectionTitle}</h2>
      </div>

      {products.length > 0 ? (
        <AnimatedSection direction="left">
          <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-[#d3cac0] rounded-lg shadow-md overflow-hidden flex flex-col group transition-shadow hover:shadow-lg"
              >
                {/* Image container */}
                <div
                  className="relative overflow-hidden cursor-pointer h-96" // Set a fixed height for consistency
                  onClick={() => product.inStock && handleViewDetails(product._id)}
                >
                  {!product.inStock && (
                    <div className="product-badge out-of-stock-badge"> Out of Stock </div>
                  )}
                  <img
                    src={
                      product.image.startsWith('http')
                        ? product.image
                        : `${API_BASE_URL}${product.image}`
                    }
                    alt={product.title}
                    className={`w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105 ${
                      !product.inStock ? 'out-of-stock-image' : ''
                    }`} // Ensure image fills container
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x500?text=No+Image'
                    }}
                    loading="lazy"
                  />
                </div>
                {/* Details Below Image */}
                <div className="product-card-details">
                  <p className="product-card-title" title={product.title}>
                    {product.title}
                  </p>
                  <p className="product-card-price">
                    PKR{' '}
                    {Number(product.price).toLocaleString('en-PK', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  {/* Buttons Area */}
                  <div className="product-card-buttons">
                    {product.inStock ? (
                      <>
                        <button
                          className="button-newcollection view-details-button"
                          onClick={() => handleViewDetails(product._id)}
                          disabled={!product.inStock}
                        >
                          View Details
                        </button>
                        <button
                          className="button-newcollection try-now-button"
                          onClick={() => handleTryNow(product._id)}
                          disabled={!product.inStock}
                        >
                          Try Now
                        </button>
                      </>
                    ) : (
                      <span className="out-of-stock-text-newcollection"> Out of Stock </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      ) : (
        <AnimatedSection direction="bottom">
          <p className="text-center text-gray-500 mt-8">
            Check back soon for new {genderFilter ? `${genderFilter.toLowerCase()} ` : ''}collection
            items!
          </p>
        </AnimatedSection>
      )}

      {/* Styles (No changes needed here) */}
      <style jsx>{`
                /* Styles for product card elements */
                .product-card-details { padding: 1rem; text-align: center; display: flex; flex-direction: column; flex-grow: 1; }
                .product-card-title { color: #374151; font-size: 0.875rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.25rem; }
                .product-card-price { color: #4b5563; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.75rem; }
                .product-card-buttons { margin-top: auto; display: flex; flex-direction: column; sm:flex-row; gap: 0.5rem; justify-content: center; padding-top: 0.5rem; }
                /* Removed fixed height from .product-image, handled by container now */
                .product-image.out-of-stock-image { opacity: 0.6; cursor: default; }
                .product-badge { position: absolute; top: 0.5rem; right: 0.5rem; color: white; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.5rem; border-radius: 0.25rem; z-index: 10; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
                .out-of-stock-badge { background-color: #ef4444; }
                .button-newcollection { padding: 0.5rem 1rem; font-size: 0.75rem; font-weight: 500; border-radius: 9999px; transition: background-color 0.2s, opacity 0.2s; flex: 1; border: none; cursor: pointer; text-align: center; }
                .button-newcollection:disabled { opacity: 0.5; cursor: not-allowed; background-color: #b0a8a0 !important; color: #777 !important; }
                .view-details-button { background-color: #6b5745; color: white; }
                .view-details-button:hover:not(:disabled) { background-color: #5d4c3b; }
                .try-now-button { background-color: #c8a98a; color: white; }
                .try-now-button:hover:not(:disabled) { background-color: #b08d6a; }
                .out-of-stock-text-newcollection { display: inline-block; margin-top: 0.25rem; padding: 0.5rem 1rem; background-color: #e5e7eb; color: #6b7280; font-size: 0.75rem; font-weight: 600; border-radius: 9999px; width: 100%; sm:width: auto; text-align: center;}
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                /* Ensure out-of-stock image doesn't scale on hover */
                .group:hover .product-image.out-of-stock-image { transform: scale(1); }
           `}</style>
    </div>
  )
}

export default NewCollection
