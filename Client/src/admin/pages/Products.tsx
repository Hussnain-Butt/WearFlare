// src/admin/pages/Products.tsx
import React, { useEffect, useState, useCallback } from 'react'
import apiClient from '../../api/axiosConfig' // Adjust path as necessary
import { toast, Toaster } from 'react-hot-toast'
import {
  Loader2,
  Edit,
  Trash2,
  Star,
  PlusCircle, // For Add Product button
  Image as ImageIcon, // For Image Upload
  X, // For Cancel Edit
  Package, // For Product Icon in heading
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Define the base URL for displaying images
const IMAGE_SERVER_URL = 'https://backend-production-c8ff.up.railway.app'

// Color constants from your theme
const primaryColor = '#003049'
const darkGrayText = '#003049' // trendzone-dark-blue
// trendzone-dark-blue
const accentColor = '#669BBC' // trendzone-light-blue
const lightGrayText = 'text-slate-500'
const headingColor = `text-[${primaryColor}]`

// Product Interface (matches backend)
interface Product {
  _id: string
  title: string
  price: string | number
  category: string
  gender: string
  image: string
  description?: string
  isInStock?: boolean
  sizes?: string[]
  stockDetails?: Record<string, number>
  isNewCollection?: boolean
  createdAt?: string
  updatedAt?: string
}

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 110, damping: 15 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
}

const Products: React.FC = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [gender, setGender] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [formSizes, setFormSizes] = useState<string>('')
  const [formStockDetailsString, setFormStockDetailsString] = useState<string>('')
  const [formIsNewCollection, setFormIsNewCollection] = useState(false)

  const [loadingForm, setLoadingForm] = useState(false) // Form submission loading
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true) // For fetching products list
  const [isEditMode, setIsEditMode] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true)
    try {
      const res = await apiClient.get<Product[]>('/products')
      const processedProducts = res.data.map((p) => ({
        ...p,
        sizes: p.sizes ?? [],
        stockDetails: p.stockDetails ?? {},
        isNewCollection: p.isNewCollection ?? false,
        isInStock: p.isInStock ?? false,
      }))
      setProducts(processedProducts)
    } catch (error) {
      toast.error('Failed to load products.')
    } finally {
      setLoadingProducts(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    // Cleanup for blob URL
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

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

  const validateForm = () => {
    // Same validation logic as before
    if (!title.trim() || !price.trim() || !category.trim() || !gender) {
      toast.error('Please fill Title, Price, Category, and Gender.')
      return false
    }
    const numericPrice = parseFloat(price)
    if (isNaN(numericPrice) || numericPrice <= 0) {
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
    if (!isEditMode && !image) {
      toast.error('Please upload an image for new products.')
      return false
    }
    return true
  }

  const resetForm = () => {
    setTitle('')
    setPrice('')
    setCategory('')
    setGender('')
    setDescription('')
    setImage(null)
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    setPreview(null)
    setFormSizes('')
    setFormStockDetailsString('')
    setFormIsNewCollection(false)
    setIsEditMode(false)
    setEditId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const formDataPayload = new FormData()
    formDataPayload.append('title', title.trim())
    formDataPayload.append('price', price.trim())
    formDataPayload.append('category', category.trim())
    formDataPayload.append('gender', gender)
    formDataPayload.append('description', description.trim())
    formDataPayload.append('sizes', formSizes.trim().toUpperCase())
    formDataPayload.append('stockDetailsString', formStockDetailsString.trim())
    formDataPayload.append('isNewCollection', String(formIsNewCollection))
    if (image) formDataPayload.append('image', image)

    setLoadingForm(true)
    const toastId = toast.loading(isEditMode ? 'Updating product...' : 'Adding product...')

    try {
      const apiUrl = isEditMode && editId ? `/products/${editId}` : '/products'
      const method = isEditMode ? 'put' : 'post'
      await apiClient({
        method,
        url: apiUrl,
        data: formDataPayload,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success(`Product ${isEditMode ? 'updated' : 'added'} successfully!`, { id: toastId })
      fetchProducts()
      resetForm()
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} product.`
      toast.error(errorMsg, { id: toastId })
    } finally {
      setLoadingForm(false)
    }
  }

  const handleEdit = (product: Product) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsEditMode(true)
    setEditId(product._id)
    setTitle(product.title)
    setPrice(String(product.price ?? ''))
    setCategory(product.category)
    setGender(product.gender)
    setDescription(product.description ?? '')
    setImage(null)
    setFormSizes(product.sizes?.join(', ') ?? '')
    const stockString = Object.entries(product.stockDetails ?? {})
      .map(([size, qty]) => `${size}:${qty}`)
      .join(', ')
    setFormStockDetailsString(stockString)
    setFormIsNewCollection(product.isNewCollection ?? false)
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    setPreview(product.image ? `${IMAGE_SERVER_URL}${product.image}` : null)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product? This cannot be undone.'))
      return
    const loadingKey = `delete-${id}`
    setActionLoading((prev) => ({ ...prev, [loadingKey]: true }))
    const toastId = toast.loading('Deleting product...')
    try {
      await apiClient.delete(`/products/${id}`)
      toast.success('Product deleted successfully.', { id: toastId })
      setProducts((prev) => prev.filter((p) => p._id !== id)) // Optimistic UI
      if (isEditMode && editId === id) resetForm()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Delete failed.', { id: toastId })
    } finally {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: false }))
    }
  }

  const handleToggleNewCollection = async (productId: string, currentValue: boolean) => {
    const newStatus = !currentValue
    const loadingKey = `isNewCollection-${productId}`
    setActionLoading((prev) => ({ ...prev, [loadingKey]: true }))
    const toastId = toast.loading('Updating status...')
    try {
      await apiClient.put(`/products/${productId}`, { isNewCollection: newStatus })
      toast.success('New Collection status updated.', { id: toastId })
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, isNewCollection: newStatus } : p)),
      )
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status.', { id: toastId })
    } finally {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: false }))
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 md:p-6 space-y-8 min-h-screen" // Added min-h-screen for full page context
    >
      <Toaster position="top-right" containerClassName="mt-20" />

      {/* Form Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white shadow-2xl rounded-xl p-6 md:p-8 ring-1 ring-slate-900/5"
      >
        <h2
          className={`text-2xl font-semibold ${headingColor} mb-6 text-center flex items-center justify-center`}
        >
          {isEditMode ? (
            <Edit size={24} className="mr-2.5 opacity-70" />
          ) : (
            <PlusCircle size={24} className="mr-2.5 opacity-70" />
          )}
          {isEditMode ? 'Edit Product Details' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {/* Column 1 */}
          <div className="space-y-5">
            <div>
              <label htmlFor="title" className="form-label-style">
                Product Title
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field-style"
                required
                placeholder="e.g., Urban Explorer Jacket"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="form-label-style">
                  Price (PKR)
                </label>
                <input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="input-field-style"
                  required
                  placeholder="e.g., 4999"
                  min="0"
                  step="any"
                />
              </div>
              <div>
                <label htmlFor="category" className="form-label-style">
                  Category
                </label>
                <input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field-style"
                  required
                  placeholder="e.g., Jackets, Tees"
                />
              </div>
            </div>
            <div>
              <label htmlFor="gender" className="form-label-style">
                Gender
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="input-field-style select-arrow"
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
            <div>
              <label htmlFor="sizes" className="form-label-style">
                Available Sizes{' '}
                <span className="text-xs font-normal text-slate-400">(e.g., S, M, L)</span>
              </label>
              <input
                id="sizes"
                value={formSizes}
                onChange={(e) => setFormSizes(e.target.value.toUpperCase())}
                className="input-field-style"
                placeholder="S, M, L, XL"
                required
              />
            </div>
            <div>
              <label htmlFor="stockDetails" className="form-label-style">
                Stock per Size{' '}
                <span className="text-xs font-normal text-slate-400">(e.g., S:10,M:5)</span>
              </label>
              <input
                id="stockDetails"
                value={formStockDetailsString}
                onChange={(e) => setFormStockDetailsString(e.target.value)}
                className="input-field-style"
                placeholder="S:10, M:15, L:0"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Sizes must match 'Available Sizes'. Use 0 for out-of-stock.
              </p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-5">
            <div>
              <label htmlFor="description" className="form-label-style">
                Description <span className="text-xs font-normal text-slate-400">(Optional)</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field-style min-h-[120px] resize-y"
                rows={4}
                placeholder="Product features, material, care instructions..."
              />
            </div>
            <div>
              <label className="form-label-style">
                Product Image{' '}
                {isEditMode && (
                  <span className="text-xs font-normal text-slate-400">
                    (Leave empty to keep current)
                  </span>
                )}
              </label>
              <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-accentColor transition-colors">
                <div className="space-y-1 text-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="mx-auto h-28 w-auto object-contain rounded-md"
                    />
                  ) : (
                    <ImageIcon className={`mx-auto h-12 w-12 text-slate-400`} />
                  )}
                  <div className="flex text-sm text-slate-600">
                    <label
                      htmlFor="image-upload"
                      className={`relative cursor-pointer rounded-md font-medium text-[${accentColor}] hover:text-[${primaryColor}] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[${accentColor}]`}
                    >
                      <span>{image ? 'Change file' : 'Upload a file'}</span>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleImageChange}
                        accept="image/png, image/jpeg, image/webp"
                      />
                    </label>
                    {image && <p className="pl-1">({image.name})</p>}
                    {!image && !preview && <p className="pl-1">or drag and drop</p>}
                  </div>
                  {!image && !preview && (
                    <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 5MB</p>
                  )}
                </div>
              </div>
            </div>
            <div className="pt-2">
              <label htmlFor="formIsNewCollection" className="flex items-center cursor-pointer">
                <input
                  id="formIsNewCollection"
                  type="checkbox"
                  checked={formIsNewCollection}
                  onChange={(e) => setFormIsNewCollection(e.target.checked)}
                  className={`h-4 w-4 rounded border-slate-300 text-[${accentColor}] focus:ring-[${accentColor}]`}
                />
                <span className="ml-2.5 text-sm font-medium text-slate-700">
                  Mark as New Collection
                </span>
              </label>
            </div>
          </div>

          {/* Form Action Buttons (Spanning both columns if needed on small screens, or at the end) */}
          <div className="md:col-span-2 pt-4 flex flex-col sm:flex-row gap-3">
            <button type="submit" disabled={loadingForm} className="button-submit-style">
              {loadingForm && <Loader2 className="animate-spin -ml-1 mr-2.5 h-5 w-5" />}
              {loadingForm ? 'Processing...' : isEditMode ? 'Update Product' : 'Add Product'}
            </button>
            {isEditMode && (
              <button
                type="button"
                onClick={resetForm}
                disabled={loadingForm}
                className="button-cancel-style"
              >
                <X className="mr-1.5 -ml-1" size={18} /> Cancel Edit
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Products List Section */}
      <motion.div variants={itemVariants} className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-semibold ${headingColor} flex items-center`}>
            <Package size={24} className={`mr-2.5 opacity-70 text-[${accentColor}]`} />
            Existing Products
          </h3>
          <span className={`${lightGrayText} text-sm`}>{products.length} items</span>
        </div>
        {loadingProducts ? (
          <div className="flex justify-center items-center py-20 text-slate-500">
            <Loader2 className={`animate-spin h-10 w-10 mr-3 text-[${accentColor}]`} />
            <span>Loading products...</span>
          </div>
        ) : products.length > 0 ? (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
          >
            {products.map((product) => {
              const isCollectionUpdating = actionLoading[`isNewCollection-${product._id}`]
              const isDeleting = actionLoading[`delete-${product._id}`]
              const anyActionLoading = isCollectionUpdating || isDeleting
              const stockDisplay = product.sizes?.length ? (
                product.sizes
                  .map((size) => `${size}: ${product.stockDetails?.[size] ?? 'N/A'}`)
                  .join(' | ')
              ) : (
                <span className="italic text-slate-400">No size/stock</span>
              )

              return (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  layout
                  className="product-card-style"
                >
                  <div className="relative">
                    {product.isNewCollection && <span className="badge-new">NEW</span>}
                    <span
                      className={`badge-stock ${
                        product.isInStock
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.isInStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <img
                      src={`${IMAGE_SERVER_URL}${product.image}`}
                      alt={product.title}
                      className="product-image-style"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/350x250?text=No+Image'
                      }}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h4 className="product-title-style" title={product.title}>
                      {product.title}
                    </h4>
                    <p className="text-xs text-slate-500 mb-1.5 h-10 overflow-hidden">
                      {product.description ? (
                        `${product.description.substring(0, 50)}...`
                      ) : (
                        <span className="italic">No description.</span>
                      )}
                    </p>
                    <p
                      className="stock-display-style"
                      title={typeof stockDisplay === 'string' ? stockDisplay : undefined}
                    >
                      Stock: {stockDisplay}
                    </p>
                    <p className="text-xs text-slate-400 capitalize my-1.5">
                      {product.category} • {product.gender}
                    </p>
                    <p className={`text-lg font-semibold text-[${accentColor}] mt-auto pt-1.5`}>
                      PKR {Number(product.price || 0).toLocaleString('en-PK')}
                    </p>
                  </div>
                  <div className="product-actions-footer-style">
                    <button
                      onClick={() => handleEdit(product)}
                      disabled={loadingForm || anyActionLoading}
                      className="action-button-style hover:bg-blue-50"
                      title="Edit"
                    >
                      <Edit size={16} className={`text-blue-600`} />
                    </button>
                    <button
                      onClick={() =>
                        handleToggleNewCollection(product._id, !!product.isNewCollection)
                      }
                      disabled={loadingForm || anyActionLoading}
                      className={`action-button-style ${
                        product.isNewCollection
                          ? `bg-[${accentColor}] text-white hover:bg-opacity-80`
                          : 'hover:bg-yellow-50'
                      }`}
                      title={product.isNewCollection ? 'Remove from New' : 'Mark as New'}
                    >
                      {isCollectionUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Star
                          size={16}
                          className={product.isNewCollection ? 'fill-current' : `text-yellow-500`}
                        />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={loadingForm || anyActionLoading}
                      className="action-button-style hover:bg-red-50"
                      title="Delete"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 size={16} className="text-red-600" />
                      )}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <motion.p variants={itemVariants} className="text-center text-slate-500 py-10 italic">
            No products found. Add some using the form above!
          </motion.p>
        )}
      </motion.div>

      <style jsx>{`
        .form-label-style {
          display: block;
          margin-bottom: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: ${darkGrayText};
        }
        .input-field-style {
          display: block;
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1px solid #cbd5e1;
          border-radius: 0.375rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-size: 0.875rem;
          color: ${darkGrayText};
        }
        .input-field-style:focus {
          outline: none;
          border-color: ${accentColor};
          box-shadow: 0 0 0 2px ${accentColor}33;
        }
        .input-field-style.select-arrow {
          background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="%23475569" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m6 8 4 4 4-4"/></svg>');
          background-position: right 0.75rem center;
          background-repeat: no-repeat;
          background-size: 1.25em 1.25em;
          padding-right: 2.5rem;
          appearance: none;
        }

        .button-submit-style {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          font-weight: 600;
          transition: all 0.2s;
          white-space: nowrap;
          border: 1px solid transparent;
          cursor: pointer;
          font-size: 0.875rem;
          background-color: ${primaryColor};
          color: white;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
        }
        .button-submit-style:hover:not(:disabled) {
          background-color: ${accentColor};
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
        }
        .button-submit-style:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .button-cancel-style {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          font-weight: 500;
          transition: all 0.2s;
          white-space: nowrap;
          border: 1px solid #cbd5e1;
          cursor: pointer;
          font-size: 0.875rem;
          background-color: white;
          color: ${darkGrayText};
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
        }
        .button-cancel-style:hover:not(:disabled) {
          background-color: #f8fafc;
          border-color: #94a3b8;
        }
        .button-cancel-style:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .product-card-style {
          background-color: white;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
        }
        .product-card-style:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
        }
        .product-image-style {
          height: 14rem;
          width: 100%;
          object-fit: cover;
          background-color: #f1f5f9;
          display: block;
          border-bottom: 1px solid #e2e8f0;
        }
        .product-title-style {
          font-weight: 600;
          color: ${primaryColor};
          font-size: 0.95rem;
          margin-bottom: 0.25rem;
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .stock-display-style {
          font-size: 0.75rem;
          color: #475569;
          margin-bottom: 0.25rem;
          background-color: #f8fafc;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .product-actions-footer-style {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem;
          background-color: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }
        .action-button-style {
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: background-color 0.2s, opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          line-height: 1;
        }
        .action-button-style:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .badge-new {
          position: absolute;
          top: 0.625rem;
          left: 0.625rem;
          background-color: ${accentColor};
          color: white;
          font-size: 0.625rem;
          font-weight: bold;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          z-index: 10;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
        }
        .badge-stock {
          position: absolute;
          top: 0.625rem;
          right: 0.625rem;
          font-size: 0.625rem;
          font-weight: bold;
          padding: 0.125rem 0.625rem;
          border-radius: 9999px;
          z-index: 10;
          border: 1px solid currentColor;
        }
      `}</style>
    </motion.div>
  )
}

export default Products
