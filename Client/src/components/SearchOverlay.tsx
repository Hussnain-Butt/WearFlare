// src/components/SearchOverlay.tsx
import React, { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search as SearchIcon, ImagePlus, Loader2, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ProductType {
  _id: string
  title: string
  price: number | string // Keep as is if price can be string from API
  category?: string
  gender?: string
  image?: string
}

interface SearchOverlayProps {
  onClose: () => void
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://backend-production-c8ff.up.railway.app' // TODO: .env

// Animation Variants - unchanged
const backdropVariants = {
  /* ... */
}
const modalVariants = {
  /* ... */
}
const itemVariants = {
  /* ... */
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

  // --- Logic Functions (handleTextSearch, handleFileChange, handleImageSearch, handleResultClick) - UNCHANGED except for console.error ---
  const handleTextSearch = async () => {
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
      console.error('Text search error:', err)
      setError('Error searching by category. Please try again.')
    } finally {
      setIsSearchingText(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file))
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
      console.error('Image search error:', err)
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
  // --- END Logic Functions ---

  const searchAttempted =
    (lastSearchedQuery || lastSearchedImage) && !isSearchingText && !isSearchingImage
  const noResultsFound = searchResults.length === 0 && imageSearchResults.length === 0

  return (
    <motion.div
      // Backdrop color - bg-black/60 is okay, or use a theme variable for overlay
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-inter"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose} // Click on backdrop closes overlay
    >
      <motion.div
        // bg-white -> bg-card
        className="bg-card w-full max-w-2xl lg:max-w-3xl rounded-xl shadow-2xl relative p-6 sm:p-8 flex flex-col max-h-[90vh]"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        <motion.div
          className="flex justify-between items-center mb-6 flex-shrink-0"
          variants={itemVariants}
        >
          {/* text-trendzone-dark-blue -> text-card-foreground (or text-primary) */}
          <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground">Search Products</h2>
          <motion.button
            onClick={onClose}
            // text-gray-500 -> text-muted-foreground
            // hover:text-trendzone-dark-blue -> hover:text-primary
            // hover:bg-gray-100 -> hover:bg-muted/50
            className="p-1.5 text-muted-foreground hover:text-primary rounded-full hover:bg-muted/50 transition-colors"
            aria-label="Close search"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>
        </motion.div>

        {error && (
          <motion.p
            // bg-red-50 -> bg-destructive/10
            // text-red-600 -> text-destructive
            // border-red-200 -> border-destructive/30
            className="bg-destructive/10 text-destructive border border-destructive/30 px-4 py-2.5 rounded-md text-sm mb-4 flex-shrink-0"
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
              // text-trendzone-dark-blue -> text-card-foreground (or text-foreground)
              className="block text-sm font-semibold text-card-foreground mb-1"
            >
              Search by Category
            </label>
            <div className="flex items-center space-x-2">
              <input
                id="text-search"
                type="text"
                // bg-gray-50 -> bg-input
                // border-gray-300 -> border-border
                // text-trendzone-dark-blue -> text-foreground
                // placeholder-gray-400 -> placeholder:text-muted-foreground
                // focus:ring-trendzone-light-blue -> focus:ring-ring
                className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
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
                // bg-trendzone-dark-blue -> bg-primary
                // text-white -> text-primary-foreground
                // hover:bg-trendzone-light-blue hover:text-trendzone-dark-blue -> hover:bg-primary/80 hover:text-primary-foreground (or accent)
                className="px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-60 flex items-center justify-center h-[44px] w-[100px]"
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
              // text-trendzone-dark-blue -> text-card-foreground
              className="block text-sm font-semibold text-card-foreground mb-1"
            >
              Search by Image
            </label>
            <div className="flex items-center space-x-2">
              {/* File Upload Label Styling */}
              <label className="flex-grow h-[44px] px-4 py-2.5 bg-input border border-border rounded-lg text-sm text-muted-foreground hover:border-primary cursor-pointer transition-colors flex items-center justify-center">
                {/* text-gray-500 -> text-muted-foreground, hover:border-trendzone-light-blue -> hover:border-primary */}
                {/* text-gray-400 (for icon) -> text-muted-foreground */}
                <ImagePlus size={18} className="mr-2 text-muted-foreground" />
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
                  className="sr-only"
                  accept="image/png, image/jpeg, image/webp"
                />
              </label>
              <motion.button
                onClick={handleImageSearch}
                disabled={!selectedFile || isSearchingImage}
                // Same button styling as text search button
                className="px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-60 flex items-center justify-center h-[44px] w-[100px]"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSearchingImage ? <Loader2 className="animate-spin w-5 h-5" /> : 'Search'}
              </motion.button>
            </div>
            {imagePreview && (
              // border-gray-200 -> border-border
              <div className="mt-2 w-20 h-20 rounded-md overflow-hidden border border-border">
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
          // border-gray-200 -> border-border
          className="flex-grow border-t border-border pt-4 overflow-y-auto"
          variants={itemVariants}
        >
          {(isSearchingText || isSearchingImage) && (
            // text-gray-600 -> text-muted-foreground
            // text-trendzone-light-blue (loader) -> text-accent (or text-primary)
            <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
              <Loader2 className="animate-spin w-7 h-7 mb-2 text-accent" />
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
                    {/* text-trendzone-dark-blue -> text-card-foreground */}
                    <h3 className="text-md font-semibold text-card-foreground mb-2">
                      Category Matches:
                    </h3>
                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {searchResults.map((product) => (
                        <li
                          key={`text-${product._id}`} // Added prefix for key uniqueness
                          onClick={() => handleResultClick(product._id)}
                          // hover:bg-gray-100 -> hover:bg-muted/50
                          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && handleResultClick(product._id)}
                        >
                          {/* bg-gray-200 -> bg-muted */}
                          <img
                            src={`${API_BASE_URL}${product.image?.startsWith('/') ? '' : '/'}${
                              product.image
                            }`}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded-md bg-muted"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/100?text=N/A'
                            }}
                          />
                          <div className="flex-grow min-w-0">
                            {/* text-trendzone-dark-blue -> text-card-foreground (or text-foreground) */}
                            {/* group-hover:text-trendzone-light-blue -> group-hover:text-accent */}
                            <p className="text-sm font-medium text-card-foreground truncate group-hover:text-accent">
                              {product.title}
                            </p>
                            {/* text-gray-500 -> text-muted-foreground */}
                            <p className="text-xs text-muted-foreground">PKR {product.price}</p>
                          </div>
                          {/* text-gray-400 -> text-muted-foreground */}
                          {/* group-hover:text-trendzone-light-blue -> group-hover:text-accent */}
                          <ArrowRight
                            size={16}
                            className="text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {imageSearchResults.length > 0 && (
                  <div>
                    {/* text-trendzone-dark-blue -> text-card-foreground */}
                    <h3 className="text-md font-semibold text-card-foreground mb-2">
                      Image Matches:
                    </h3>
                    {labels.length > 0 && (
                      // text-gray-500 -> text-muted-foreground
                      <p className="text-xs text-muted-foreground mb-2">
                        <span className="font-medium">Detected:</span>{' '}
                        {labels.slice(0, 4).join(', ')}
                        {labels.length > 4 ? '...' : ''}
                      </p>
                    )}
                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {imageSearchResults.map((product) => (
                        <li
                          key={`image-${product._id}`} // Added prefix for key uniqueness
                          onClick={() => handleResultClick(product._id)}
                          // hover:bg-gray-100 -> hover:bg-muted/50
                          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && handleResultClick(product._id)}
                        >
                          {/* bg-gray-200 -> bg-muted */}
                          <img
                            src={`${API_BASE_URL}${product.image?.startsWith('/') ? '' : '/'}${
                              product.image
                            }`}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded-md bg-muted"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/100?text=N/A'
                            }}
                          />
                          <div className="flex-grow min-w-0">
                            {/* text-trendzone-dark-blue -> text-card-foreground (or text-foreground) */}
                            {/* group-hover:text-trendzone-light-blue -> group-hover:text-accent */}
                            <p className="text-sm font-medium text-card-foreground truncate group-hover:text-accent">
                              {product.title}
                            </p>
                            {/* text-gray-500 -> text-muted-foreground */}
                            <p className="text-xs text-muted-foreground">PKR {product.price}</p>
                          </div>
                          {/* text-gray-400 -> text-muted-foreground */}
                          {/* group-hover:text-trendzone-light-blue -> group-hover:text-accent */}
                          <ArrowRight
                            size={16}
                            className="text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          {/* text-gray-500 -> text-muted-foreground */}
          {!isSearchingText && !isSearchingImage && noResultsFound && searchAttempted && (
            <p className="text-sm text-center text-muted-foreground py-6">
              {lastSearchedQuery
                ? `No results found for "${lastSearchedQuery}".`
                : 'No similar products found for the uploaded image.'}
            </p>
          )}
          {/* text-gray-400 -> text-muted-foreground/70 (lighter hint) */}
          {!searchAttempted && !isSearchingText && !isSearchingImage && (
            <p className="text-sm text-center text-muted-foreground/70 py-6">
              Enter a category or upload an image to start searching.
            </p>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default SearchOverlay
