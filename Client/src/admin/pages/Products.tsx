import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast, Toaster } from 'react-hot-toast'

interface Product {
  _id: string
  title: string
  price: string
  category: string
  gender: string
  description: string
  image: string
}

const Products: React.FC = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [gender, setGender] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [editId, setEditId] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await axios.get<Product[]>(
        'https://backend-production-c8ff.up.railway.app/api/products',
      )
      setProducts(res.data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const validateForm = () => {
    if (!title || !price || !category || !description || !gender || (!image && !isEditMode)) {
      toast.error('Please fill all fields and upload an image.')
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
    setPreview(null)
    setIsEditMode(false)
    setEditId('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const formData = new FormData()
    formData.append('title', title)
    formData.append('price', price)
    formData.append('category', category)
    formData.append('gender', gender)
    formData.append('description', description)

    if (image) formData.append('image', image)

    setLoading(true)

    try {
      if (isEditMode) {
        await axios.put(
          `https://backend-production-c8ff.up.railway.app/api/products/${editId}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        )
        toast.success('✅ Product updated!')
      } else {
        await axios.post('https://backend-production-c8ff.up.railway.app/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        toast.success('✅ Product added!')
      }

      fetchProducts()
      resetForm()
    } catch (error) {
      toast.error('❌ Error saving product')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setTitle(product.title)
    setPrice(product.price)
    setCategory(product.category)
    setGender(product.gender)
    setDescription(product.description)
    setPreview(product.image)
    setIsEditMode(true)
    setEditId(product._id)
    toast('Edit mode enabled', { icon: '✏️' })
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`https://backend-production-c8ff.up.railway.app/api/products/${id}`)
      toast.success('🗑️ Product deleted')
      fetchProducts()
    } catch (error) {
      toast.error('❌ Failed to delete')
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f7f3] px-4 py-10">
      <Toaster position="top-right" />

      {/* Form */}
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-[#c8a98a] mb-6">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Product Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-[#c8a98a] rounded-md"
          />
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border border-[#c8a98a] rounded-md"
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-[#c8a98a] rounded-md"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-[#c8a98a] rounded-md"
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-2 border border-[#c8a98a] rounded-md"
          >
            <option value="">Select Gender</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>

          {/* File input */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer bg-[#c8a98a] text-white py-2 px-4 rounded-md hover:bg-[#b78d6b] transition">
                Choose File
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
              {image && <span className="text-sm text-gray-600">{image.name}</span>}
            </div>
          </div>

          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-52 object-cover rounded-md border border-gray-200"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center bg-[#c8a98a] text-white py-2 px-4 rounded-md hover:bg-[#b78d6b] transition ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </div>

      {/* Products List */}
      <div className="max-w-6xl mx-auto mt-16">
        <h3 className="text-xl font-semibold text-[#c8a98a] mb-4">All Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white shadow p-4 rounded-md">
              <img
                src={`https://backend-production-c8ff.up.railway.app${product.image}`}
                alt={product.title}
                className="h-48 w-full object-cover rounded-md"
              />
              <div className="mt-2">
                <h4 className="font-semibold">{product.title}</h4>
                <p className="text-sm text-gray-600">
                  {product.category} • {product.gender}
                </p>
                <p className="text-[#6b5745] font-medium mt-1">{product.price}</p>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(product)}
                  className="px-4 py-2 bg-[#c8a98a] text-white rounded hover:bg-[#b78d6b]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Products
