import React, { useState } from 'react'
import axios from 'axios'
import { X } from 'lucide-react'

interface ProductType {
  _id: string
  title: string
  // Make sure price is a number or string as appropriate for your data
  price: number | string
  category?: string
  gender?: string
  image?: string // This field holds the image path like /uploads/image.jpg
}

interface SearchOverlayProps {
  onClose: () => void
}

// --- IMPORTANT ---
// Define your backend base URL here or better, use an environment variable
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app'
// For production, you would use something like:
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://your-production-api.com';
// --- /IMPORTANT ---

const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<ProductType[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageSearchResults, setImageSearchResults] = useState<ProductType[]>([])
  const [labels, setLabels] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSearchingText, setIsSearchingText] = useState(false) // Optional: For loading state
  const [isSearchingImage, setIsSearchingImage] = useState(false) // Optional: For loading state

  const handleTextSearch = async () => {
    if (!searchQuery) return
    setIsSearchingText(true) // Start loading
    setError(null)
    setSearchResults([]) // Clear previous results
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/products/search?query=${encodeURIComponent(searchQuery)}`,
      )

      console.log('Search response data:', response.data)

      if (Array.isArray(response.data)) {
        setSearchResults(response.data)
      } else {
        setError('Unexpected data format from server. Expected an array.')
        setSearchResults([])
      }
    } catch (err: any) {
      console.error('Text Search Error:', err)
      setError('Error in text search. Please try again.')
      setSearchResults([])
    } finally {
      setIsSearchingText(false) // Stop loading
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
      // Clear previous image search results when a new file is selected
      setImageSearchResults([])
      setLabels([])
    }
  }

  const handleImageSearch = async () => {
    if (!selectedFile) return
    setIsSearchingImage(true) // Start loading
    setError(null)
    setImageSearchResults([])
    setLabels([])
    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      const response = await axios.post(`${API_BASE_URL}/api/products/search-by-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setImageSearchResults(response.data.products || []) // Ensure it's an array
      setLabels(response.data.labels || []) // Ensure it's an array
    } catch (err: any) {
      console.error('Image Search Error:', err)
      setError('Error in image search. Please try again.')
      setImageSearchResults([])
      setLabels([])
    } finally {
      setIsSearchingImage(false) // Stop loading
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg relative p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none z-10"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Search Products</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Text Search */}
          <div>
            <label htmlFor="text-search" className="block mb-2 font-semibold text-gray-700">
              Search by Title
            </label>
            <div className="flex items-center space-x-2">
              <input
                id="text-search"
                type="text"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-[#B8860B] flex-grow"
                placeholder="Enter product title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTextSearch()} // Optional: Search on Enter
              />
              <button
                onClick={handleTextSearch}
                disabled={isSearchingText || !searchQuery} // Disable while searching or if query is empty
                className={`bg-[#B8860B] text-white px-4 py-2 rounded hover:bg-[#996F0B] transition-colors whitespace-nowrap ${
                  isSearchingText || !searchQuery ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSearchingText ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Text Search Results - MODIFIED SECTION */}
            {searchResults.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Text Search Results:</h3>
                <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {' '}
                  {/* Added max height and scroll */}
                  {searchResults.map((product) => (
                    <li
                      key={product._id}
                      className="border border-gray-200 p-3 rounded hover:bg-gray-50 transition flex items-center space-x-4"
                    >
                      {/* Product Image */}
                      {product.image ? (
                        <img
                          // Construct the full URL for the image
                          src={`${API_BASE_URL}${product.image}`}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded flex-shrink-0" // Fixed size, object-cover
                          onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails to load
                        />
                      ) : (
                        // Optional: Placeholder if no image
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs flex-shrink-0">
                          No img
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="flex-grow">
                        <strong className="block text-sm font-medium text-gray-900">
                          {product.title}
                        </strong>
                        {/* Assuming price is stored like '5,299' or '5299'. Adjust formatting as needed. */}
                        <span className="text-sm text-gray-600">Rs {product.price}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Indicate if searching */}
            {isSearchingText && <p className="mt-4 text-gray-600">Searching...</p>}
            {/* Indicate if no results found after search */}
            {!isSearchingText && searchQuery && searchResults.length === 0 && (
              <p className="mt-4 text-gray-600">No products found matching "{searchQuery}".</p>
            )}
          </div>
          {/* / End Text Search Results */}

          {/* Right Side: Image Search */}
          <div>
            <label htmlFor="image-search-input" className="block mb-2 font-semibold text-gray-700">
              Search by Image
            </label>
            <div className="flex flex-col space-y-3">
              <input
                id="image-search-input"
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded file:border-0
                           file:text-sm file:font-semibold
                           file:bg-[#eee1c0] file:text-[#B8860B]
                           hover:file:bg-[#e6d5b1]"
                accept="image/*"
              />
              {selectedFile && (
                <span className="text-sm text-gray-600 truncate">
                  Selected: {selectedFile.name}
                </span>
              )}
              <button
                onClick={handleImageSearch}
                disabled={!selectedFile || isSearchingImage} // Disable if no file or searching
                className={`bg-[#B8860B] text-white px-4 py-2 rounded hover:bg-[#996F0B] transition-colors self-start ${
                  !selectedFile || isSearchingImage ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSearchingImage ? 'Searching...' : 'Search by Image'}
              </button>
            </div>

            {/* Image Search Results - Also updated to show images */}
            {imageSearchResults.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Image Search Results:</h3>
                {/* Display detected labels if needed */}
                {labels.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Detected objects/concepts:</span>{' '}
                      {labels.slice(0, 5).join(', ')}
                      {labels.length > 5 ? '...' : ''}
                    </p>
                  </div>
                )}
                <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {' '}
                  {/* Added max height and scroll */}
                  {imageSearchResults.map((product) => (
                    <li
                      key={product._id}
                      className="border border-gray-200 p-3 rounded hover:bg-gray-50 transition flex items-center space-x-4"
                    >
                      {/* Product Image */}
                      {product.image ? (
                        <img
                          src={`${API_BASE_URL}${product.image}`}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded flex-shrink-0"
                          onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails to load
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs flex-shrink-0">
                          No img
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="flex-grow">
                        <strong className="block text-sm font-medium text-gray-900">
                          {product.title}
                        </strong>
                        <span className="text-sm text-gray-600">Rs {product.price}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Indicate if searching */}
            {isSearchingImage && (
              <p className="mt-4 text-gray-600">Analyzing image and searching...</p>
            )}
            {/* Indicate if no results found after search */}
            {!isSearchingImage && selectedFile && imageSearchResults.length === 0 && (
              <p className="mt-4 text-gray-600">
                No similar products found for the uploaded image.
              </p>
            )}
          </div>
          {/* / End Image Search Results */}
        </div>
      </div>
    </div>
  )
}

export default SearchOverlay
