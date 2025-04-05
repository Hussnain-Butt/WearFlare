// No changes needed from the previous version provided.
// It will correctly display the new 504 timeout error or the existing 502 error.
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null) // State for error message

  useEffect(() => {
    // Use the correct backend URL
    const backendApiUrl = 'https://backend-production-c8ff.up.railway.app'
    axios
      .get(`${backendApiUrl}/api/products/${productId}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error('Failed to fetch product:', err)
        setErrorMessage('Failed to load product details.')
      })
  }, [productId])

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedImage(file)
    // Revoke previous URL to prevent memory leaks
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl)
    }
    setPreviewImageUrl(URL.createObjectURL(file))
    setShowTryButton(true)
    setTryOnResult(null) // Clear previous result
    setErrorMessage(null) // Clear previous error
  }

  const handleTryOn = async () => {
    if (!uploadedImage || !product) return
    setIsLoading(true)
    setErrorMessage(null) // Clear previous error

    const formData = new FormData()
    formData.append('userImage', uploadedImage)

    // Construct clothing image URL (ensure no double slashes)
    const backendUrl = 'https://backend-production-c8ff.up.railway.app' // Define backend URL
    let imagePath = product.image
    let clothingImageUrl = imagePath.startsWith('/')
      ? `${backendUrl}${imagePath}`
      : `${backendUrl}/${imagePath}`

    formData.append('clothingImage', clothingImageUrl)

    try {
      const res = await axios.post(
        `${backendUrl}/api/tryon`, // Use defined backend URL
        formData,
        {
          // Content-Type is set automatically by browser for FormData
        },
      )
      setTryOnResult(res.data.outputImageUrl)
    } catch (err) {
      console.error('Try-on failed:', err)
      // Extract error message from backend response or provide a default
      const backendError =
        err.response?.data?.error ||
        err.response?.data?.details ||
        'Try-on request failed. Please check the console or try again later.'
      const status = err.response?.status // Get status code if available

      // Customize message for specific errors if needed
      let displayError = backendError
      if (status === 504) {
        displayError =
          'The virtual try-on service took too long to respond. Please try again in a few moments.'
      } else if (status === 502) {
        displayError =
          'Could not connect to the virtual try-on service. It might be temporarily unavailable.'
      }

      setErrorMessage(`Error: ${displayError}`)
      setTryOnResult(null) // Clear result on error
    } finally {
      setIsLoading(false)
      // Decide whether to hide the button or not
      // setShowTryButton(false);
    }
  }

  // Cleanup preview URL on component unmount
  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl)
      }
    }
  }, [previewImageUrl])

  return (
    <div className="min-h-screen bg-[#f8f6f2] flex flex-col items-center px-4 py-10">
      <h2 className="text-3xl font-semibold text-[#6b5745] mb-10">Virtual Try-On</h2>

      {/* Display Error Message */}
      {errorMessage && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 max-w-md w-full"
          role="alert"
        >
          {/* <strong className="font-bold">Error: </strong> */}
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

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
            <div className="mt-6 w-full h-[300px] overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
              <img
                src={previewImageUrl}
                alt="Uploaded Preview"
                className="object-contain max-h-full max-w-full"
              />
            </div>
          )}

          {showTryButton && (
            <Button
              onClick={handleTryOn}
              disabled={isLoading || !uploadedImage}
              className="mt-6 bg-[#c8a98a] text-[#6b5745] px-6 py-2 rounded-full hover:bg-white transition flex items-center disabled:opacity-50"
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
        <div className="w-[400px] bg-[#fffefc] text-[#6b5745] p-6 rounded-xl shadow-md flex flex-col items-center justify-center min-h-[400px]">
          <ImagePlus className="h-10 w-10 mb-3" />
          {isLoading && !tryOnResult && (
            <div className="flex flex-col items-center text-center">
              <Loader2 className="animate-spin w-8 h-8 mb-2" />
              <p>Generating your try-on...</p>
              <p className="text-sm text-gray-500">(This may take up to a minute)</p>
            </div>
          )}
          {tryOnResult && !isLoading && (
            <img
              src={tryOnResult}
              alt="Try-On Result"
              className="w-full rounded-lg object-contain"
            />
          )}
          {!tryOnResult && !isLoading && (
            <p className="text-center text-[#6b5745]">
              {errorMessage ? 'Failed to generate.' : 'Your try-on preview will appear here'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TryOnPage
