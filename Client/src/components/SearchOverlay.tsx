import React, { useState } from 'react'
import axios from 'axios'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom' // Import useNavigate

// Interface for Product data
interface ProductType {
  _id: string
  title: string
  price: number | string
  category?: string
  gender?: string
  image?: string
}

// Interface for component props
interface SearchOverlayProps {
  onClose: () => void
}

// --- Backend Base URL ---
const API_BASE_URL = 'http://localhost:5000' // Or your local URL
// --- / ---

const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose }) => {
  const navigate = useNavigate() // Initialize useNavigate hook

  // --- State Variables ---
  const [searchQuery, setSearchQuery] = useState<string>('') // For category search input
  const [searchResults, setSearchResults] = useState<ProductType[]>([]) // Category search results
  const [selectedFile, setSelectedFile] = useState<File | null>(null) // Image search file
  const [imageSearchResults, setImageSearchResults] = useState<ProductType[]>([]) // Image search results
  const [labels, setLabels] = useState<string[]>([]) // Labels from image search
  const [error, setError] = useState<string | null>(null) // Error message
  const [isSearchingText, setIsSearchingText] = useState(false) // Loading for category search
  const [isSearchingImage, setIsSearchingImage] = useState(false) // Loading for image search
  const [lastSearchedQuery, setLastSearchedQuery] = useState<string>('') // To display "no results for..." message correctly
  const [lastSearchedImage, setLastSearchedImage] = useState<boolean>(false) // To display "no results for..." message correctly

  // --- Text Search Handler (Searches Category) ---
  const handleTextSearch = async () => {
    const trimmedQuery = searchQuery.trim()
    if (!trimmedQuery) return

    setIsSearchingText(true)
    setError(null)
    setSearchResults([])
    setImageSearchResults([]) // Clear other results
    setLabels([])
    setLastSearchedQuery(trimmedQuery) // Store the query being searched
    setLastSearchedImage(false) // Indicate text search was last

    try {
      const response = await axios.get<ProductType[]>(
        `${API_BASE_URL}/api/products/search?query=${encodeURIComponent(trimmedQuery)}`,
      )
      setSearchResults(Array.isArray(response.data) ? response.data : [])
    } catch (err: any) {
      console.error('Category Search Error:', err)
      setError('Error searching by category. Please check the category name or try again.')
      setSearchResults([])
    } finally {
      setIsSearchingText(false)
    }
  }

  // --- File Change Handler ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0])
      setImageSearchResults([])
      setLabels([])
      setError(null)
      setSearchResults([]) // Clear text results when new file chosen
      setLastSearchedImage(false) // Reset flag
      setLastSearchedQuery('') // Reset flag
    }
  }

  // --- Image Search Handler ---
  const handleImageSearch = async () => {
    if (!selectedFile) return

    setIsSearchingImage(true)
    setError(null)
    setImageSearchResults([])
    setLabels([])
    setSearchResults([]) // Clear text results
    setLastSearchedImage(true) // Indicate image search was last
    setLastSearchedQuery('') // Reset flag

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      const response = await axios.post<{ products: ProductType[]; labels: string[] }>(
        `${API_BASE_URL}/api/products/search-by-image`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      setImageSearchResults(response.data?.products || [])
      setLabels(response.data?.labels || [])
    } catch (err: any) {
      console.error('Image Search Error:', err)
      setError('Error performing image search. Please try again.')
      setImageSearchResults([])
      setLabels([])
    } finally {
      setIsSearchingImage(false)
    }
  }

  // --- Navigation Handler ---
  const handleResultClick = (productId: string) => {
    if (!productId) return
    navigate(`/product/${productId}`)
    onClose() // Close the overlay
  }

  // Determine if any search has been performed and finished
  const searchAttempted =
    (lastSearchedQuery || lastSearchedImage) && !isSearchingText && !isSearchingImage
  const noResultsFound = searchResults.length === 0 && imageSearchResults.length === 0

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl relative p-6 md:p-8 max-h-[90vh] overflow-y-hidden flex flex-col font-sans">
        {' '}
        {/* Changed overflow-y */}
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pr-8 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800">Search Products</h2>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-600 focus:outline-none z-10 p-1 rounded-full hover:bg-gray-100"
            aria-label="Close search"
          >
            <X size={24} />
          </button>
        </div>
        {/* Global Error Display */}
        {error && <p className="error-message flex-shrink-0">{error}</p>}
        {/* Search Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 flex-shrink-0">
          {/* Left Side: Text Search (by Category) */}
          <div>
            <label htmlFor="text-search" className="search-label">
              Search by Category
            </label>
            <div className="flex items-center space-x-2">
              <input
                id="text-search"
                type="text"
                className="search-input"
                placeholder="Enter category (e.g., Shirts)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTextSearch()}
              />
              <button
                onClick={handleTextSearch}
                disabled={isSearchingText || !searchQuery.trim()}
                className="search-button primary-button"
              >
                {isSearchingText ? '...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Right Side: Image Search */}
          <div>
            <label htmlFor="image-search-input" className="search-label">
              Search by Image
            </label>
            <div className="flex flex-col space-y-2">
              {' '}
              {/* Reduced space */}
              <input
                id="image-search-input"
                type="file"
                onChange={handleFileChange}
                className="file-input"
                accept="image/png, image/jpeg, image/webp"
              />
              {selectedFile && (
                <span className="text-xs text-gray-600 truncate">
                  Selected: {selectedFile.name}
                </span>
              )}
              <button
                onClick={handleImageSearch}
                disabled={!selectedFile || isSearchingImage}
                className="search-button secondary-button self-start mt-1" // Added margin top
              >
                {isSearchingImage ? 'Analysing...' : 'Search Image'}
              </button>
            </div>
          </div>
        </div>
        {/* Results Area - Scrollable */}
        <div className="flex-grow border-t border-gray-200 pt-4 overflow-y-auto">
          {' '}
          {/* Added overflow-y-auto */}
          {/* Loading Indicators */}
          {(isSearchingText || isSearchingImage) && (
            <p className="search-status text-center py-4">
              {isSearchingText
                ? `Searching for category "${lastSearchedQuery}"...`
                : 'Analyzing image and searching...'}
            </p>
          )}
          {/* Results Display */}
          {!isSearchingText &&
            !isSearchingImage &&
            (searchResults.length > 0 || imageSearchResults.length > 0) && (
              <div className="space-y-4">
                {' '}
                {/* Add space between result sections */}
                {/* Text Search Results - CLICKABLE */}
                {searchResults.length > 0 && (
                  <div className="search-results-section">
                    <h3 className="results-title">Category Search Results:</h3>
                    <ul className="results-list">
                      {searchResults.map((product) => (
                        <li
                          key={product._id}
                          onClick={() => handleResultClick(product._id)}
                          className="result-item group"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && handleResultClick(product._id)}
                        >
                          <img
                            src={`${API_BASE_URL}${product.image}`}
                            alt={product.title}
                            className="result-image"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/100?text=No+Img'
                              e.currentTarget.alt = 'Image unavailable'
                            }}
                          />
                          <div className="result-info">
                            {' '}
                            <strong className="result-title">{product.title}</strong>{' '}
                            <span className="result-price">Rs {product.price}</span>{' '}
                          </div>
                          <span className="result-view-indicator">View</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Image Search Results - CLICKABLE */}
                {imageSearchResults.length > 0 && (
                  <div className="search-results-section">
                    <h3 className="results-title">Image Search Results:</h3>
                    {labels.length > 0 && (
                      <p className="detected-labels">
                        <span className="font-medium">Detected:</span>{' '}
                        {labels.slice(0, 5).join(', ')}
                        {labels.length > 5 ? '...' : ''}
                      </p>
                    )}
                    <ul className="results-list">
                      {imageSearchResults.map((product) => (
                        <li
                          key={product._id}
                          onClick={() => handleResultClick(product._id)}
                          className="result-item group"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && handleResultClick(product._id)}
                        >
                          <img
                            src={`${API_BASE_URL}${product.image}`}
                            alt={product.title}
                            className="result-image"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/100?text=No+Img'
                              e.currentTarget.alt = 'Image unavailable'
                            }}
                          />
                          <div className="result-info">
                            {' '}
                            <strong className="result-title">{product.title}</strong>{' '}
                            <span className="result-price">Rs {product.price}</span>{' '}
                          </div>
                          <span className="result-view-indicator">View</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          {/* No Results/Initial State Messages */}
          {!isSearchingText && !isSearchingImage && noResultsFound && searchAttempted && (
            <p className="search-status text-center py-4">
              {lastSearchedQuery
                ? `No products found for category "${lastSearchedQuery}".`
                : lastSearchedImage
                ? 'No similar products found for the uploaded image.'
                : 'No results.'}
            </p>
          )}
          {!searchAttempted && !isSearchingText && !isSearchingImage && (
            <p className="search-status text-center py-4 text-gray-500">
              Enter a category or upload an image to start searching.
            </p>
          )}
        </div>{' '}
        {/* End Results Area */}
      </div>{' '}
      {/* End Modal Content */}
      {/* --- Basic Styles (Copied from previous response, ensure they match your needs) --- */}
      <style jsx>{`
        /* Input & Button Styles */
        .search-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151; /* text-gray-700 */
          font-size: 0.875rem; /* text-sm */
        }
        .search-input {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          width: 100%;
          flex-grow: 1;
          font-size: 0.875rem;
        }
        .search-input:focus {
          outline: none;
          border-color: #c8a98a;
          box-shadow: 0 0 0 1px #c8a98a;
        }
        .file-input {
          display: block;
          width: 100%;
          font-size: 0.875rem;
          color: #6b7280;
        }
        .file-input::file-selector-button {
          margin-right: 1rem;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          border: none;
          font-size: 0.875rem;
          font-weight: 600;
          background-color: #f3f0e9; /* Lighter beige */
          color: #a88a6a;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .file-input::file-selector-button:hover {
          background-color: #e6dcc8;
        }
        .search-button {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          color: white;
          transition: background-color 0.2s, opacity 0.2s;
          font-weight: 500;
          white-space: nowrap;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
        }
        .search-button.primary-button {
          background-color: #c8a98a;
        }
        .search-button.primary-button:hover:not(:disabled) {
          background-color: #b08d6a;
        }
        .search-button.secondary-button {
          background-color: #a88a6a;
        } /* Slightly different brown */
        .search-button.secondary-button:hover:not(:disabled) {
          background-color: #8b6e4a;
        }
        .search-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Status & Results Styles */
        .search-status {
          color: #4b5563; /* gray-600 */
          font-size: 0.875rem;
        }
        .error-message {
          background-color: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }
        .search-results-section {
          /* Optional: Add margin if needed */
        }
        .results-title {
          font-size: 1rem; /* text-base */
          font-weight: 600; /* font-semibold */
          margin-bottom: 0.75rem; /* mb-3 */
          color: #374151; /* text-gray-800 */
          flex-shrink: 0;
        }
        .detected-labels {
          font-size: 0.8rem;
          color: #4b5563;
          margin-bottom: 0.75rem;
          flex-shrink: 0;
          line-height: 1.4;
        }
        .results-list {
          list-style: none;
          padding: 0;
          margin: 0; /* Handled by parent now */
          space-y: 0.75rem; /* space-y-3 */
        }
        .result-item {
          border: 1px solid #e5e7eb; /* border-gray-200 */
          padding: 0.75rem; /* p-3 */
          border-radius: 0.375rem; /* rounded */
          transition: background-color 0.2s, border-color 0.2s;
          display: flex;
          align-items: center;
          gap: 1rem; /* space-x-4 */
          cursor: pointer;
        }
        .result-item:hover,
        .result-item:focus {
          background-color: #f9fafb; /* hover:bg-gray-50 */
          outline: none;
          border-color: #c8a98a;
        }
        .result-image {
          width: 3.5rem; /* w-14 */
          height: 3.5rem; /* h-14 */
          object-fit: cover;
          border-radius: 0.25rem; /* rounded */
          flex-shrink: 0;
          background-color: #f3f4f6; /* BG for placeholders */
        }
        .result-info {
          flex-grow: 1;
          min-width: 0; /* Allow text truncation */
        }
        .result-title {
          display: block;
          font-size: 0.875rem; /* text-sm */
          font-weight: 500; /* font-medium */
          color: #111827; /* text-gray-900 */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .result-price {
          font-size: 0.8rem;
          color: #4b5563; /* text-gray-600 */
        }
        .result-view-indicator {
          margin-left: auto;
          font-size: 0.75rem;
          color: #9ca3af; /* gray-400 */
          opacity: 0;
          transition: opacity 0.2s;
          flex-shrink: 0;
        } /* Added flex-shrink */
        .result-item:hover .result-view-indicator,
        .result-item:focus .result-view-indicator {
          opacity: 1;
        }
      `}</style>
    </div> // End Modal Container
  )
}

export default SearchOverlay
