// src/ProductManager/pages/ManagerProducts.tsx
import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios' // Import axios directly
import { useNavigate } from 'react-router-dom' // Import useNavigate for redirection
import { toast, Toaster } from 'react-hot-toast'
import { Loader2, CheckCircle, XCircle, Star, Edit, Trash2 } from 'lucide-react'

// Define API base URL - Make sure this is correct for your environment
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://backend-production-c8ff.up.railway.app'

// Product Interface including isNewCollection
interface Product {
  _id: string
  title: string
  price: string | number
  category: string
  gender: string
  image: string
  description?: string
  inStock: boolean
  sizes?: string[]
  isNewCollection?: boolean
}

// Helper function to get token
const getToken = () => localStorage.getItem('managerToken')

// Helper function to create auth config
const createAuthConfig = () => {
  const token = getToken()
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {}
}

// Helper function to create FormData auth config
const createFormAuthConfig = () => {
  const token = getToken()
  return {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  }
}

const ManagerProducts: React.FC = () => {
  // --- State Variables ---
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [gender, setGender] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false) // For main form submit
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({}) // For toggles/delete per item
  const [products, setProducts] = useState<Product[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [formInStock, setFormInStock] = useState(true)
  const [formSizes, setFormSizes] = useState<string>('')
  const [formIsNewCollection, setFormIsNewCollection] = useState(false)

  const navigate = useNavigate() // Hook for navigation

  // --- Data Fetching (with Auth) ---
  const fetchProducts = useCallback(async () => {
    try {
      const config = createAuthConfig() // Get auth config
      const res = await axios.get<Product[]>(`${API_BASE_URL}/api/manager/products`, config) // Pass config
      const processedProducts = res.data.map((p) => ({
        ...p,
        inStock: p.inStock ?? true,
        sizes: p.sizes ?? [],
        isNewCollection: p.isNewCollection ?? false,
      }))
      setProducts(processedProducts)
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        toast.error('Authentication failed. Please log in again.', { id: 'authError' })
        localStorage.removeItem('managerToken') // Clear bad token
        navigate('/productmanager') // Redirect to login
      } else {
        console.error('Failed to fetch products:', error)
        toast.error('Failed to load products.')
      }
    }
  }, [navigate]) // Add navigate dependency

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // --- Event Handlers ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    // Revoke previous blob URL if it exists
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    } else {
      setImage(null)
      setPreview(null) // Clear preview if no file is selected
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
    if (!isEditMode && !image) {
      // Image required only when creating a new product
      toast.error('Please upload an image for new products.')
      return false
    }
    return true
  }

  // Reset form fields
  const resetForm = () => {
    setTitle('')
    setPrice('')
    setCategory('')
    setGender('')
    setDescription('')
    setImage(null)
    // Revoke blob URL on reset if it exists
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    setIsEditMode(false)
    setEditId(null)
    setFormInStock(true)
    setFormSizes('')
    setFormIsNewCollection(false)
  }

  // Handle form submission (Create or Update with Auth)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const formData = new FormData()
    formData.append('title', title.trim())
    formData.append('price', price.trim())
    formData.append('category', category.trim())
    formData.append('gender', gender)
    formData.append('description', description.trim())
    formData.append('inStock', String(formInStock))
    formData.append('sizes', formSizes.trim())
    formData.append('isNewCollection', String(formIsNewCollection))

    // Only append image if a new one is selected OR if creating new product
    if (image) {
      formData.append('image', image)
    }

    setLoading(true)
    const toastId = toast.loading(isEditMode ? 'Updating product...' : 'Adding product...')
    try {
      const config = createFormAuthConfig() // Get FormData auth config
      const apiUrl =
        isEditMode && editId
          ? `${API_BASE_URL}/api/manager/products/${editId}`
          : `${API_BASE_URL}/api/manager/products`
      const method = isEditMode ? 'put' : 'post'

      await axios({
        method,
        url: apiUrl,
        data: formData,
        headers: config.headers, // Pass headers from config
      })

      toast.success(`✅ Product ${isEditMode ? 'updated' : 'added'}!`, { id: toastId })
      fetchProducts() // Refresh list
      resetForm() // Clear form
    } catch (error: any) {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        toast.error('Authorization error. Cannot perform action.', { id: toastId })
        localStorage.removeItem('managerToken')
        navigate('/productmanager') // Redirect on auth error
      } else {
        console.error('API Error:', error.response?.data || error.message)
        const errorMsg =
          error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} product.`
        toast.error(`❌ ${errorMsg}`, { id: toastId })
      }
    } finally {
      setLoading(false)
    }
  }

  // Populate form for editing
  const handleEdit = (product: Product) => {
    window.scrollTo({ top: 0, behavior: 'smooth' }) // Scroll to top
    setIsEditMode(true)
    setEditId(product._id)
    setTitle(product.title)
    setPrice(product.price != null ? String(product.price) : '')
    setCategory(product.category)
    setGender(product.gender)
    setDescription(product.description || '')
    setFormInStock(product.inStock ?? true)
    setFormSizes(product.sizes?.join(', ') || '')
    setFormIsNewCollection(product.isNewCollection ?? false)

    // Clear file input and revoke previous blob URL
    setImage(null)
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    // Set preview to the existing image URL from the server
    setPreview(product.image ? `${API_BASE_URL}${product.image}` : null)
  }

  // Handle product deletion (with Auth)
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    const loadingKey = `delete-${id}`
    setActionLoading((prev) => ({ ...prev, [loadingKey]: true }))
    const toastId = toast.loading('Deleting product...')
    try {
      const config = createAuthConfig() // Get auth config
      await axios.delete(`${API_BASE_URL}/api/manager/products/${id}`, config) // Pass config
      toast.success('🗑️ Product deleted', { id: toastId })
      fetchProducts() // Refresh list
      // If the deleted product was the one being edited, reset the form
      if (isEditMode && editId === id) {
        resetForm()
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        toast.error('Authorization error. Cannot delete.', { id: toastId })
        localStorage.removeItem('managerToken')
        navigate('/productmanager')
      } else {
        console.error('Delete Error:', error)
        toast.error('❌ Delete failed.', { id: toastId })
      }
    } finally {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: false }))
    }
  }

  // Combined handler for toggling status fields (inStock, isNewCollection) (with Auth)
  const handleToggleStatus = async (
    productId: string,
    field: 'inStock' | 'isNewCollection',
    currentValue: boolean,
  ) => {
    const newStatus = !currentValue
    const loadingKey = `${field}-${productId}`
    setActionLoading((prev) => ({ ...prev, [loadingKey]: true }))
    const fieldNameReadable = field === 'inStock' ? 'Stock status' : 'New Collection status'
    const toastId = toast.loading(`Updating ${fieldNameReadable}...`)

    try {
      const payload = { [field]: newStatus } // Payload contains only the field to update
      const config = createAuthConfig() // Get auth config

      await axios.put(
        `${API_BASE_URL}/api/manager/products/${productId}`,
        payload, // Send only the specific field update
        config, // Pass config with Authorization header
      )

      toast.success(`✅ ${fieldNameReadable} updated.`, { id: toastId })

      // Update local state optimistically
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p._id === productId ? { ...p, [field]: newStatus } : p)),
      )
    } catch (error: any) {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        toast.error(`Authorization error. Cannot update ${fieldNameReadable}.`, { id: toastId })
        localStorage.removeItem('managerToken')
        navigate('/productmanager')
      } else {
        const errorData = error.response?.data
        const errorMessage = errorData?.message || `Failed to update ${fieldNameReadable}.`
        console.error(
          `Failed to update ${field} for ${productId}:`,
          error.response?.status,
          errorData || error.message,
        )
        toast.error(`❌ ${errorMessage}`, { id: toastId })
        // Optional: Refetch to revert optimistic update on error
        // fetchProducts();
      }
    } finally {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: false }))
    }
  }

  // Cleanup Effect for Blob URL
  useEffect(() => {
    // This runs when the component unmounts or before preview changes
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
        console.log('Revoked Blob URL:', preview) // For debugging
      }
    }
  }, [preview]) // Dependency array includes preview

  // --- Render Component ---
  return (
    <div className="min-h-screen bg-[#f9f7f3] px-4 py-10 font-sans">
      <Toaster position="top-right" reverseOrder={false} />

      {/* --- Add/Edit Product Form --- */}
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
          {/* Price */}
          <div>
            <label htmlFor="price" className="form-label">
              Price (PKR)
            </label>
            <input
              id="price"
              type="number" // Use number type for better input control
              step="0.01" // Allow decimals if needed
              min="0" // Prevent negative prices
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input-style"
              required
              placeholder="e.g., 3499"
            />
          </div>
          {/* Category */}
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
              placeholder="e.g., Shirts, Pants, Accessories"
            />
          </div>
          {/* Gender */}
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
                -- Select Gender --
              </option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
          {/* Description */}
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
              placeholder="Product features, material, care instructions..."
            />
          </div>
          {/* Sizes */}
          <div>
            <label htmlFor="sizes" className="form-label">
              Available Sizes{' '}
              <span className="text-xs text-gray-500">(Comma-separated, e.g., S,M,L)</span>
            </label>
            <input
              id="sizes"
              value={formSizes}
              onChange={(e) => setFormSizes(e.target.value.toUpperCase().replace(/\s/g, ''))} // Auto uppercase and remove spaces
              className="input-style"
              placeholder="e.g., S,M,L,XL"
            />
          </div>
          {/* Image Input */}
          <div className="w-full">
            <label className="form-label">
              Product Image{' '}
              {isEditMode && (
                <span className="text-xs text-gray-500">(Leave empty to keep current image)</span>
              )}
            </label>
            <div className="flex items-center space-x-4 mt-1">
              <label className="button-style-alt cursor-pointer">
                Choose File
                <input
                  type="file"
                  className="hidden" // Hide default input
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg, image/webp" // Specify accepted file types
                />
              </label>
              {/* Display selected file name or current status */}
              {image && (
                <span className="text-sm text-gray-600 truncate max-w-xs" title={image.name}>
                  {image.name}
                </span>
              )}
              {/* Show message when editing and no NEW file is chosen, but preview exists */}
              {!image && isEditMode && preview && !preview.startsWith('blob:') && (
                <span className="text-sm text-gray-500 italic">Current image selected</span>
              )}
            </div>
          </div>
          {/* Image Preview */}
          {preview && (
            <div className="preview-container">
              {/* Conditional text based on whether it's a new blob or existing URL */}
              <p className="text-xs text-gray-500 mb-1">
                {preview.startsWith('blob:') ? 'New Image Preview:' : 'Current Image:'}
              </p>
              <img src={preview} alt="Product Preview" className="preview-image" />
            </div>
          )}

          {/* Checkboxes Area */}
          <div className="flex flex-wrap items-center justify-start pt-2 gap-x-6 gap-y-2">
            {' '}
            {/* Allow wrapping */}
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
                className="checkbox-style text-blue-600 focus:ring-blue-500" // Example alternate color
              />
              <label htmlFor="formIsNewCollection" className="ml-2 form-label cursor-pointer">
                New Collection
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading} // Disable while submitting
              className="button-style primary w-full sm:w-auto flex justify-center items-center" // Added items-center
            >
              {loading && <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />}
              {loading ? 'Processing...' : isEditMode ? 'Update Product' : 'Add Product'}
            </button>
            {isEditMode && (
              <button
                type="button"
                onClick={resetForm} // Use resetForm to cancel editing
                disabled={loading} // Disable if main form is processing
                className="button-style secondary w-full sm:w-auto"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>
      {/* --- End Form --- */}

      {/* --- Display Existing Products --- */}
      <div className="max-w-7xl mx-auto mt-16">
        {/* Header for product list */}
        <h3 className="text-xl font-semibold text-[#c8a98a] mb-6 text-center sm:text-left">
          Manage Existing Products ({products.length})
        </h3>
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.length > 0 ? (
            products.map((product) => {
              // Loading states specific to this product's actions
              const isStockUpdating = actionLoading[`inStock-${product._id}`]
              const isCollectionUpdating = actionLoading[`isNewCollection-${product._id}`]
              const isDeleting = actionLoading[`delete-${product._id}`]
              const anyActionLoading = isStockUpdating || isCollectionUpdating || isDeleting // Check if any action is loading for this card

              return (
                // --- Product Card ---
                <div key={product._id} className="product-card-admin">
                  {/* Badge for New Collection */}
                  {product.isNewCollection && (
                    <span className="absolute top-1.5 left-1.5 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10 shadow-sm">
                      NEW
                    </span>
                  )}
                  {/* Product Image */}
                  <img
                    // Prepend API base URL only if image path is relative
                    src={
                      product.image.startsWith('http')
                        ? product.image
                        : `${API_BASE_URL}${product.image}`
                    }
                    alt={product.title}
                    className="product-image-admin"
                    onError={(e) => {
                      // Fallback image on error
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image'
                    }}
                    loading="lazy" // Lazy load images
                  />

                  {/* Product Details */}
                  <div className="product-details-admin">
                    {/* Title (truncated) */}
                    <h4 title={product.title}>{product.title}</h4>
                    {/* Description (truncated) */}
                    <p className="text-xs text-gray-500 mb-1" title={product.description}>
                      {product.description ? (
                        `${product.description.substring(0, 40)}...`
                      ) : (
                        <span className="italic">No description</span>
                      )}
                    </p>
                    {/* Sizes */}
                    <p className="text-xs text-gray-500 mb-1">
                      Sizes:{' '}
                      {product.sizes && product.sizes.length > 0 ? (
                        product.sizes.join(', ')
                      ) : (
                        <span className="italic">None</span>
                      )}
                    </p>
                    {/* Category & Gender */}
                    <p className="text-xs text-gray-500 capitalize mb-2">
                      {product.category} • {product.gender}
                    </p>
                    {/* Price */}
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
                      disabled={loading || anyActionLoading} // Disable if form is submitting OR another action on this card is running
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
            })
          ) : (
            // Message when no products are found
            <p className="no-products-message col-span-full">
              No products found. Use the form above to add new products.
            </p>
          )}
        </div>{' '}
        {/* End Grid */}
      </div>
      {/* --- End Display Products --- */}

      {/* --- Styles (Scoped JSX) --- */}
      <style jsx>{`
                /* Form Styles */
                .form-label { display: block; margin-bottom: 0.25rem; font-size: 0.875rem; font-weight: 500; color: #374151; }
                .input-style, .select-style, .textarea-style { display: block; width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; transition: border-color 0.2s, box-shadow 0.2s; font-size: 0.875rem; background-color: white; }
                .input-style:focus, .select-style:focus, .textarea-style:focus { outline: none; border-color: #c8a98a; box-shadow: 0 0 0 1px #c8a98a; }
                .select-style { background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="%236b7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m6 8 4 4 4-4"/></svg>'); background-position: right 0.5rem center; background-repeat: no-repeat; background-size: 1.5em 1.5em; padding-right: 2.5rem; appearance: none; }
                .textarea-style { min-height: 6rem; resize: vertical; }
                .checkbox-style { height: 1rem; width: 1rem; border-radius: 0.25rem; border: 1px solid #d1d5db; color: #c8a98a; focus:ring-offset-0 focus:ring-1 focus:ring-[#c8a98a]; cursor: pointer; }
                .button-style { display: inline-flex; justify-content: center; align-items: center; padding: 0.625rem 1.25rem; border-radius: 0.375rem; font-weight: 600; transition: background-color 0.2s, opacity 0.2s; white-space: nowrap; border: 1px solid transparent; cursor: pointer; line-height: 1.25rem; }
                .button-style.primary { background-color: #c8a98a; color: white; }
                .button-style.primary:hover:not(:disabled) { background-color: #b08d6a; }
                .button-style.secondary { background-color: #e5e7eb; color: #374151; border-color: #d1d5db; }
                .button-style.secondary:hover:not(:disabled) { background-color: #d1d5db; }
                .button-style:disabled { opacity: 0.6; cursor: not-allowed; }
                .button-style-alt { display: inline-block; cursor: pointer; background-color: #f3f4f6; color: #374151; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); transition: background-color 0.2s; }
                .button-style-alt:hover { background-color: #e5e7eb; }
                .preview-container { margin-top: 1rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; padding: 0.5rem; background-color: #f9fafb; }
                .preview-image { display: block; width: 100%; height: auto; max-height: 15rem; object-fit: contain; border-radius: 0.25rem; } /* Use contain for preview */

                /* Admin Product Card Styles */
                .product-card-admin { background-color: white; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1); display: flex; flex-direction: column; transition: box-shadow 0.2s; position: relative; }
                .product-card-admin:hover { box-shadow: 0 4px 8px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
                .product-image-admin { height: 12rem; width: 100%; object-fit: cover; background-color: #f3f4f6; border-bottom: 1px solid #f3f4f6; }
                .product-details-admin { padding: 0.75rem; flex-grow: 1; display: flex; flex-direction: column; }
                .product-details-admin h4 { font-weight: 600; color: #1f2937; font-size: 0.9rem; margin-bottom: 0.25rem; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .product-actions-admin { display: flex; justify-content: space-around; align-items: center; padding: 0.5rem; background-color: #f9fafb; border-top: 1px solid #f3f4f6; gap: 0.3rem; }

                /* Action Buttons Base */
                .button-edit, .button-stock, .button-delete, .button-toggle-new { padding: 0.4rem; border-radius: 0.25rem; transition: background-color 0.2s, color 0.2s, opacity 0.2s, border-color 0.2s; border: 1px solid transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; }
                .button-edit:disabled, .button-stock:disabled, .button-delete:disabled, .button-toggle-new:disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; } /* Added pointer-events */

                /* Specific Action Button Styles */
                .button-edit { background-color: #f0f9ff; color: #0284c7; border-color: #bae6fd; } /* Light Blue */
                .button-edit:hover:not(:disabled) { background-color: #e0f2fe; }
                .button-stock { min-width: 32px; height: 32px; text-align: center; }
                .button-stock.in { background-color: #dcfce7; color: #16a34a; border-color: #bbf7d0; } /* Light Green */
                .button-stock.in:hover:not(:disabled) { background-color: #bbf7d0; }
                .button-stock.out { background-color: #fff1f2; color: #f43f5e; border-color: #ffcbd1; } /* Light Red */
                .button-stock.out:hover:not(:disabled) { background-color: #ffe4e6; }
                .button-delete { background-color: #fee2e2; color: #dc2626; border-color: #fecaca; } /* Red */
                .button-delete:hover:not(:disabled) { background-color: #ef4444; color: white; }
                .button-toggle-new { min-width: 32px; height: 32px; background-color: #eef2ff; color: #6366f1; border-color: #c7d2fe; } /* Indigo */
                .button-toggle-new:hover:not(:disabled) { background-color: #e0e7ff; }
                .button-toggle-new.active { background-color: #6366f1; color: white; }
                .button-toggle-new.active:hover:not(:disabled) { background-color: #4f46e5; }

                .no-products-message { text-align: center; color: #6b7280; padding: 3rem 1rem; grid-column: 1 / -1; font-style: italic; }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
    </div>
  )
}

export default ManagerProducts
