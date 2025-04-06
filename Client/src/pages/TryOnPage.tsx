// src/pages/TryOnPage.jsx (or wherever your component is)
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
  const [tryOnResult, setTryOnResult] = useState<string | null>(null) // Still used for *displaying* result if available later
  const [showTryButton, setShowTryButton] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null) // For info like "Processing..."

  // --- Fetch Product Details ---
  useEffect(() => {
    const backendApiUrl =
      process.env.REACT_APP_BACKEND_URL || 'https://backend-production-c8ff.up.railway.app'
    if (productId) {
      axios
        .get(`${backendApiUrl}/api/products/${productId}`)
        .then((res) => setProduct(res.data))
        .catch((err) => {
          console.error('Failed to fetch product:', err)
          setErrorMessage('Failed to load product details.')
        })
    }
  }, [productId])

  // --- Handle Image Upload ---
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedImage(file)
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl)
    }
    setPreviewImageUrl(URL.createObjectURL(file))
    setShowTryButton(true)
    setTryOnResult(null) // Clear previous result
    setErrorMessage(null) // Clear previous error
    setInfoMessage(null) // Clear previous info message
  }

  // --- Handle Try-On Request ---
  const handleTryOn = async () => {
    if (!uploadedImage || !product) return
    setIsLoading(true)
    setErrorMessage(null)
    setInfoMessage(null)
    setTryOnResult(null) // Clear previous result image

    const formData = new FormData()
    formData.append('userImage', uploadedImage) // Backend needs this file

    // Construct clothing image URL for the backend
    const backendUrl =
      process.env.REACT_APP_BACKEND_URL || 'https://backend-production-c8ff.up.railway.app'
    let imagePath = product.image
    let clothingImageUrl = imagePath.startsWith('/')
      ? `${backendUrl}${imagePath}`
      : `${backendUrl}/${imagePath}`

    formData.append('clothingImage', clothingImageUrl) // Backend needs this URL

    try {
      const res = await axios.post(
        `${backendUrl}/api/tryon`, // Call our backend endpoint
        formData,
        {
          // Content-Type is set automatically for FormData by the browser
        },
      )

      // --- Process Backend Response ---
      // Check if the backend successfully initiated the job
      if (res.data && res.data.jobId) {
        console.log('Try-on job initiated:', res.data.jobId)
        setInfoMessage(`Processing started (Job ID: ${res.data.jobId}). Result will appear later.`)
        // TODO: Implement logic to periodically check the job status using the jobId
        // and fetch the actual result image URL when ready.
        // For now, we just display the info message.
        setTryOnResult(null) // Ensure no old image is shown
      }
      // Handle cases where backend might *still* send outputImageUrl (e.g., placeholder or error simulation)
      else if (res.data && res.data.outputImageUrl) {
        console.warn('Backend sent outputImageUrl directly:', res.data.outputImageUrl)
        setTryOnResult(res.data.outputImageUrl) // Display it if backend sends it
        setInfoMessage(null)
      }
      // Handle other success messages from backend
      else if (res.data && res.data.message) {
        console.log('Backend message:', res.data.message)
        setInfoMessage(res.data.message)
        setTryOnResult(null)
      } else {
        // Unexpected success response from backend
        console.error('Unexpected response structure from backend:', res.data)
        setErrorMessage('Received an unexpected response from the server.')
        setTryOnResult(null)
      }
    } catch (err) {
      console.error('Try-on failed:', err)
      // Extract error message from backend response or provide a default
      const backendError =
        err.response?.data?.error ||
        err.response?.data?.details ||
        'Try-on request failed. Please check the console or try again later.'
      const status = err.response?.status

      let displayError = backendError
      if (status === 504) {
        displayError = 'The virtual try-on service timed out. Please try again in a few moments.'
      } else if (status === 502) {
        displayError =
          'Could not connect to the virtual try-on service. It might be temporarily unavailable.'
      } else if (status) {
        displayError = `Request failed: ${backendError} (Status: ${status})`
      } else {
        displayError = `Request failed: ${backendError}`
      }

      setErrorMessage(displayError) // Show specific error
      setTryOnResult(null)
      setInfoMessage(null)
    } finally {
      setIsLoading(false)
      // Keep the button visible maybe? Or hide it:
      // setShowTryButton(false);
    }
  }

  // --- Cleanup Preview URL ---
  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl)
      }
    }
  }, [previewImageUrl])

  // --- Render Component ---
  return (
    <div className="min-h-screen bg-[#f8f6f2] flex flex-col items-center px-4 py-10">
      <h2 className="text-3xl font-semibold text-[#6b5745] mb-10">Virtual Try-On</h2>

      {/* Display Error Message */}
      {errorMessage && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 max-w-md w-full"
          role="alert"
        >
          <span className="block sm:inline">Error: {errorMessage}</span>
        </div>
      )}

      {/* Display Info Message */}
      {infoMessage && !errorMessage && (
        <div
          className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-6 max-w-md w-full"
          role="alert"
        >
          <span className="block sm:inline">{infoMessage}</span>
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
          {/* Display Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center text-center">
              <Loader2 className="animate-spin w-8 h-8 mb-2" />
              <p>Initiating try-on...</p>
            </div>
          )}
          {/* Display the final result image IF available */}
          {!isLoading && tryOnResult && (
            <img
              src={tryOnResult}
              alt="Try-On Result"
              className="w-full rounded-lg object-contain"
            />
          )}
          {/* Display Info/Placeholder message when not loading and no result image */}
          {!isLoading && !tryOnResult && (
            <p className="text-center text-[#6b5745]">
              {infoMessage
                ? infoMessage.split('.')[0] // Show first part of info message if available
                : errorMessage
                ? 'Failed to generate.' // Show error status if error occurred
                : 'Your try-on preview will appear here'}{' '}
              {/* Default placeholder */}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TryOnPage
