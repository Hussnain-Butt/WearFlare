// src/admin/pages/Products.tsx OR src/shared/pages/Products.tsx

import React, { useEffect, useState, useCallback } from 'react'
// Import the configured Axios instance
import apiClient from '../../api/axiosConfig' // Adjust the path as necessary
import { toast, Toaster } from 'react-hot-toast'
import { Loader2, CheckCircle, XCircle, Star, Edit, Trash2 } from 'lucide-react'

// Define the base URL for displaying images fetched from the server
const IMAGE_SERVER_URL = 'https://backend-production-c8ff.up.railway.app' // Your backend URL

// Product Interface (defines the shape of product data)
interface Product {
  _id: string
  title: string
  price: string | number
  category: string
  gender: string
  image: string // Should be the relative path like /uploads/imagename.jpg
  description?: string
  inStock: boolean
  sizes?: string[]
  isNewCollection?: boolean
}

const Products: React.FC = () => {
  // --- State Variables ---
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [gender, setGender] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null) // For new image upload
  const [preview, setPreview] = useState<string | null>(null) // For image preview (blob or server URL)
  const [loading, setLoading] = useState(false) // Loading state for form submission
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({}) // Loading for specific item actions
  const [products, setProducts] = useState<Product[]>([]) // List of products
  const [isEditMode, setIsEditMode] = useState(false) // Flag for edit mode
  const [editId, setEditId] = useState<string | null>(null) // ID of product being edited
  const [formInStock, setFormInStock] = useState(true) // 'In Stock' state for the form
  const [formSizes, setFormSizes] = useState<string>('') // 'Sizes' state for the form (comma-separated)
  const [formIsNewCollection, setFormIsNewCollection] = useState(false) // 'New Collection' state for the form

  // --- Data Fetching ---
  const fetchProducts = useCallback(async () => {
    try {
      // Use apiClient instance and relative URL ('/products')
      // Auth token is added automatically by the interceptor
      const res = await apiClient.get<Product[]>('/products')

      // Process fetched data to ensure defaults
      const processedProducts = res.data.map((p) => ({
        ...p,
        inStock: p.inStock ?? true, // Default to true if missing
        sizes: p.sizes ?? [], // Default to empty array
        isNewCollection: p.isNewCollection ?? false, // Default to false
      }))
      setProducts(processedProducts)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to load products. Check console for details.')
    }
  }, []) // Empty dependency array ensures this useCallback instance doesn't change

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // --- Event Handlers ---
  // Handles selecting a new image file
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    // Revoke previous blob URL if it exists to prevent memory leaks
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    if (file) {
      setImage(file) // Store the file object
      setPreview(URL.createObjectURL(file)) // Create a temporary URL for preview
    } else {
      setImage(null)
      setPreview(null)
    }
  }

  // Simple form validation
  const validateForm = () => {
    if (!title.trim() || !price.trim() || !category.trim() || !gender) {
      toast.error('Please fill Title, Price, Category, and Gender.')
      return false
    }
    const numericPrice = parseFloat(price)
    if (isNaN(numericPrice) || numericPrice < 0) {
      toast.error('Please enter a valid non-negative price.')
      return false
    }
    // Require image only when creating a new product, not when editing
    if (!isEditMode && !image) {
      toast.error('Please upload an image for new products.')
      return false
    }
    return true
  }

  // Reset form fields to default values
  const resetForm = () => {
    setTitle('')
    setPrice('')
    setCategory('')
    setGender('')
    setDescription('')
    setImage(null) // Clear selected file
    if (preview && preview.startsWith('blob:')) {
      // Clean up preview URL
      URL.revokeObjectURL(preview)
    }
    setPreview(null) // Clear preview display
    setIsEditMode(false)
    setEditId(null)
    setFormInStock(true)
    setFormSizes('')
    setFormIsNewCollection(false)
  }

  // Handle form submission (Create or Update product)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return // Stop if validation fails

    // Create FormData to send data (especially the image file)
    const formData = new FormData()
    formData.append('title', title.trim())
    formData.append('price', price.trim())
    formData.append('category', category.trim())
    formData.append('gender', gender)
    formData.append('description', description.trim())
    formData.append('inStock', String(formInStock)) // Convert boolean to string
    formData.append('sizes', formSizes.trim().toUpperCase()) // Send sizes as string
    formData.append('isNewCollection', String(formIsNewCollection)) // Convert boolean to string

    // Append the image file only if a new one was selected
    if (image) {
      formData.append('image', image)
    }

    setLoading(true) // Show loading indicator on submit button
    const toastId = toast.loading(isEditMode ? 'Updating product...' : 'Adding product...')

    try {
      // Determine API URL and method based on edit mode
      const apiUrl = isEditMode && editId ? `/products/${editId}` : '/products'
      const method = isEditMode ? 'put' : 'post'

      // Use apiClient for the request. Interceptor adds Auth token.
      // Header 'Content-Type': 'multipart/form-data' is crucial for file uploads.
      await apiClient({
        method,
        url: apiUrl,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      toast.success(`✅ Product ${isEditMode ? 'updated' : 'added'}!`, { id: toastId })
      fetchProducts() // Refresh the product list
      resetForm() // Clear the form fields
    } catch (error: any) {
      // Handle potential errors
      console.error('API Error on Submit:', error.response?.data || error.message)
      const errorMsg =
        error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} product.`
      toast.error(`❌ ${errorMsg}`, { id: toastId })
    } finally {
      setLoading(false) // Hide loading indicator
    }
  }

  // Populate the form with data of the product to be edited
  const handleEdit = (product: Product) => {
    window.scrollTo({ top: 0, behavior: 'smooth' }) // Scroll to top to see the form
    setIsEditMode(true)
    setEditId(product._id)
    setTitle(product.title)
    setPrice(product.price != null ? String(product.price) : '')
    setCategory(product.category)
    setGender(product.gender)
    setDescription(product.description || '')
    setImage(null) // Clear any selected file (user must choose new one to replace)
    setFormInStock(product.inStock ?? true)
    setFormSizes(product.sizes?.join(', ') || '') // Join array back to string for input
    setFormIsNewCollection(product.isNewCollection ?? false)

    // Clean up previous blob preview if exists
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    // Set preview to the existing product image URL (using the image server base URL)
    setPreview(product.image ? `${IMAGE_SERVER_URL}${product.image}` : null)
  }

  // Handle deleting a product
  const handleDelete = async (id: string) => {
    // Confirmation dialog
    if (!window.confirm('Are you sure you want to delete this product? This cannot be undone.'))
      return

    const loadingKey = `delete-${id}` // Unique key for this delete action
    setActionLoading((prev) => ({ ...prev, [loadingKey]: true })) // Show loading on specific item
    const toastId = toast.loading('Deleting product...')

    try {
      // Use apiClient for DELETE request. Interceptor adds Auth token.
      await apiClient.delete(`/products/${id}`)

      toast.success('🗑️ Product deleted', { id: toastId })
      fetchProducts() // Refresh the product list
      // If the currently edited product was deleted, reset the form
      if (isEditMode && editId === id) {
        resetForm()
      }
    } catch (error: any) {
      // Handle potential errors
      console.error('Delete Error:', error.response?.data || error.message)
      const message = error.response?.data?.message || 'Delete failed.'
      toast.error(`❌ ${message}`, { id: toastId })
    } finally {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: false })) // Hide loading
    }
  }

  // Combined handler for toggling 'inStock' or 'isNewCollection' status
  const handleToggleStatus = async (
    productId: string,
    field: 'inStock' | 'isNewCollection', // Field to update
    currentValue: boolean, // Current value of the field
  ) => {
    const newStatus = !currentValue // Toggle the value
    const loadingKey = `${field}-${productId}` // Unique key for this toggle action
    setActionLoading((prev) => ({ ...prev, [loadingKey]: true })) // Show loading
    const fieldNameReadable = field === 'inStock' ? 'Stock status' : 'New Collection status'
    const toastId = toast.loading(`Updating ${fieldNameReadable}...`)

    try {
      // Payload contains only the field being updated
      const payload = { [field]: newStatus }
      console.log(`Attempting to update ${field} for ${productId} to ${newStatus}`, payload)

      // Use apiClient for PUT request. Interceptor adds Auth token.
      // Send only the specific field to update
      await apiClient.put(`/products/${productId}`, payload)

      toast.success(`✅ ${fieldNameReadable} updated.`, { id: toastId })

      // Optimistic UI Update: Update the state locally immediately
      setProducts((prevProducts) =>
        prevProducts.map(
          (p) => (p._id === productId ? { ...p, [field]: newStatus } : p), // Update the specific product
        ),
      )
    } catch (error: any) {
      // Handle potential errors
      const errorData = error.response?.data
      const errorMessage = errorData?.message || `Failed to update ${fieldNameReadable}.`
      console.error(
        `Failed to update ${field} for ${productId}:`,
        error.response?.status,
        errorData || error.message,
      )
      toast.error(`❌ ${errorMessage}`, { id: toastId })
      // Optionally, refetch products on error to revert optimistic update:
      // fetchProducts();
    } finally {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: false })) // Hide loading
    }
  }

  // Cleanup Effect for Blob URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview]) // Depend on preview state

  // --- Render Component ---
  return (
    // Main container
    <div className="min-h-screen bg-[#f9f7f3] px-4 py-10 font-sans">
      {/* Toast notifications container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* --- Add/Edit Product Form Section --- */}
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8 mb-12">
        <h2 className="text-2xl font-semibold text-[#c8a98a] mb-6 text-center">
          {isEditMode ? 'Edit Product Details' : 'Add New Product'}
        </h2>
        {/* Form Element */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Title Input */}
          <div>
            <label htmlFor="title" className="form-label">
              Product Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-style"
              required
              placeholder="e.g., Premium Cotton Shirt"
            />
          </div>
          {/* Product Price Input */}
          <div>
            <label htmlFor="price" className="form-label">
              Price (PKR)
            </label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input-style"
              required
              placeholder="e.g., 3499"
            />
          </div>
          {/* Product Category Input */}
          <div>
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-style"
              required
              placeholder="e.g., Shirts, Pants"
            />
          </div>
          {/* Gender Select Dropdown */}
          <div>
            <label htmlFor="gender" className="form-label">
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
                -- Select --
              </option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
          {/* Product Description Textarea */}
          <div>
            <label htmlFor="description" className="form-label">
              Description <span className="text-xs text-gray-500">(Optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea-style"
              rows={3}
              placeholder="Product features, material..."
            />
          </div>
          {/* Available Sizes Input */}
          <div>
            <label htmlFor="sizes" className="form-label">
              Available Sizes <span className="text-xs text-gray-500">(Comma-separated)</span>
            </label>
            <input
              id="sizes"
              value={formSizes}
              onChange={(e) => setFormSizes(e.target.value.toUpperCase())}
              className="input-style"
              placeholder="e.g., S, M, L, XL"
            />
          </div>
          {/* Image Upload Input */}
          <div className="w-full">
            <label className="form-label">
              Product Image{' '}
              {isEditMode && (
                <span className="text-xs text-gray-500">(Leave empty to keep current)</span>
              )}
            </label>
            <div className="flex items-center space-x-4 mt-1">
              <label className="button-style-alt cursor-pointer">
                {' '}
                {/* Styled button */}
                Choose File
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg, image/webp"
                />{' '}
                {/* Hidden actual input */}
              </label>
              {/* Display filename if new image selected */}
              {image && (
                <span className="text-sm text-gray-600 truncate max-w-xs" title={image.name}>
                  {image.name}
                </span>
              )}
              {/* Display message if editing and no new file chosen */}
              {!image && isEditMode && preview && (
                <span className="text-sm text-gray-500 italic">Current image saved</span>
              )}
            </div>
          </div>
          {/* Image Preview Section */}
          {preview && (
            <div className="preview-container">
              <p className="text-xs text-gray-500 mb-1">
                {isEditMode && !image ? 'Current Image:' : 'New Image Preview:'}
              </p>
              {/* Display either blob URL or server URL */}
              <img src={preview} alt="Preview" className="preview-image" />
            </div>
          )}
          {/* Checkboxes Section */}
          <div className="flex items-center justify-start pt-2 space-x-6">
            {/* In Stock Checkbox */}
            <div className="flex items-center">
              <input
                id="formInStock"
                type="checkbox"
                checked={formInStock}
                onChange={(e) => setFormInStock(e.target.checked)}
                className="checkbox-style"
              />
              <label htmlFor="formInStock" className="ml-2 form-label cursor-pointer">
                In Stock
              </label>
            </div>
            {/* New Collection Checkbox */}
            <div className="flex items-center">
              <input
                id="formIsNewCollection"
                type="checkbox"
                checked={formIsNewCollection}
                onChange={(e) => setFormIsNewCollection(e.target.checked)}
                className="checkbox-style text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="formIsNewCollection" className="ml-2 form-label cursor-pointer">
                New Collection
              </label>
            </div>
          </div>
          {/* Form Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="button-style primary w-full sm:w-auto flex justify-center"
            >
              {loading && <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />}
              {loading ? 'Processing...' : isEditMode ? 'Update Product' : 'Add Product'}
            </button>
            {/* Cancel Edit Button (visible only in edit mode) */}
            {isEditMode && (
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="button-style secondary w-full sm:w-auto"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>
      {/* --- End Form Section --- */}

      {/* --- Display Existing Products Section --- */}
      <div className="max-w-7xl mx-auto mt-16">
        <h3 className="text-xl font-semibold text-[#c8a98a] mb-6 text-center sm:text-left">
          Manage Existing Products ({products.length})
        </h3>
        {/* Grid container for product cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.length > 0 ? (
            // Map over products array to display each product card
            products.map((product) => {
              // Determine loading states for actions on this specific product
              const isStockUpdating = actionLoading[`inStock-${product._id}`]
              const isCollectionUpdating = actionLoading[`isNewCollection-${product._id}`]
              const isDeleting = actionLoading[`delete-${product._id}`]
              const anyActionLoading = isStockUpdating || isCollectionUpdating || isDeleting // Check if any action is loading

              return (
                // --- Individual Product Card ---
                <div key={product._id} className="product-card-admin">
                  {/* 'NEW' Badge if product is in new collection */}
                  {product.isNewCollection && (
                    <span className="absolute top-1.5 left-1.5 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10 shadow-sm">
                      NEW
                    </span>
                  )}
                  {/* Product Image - Use IMAGE_SERVER_URL */}
                  <img
                    src={`${IMAGE_SERVER_URL}${product.image}`} // Construct full URL
                    alt={product.title}
                    className="product-image-admin"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image'
                    }} // Fallback image
                    loading="lazy" // Lazy load images
                  />
                  {/* Product Details Section */}
                  <div className="product-details-admin">
                    <h4 title={product.title}>{product.title}</h4>
                    <p className="text-xs text-gray-500 mb-1">
                      {/* Truncate description */}
                      {product.description ? (
                        `${product.description.substring(0, 35)}...`
                      ) : (
                        <span className="italic">No description</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      Sizes: {product.sizes?.join(', ') || <span className="italic">None</span>}
                    </p>
                    <p className="text-xs text-gray-500 capitalize mb-2">
                      {product.category} • {product.gender}
                    </p>
                    <p className="text-[#c8a98a] font-medium text-base mt-auto pt-1">
                      {' '}
                      {/* Price */}
                      PKR{' '}
                      {product.price != null
                        ? Number(product.price).toLocaleString('en-PK')
                        : 'N/A'}
                    </p>
                  </div>
                  {/* Action Buttons Footer */}
                  <div className="product-actions-admin">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(product)}
                      disabled={loading || anyActionLoading}
                      className="button-edit"
                      title="Edit Product"
                    >
                      <Edit size={14} />
                    </button>
                    {/* In Stock Toggle Button */}
                    <button
                      onClick={() => handleToggleStatus(product._id, 'inStock', product.inStock)}
                      disabled={loading || anyActionLoading}
                      className={`button-stock ${product.inStock ? 'in' : 'out'}`}
                      title={product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                    >
                      {isStockUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : product.inStock ? (
                        <CheckCircle size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}
                    </button>
                    {/* New Collection Toggle Button */}
                    <button
                      onClick={() =>
                        handleToggleStatus(
                          product._id,
                          'isNewCollection',
                          !!product.isNewCollection,
                        )
                      }
                      disabled={loading || anyActionLoading}
                      className={`button-toggle-new ${product.isNewCollection ? 'active' : ''}`}
                      title={
                        product.isNewCollection
                          ? 'Remove from New Collection'
                          : 'Add to New Collection'
                      }
                    >
                      {isCollectionUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Star size={14} fill={product.isNewCollection ? 'currentColor' : 'none'} />
                      )}
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={loading || anyActionLoading}
                      className="button-delete"
                      title="Delete Product"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div> // End Product Card
              )
            }) // End map
          ) : (
            // Message displayed when no products are found
            <p className="no-products-message col-span-full">
              No products found. Add products using the form above.
            </p>
          )}
        </div>{' '}
        {/* End Grid */}
      </div>
      {/* --- End Display Products Section --- */}

      {/* --- Reusable Styles defined using styled-jsx --- */}
      <style jsx>{`
        /* Form Styles */
        .form-label { display: block; margin-bottom: 0.25rem; font-size: 0.875rem; font-weight: 500; color: #374151; }
        .input-style, .select-style, .textarea-style { display: block; width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; transition: border-color 0.2s, box-shadow 0.2s; font-size: 0.875rem; }
        .input-style:focus, .select-style:focus, .textarea-style:focus { outline: none; border-color: #c8a98a; box-shadow: 0 0 0 1px #c8a98a; }
        .select-style { background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="%236b7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m6 8 4 4 4-4"/></svg>'); background-position: right 0.5rem center; background-repeat: no-repeat; background-size: 1.5em 1.5em; padding-right: 2.5rem; appearance: none; }
        .textarea-style { min-height: 7rem; resize: vertical; }
        .checkbox-style { height: 1rem; width: 1rem; border-radius: 0.25rem; border: 1px solid #d1d5db; color: #c8a98a; focus:ring-offset-0 focus:ring-1 focus:ring-[#c8a98a]; cursor: pointer; }
        .button-style { display: inline-flex; justify-content: center; align-items: center; padding: 0.625rem 1.25rem; border-radius: 0.375rem; font-weight: 600; transition: background-color 0.2s, opacity 0.2s; white-space: nowrap; border: 1px solid transparent; cursor: pointer; }
        .button-style.primary { background-color: #c8a98a; color: white; }
        .button-style.primary:hover:not(:disabled) { background-color: #b08d6a; }
        .button-style.secondary { background-color: #e5e7eb; color: #374151; border-color: #d1d5db; }
        .button-style.secondary:hover:not(:disabled) { background-color: #d1d5db; }
        .button-style:disabled { opacity: 0.7; cursor: not-allowed; }
        .button-style-alt { display: inline-block; cursor: pointer; background-color: #c8a98a; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); transition: background-color 0.2s; }
        .button-style-alt:hover { background-color: #b08d6a; }
        .preview-container { margin-top: 1rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; padding: 0.5rem; background-color: #f9fafb; }
        .preview-image { display: block; width: 100%; height: auto; max-height: 15rem; object-fit: cover; border-radius: 0.375rem; }

        /* Admin Product Card Styles */
        .product-card-admin { background-color: white; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1); display: flex; flex-direction: column; transition: box-shadow 0.2s; position: relative; }
        .product-card-admin:hover { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        .product-image-admin { height: 12rem; width: 100%; object-fit: cover; background-color: #f3f4f6; } /* Added bg color */
        .product-details-admin { padding: 0.75rem; flex-grow: 1; display: flex; flex-direction: column; }
        .product-details-admin h4 { font-weight: 600; color: #1f2937; font-size: 0.9rem; margin-bottom: 0.25rem; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .product-actions-admin { display: flex; justify-content: space-around; align-items: center; padding: 0.5rem; background-color: #f9fafb; border-top: 1px solid #f3f4f6; gap: 0.3rem; }

        /* Action Buttons Base */
        .button-edit, .button-stock, .button-delete, .button-toggle-new { padding: 0.4rem; border-radius: 0.25rem; transition: background-color 0.2s, color 0.2s, opacity 0.2s, border-color 0.2s; border: 1px solid transparent; display: flex; align-items: center; justify-content: center; cursor: pointer;}
        .button-edit:disabled, .button-stock:disabled, .button-delete:disabled, .button-toggle-new:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Specific Action Button Styles */
        .button-edit { background-color: #f3f4f6; color: #4b5563; border-color: #e5e7eb; }
        .button-edit:hover:not(:disabled) { background-color: #e5e7eb; }
        .button-stock { min-width: 32px; height: 32px; text-align: center; }
        .button-stock.in { background-color: #d1fae5; color: #065f46; } .button-stock.in:hover:not(:disabled) { background-color: #a7f3d0; }
        .button-stock.out { background-color: #fee2e2; color: #991b1b; } .button-stock.out:hover:not(:disabled) { background-color: #fecaca; }
        .button-delete { background-color: #fee2e2; color: #dc2626; }
        .button-delete:hover:not(:disabled) { background-color: #ef4444; color: white; }
        .button-toggle-new { min-width: 32px; height: 32px; background-color: #e0e7ff; color: #4f46e5; border-color: #c7d2fe; }
        .button-toggle-new:hover:not(:disabled) { background-color: #c7d2fe; }
        .button-toggle-new.active { background-color: #4f46e5; color: white; }
        .button-toggle-new.active:hover:not(:disabled) { background-color: #4338ca; }

        /* Utility Styles */
        .no-products-message { text-align: center; color: #6b7280; padding: 2rem 0; grid-column: 1 / -1; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div> // End Main container
  )
}

export default Products
