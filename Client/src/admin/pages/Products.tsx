import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { toast, Toaster } from 'react-hot-toast'

// Interface for Product data, including the optional description
interface Product {
  _id: string
  title: string
  price: string | number // Price can be fetched as string or number
  category: string
  gender: string
  image: string
  description?: string // Description is optional string
}

const Products: React.FC = () => {
  // --- State Variables ---
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('') // Use string state for input value
  const [category, setCategory] = useState('')
  const [gender, setGender] = useState('')
  const [description, setDescription] = useState('') // State for description (string)
  const [image, setImage] = useState<File | null>(null) // State for the selected image file
  const [preview, setPreview] = useState<string | null>(null) // State for image preview URL
  const [loading, setLoading] = useState(false) // Loading state for form submission/deletion
  const [products, setProducts] = useState<Product[]>([]) // List of all products
  const [isEditMode, setIsEditMode] = useState(false) // Flag for toggling between Add/Edit mode
  const [editId, setEditId] = useState<string | null>(null) // ID of the product being edited

  // --- Data Fetching ---
  // Use useCallback to memoize fetchProducts, preventing unnecessary re-fetches
  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get<Product[]>(
        'https://backend-production-c8ff.up.railway.app/api/products',
      )
      setProducts(res.data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to load products.')
    }
  }, []) // Empty dependency array: function is created only once

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // --- Event Handlers ---
  // Handle changes in the file input
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    // Clean up previous blob URL if it exists
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file)) // Create a temporary URL for preview
    } else {
      // If no file is selected (e.g., user cancels), clear image state and preview
      setImage(null)
      setPreview(null)
    }
  }

  // Validate form fields before submission
  const validateForm = () => {
    if (!title || !price || !category || !gender) {
      toast.error('Please fill Title, Price, Category, and Gender.')
      return false
    }
    // Ensure price is a valid number >= 0
    if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      toast.error('Please enter a valid non-negative price.')
      return false
    }
    if (!isEditMode && !image) {
      toast.error('Please upload an image for new products.')
      return false
    }
    // Optional: Add validation for description if needed
    // if (description.length > 0 && description.length < 10) {
    //   toast.error('Description must be at least 10 characters if provided.');
    //   return false;
    // }
    return true
  }

  // Reset form fields and state to default values
  const resetForm = () => {
    setTitle('')
    setPrice('')
    setCategory('')
    setGender('')
    setDescription('') // Reset description
    setImage(null)
    // Clean up preview URL if it exists
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    setIsEditMode(false)
    setEditId(null)
  }

  // Handle form submission for adding or updating a product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return // Stop if validation fails

    // Prepare form data for multipart submission
    const formData = new FormData()
    formData.append('title', title)
    formData.append('price', price) // Send price as string, backend should handle parsing
    formData.append('category', category)
    formData.append('gender', gender)
    formData.append('description', description) // Append description
    // Only append the image file if a new one has been selected
    if (image) {
      formData.append('image', image)
    }

    setLoading(true) // Set loading state

    try {
      // Determine API URL and method based on edit mode
      const apiUrl =
        isEditMode && editId
          ? `https://backend-production-c8ff.up.railway.app/api/products/${editId}`
          : 'https://backend-production-c8ff.up.railway.app/api/products'
      const method = isEditMode ? 'put' : 'post'

      // Make the API request
      await axios({
        method: method,
        url: apiUrl,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }, // Necessary for file uploads
      })

      toast.success(`✅ Product ${isEditMode ? 'updated' : 'added'} successfully!`)
      fetchProducts() // Refresh the products list
      resetForm() // Clear the form
    } catch (error: any) {
      // Catch potential errors
      const errorMsg =
        error.response?.data?.message || 'An error occurred while saving the product.'
      toast.error(`❌ ${errorMsg}`)
      console.error('API Error:', error.response || error)
    } finally {
      setLoading(false) // Reset loading state regardless of outcome
    }
  }

  // Populate the form with data of the product to be edited
  const handleEdit = (product: Product) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsEditMode(true)
    setEditId(product._id)
    setTitle(product.title)

    // --- THIS IS THE KEY PART for displaying the price ---
    // Ensure product.price is converted to a string for the input field's value.
    // Handle cases where price might be null, undefined, or already a string/number.
    setPrice(product.price != null ? String(product.price) : '')
    // --- END OF KEY PART ---

    setCategory(product.category)
    setGender(product.gender)
    setDescription(product.description || '') // Set description or empty string if undefined
    setImage(null) // Clear any selected file when starting edit

    // Clean up previous blob URL if it exists before setting new preview
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    // Set preview to the existing image URL
    setPreview(
      product.image ? `https://backend-production-c8ff.up.railway.app${product.image}` : null,
    )

    toast('Edit mode active. Modify the form and click "Update Product".', { icon: '✏️' })
  }

  // Handle product deletion with confirmation
  const handleDelete = async (id: string) => {
    // Confirm before deleting
    if (!window.confirm('Are you sure you want to permanently delete this product?')) {
      return
    }

    setLoading(true) // Indicate loading state during deletion
    try {
      await axios.delete(`https://backend-production-c8ff.up.railway.app/api/products/${id}`)
      toast.success('🗑️ Product deleted successfully')
      fetchProducts() // Refresh the list
      // If the product being edited was deleted, reset the form
      if (isEditMode && editId === id) {
        resetForm()
      }
    } catch (error) {
      toast.error('❌ Failed to delete product.')
      console.error('Delete Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // --- Cleanup Effect ---
  // Effect to clean up the blob URL when the component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  // --- Render Component ---
  return (
    <div className="min-h-screen bg-[#f9f7f3] px-4 py-10">
      {/* Toast notifications container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Add/Edit Product Form Section */}
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8 mb-12">
        <h2 className="text-2xl font-semibold text-[#c8a98a] mb-6 text-center">
          {isEditMode ? 'Edit Product Details' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Product Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Classic Cotton T-Shirt"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-[#d3b899] rounded-md focus:ring-[#c8a98a] focus:border-[#c8a98a] transition duration-150 ease-in-out"
              required
            />
          </div>

          {/* Price Input */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (PKR)
            </label>
            <input
              id="price"
              type="number" // Use number type for better input control (arrows, validation)
              placeholder="e.g., 1999"
              value={price} // Bind to the string state 'price'
              onChange={(e) => setPrice(e.target.value)} // Update the string state
              className="w-full px-4 py-2 border border-[#d3b899] rounded-md focus:ring-[#c8a98a] focus:border-[#c8a98a] transition duration-150 ease-in-out"
              required
              min="0" // Prevent negative prices visually
              step="any" // Allow decimals
            />
          </div>

          {/* Category Input */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input // Consider changing to a <select> if categories are fixed
              id="category"
              type="text"
              placeholder="e.g., T-Shirt, Jeans, Jacket"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-[#d3b899] rounded-md focus:ring-[#c8a98a] focus:border-[#c8a98a] transition duration-150 ease-in-out"
              required
            />
          </div>

          {/* Gender Select */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 border border-[#d3b899] rounded-md bg-white focus:ring-[#c8a98a] focus:border-[#c8a98a] transition duration-150 ease-in-out"
              required
            >
              <option value="" disabled>
                -- Select Gender --
              </option>
              {/* Note: Ensure the <option> values match your data ('men', 'women') */}
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              {/* <option value="unisex">Unisex</option> */}
            </select>
          </div>

          {/* Description Textarea */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter detailed product description here (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-[#d3b899] rounded-md focus:ring-[#c8a98a] focus:border-[#c8a98a] transition duration-150 ease-in-out h-28 resize-y" // Allow vertical resizing
              rows={4} // Suggest initial height
            />
          </div>

          {/* Product Image Input */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image {isEditMode && '(Leave empty to keep current image)'}
            </label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer bg-[#c8a98a] text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition duration-150 ease-in-out text-sm font-medium shadow-sm">
                Choose File
                <input
                  type="file"
                  className="hidden" // Hide the default file input
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg, image/webp" // Specify accepted image types
                />
              </label>
              {/* Display selected file name or current image status */}
              {image && (
                <span className="text-sm text-gray-600 truncate max-w-xs" title={image.name}>
                  {image.name}
                </span>
              )}
              {/* Show 'Current image saved' text only in edit mode when no new image is selected AND a preview exists */}
              {!image && isEditMode && preview && (
                <span className="text-sm text-gray-500 italic">Current image saved</span>
              )}
            </div>
          </div>

          {/* Image Preview Area */}
          {preview && (
            <div className="mt-4 border border-gray-200 rounded-md p-2 bg-gray-50">
              <p className="text-xs text-gray-500 mb-1">
                {/* Logic: If editing AND no new image selected, show 'Current'. Otherwise show 'New'. */}
                {isEditMode && !image ? 'Current Image:' : 'New Image Preview:'}
              </p>
              <img
                src={preview}
                alt="Product Preview"
                className="w-full h-40 sm:h-52 object-cover rounded-md"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            {/* Submit/Update Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center bg-[#c8a98a] text-white py-2.5 px-5 rounded-md hover:bg-yellow-700 transition duration-150 ease-in-out font-semibold disabled:opacity-70 disabled:cursor-not-allowed shadow-sm`}
            >
              {loading ? ( // Show loading indicator
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : isEditMode ? (
                'Update Product'
              ) : (
                'Add Product'
              )}
            </button>
            {/* Cancel Edit Button (shown only in edit mode) */}
            {isEditMode && (
              <button
                type="button" // crucial to prevent form submission
                onClick={resetForm}
                className="w-full sm:w-auto flex justify-center items-center bg-gray-200 text-gray-700 py-2.5 px-5 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out font-semibold border border-gray-300"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Display Existing Products Section */}
      <div className="max-w-7xl mx-auto mt-16">
        <h3 className="text-xl font-semibold text-[#c8a98a] mb-6 text-center sm:text-left">
          Manage Existing Products
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              // Product Card Start
              <div
                key={product._id}
                className="bg-white shadow rounded-lg overflow-hidden flex flex-col transition hover:shadow-md"
              >
                {/* Product Image */}
                <img
                  // Handle potential relative vs absolute image URLs from backend
                  src={
                    product.image && product.image.startsWith('/uploads')
                      ? `https://backend-production-c8ff.up.railway.app${product.image}`
                      : product.image // Assume it's a full URL if not starting with /uploads
                  }
                  alt={product.title}
                  className="h-48 w-full object-cover" // Standard image height
                  loading="lazy" // Lazy load images for performance
                  onError={(e) => {
                    // Optional: Placeholder if image fails to load
                    e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image'
                  }}
                />
                {/* Product Details Section */}
                <div className="p-4 flex flex-col flex-grow">
                  {' '}
                  {/* Use flex-grow to allow price to push down */}
                  {/* Product Title */}
                  <h4
                    className="font-semibold text-gray-800 text-base mb-1 line-clamp-1"
                    title={product.title}
                  >
                    {' '}
                    {/* Truncate title */}
                    {product.title}
                  </h4>
                  {/* Display FULL Description */}
                  {/* Ensure description is treated as pre-formatted text for newlines */}
                  <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap break-words flex-grow">
                    {product.description?.trim() ? (
                      product.description.trim()
                    ) : (
                      <span className="italic text-gray-400">No description provided</span>
                    )}
                  </p>
                  {/* Category & Gender */}
                  <p className="text-xs text-gray-500 capitalize mb-1">
                    {/* Make sure product.gender value casing matches display needs */}
                    {product.category} • {product.gender}
                  </p>
                  {/* Price (Pushed to bottom) */}
                  <p className="text-[#8B4513] font-medium mt-auto pt-1 text-sm">
                    {' '}
                    {/* mt-auto pushes this down */}
                    {/* Format price if needed, ensure it's displayed */}
                    PKR {product.price != null ? product.price : 'N/A'}
                  </p>
                </div>
                {/* Action Buttons Footer */}
                <div className="flex justify-between items-center p-3 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-3 py-1.5 bg-[#c8a98a] text-white text-xs font-medium rounded hover:bg-[#b78d6b] transition duration-150"
                    aria-label={`Edit ${product.title}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    // Disable delete button if the main form is loading (submitting add/update)
                    // OR if the specific product being deleted is currently in edit mode AND loading
                    disabled={loading && (!isEditMode || editId === product._id)}
                    className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Delete ${product.title}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
              // Product Card End
            ))
          ) : (
            // Message when no products exist
            <p className="text-center text-gray-500 col-span-full py-8">
              No products found. Add your first product using the form above.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products
