// src/components/NewCollection.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AnimatedSection from './AnimatedSection'
import { Loader2 } from 'lucide-react'

// --- Product Interface (Should match backend) ---
interface Product {
  _id: string
  image: string
  title: string
  price: string | number
  inStock: boolean
  // Add other fields if needed (category, gender)
  category?: string
  gender?: string
}

// --- API Base URL ---
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app' // Or https://backend-production-c8ff.up.railway.app

const NewCollection: React.FC = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // --- *** UPDATED Fetch Data Function *** ---
  const fetchNewCollection = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // *** FETCH FROM THE NEW ENDPOINT ***
      const response = await axios.get<Product[]>(`${API_BASE_URL}/api/products/new-collection`)
      // *** END FETCH ***

      if (Array.isArray(response.data)) {
        const processedData = response.data.map((p) => ({
          ...p,
          _id: p._id,
          title: p.title ?? 'Untitled Product',
          price: String(p.price ?? '0'),
          image: p.image ?? '',
          inStock: p.inStock ?? true, // Default inStock if missing
        }))
        setProducts(processedData)
      } else {
        console.warn('API did not return an array for new collection:', response.data)
        setProducts([])
      }
    } catch (err) {
      console.error('Error fetching new collection:', err)
      setError('Could not load new collection items.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNewCollection()
  }, [fetchNewCollection])
  // --- *** END DATA FETCHING UPDATE *** ---

  // --- Navigation Handlers (Keep as is) ---
  const handleViewDetails = (productId: string) => {
    if (!productId) return
    navigate(`/product/${productId}`)
  }
  const handleTryNow = (productId: string) => {
    if (!productId) return
    navigate(`/try-on/${productId}`)
  }

  // --- Render Logic (Keep loading/error/empty checks) ---
  if (loading) {
    /* ... loading UI ... */
  }
  if (error) {
    /* ... error UI ... */
  }
  if (products.length === 0) {
    return null
  } // Or "No new items" message

  return (
    <div className="bg-[#eee8e3] py-12 md:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-3xl md:text-4xl text-[#6b5745] font-serif">New Collection</h2>
      </div>
      <AnimatedSection direction="up">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-[#d3cac0] rounded-lg shadow-md overflow-hidden flex flex-col group transition-shadow hover:shadow-lg"
            >
              <div
                className="relative overflow-hidden cursor-pointer"
                onClick={() => product.inStock && handleViewDetails(product._id)}
              >
                {!product.inStock && (
                  <div className="product-badge out-of-stock-badge"> Out of Stock </div>
                )}
                <img
                  src={`${API_BASE_URL}${product.image}`} // Use API data
                  alt={product.title}
                  className={`product-image ${!product.inStock ? 'out-of-stock-image' : ''}`}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x500?text=No+Image'
                  }}
                  loading="lazy"
                />
              </div>
              <div className="product-card-details">
                <p className="product-card-title" title={product.title}>
                  {product.title}
                </p>
                <p className="product-card-price">
                  PKR{' '}
                  {Number(product.price).toLocaleString('en-PK', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <div className="product-card-buttons">
                  {product.inStock ? (
                    <>
                      <button
                        className="button-newcollection view-details-button"
                        onClick={() => handleViewDetails(product._id)}
                        disabled={!product.inStock}
                      >
                        {' '}
                        View Details{' '}
                      </button>
                      <button
                        className="button-newcollection try-now-button"
                        onClick={() => handleTryNow(product._id)}
                        disabled={!product.inStock}
                      >
                        {' '}
                        Try Now{' '}
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

      {/* --- Styles (Keep as is) --- */}
      <style jsx>{`
           /* ... existing styles ... */
           .product-card-details { padding: 1rem; text-align: center; display: flex; flex-direction: column; flex-grow: 1; }
           .product-card-title { color: #374151; font-size: 0.875rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.25rem; }
           .product-card-price { color: #4b5563; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.75rem; }
           .product-card-buttons { margin-top: auto; display: flex; flex-direction: column; sm:flex-row; gap: 0.5rem; justify-content: center; padding-top: 0.5rem; }
           .product-image { display: block; width: 100%; height: 20rem; sm:height: 24rem; object-fit: cover; object-position: center; transition: transform 0.3s ease-in-out; }
           .group:hover .product-image:not(.out-of-stock-image) { transform: scale(1.05); }
           .product-image.out-of-stock-image { opacity: 0.6; cursor: default; }
           .product-badge { position: absolute; top: 0.5rem; right: 0.5rem; color: white; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.5rem; border-radius: 0.25rem; z-index: 10; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
           .out-of-stock-badge { background-color: #ef4444; }
           .button-newcollection { /* ... */ }
           .button-newcollection:disabled { /* ... */ }
           .view-details-button { /* ... */ }
           .try-now-button { /* ... */ }
           .out-of-stock-text-newcollection { /* ... */ }
           .animate-spin { animation: spin 1s linear infinite; }
           @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
    </div>
  )
}

export default NewCollection
