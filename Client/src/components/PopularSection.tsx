import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' // Link import removed as it wasn't used
import axios from 'axios'
import AnimatedSection from './AnimatedSection' // Ensure this path is correct

// --- Updated Product Interface ---
interface Product {
  _id: string
  title: string
  price: string // Assuming price is a string from API
  image: string // Expecting path like /uploads/image.jpg
  gender: string
  category: string
  inStock: boolean // Added inStock field
}

const PopularSection: React.FC = () => {
  const navigate = useNavigate()
  const [popularProducts, setPopularProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  // Ensure this matches your actual backend API URL
  const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app' // Or https://backend-production-c8ff.up.railway.app

  useEffect(() => {
    setLoading(true)
    setError(null)

    // Fetch products
    axios
      .get<any>(`${API_BASE_URL}/api/products?limit=3`) // Fetch up to 3
      .then((res) => {
        let rawProductsData: any[] = []

        // Determine the actual array of products from the response
        if (res.data && Array.isArray(res.data.products)) {
          rawProductsData = res.data.products
        } else if (Array.isArray(res.data)) {
          rawProductsData = res.data
        } else {
          console.warn('Unexpected API response structure for popular products:', res.data)
          setError('Could not parse popular products data.')
          setPopularProducts([])
          return
        }

        // Process fetched data
        const processedProducts: Product[] = rawProductsData
          .map((p) => {
            if (!p || typeof p !== 'object' || !p._id) {
              console.warn('Skipping invalid item in popular products data:', p)
              return null
            }
            return {
              _id: p._id,
              title: p.title ?? 'Untitled Product',
              price: String(p.price ?? '0'),
              image: p.image ?? '',
              gender: p.gender ?? 'Unknown',
              category: p.category ?? 'Uncategorized',
              inStock: p.inStock ?? true, // Default inStock to true
            }
          })
          .filter((p): p is Product => p !== null)

        // Set state with the processed and limited data (ensure max 3)
        setPopularProducts(processedProducts.slice(0, 3))
      })
      .catch((err) => {
        console.error('Error fetching popular products:', err)
        setError('Could not load popular products at the moment.')
        setPopularProducts([])
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
  if (loading) {
    return (
      <section className="popular-section-container bg-[#D3C5B8]">
        <h2 className="section-title">Most Popular</h2>
        <div className="loading-text">Loading popular items...</div>
      </section>
    )
  }

  if (error || popularProducts.length === 0) {
    if (error) console.error('PopularSection Error:', error)
    if (!error && popularProducts.length === 0) console.log('No popular products to display.')
    return null // Render nothing if error or no products
  }

  // --- Render Section ---
  return (
    <section className="popular-section-container bg-[#D3C5B8]">
      <h2 className="section-title text-[#725D45]">Most Popular</h2>
      <AnimatedSection direction="right">
        {/* Apply grid styles directly if not using Tailwind */}
        <div className="popular-grid">
          {popularProducts.map((product) => (
            // Product Card Start
            <div key={product._id} className="product-card-popular group">
              {/* Image Wrapper */}
              <div className="image-wrapper-popular">
                {/* Out of Stock Badge */}
                {!product.inStock && <div className="out-of-stock-badge-popular">Out of Stock</div>}
                {/* Product Image */}
                <img
                  src={`${API_BASE_URL}${product.image}`}
                  alt={product.title}
                  className={`product-image-popular ${
                    !product.inStock ? 'out-of-stock-image' : ''
                  }`}
                  onClick={() => product.inStock && handleViewDetails(product._id)}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x400?text=No+Image'
                  }}
                />
              </div>
              {/* Details Below Image */}
              <div className="details-wrapper-popular">
                <p className="product-title-popular" title={product.title}>
                  {product.title}
                </p>
                <p className="product-price-popular"> PKR {product.price}</p>
                {/* Buttons Container / Out of Stock Message */}
                <div className="buttons-container-popular">
                  {product.inStock ? (
                    // Render buttons only if in stock
                    <>
                      <button
                        className="button-popular view-details-button"
                        onClick={() => handleViewDetails(product._id)}
                        disabled={!product.inStock}
                      >
                        View Details
                      </button>
                      <button
                        className="button-popular try-now-button"
                        onClick={() => handleTryNow(product._id)}
                        disabled={!product.inStock}
                      >
                        Try Now
                      </button>
                    </>
                  ) : (
                    // Show "Out of Stock" text instead of buttons
                    <span className="out-of-stock-text-popular">Out of Stock</span>
                  )}
                </div>
                {/* End Buttons Container */}
              </div>
            </div>
            // Product Card End
          ))}
        </div>
      </AnimatedSection>

      {/* Basic Styles - UPDATED grid-template-columns */}
      <style jsx>{`
            .popular-section-container { width: 100%; padding: 3rem 1rem; /* py-12 px-4 */ md:padding: 4rem 2rem; lg:padding: 4rem 3rem; }
            .section-title { font-size: 1.875rem; /* text-3xl */ sm:font-size: 2.25rem; /* sm:text-4xl */ font-weight: 500; /* font-medium */ text-align: center; margin-bottom: 2rem; /* mb-8 */ sm:margin-bottom: 3rem; /* sm:mb-12 */ }
            .loading-text { text-align: center; color: #6b7280; /* text-gray-500 */ }

            /* --- UPDATED GRID DEFINITION --- */
            .popular-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr); /* Always 3 columns */
                gap: 1.5rem; /* gap-x-6 */
                row-gap: 2.5rem; /* gap-y-10 */
                max-width: 72rem; /* max-w-6xl */
                margin-left: auto;
                margin-right: auto;
             }
             /* --- Responsive adjustment for smaller screens (optional, if 3 cols is too crowded) --- */
             @media (max-width: 767px) { /* Below md breakpoint */
                .popular-grid {
                    grid-template-columns: repeat(1, 1fr); /* Switch to 1 column on small screens */
                    gap: 2rem; /* Adjust gap for single column */
                }
             }
             /* --- END GRID UPDATE --- */

            .product-card-popular { display: flex; flex-direction: column; align-items: center; }
            .image-wrapper-popular { background-color: white; padding: 1rem; /* p-4 */ width: 100%; overflow: hidden; border-radius: 0.375rem; /* rounded-md */ box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */ transition: box-shadow 0.3s ease-in-out; position: relative; }
            .product-card-popular:hover .image-wrapper-popular { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); /* hover:shadow-lg */ }
            .out-of-stock-badge-popular { position: absolute; top: 0.5rem; right: 0.5rem; background-color: #ef4444; color: white; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.5rem; border-radius: 0.25rem; z-index: 10; }
            .product-image-popular { display: block; width: 100%; height: 16rem; /* h-64 */ sm:height: 18rem; md:height: 20rem; object-fit: cover; transition: transform 0.3s ease-in-out; cursor: pointer; }
            .product-card-popular:hover .product-image-popular:not(.out-of-stock-image) { transform: scale(1.05); } /* Zoom effect for in-stock items */
            .product-image-popular.out-of-stock-image { opacity: 0.5; cursor: default; /* No pointer if out of stock */ }
            .details-wrapper-popular { margin-top: 0.75rem; /* mt-3 */ text-align: center; width: 100%; padding-left: 0.5rem; padding-right: 0.5rem; /* px-2 */ }
            .product-title-popular { font-size: 0.875rem; /* text-sm */ color: #1f2937; /* text-gray-800 */ font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .product-price-popular { font-size: 0.875rem; font-weight: 600; color: #111827; /* text-gray-900 */ margin-top: 0.25rem; }
            .buttons-container-popular { margin-top: 0.75rem; display: flex; flex-direction: column; sm:flex-row; gap: 0.5rem; justify-content: center; }
            .button-popular { padding: 0.5rem 1rem; /* px-4 py-2 */ font-size: 0.75rem; /* text-xs */ font-weight: 500; border-radius: 9999px; /* rounded-full */ transition: background-color 0.3s, opacity 0.3s; flex: 1; /* Make buttons take equal space in row */ border: none; cursor: pointer; }
            .button-popular:disabled { opacity: 0.5; cursor: not-allowed; }
            .view-details-button { background-color: #6b5745; color: white; }
            .view-details-button:hover:not(:disabled) { background-color: #5d4c3b; }
            .try-now-button { background-color: #c8a98a; /* Lighter brown */ color: white; }
            .try-now-button:hover:not(:disabled) { background-color: #b08d6a; /* Darken */ }
            .out-of-stock-text-popular { display: inline-block; margin-top: 0.25rem; padding: 0.5rem 1rem; background-color: #e5e7eb; /* bg-gray-200 */ color: #6b7280; /* text-gray-500 */ font-size: 0.75rem; font-weight: 600; border-radius: 9999px; width: 100%; sm:width: auto; }
       `}</style>
    </section>
  )
}

export default PopularSection
