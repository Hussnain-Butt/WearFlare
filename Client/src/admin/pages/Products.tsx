import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { toast, Toaster } from 'react-hot-toast'

// --- Backend API Base URL ---
// Make sure this matches your backend server address and port
const API_BASE_URL = 'https://backend-production-c8ff.up.railway.app'

// --- Updated Product Interface ---
interface Product {
  _id: string
  title: string
  price: string | number // Allow both during state transitions
  category: string
  gender: string
  image: string // Expecting path like /uploads/image.jpg
  description?: string
  inStock: boolean
  sizes?: string[] // Array of available sizes
}

const Products: React.FC = () => {
  // --- State Variables ---
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('') // Keep price as string for input field compatibility
  const [category, setCategory] = useState('')
  const [gender, setGender] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null) // For the uploaded file object
  const [preview, setPreview] = useState<string | null>(null) // For the image preview URL (blob or existing)
  const [loading, setLoading] = useState(false) // General loading for form submission/deletion
  const [stockUpdateLoading, setStockUpdateLoading] = useState<Record<string, boolean>>({}) // Loading state per product for stock toggle
  const [products, setProducts] = useState<Product[]>([]) // List of fetched products
  const [isEditMode, setIsEditMode] = useState(false) // Flag for Add vs Edit mode
  const [editId, setEditId] = useState<string | null>(null) // ID of the product being edited
  const [formInStock, setFormInStock] = useState(true) // State for the form's 'In Stock' checkbox
  // --- NEW State for Sizes Input ---
  const [formSizes, setFormSizes] = useState<string>('') // Store sizes as a comma-separated string in the form

  // --- Data Fetching ---
  const fetchProducts = useCallback(async () => {
    // Consider adding a separate loading state for fetching if needed
    // setLoading(true); // Can cause UI flicker if main loading state is used
    try {
      const res = await axios.get<Product[]>(`${API_BASE_URL}/api/products`)
      // Process fetched data: ensure defaults for potentially missing fields
      const processedProducts = res.data.map((p) => ({
        ...p,
        inStock: p.inStock ?? true, // Default inStock to true if missing
        sizes: p.sizes ?? [], // Default sizes to empty array if missing
      }))
      setProducts(processedProducts)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to load products.')
    } finally {
      // setLoading(false);
    }
  }, []) // Empty dependency array means this function is created only once

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts]) // fetchProducts is stable due to useCallback

  // --- Event Handlers ---

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    // Clean up previous temporary blob URL if it exists
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    if (file) {
      setImage(file) // Store the File object
      setPreview(URL.createObjectURL(file)) // Create a temporary URL for preview
    } else {
      // If no file is selected (e.g., user cancels), clear image state and preview
      setImage(null)
      setPreview(null)
    }
  }

  // Validate form fields before submission
  const validateForm = () => {
    // Basic validation (add more specific checks if needed)
    if (!title.trim() || !price.trim() || !category.trim() || !gender) {
      toast.error('Please fill Title, Price, Category, and Gender.')
      return false
    }
    const numericPrice = parseFloat(price)
    if (isNaN(numericPrice) || numericPrice < 0) {
      toast.error('Please enter a valid non-negative price.')
      return false
    }
    // Require image only when adding a *new* product
    if (!isEditMode && !image) {
      toast.error('Please upload an image for new products.')
      return false
    }
    // Optional: Add validation for sizes format (e.g., using regex)
    // const sizePattern = /^[A-Za-z0-9]+(,\s*[A-Za-z0-9]+)*$/;
    // if (formSizes.trim() && !sizePattern.test(formSizes.trim())) {
    //     toast.error('Invalid sizes format. Use comma-separated values (e.g., S, M, L).');
    //     return false;
    // }
    return true
  }

  // Reset form fields and state to default values
  const resetForm = () => {
    setTitle('')
    setPrice('')
    setCategory('')
    setGender('')
    setDescription('')
    setImage(null)
    // Clean up preview URL if it was a blob URL
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    setIsEditMode(false)
    setEditId(null)
    setFormInStock(true) // Default new products to In Stock
    setFormSizes('') // Reset sizes input field
  }

  // Handle form submission (Add or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent default form submission
    if (!validateForm()) return // Stop if validation fails

    // Use FormData for multipart/form-data (needed for file uploads)
    const formData = new FormData()
    formData.append('title', title.trim())
    formData.append('price', price.trim()) // Send price as string, backend might parse
    formData.append('category', category.trim())
    formData.append('gender', gender)
    formData.append('description', description.trim())
    formData.append('inStock', String(formInStock)) // Send boolean as string 'true' or 'false'
    // --- Append sizes string ---
    formData.append('sizes', formSizes.trim()) // Send the comma-separated string

    // Only append the image file if a new one has been selected
    // For updates, if no new image is selected, the backend won't change the existing one
    if (image) {
      formData.append('image', image)
    }

    setLoading(true) // Indicate processing

    try {
      // Determine API endpoint and method based on edit mode
      const apiUrl =
        isEditMode && editId
          ? `${API_BASE_URL}/api/products/${editId}` // PUT request for update
          : `${API_BASE_URL}/api/products` // POST request for create
      const method = isEditMode ? 'put' : 'post'

      // Make the API request
      await axios({
        method: method,
        url: apiUrl,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }, // Essential header for FormData
      })

      toast.success(`✅ Product ${isEditMode ? 'updated' : 'added'} successfully!`)
      fetchProducts() // Refresh the product list
      resetForm() // Clear the form fields
    } catch (error: any) {
      // Log the detailed error and show a user-friendly message
      console.error('API Error:', error.response?.data || error.message || error)
      const errorMsg =
        error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} product.`
      toast.error(`❌ ${errorMsg}`)
    } finally {
      setLoading(false) // Stop loading indicator
    }
  }

  // Populate the form when the "Edit" button is clicked
  const handleEdit = (product: Product) => {
    window.scrollTo({ top: 0, behavior: 'smooth' }) // Scroll to top for better UX
    setIsEditMode(true)
    setEditId(product._id)
    setTitle(product.title)
    setPrice(product.price != null ? String(product.price) : '') // Ensure price is string for input
    setCategory(product.category)
    setGender(product.gender)
    setDescription(product.description || '')
    setImage(null) // Clear any previously selected *new* file
    setFormInStock(product.inStock ?? true) // Set stock status from product data
    // --- Set sizes input value ---
    // Join the sizes array back into a comma-separated string for the input field
    setFormSizes(product.sizes?.join(', ') || '')

    // Clean up previous temporary blob URL if needed
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    // Set preview to the *existing* image URL from the product data
    setPreview(product.image ? `${API_BASE_URL}${product.image}` : null)

    toast('Edit mode active. Modify the form and click "Update Product".', { icon: '✏️' })
  }

  // Handle product deletion
  const handleDelete = async (id: string) => {
    // Confirmation dialog
    if (!window.confirm('Are you sure you want to permanently delete this product?')) {
      return
    }

    setLoading(true) // Use main loading state for simplicity during delete
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`)
      toast.success('🗑️ Product deleted successfully')
      fetchProducts() // Refresh the list
      // If the product currently being edited was deleted, reset the form
      if (isEditMode && editId === id) {
        resetForm()
      }
    } catch (error) {
      console.error('Delete Error:', error)
      toast.error('❌ Failed to delete product.')
    } finally {
      setLoading(false)
    }
  }

  // Handle toggling the 'In Stock' status directly from the product card
  const handleToggleStockStatus = async (productId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus // The desired new status
    // Set loading state *specifically* for this product's stock button
    setStockUpdateLoading((prev) => ({ ...prev, [productId]: true }))

    try {
      // Send a PUT request to update *only* the inStock field
      // The backend controller should handle this partial update
      await axios.put(`${API_BASE_URL}/api/products/${productId}`, { inStock: newStatus })
      toast.success(`✅ Stock status updated`)

      // Optimistic UI Update: Update the local state immediately for responsiveness
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p._id === productId ? { ...p, inStock: newStatus } : p)),
      )
      // Alternatively, call fetchProducts() here to guarantee consistency with the backend,
      // but it might feel slightly slower.
      // fetchProducts();
    } catch (error) {
      console.error('Failed to update stock status:', error)
      toast.error('❌ Stock update failed.')
      // Optional: If the API call fails, revert the optimistic update by refetching
      // fetchProducts();
    } finally {
      // Reset loading state for this specific product's stock button
      setStockUpdateLoading((prev) => ({ ...prev, [productId]: false }))
    }
  }

  // --- Cleanup Effect for Blob URL ---
  // This effect runs when the component unmounts or when 'preview' state changes.
  // It revokes the temporary blob URL to free up memory.
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview]) // Dependency array ensures this runs only when 'preview' changes

  // --- Render Component ---
  return (
    <div className="min-h-screen bg-[#f9f7f3] px-4 py-10 font-sans">
      {' '}
      {/* Added font-sans */}
      {/* Toast notifications container */}
      <Toaster position="top-right" reverseOrder={false} />
      {/* Add/Edit Product Form Section */}
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8 mb-12">
        <h2 className="text-2xl font-semibold text-[#c8a98a] mb-6 text-center">
          {isEditMode ? 'Edit Product Details' : 'Add New Product'}
        </h2>
        {/* Form Element */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Product Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Premium Polo Shirt"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-style"
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
              type="number"
              placeholder="e.g., 2999"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input-style"
              required
              min="0"
              step="any"
            />
          </div>

          {/* Category Input */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              id="category"
              type="text"
              placeholder="e.g., Shirt, Pant, Jacket"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-style"
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
              className="select-style"
              required
            >
              <option value="" disabled>
                -- Select Gender --
              </option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              {/* Add Unisex or other options if needed */}
            </select>
          </div>

          {/* Description Textarea */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              placeholder="Enter product details, materials, features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea-style"
              rows={4}
            />
          </div>

          {/* --- Sizes Input --- */}
          <div>
            <label htmlFor="sizes" className="block text-sm font-medium text-gray-700 mb-1">
              Available Sizes (Comma-separated)
            </label>
            <input
              id="sizes"
              type="text"
              placeholder="e.g., S, M, L, XL, XXL"
              value={formSizes}
              onChange={(e) => setFormSizes(e.target.value.toUpperCase())} // Optional: Force uppercase
              className="input-style" // Use consistent input style
            />
            <p className="text-xs text-gray-500 mt-1">Enter available sizes separated by commas.</p>
          </div>
          {/* --- End Sizes Input --- */}

          {/* Product Image Input */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image {isEditMode && '(Leave empty to keep current image)'}
            </label>
            <div className="flex items-center space-x-4">
              <label className="button-style-alt cursor-pointer">
                {' '}
                {/* Added cursor-pointer */}
                Choose File
                <input
                  type="file"
                  className="hidden" // Keep the actual input hidden
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg, image/webp" // Specify accepted types
                />
              </label>
              {/* Display selected file name or current image status */}
              {image && (
                <span className="text-sm text-gray-600 truncate max-w-xs" title={image.name}>
                  {image.name}
                </span>
              )}
              {!image && isEditMode && preview && (
                <span className="text-sm text-gray-500 italic">Current image saved</span>
              )}
            </div>
          </div>

          {/* Image Preview Area */}
          {preview && (
            <div className="preview-container">
              <p className="text-xs text-gray-500 mb-1">
                {isEditMode && !image ? 'Current Image:' : 'New Image Preview:'}
              </p>
              <img src={preview} alt="Product Preview" className="preview-image" />
            </div>
          )}

          {/* In Stock Checkbox */}
          <div className="flex items-center pt-2">
            <input
              id="formInStock"
              type="checkbox"
              checked={formInStock}
              onChange={(e) => setFormInStock(e.target.checked)}
              className="checkbox-style"
            />
            <label htmlFor="formInStock" className="ml-2 block text-sm font-medium text-gray-700">
              Product is In Stock
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            {/* Submit/Update Button */}
            <button
              type="submit"
              disabled={loading} // Disable if main form is processing
              className="button-style primary w-full sm:w-auto" // Apply button styles
            >
              {/* Loading Indicator */}
              {loading ? (
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
              ) : null}
              {loading ? 'Processing...' : isEditMode ? 'Update Product' : 'Add Product'}
            </button>
            {/* Cancel Edit Button (shown only in edit mode) */}
            {isEditMode && (
              <button
                type="button" // Crucial: prevents form submission
                onClick={resetForm}
                disabled={loading} // Also disable when main form is processing
                className="button-style secondary w-full sm:w-auto" // Apply secondary button styles
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>{' '}
        {/* End of form */}
      </div>{' '}
      {/* End of Add/Edit Form Section */}
      {/* Display Existing Products Section */}
      <div className="max-w-7xl mx-auto mt-16">
        <h3 className="text-xl font-semibold text-[#c8a98a] mb-6 text-center sm:text-left">
          Manage Existing Products
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Check if products array has items */}
          {products.length > 0 ? (
            products.map((product) => {
              // Check loading state specifically for this product's stock update
              const isStockUpdating = stockUpdateLoading[product._id]
              return (
                // Product Card Start
                <div key={product._id} className="product-card-admin">
                  {/* Product Image */}
                  <img
                    // Construct full image URL using base URL and image path
                    src={`${API_BASE_URL}${product.image}`}
                    alt={product.title}
                    className="product-image-admin"
                    // Simple fallback for broken images
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image'
                    }}
                    loading="lazy" // Improve performance
                  />
                  {/* Product Details */}
                  <div className="product-details-admin">
                    {/* Product Title (truncated) */}
                    <h4 title={product.title}>{product.title}</h4>
                    {/* Description (optional, truncated) */}
                    <p className="text-xs text-gray-500 mb-2">
                      {product.description ? (
                        `${product.description.substring(0, 40)}...`
                      ) : (
                        <span className="italic">No description</span>
                      )}
                    </p>
                    {/* Display Sizes */}
                    <p className="text-xs text-gray-500 mt-1 mb-1">
                      Sizes:{' '}
                      {product.sizes && product.sizes.length > 0 ? (
                        product.sizes.join(', ')
                      ) : (
                        <span className="italic">None</span>
                      )}
                    </p>
                    {/* Category & Gender */}
                    <p className="text-xs text-gray-500 capitalize mb-1">
                      {product.category} • {product.gender}
                    </p>
                    {/* Price */}
                    <p className="text-[#8B4513] font-medium text-sm">
                      PKR {product.price != null ? product.price : 'N/A'}
                    </p>
                  </div>
                  {/* Action Buttons Footer */}
                  <div className="product-actions-admin">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(product)}
                      // Disable if main form is loading OR this product's stock is updating
                      disabled={loading || isStockUpdating}
                      className="button-edit"
                      aria-label={`Edit ${product.title}`}
                    >
                      Edit
                    </button>

                    {/* In Stock Toggle Button */}
                    <button
                      onClick={() => handleToggleStockStatus(product._id, product.inStock)}
                      // Disable if main form is loading OR this product's stock is updating
                      disabled={loading || isStockUpdating}
                      // Dynamic classes based on stock status and loading state
                      className={`button-stock ${product.inStock ? 'in' : 'out'}`}
                      aria-live="polite" // Announce changes for accessibility
                    >
                      {/* Show spinner if stock is updating for this product */}
                      {isStockUpdating ? (
                        <svg
                          className="animate-spin h-4 w-4 text-current mx-auto"
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
                      ) : // Show current stock status text
                      product.inStock ? (
                        'In Stock'
                      ) : (
                        'Out Stock'
                      )}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(product._id)}
                      // Disable if main form is loading OR this product's stock is updating
                      disabled={loading || isStockUpdating}
                      className="button-delete"
                      aria-label={`Delete ${product.title}`}
                    >
                      Del {/* Short text for small button */}
                    </button>
                  </div>{' '}
                  {/* End Action Buttons Footer */}
                </div> // Product Card End
              )
            }) // End products.map
          ) : (
            // Message displayed when no products are found
            <p className="no-products-message col-span-full">
              {' '}
              {/* Ensure it spans grid columns */}
              No products found. Add your first product using the form above.
            </p>
          )}
        </div>{' '}
        {/* End Product Grid */}
      </div>{' '}
      {/* End Display Existing Products Section */}
      {/* Reusable Styles (Consider moving to a CSS file or using Tailwind @apply) */}
      {/* Using inline <style jsx> for simplicity in this example */}
      <style jsx>{`
        .input-style {
          width: 100%;
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db; /* gray-300 */
          border-radius: 0.375rem; /* rounded-md */
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-style:focus {
          outline: none;
          border-color: #c8a98a;
          box-shadow: 0 0 0 1px #c8a98a;
        }
        .select-style {
          width: 100%;
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          background-color: white;
          appearance: none;
          background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="%236b7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m6 8 4 4 4-4"/></svg>');
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }
        .select-style:focus {
          outline: none;
          border-color: #c8a98a;
          box-shadow: 0 0 0 1px #c8a98a;
        }
        .textarea-style {
          width: 100%;
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          min-height: 7rem; /* h-28 */
          resize: vertical;
        }
        .textarea-style:focus {
          outline: none;
          border-color: #c8a98a;
          box-shadow: 0 0 0 1px #c8a98a;
        }
        .checkbox-style {
          height: 1rem;
          width: 1rem;
          color: #c8a98a;
          border-radius: 0.25rem;
          border-color: #d1d5db;
          cursor: pointer;
        }
        .checkbox-style:focus {
          ring: 1px;
          ring-color: #c8a98a;
        } /* Basic focus */
        .button-style {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          padding: 0.625rem 1.25rem; /* py-2.5 px-5 */
          border-radius: 0.375rem; /* rounded-md */
          font-weight: 600; /* font-semibold */
          transition: background-color 0.2s, opacity 0.2s;
          white-space: nowrap;
        }
        .button-style.primary {
          background-color: #c8a98a;
          color: white;
          border: 1px solid transparent;
        }
        .button-style.primary:hover:not(:disabled) {
          background-color: #b08d6a; /* Darken color */
        }
        .button-style.secondary {
          background-color: #e5e7eb; /* bg-gray-200 */
          color: #374151; /* text-gray-700 */
          border: 1px solid #d1d5db; /* border-gray-300 */
        }
        .button-style.secondary:hover:not(:disabled) {
          background-color: #d1d5db; /* hover:bg-gray-300 */
        }
        .button-style:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .button-style-alt {
          display: inline-block;
          cursor: pointer;
          background-color: #c8a98a;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          transition: background-color 0.2s;
        }
        .button-style-alt:hover {
          background-color: #b08d6a;
        }
        .preview-container {
          margin-top: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          padding: 0.5rem;
          background-color: #f9fafb;
        }
        .preview-image {
          display: block;
          width: 100%;
          height: auto;
          max-height: 15rem; /* Limit preview height */
          object-fit: cover;
          border-radius: 0.375rem;
        }
        .product-card-admin {
          background-color: white;
          border-radius: 0.5rem; /* rounded-lg */
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); /* shadow */
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.2s;
        }
        .product-card-admin:hover {
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); /* hover:shadow-md */
        }
        .product-image-admin {
          height: 12rem; /* h-48 */
          width: 100%;
          object-fit: cover;
        }
        .product-details-admin {
          padding: 1rem; /* p-4 */
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .product-details-admin h4 {
          font-weight: 600; /* font-semibold */
          color: #1f2937; /* text-gray-800 */
          font-size: 1rem; /* text-base */
          margin-bottom: 0.25rem;
          line-height: 1.2; /* Adjust line height */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .product-actions-admin {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background-color: #f9fafb; /* bg-gray-50 */
          border-top: 1px solid #f3f4f6; /* border-gray-100 */
          gap: 0.5rem;
        }
        .button-edit,
        .button-stock,
        .button-delete {
          padding: 0.375rem 0.75rem; /* px-3 py-1.5 */
          font-size: 0.75rem; /* text-xs */
          font-weight: 500; /* font-medium */
          border-radius: 0.25rem; /* rounded */
          transition: background-color 0.2s, opacity 0.2s;
        }
        .button-edit {
          background-color: #c8a98a;
          color: white;
        }
        .button-edit:hover:not(:disabled) {
          background-color: #b08d6a;
        }
        .button-stock {
          min-width: 70px; /* Adjust as needed */
          text-align: center;
        }
        .button-stock.in {
          background-color: #d1fae5; /* bg-green-100 */
          color: #065f46; /* text-green-700 */
        }
        .button-stock.in:hover:not(:disabled) {
          background-color: #a7f3d0; /* hover:bg-green-200 */
        }
        .button-stock.out {
          background-color: #fee2e2; /* bg-red-100 */
          color: #991b1b; /* text-red-700 */
        }
        .button-stock.out:hover:not(:disabled) {
          background-color: #fecaca; /* hover:bg-red-200 */
        }
        .button-delete {
          background-color: #ef4444; /* bg-red-500 */
          color: white;
        }
        .button-delete:hover:not(:disabled) {
          background-color: #dc2626; /* hover:bg-red-600 */
        }
        .button-edit:disabled,
        .button-stock:disabled,
        .button-delete:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .no-products-message {
          text-align: center;
          color: #6b7280; /* text-gray-500 */
          padding: 2rem 0; /* py-8 */
        }
        svg.animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div> // End Main Container Div
  )
}

export default Products
