// src/components/SearchOverlay.tsx
import React, { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search as SearchIcon, ImagePlus, Loader2, ArrowRight } from 'lucide-react' // Added icons
import { useNavigate } from 'react-router-dom'

interface ProductType {
  _id: string
  title: string
  price: number | string
  category?: string
  gender?: string
  image?: string
}

interface SearchOverlayProps {
  onClose: () => void
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://backend-production-c8ff.up.railway.app'

// Animation Variants
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 250,
      damping: 25,
      duration: 0.3,
      staggerChildren: 0.05,
    },
  },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose }) => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<ProductType[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageSearchResults, setImageSearchResults] = useState<ProductType[]>([])
  const [labels, setLabels] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSearchingText, setIsSearchingText] = useState(false)
  const [isSearchingImage, setIsSearchingImage] = useState(false)
  const [lastSearchedQuery, setLastSearchedQuery] = useState<string>('')
  const [lastSearchedImage, setLastSearchedImage] = useState<boolean>(false)

  const handleTextSearch = async () => {
    // ... (functionality remains the same, ensure errors are set via setError)
    const trimmedQuery = searchQuery.trim()
    if (!trimmedQuery) {
      setError('Please enter a category to search.')
      return
    }
    setIsSearchingText(true)
    setError(null)
    setSearchResults([])
    setImageSearchResults([])
    setLabels([])
    setLastSearchedQuery(trimmedQuery)
    setLastSearchedImage(false)
    try {
      const response = await axios.get<ProductType[]>(
        `${API_BASE_URL}/api/products/search?query=${encodeURIComponent(trimmedQuery)}`,
      )
      setSearchResults(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      setError('Error searching by category. Please try again.')
    } finally {
      setIsSearchingText(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file)) // Create preview
      setImageSearchResults([])
      setLabels([])
      setError(null)
      setSearchResults([])
      setLastSearchedImage(false)
      setLastSearchedQuery('')
    } else {
      setSelectedFile(null)
      setImagePreview(null)
    }
  }

  const handleImageSearch = async () => {
    // ... (functionality remains the same, ensure errors are set via setError)
    if (!selectedFile) {
      setError('Please select an image file.')
      return
    }
    setIsSearchingImage(true)
    setError(null)
    setImageSearchResults([])
    setLabels([])
    setSearchResults([])
    setLastSearchedImage(true)
    setLastSearchedQuery('')
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
    } catch (err) {
      setError('Error performing image search. Please try again.')
    } finally {
      setIsSearchingImage(false)
    }
  }

  const handleResultClick = (productId: string) => {
    if (!productId) return
    navigate(`/product/${productId}`)
    onClose()
  }

  const searchAttempted =
    (lastSearchedQuery || lastSearchedImage) && !isSearchingText && !isSearchingImage
  const noResultsFound = searchResults.length === 0 && imageSearchResults.length === 0

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-inter"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="bg-white w-full max-w-2xl lg:max-w-3xl rounded-xl shadow-2xl relative p-6 sm:p-8 flex flex-col max-h-[90vh]"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          className="flex justify-between items-center mb-6 flex-shrink-0"
          variants={itemVariants}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-trendzone-dark-blue">
            Search Products
          </h2>
          <motion.button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-trendzone-dark-blue rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close search"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>
        </motion.div>

        {error && (
          <motion.p
            className="bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-md text-sm mb-4 flex-shrink-0"
            variants={itemVariants}
          >
            {error}
          </motion.p>
        )}

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 flex-shrink-0"
          variants={itemVariants}
        >
          {/* Text Search */}
          <div className="space-y-2">
            <label
              htmlFor="text-search"
              className="block text-sm font-semibold text-trendzone-dark-blue mb-1"
            >
              Search by Category
            </label>
            <div className="flex items-center space-x-2">
              <input
                id="text-search"
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-trendzone-dark-blue placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-trendzone-light-blue focus:border-transparent transition-colors"
                placeholder="e.g., Shirts, Jackets"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && !isSearchingText && searchQuery.trim() && handleTextSearch()
                }
              />
              <motion.button
                onClick={handleTextSearch}
                disabled={isSearchingText || !searchQuery.trim()}
                className="px-4 py-2.5 bg-trendzone-dark-blue text-white text-sm font-semibold rounded-lg hover:bg-trendzone-light-blue hover:text-trendzone-dark-blue transition-colors disabled:opacity-60 flex items-center justify-center h-[44px] w-[100px]" // Fixed height for consistency
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSearchingText ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <SearchIcon size={18} />
                )}
              </motion.button>
            </div>
          </div>

          {/* Image Search */}
          <div className="space-y-2">
            <label
              htmlFor="image-search-input"
              className="block text-sm font-semibold text-trendzone-dark-blue mb-1"
            >
              Search by Image
            </label>
            <div className="flex items-center space-x-2">
              <label className="flex-grow h-[44px] px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500 hover:border-trendzone-light-blue cursor-pointer transition-colors flex items-center justify-center">
                <ImagePlus size={18} className="mr-2 text-gray-400" />
                <span>
                  {selectedFile
                    ? selectedFile.name.substring(0, 20) +
                      (selectedFile.name.length > 20 ? '...' : '')
                    : 'Choose File'}
                </span>
                <input
                  id="image-search-input"
                  type="file"
                  onChange={handleFileChange}
                  className="sr-only" // Hidden, styled by label
                  accept="image/png, image/jpeg, image/webp"
                />
              </label>
              <motion.button
                onClick={handleImageSearch}
                disabled={!selectedFile || isSearchingImage}
                className="px-4 py-2.5 bg-trendzone-dark-blue text-white text-sm font-semibold rounded-lg hover:bg-trendzone-light-blue hover:text-trendzone-dark-blue transition-colors disabled:opacity-60 flex items-center justify-center h-[44px] w-[100px]" // Fixed height for consistency
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSearchingImage ? <Loader2 className="animate-spin w-5 h-5" /> : 'Search'}
              </motion.button>
            </div>
            {imagePreview && (
              <div className="mt-2 w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                <img
                  src={imagePreview}
                  alt="Selected preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Results Area */}
        <motion.div
          className="flex-grow border-t border-gray-200 pt-4 overflow-y-auto"
          variants={itemVariants}
        >
          {(isSearchingText || isSearchingImage) && (
            <div className="flex flex-col items-center justify-center py-6 text-gray-600">
              <Loader2 className="animate-spin w-7 h-7 mb-2 text-trendzone-light-blue" />
              <p className="text-sm">
                {isSearchingText ? `Searching for "${lastSearchedQuery}"...` : 'Analyzing image...'}
              </p>
            </div>
          )}

          {!isSearchingText &&
            !isSearchingImage &&
            (searchResults.length > 0 || imageSearchResults.length > 0) && (
              <div className="space-y-5">
                {searchResults.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold text-trendzone-dark-blue mb-2">
                      Category Matches:
                    </h3>
                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {' '}
                      {/* Scrollable list */}
                      {searchResults.map((product) => (
                        <li
                          key={product._id}
                          onClick={() => handleResultClick(product._id)}
                          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && handleResultClick(product._id)}
                        >
                          <img
                            src={`${API_BASE_URL}${product.image?.startsWith('/') ? '' : '/'}${
                              product.image
                            }`}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded-md bg-gray-200"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/100?text=N/A'
                            }}
                          />
                          <div className="flex-grow min-w-0">
                            <p className="text-sm font-medium text-trendzone-dark-blue truncate group-hover:text-trendzone-light-blue">
                              {product.title}
                            </p>
                            <p className="text-xs text-gray-500">PKR {product.price}</p>
                          </div>
                          <ArrowRight
                            size={16}
                            className="text-gray-400 group-hover:text-trendzone-light-blue transition-colors flex-shrink-0"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {imageSearchResults.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold text-trendzone-dark-blue mb-2">
                      Image Matches:
                    </h3>
                    {labels.length > 0 && (
                      <p className="text-xs text-gray-500 mb-2">
                        <span className="font-medium">Detected:</span>{' '}
                        {labels.slice(0, 4).join(', ')}
                        {labels.length > 4 ? '...' : ''}
                      </p>
                    )}
                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {' '}
                      {/* Scrollable list */}
                      {imageSearchResults.map((product) => (
                        <li
                          key={product._id}
                          onClick={() => handleResultClick(product._id)}
                          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && handleResultClick(product._id)}
                        >
                          <img
                            src={`${API_BASE_URL}${product.image?.startsWith('/') ? '' : '/'}${
                              product.image
                            }`}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded-md bg-gray-200"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/100?text=N/A'
                            }}
                          />
                          <div className="flex-grow min-w-0">
                            <p className="text-sm font-medium text-trendzone-dark-blue truncate group-hover:text-trendzone-light-blue">
                              {product.title}
                            </p>
                            <p className="text-xs text-gray-500">PKR {product.price}</p>
                          </div>
                          <ArrowRight
                            size={16}
                            className="text-gray-400 group-hover:text-trendzone-light-blue transition-colors flex-shrink-0"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          {!isSearchingText && !isSearchingImage && noResultsFound && searchAttempted && (
            <p className="text-sm text-center text-gray-500 py-6">
              {lastSearchedQuery
                ? `No results found for "${lastSearchedQuery}".`
                : 'No similar products found for the uploaded image.'}
            </p>
          )}
          {!searchAttempted && !isSearchingText && !isSearchingImage && (
            <p className="text-sm text-center text-gray-400 py-6">
              Enter a category or upload an image to start searching.
            </p>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default SearchOverlay
