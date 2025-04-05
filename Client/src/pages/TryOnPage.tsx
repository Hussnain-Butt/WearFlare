import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Upload, ImagePlus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const TryOnPage = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [tryOnResult, setTryOnResult] = useState<string | null>(null)
  const [showTryButton, setShowTryButton] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    axios
      .get(`https://backend-production-c8ff.up.railway.app/api/products/${productId}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err))
  }, [productId])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedImage(file)
    setPreviewImageUrl(URL.createObjectURL(file))
    setShowTryButton(true)
  }

  const handleTryOn = async () => {
    if (!uploadedImage || !product) return
    setIsLoading(true)

    const formData = new FormData()
    formData.append('userImage', uploadedImage)
    // Ensure product.image doesn't start with a slash OR handle it
    let clothingImageUrl = `https://backend-production-c8ff.up.railway.app${product.image}`
    if (product.image.startsWith('/')) {
      clothingImageUrl = `https://backend-production-c8ff.up.railway.app${product.image}`
    } else {
      clothingImageUrl = `https://backend-production-c8ff.up.railway.app/${product.image}`
    }
    // OR clean it up on the backend if easier:
    // const clothingImage = req.body.clothingImage?.trim().replace(/([^:]\/)\/+/g, "$1");

    formData.append('clothingImage', clothingImageUrl)
    formData.append('clothingImage', clothingImageUrl)

    try {
      const res = await axios.post(
        'https://backend-production-c8ff.up.railway.app/api/tryon',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      setTryOnResult(res.data.outputImageUrl)
    } catch (err) {
      console.error('Try-on failed:', err)
    } finally {
      setIsLoading(false)
      setShowTryButton(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f6f2] flex flex-col items-center px-4 py-10">
      <h2 className="text-3xl font-semibold text-[#6b5745] mb-10">Virtual Try-On</h2>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Upload Section */}
        <div className="w-[400px] bg-[#6b5745] text-[#c8a98a] p-6 rounded-xl shadow-md flex flex-col items-center">
          <Upload className="h-12 w-12 mb-4" />
          <p className="mb-4 text-center">Upload your photo to try this outfit</p>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="fileUpload"
          />
          <label
            htmlFor="fileUpload"
            className="cursor-pointer bg-[#c8a98a] text-[#6b5745] px-5 py-2 rounded-full font-medium hover:bg-white transition"
          >
            Choose Image
          </label>

          {previewImageUrl && (
            <div className="mt-6 w-full h-[300px] overflow-hidden rounded-lg bg-white flex items-center justify-center">
              <img
                src={previewImageUrl}
                alt="Uploaded"
                className="object-cover max-h-full max-w-full"
              />
            </div>
          )}

          {showTryButton && (
            <Button
              onClick={handleTryOn}
              disabled={isLoading}
              className="mt-6 bg-[#c8a98a] text-[#6b5745] px-6 py-2 rounded-full hover:bg-white transition flex items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 w-4 h-4" /> Generating...
                </>
              ) : (
                'Generate Try-On'
              )}
            </Button>
          )}
        </div>

        {/* Right: Try-On Result */}
        <div className="w-[400px] bg-[#fffefc] text-[#6b5745] p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
          <ImagePlus className="h-10 w-10 mb-3" />
          {tryOnResult ? (
            <img
              src={tryOnResult}
              alt="Try-On Result"
              className="w-full rounded-lg object-contain"
            />
          ) : (
            <p className="text-center text-[#6b5745]">Your try-on preview will appear here</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TryOnPage
