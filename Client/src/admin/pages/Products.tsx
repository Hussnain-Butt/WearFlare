// src/admin/pages/Products.tsx

import React, { useEffect, useState, useCallback } from 'react'
import apiClient from '../../api/axiosConfig' // Adjust path as necessary
import { toast, Toaster } from 'react-hot-toast'
import { Loader2, CheckCircle, XCircle, Star, Edit, Trash2 } from 'lucide-react' // Keep icons

// Define the base URL for displaying images
const IMAGE_SERVER_URL = 'http://localhost:5000' // Your backend URL

// --- Updated Product Interface (Matches Backend Response) ---
interface Product {
  _id: string
  title: string
  price: string | number // Keep flexible for now
  category: string
  gender: string
  image: string // Relative path like /uploads/imagename.jpg
  description?: string
  isInStock?: boolean // Virtual property from backend
  sizes?: string[] // Array of available sizes (e.g., ['S', 'M'])
  stockDetails?: Record<string, number> // Object like { 'S': 10, 'M': 5 }
  isNewCollection?: boolean
  createdAt?: string // Optional: For sorting or display
  updatedAt?: string // Optional
}

const Products: React.FC = () => {
  // --- State Variables ---
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [gender, setGender] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [formSizes, setFormSizes] = useState<string>('') // For available sizes input "S,M,L"
  const [formStockDetailsString, setFormStockDetailsString] = useState<string>('') // NEW: For stock input "S:10,M:15"
  const [formIsNewCollection, setFormIsNewCollection] = useState(false)
  const [loading, setLoading] = useState(false) // Form submission loading
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({}) // Item-specific action loading
  const [products, setProducts] = useState<Product[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  // --- Data Fetching ---
  const fetchProducts = useCallback(async () => {
    try {
      // Fetch products - backend now includes virtuals and stockDetails
      const res = await apiClient.get<Product[]>('/products')
      const processedProducts = res.data.map((p) => ({
        ...p,
        sizes: p.sizes ?? [], // Ensure array default
        stockDetails: p.stockDetails ?? {}, // Ensure object default
        isNewCollection: p.isNewCollection ?? false,
        isInStock: p.isInStock ?? false, // Ensure boolean default
      }))
      setProducts(processedProducts)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to load products.')
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // --- Event Handlers ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    } else {
      setImage(null)
      setPreview(null)
    }
  }

  // --- Form Validation (Basic - Backend has more robust validation) ---
  const validateForm = () => {
    if (!title.trim() || !price.trim() || !category.trim() || !gender) {
      toast.error('Please fill Title, Price, Category, and Gender.')
      return false
    }
    const numericPrice = parseFloat(price)
    if (isNaN(numericPrice) || numericPrice <= 0) {
      // Price should be positive
      toast.error('Please enter a valid positive price.')
      return false
    }
    if (!formSizes.trim()) {
      toast.error('Please enter available sizes (e.g., S, M, L).')
      return false
    }
    if (!formStockDetailsString.trim()) {
      toast.error('Please enter stock details (e.g., S:10, M:5).')
      return false
    }
    // Basic format check for stock string (more checks on backend)
    if (!/^[a-zA-Z0-9]+:\d+(,\s*[a-zA-Z0-9]+:\d+)*$/.test(formStockDetailsString.trim())) {
      // toast.error('Stock details format seems incorrect. Use SIZE:QTY,SIZE:QTY (e.g., S:10, M:5).');
      // Allow flexibility here, backend validation is primary
    }

    if (!isEditMode && !image) {
      toast.error('Please upload an image for new products.')
      return false
    }
    return true
  }

  // --- Reset Form ---
  const resetForm = () => {
    setTitle('')
    setPrice('')
    setCategory('')
    setGender('')
    setDescription('')
    setImage(null)
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    setFormSizes('') // Reset sizes string
    setFormStockDetailsString('') // Reset stock details string
    setFormIsNewCollection(false)
    setIsEditMode(false)
    setEditId(null)
  }

  // --- Handle Submit (Create/Update) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const formData = new FormData()
    formData.append('title', title.trim())
    formData.append('price', price.trim())
    formData.append('category', category.trim())
    formData.append('gender', gender)
    formData.append('description', description.trim())
    formData.append('sizes', formSizes.trim().toUpperCase()) // Send sizes string (uppercase)
    formData.append('stockDetailsString', formStockDetailsString.trim()) // Send stock string
    formData.append('isNewCollection', String(formIsNewCollection))

    if (image) {
      formData.append('image', image)
    }

    setLoading(true)
    const toastId = toast.loading(isEditMode ? 'Updating product...' : 'Adding product...')

    try {
      const apiUrl = isEditMode && editId ? `/products/${editId}` : '/products'
      const method = isEditMode ? 'put' : 'post'

      // Use apiClient for the request
      await apiClient({
        method,
        url: apiUrl,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }, // Essential for file uploads
      })

      toast.success(`✅ Product ${isEditMode ? 'updated' : 'added'}!`, { id: toastId })
      fetchProducts() // Refresh list
      resetForm() // Clear form
    } catch (error: any) {
      console.error('API Error on Submit:', error.response?.data || error.message)
      const errorMsg =
        error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} product.`
      toast.error(`❌ ${errorMsg}`, { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  // --- Handle Edit ---
  const handleEdit = (product: Product) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsEditMode(true)
    setEditId(product._id)
    setTitle(product.title)
    setPrice(product.price != null ? String(product.price) : '')
    setCategory(product.category)
    setGender(product.gender)
    setDescription(product.description || '')
    setImage(null) // Clear selected file for edit
    setFormSizes(product.sizes?.join(', ') || '') // Convert sizes array back to string

    // Convert stockDetails object back to string "S:10, M:5" for the input field
    const stockString = Object.entries(product.stockDetails || {})
      .map(([size, qty]) => `${size}:${qty}`)
      .join(', ')
    setFormStockDetailsString(stockString) // Set the stock string

    setFormIsNewCollection(product.isNewCollection ?? false)

    // Clean up previous blob preview if exists
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    setPreview(product.image ? `${IMAGE_SERVER_URL}${product.image}` : null) // Show current image
  }

  // --- Handle Delete ---
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product? This cannot be undone.'))
      return

    const loadingKey = `delete-${id}`
    setActionLoading((prev) => ({ ...prev, [loadingKey]: true }))
    const toastId = toast.loading('Deleting product...')

    try {
      await apiClient.delete(`/products/${id}`)
      toast.success('🗑️ Product deleted', { id: toastId })
      fetchProducts() // Refresh list
      if (isEditMode && editId === id) {
        resetForm() // Reset form if deleted item was being edited
      }
    } catch (error: any) {
      console.error('Delete Error:', error.response?.data || error.message)
      const message = error.response?.data?.message || 'Delete failed.'
      toast.error(`❌ ${message}`, { id: toastId })
    } finally {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: false }))
    }
  }

  // --- Handle Toggle New Collection Status ---
  const handleToggleNewCollection = async (productId: string, currentValue: boolean) => {
    const newStatus = !currentValue
    const loadingKey = `isNewCollection-${productId}`
    setActionLoading((prev) => ({ ...prev, [loadingKey]: true }))
    const toastId = toast.loading(`Updating New Collection status...`)

    try {
      // Send only the field being updated
      await apiClient.put(`/products/${productId}`, { isNewCollection: newStatus })
      toast.success(`✅ New Collection status updated.`, { id: toastId })

      // Optimistic UI Update
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p._id === productId ? { ...p, isNewCollection: newStatus } : p)),
      )
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to update status.'
      console.error(
        `Failed to update New Collection status for ${productId}:`,
        error.response?.data || error.message,
      )
      toast.error(`❌ ${errorMsg}`, { id: toastId })
      // fetchProducts(); // Optional: Refetch on error to ensure consistency
    } finally {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: false }))
    }
  }

  // --- Cleanup Effect for Image Preview Blob URL ---
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  // --- Render Component ---
  return (
    <div className="min-h-screen bg-[#f9f7f3] px-4 py-10 font-sans">
      <Toaster position="top-right" reverseOrder={false} />

      {/* --- Add/Edit Product Form Section --- */}
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8 mb-12">
        <h2 className="text-2xl font-semibold text-[#c8a98a] mb-6 text-center">
          {isEditMode ? 'Edit Product Details' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Title */}
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
          {/* Product Price */}
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
              min="0"
              step="any"
            />
          </div>
          {/* Product Category */}
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
          {/* Gender Select */}
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
            </select>
          </div>
          {/* Product Description */}
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
              Available Sizes{' '}
              <span className="text-xs text-gray-500">(Comma-separated, e.g., S, M, L)</span>
            </label>
            <input
              id="sizes"
              value={formSizes}
              onChange={(e) => setFormSizes(e.target.value.toUpperCase())} // Standardize input
              className="input-style"
              placeholder="e.g., S, M, L, XL"
              required
            />
          </div>

          {/* Stock Quantity per Size Input */}
          <div>
            <label htmlFor="stockDetails" className="form-label">
              Stock Quantity per Size{' '}
              <span className="text-xs text-gray-500">(Format: SIZE:QTY,SIZE:QTY)</span>
            </label>
            <input
              id="stockDetails"
              value={formStockDetailsString}
              onChange={(e) => setFormStockDetailsString(e.target.value)}
              className="input-style"
              placeholder="e.g., S:10, M:15, L:0, XL:5"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Ensure sizes here match 'Available Sizes'. Use 0 for out-of-stock sizes.
            </p>
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
                Choose File
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg, image/webp"
                />
              </label>
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

          {/* Image Preview */}
          {preview && (
            <div className="preview-container">
              <p className="text-xs text-gray-500 mb-1">
                {isEditMode && !image ? 'Current Image:' : 'New Image Preview:'}
              </p>
              <img src={preview} alt="Preview" className="preview-image" />
            </div>
          )}

          {/* Checkboxes Section */}
          <div className="flex items-center justify-start pt-2 space-x-6">
            {/* REMOVED 'In Stock' Checkbox */}
            {/* New Collection Checkbox */}
            <div className="flex items-center">
              <input
                id="formIsNewCollection"
                type="checkbox"
                checked={formIsNewCollection}
                onChange={(e) => setFormIsNewCollection(e.target.checked)}
                className="checkbox-style text-blue-600 focus:ring-blue-500" // Keep styling
              />
              <label htmlFor="formIsNewCollection" className="ml-2 form-label cursor-pointer">
                Mark as New Collection
              </label>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="button-style primary w-full sm:w-auto flex justify-center"
            >
              {loading && <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />}
              {loading ? 'Processing...' : isEditMode ? 'Update Product' : 'Add Product'}
            </button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.length > 0 ? (
            products.map((product) => {
              // Determine loading states for actions
              const isCollectionUpdating = actionLoading[`isNewCollection-${product._id}`]
              const isDeleting = actionLoading[`delete-${product._id}`]
              const anyActionLoading = isCollectionUpdating || isDeleting

              // Generate a display string for stock details
              const stockDisplay =
                product.sizes && product.sizes.length > 0 ? (
                  product.sizes
                    .map((size) => `${size}: ${product.stockDetails?.[size] ?? 0}`) // Show qty per size
                    .join(' | ')
                ) : (
                  <span className="italic text-gray-500">No size/stock info</span>
                ) // Handle case with no sizes

              return (
                // --- Individual Product Card ---
                <div key={product._id} className="product-card-admin">
                  {/* 'NEW' Badge */}
                  {product.isNewCollection && (
                    <span className="absolute top-1.5 left-1.5 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10 shadow-sm">
                      NEW
                    </span>
                  )}
                  {/* Overall Stock Status Badge */}
                  <span
                    className={`absolute top-1.5 right-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10 shadow-sm ${
                      product.isInStock
                        ? 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20'
                        : 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-600/10'
                    }`}
                  >
                    {product.isInStock ? 'In Stock' : 'Out of Stock'}
                  </span>

                  {/* Product Image */}
                  <img
                    src={`${IMAGE_SERVER_URL}${product.image}`}
                    alt={product.title}
                    className="product-image-admin"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image'
                    }}
                    loading="lazy"
                  />
                  {/* Product Details */}
                  <div className="product-details-admin">
                    <h4 title={product.title}>{product.title}</h4>
                    <p className="text-xs text-gray-500 mb-1">
                      {product.description ? (
                        `${product.description.substring(0, 35)}...`
                      ) : (
                        <span className="italic">No description</span>
                      )}
                    </p>
                    {/* Display Detailed Stock Info */}
                    <p
                      className="text-xs text-gray-600 font-medium my-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200 overflow-hidden text-ellipsis whitespace-nowrap"
                      title={typeof stockDisplay === 'string' ? stockDisplay : 'Stock details'}
                    >
                      Stock: {stockDisplay}
                    </p>
                    <p className="text-xs text-gray-500 capitalize mt-1 mb-2">
                      {product.category} • {product.gender}
                    </p>
                    <p className="text-[#c8a98a] font-medium text-base mt-auto pt-1">
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
                    {/* REMOVED In Stock Toggle Button */}
                    {/* New Collection Toggle Button */}
                    <button
                      onClick={() =>
                        handleToggleNewCollection(product._id, !!product.isNewCollection)
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
            <p className="no-products-message col-span-full">
              No products found. Add products using the form above.
            </p>
          )}
        </div>{' '}
        {/* End Grid */}
      </div>
      {/* --- End Display Products Section --- */}

      {/* --- Reusable Styles --- */}
      <style jsx>{`
        /* Form Styles */
        .form-label { display: block; margin-bottom: 0.25rem; font-size: 0.875rem; font-weight: 500; color: #374151; }
        .input-style, .select-style, .textarea-style { display: block; width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; transition: border-color 0.2s, box-shadow 0.2s; font-size: 0.875rem; }
        .input-style:focus, .select-style:focus, .textarea-style:focus { outline: none; border-color: #c8a98a; box-shadow: 0 0 0 1px #c8a98a; }
        .select-style { background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="%236b7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m6 8 4 4 4-4"/></svg>'); background-position: right 0.5rem center; background-repeat: no-repeat; background-size: 1.5em 1.5em; padding-right: 2.5rem; appearance: none; }
        .textarea-style { min-height: 7rem; resize: vertical; }
        .checkbox-style { height: 1rem; width: 1rem; border-radius: 0.25rem; border: 1px solid #d1d5db; color: #c8a98a; focus:ring-offset-0 focus:ring-1 focus:ring-[#c8a98a]; cursor: pointer; }
        .button-style { display: inline-flex; justify-content: center; align-items: center; padding: 0.625rem 1.25rem; border-radius: 0.375rem; font-weight: 600; transition: background-color 0.2s, opacity 0.2s; white-space: nowrap; border: 1px solid transparent; cursor: pointer; font-size: 0.875rem; }
        .button-style.primary { background-color: #c8a98a; color: white; }
        .button-style.primary:hover:not(:disabled) { background-color: #b08d6a; }
        .button-style.secondary { background-color: #e5e7eb; color: #374151; border-color: #d1d5db; }
        .button-style.secondary:hover:not(:disabled) { background-color: #d1d5db; }
        .button-style:disabled { opacity: 0.7; cursor: not-allowed; }
        .button-style-alt { display: inline-block; cursor: pointer; background-color: #f3f4f6; color: #374151; padding: 0.5rem 1rem; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); transition: background-color 0.2s; border: 1px solid #d1d5db;}
        .button-style-alt:hover { background-color: #e5e7eb; }
        .preview-container { margin-top: 1rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; padding: 0.5rem; background-color: #f9fafb; }
        .preview-image { display: block; width: 100%; height: auto; max-height: 15rem; object-fit: cover; border-radius: 0.375rem; }

        /* Admin Product Card Styles */
        .product-card-admin { background-color: white; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1); display: flex; flex-direction: column; transition: box-shadow 0.2s; position: relative; }
        .product-card-admin:hover { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        .product-image-admin { height: 12rem; width: 100%; object-fit: cover; background-color: #f3f4f6; display: block; }
        .product-details-admin { padding: 0.75rem; flex-grow: 1; display: flex; flex-direction: column; }
        .product-details-admin h4 { font-weight: 600; color: #1f2937; font-size: 0.9rem; margin-bottom: 0.25rem; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .product-actions-admin { display: flex; justify-content: space-around; align-items: center; padding: 0.5rem 0.75rem; background-color: #f9fafb; border-top: 1px solid #f3f4f6; gap: 0.5rem; } /* Increased gap slightly */

        /* Action Buttons Base */
        .button-edit, .button-delete, .button-toggle-new { padding: 0.4rem; border-radius: 0.25rem; transition: background-color 0.2s, color 0.2s, opacity 0.2s, border-color 0.2s; border: 1px solid transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; line-height: 1; }
        .button-edit:disabled, .button-delete:disabled, .button-toggle-new:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Specific Action Button Styles */
        .button-edit { background-color: #f3f4f6; color: #4b5563; border-color: #e5e7eb; }
        .button-edit:hover:not(:disabled) { background-color: #e5e7eb; }
        /* Removed .button-stock styles */
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
