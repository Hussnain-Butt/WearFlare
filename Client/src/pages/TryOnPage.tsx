// src/pages/TryOnPage.jsx
import React, { useState, useEffect, useRef } from 'react' // Added useRef
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Upload, ImagePlus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const POLLING_INTERVAL = 5000 // Check status every 5 seconds (5000ms)
const MAX_POLLING_ATTEMPTS = 24 // Try for max 2 minutes (24 * 5s = 120s)

const TryOnPage = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [tryOnResult, setTryOnResult] = useState<string | null>(null) // Final image URL
  const [showTryButton, setShowTryButton] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Loading state for initial request AND polling
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [currentJobId, setCurrentJobId] = useState<string | null>(null) // Store the active job ID

  // Ref to store interval ID for cleanup
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const pollingAttemptsRef = useRef<number>(0)

  // Backend URL (use environment variable in real app)
  const backendApiUrl =
    process.env.REACT_APP_BACKEND_URL || 'https://backend-production-c8ff.up.railway.app'

  // --- Fetch Product Details ---
  useEffect(() => {
    if (productId) {
      axios
        .get(`${backendApiUrl}/api/products/${productId}`)
        .then((res) => setProduct(res.data))
        .catch((err) => {
          console.error('Failed to fetch product:', err)
          setErrorMessage('Failed to load product details.')
        })
    }
    // Cleanup polling interval on component unmount or productId change
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [productId, backendApiUrl]) // Added backendApiUrl dependency

  // --- Stop Polling Function ---
  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
      pollingAttemptsRef.current = 0 // Reset attempts
      console.log('Polling stopped.')
    }
  }

  // --- Start Polling Function ---
  const startPolling = (jobId) => {
    stopPolling() // Clear any previous interval
    setCurrentJobId(jobId) // Store the new job ID
    pollingAttemptsRef.current = 0 // Reset attempts count
    setInfoMessage(`Processing started (Job ID: ${jobId}). Checking status...`)
    setIsLoading(true) // Keep loading state active during polling

    pollingIntervalRef.current = setInterval(async () => {
      if (!jobId) {
        // Safety check
        stopPolling()
        return
      }

      pollingAttemptsRef.current += 1
      console.log(`Polling attempt ${pollingAttemptsRef.current} for Job ID: ${jobId}`)

      if (pollingAttemptsRef.current > MAX_POLLING_ATTEMPTS) {
        console.error('Polling timeout reached.')
        setErrorMessage('Try-on request timed out after checking status for too long.')
        stopPolling()
        setIsLoading(false)
        return
      }

      try {
        // Call the backend status check endpoint
        const statusRes = await axios.get(`${backendApiUrl}/api/tryon/status/${jobId}`)
        const { status, outputImageUrl, error: statusError } = statusRes.data

        console.log('Status check response:', statusRes.data)

        if (status === 'completed' && outputImageUrl) {
          setTryOnResult(outputImageUrl)
          setInfoMessage('Try-on completed!')
          setErrorMessage(null)
          stopPolling()
          setIsLoading(false)
        } else if (status === 'failed') {
          setErrorMessage(`Try-on failed: ${statusError || 'Unknown reason'}`)
          setInfoMessage(null)
          stopPolling()
          setIsLoading(false)
        } else if (status === 'check_failed') {
          // Error occurred during the status check itself (backend reported)
          setErrorMessage(`Failed to check status: ${statusError || 'Unknown error'}`)
          setInfoMessage(null)
          stopPolling() // Stop polling if status check fails persistently
          setIsLoading(false)
        } else {
          // Still processing, starting, in_queue etc. Keep polling.
          setInfoMessage(`Status: ${status}... (Job ID: ${jobId})`)
        }
      } catch (pollError) {
        console.error('Error during status polling:', pollError)
        // Handle potential network errors during polling or if backend status endpoint itself fails
        const errMsg =
          pollError.response?.data?.error || pollError.message || 'Could not check job status.'
        setErrorMessage(`Error checking status: ${errMsg}`)
        stopPolling() // Stop polling on error
        setIsLoading(false)
      }
    }, POLLING_INTERVAL)
  }

  // --- Handle Image Upload ---
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    stopPolling() // Stop polling if a new image is uploaded
    setCurrentJobId(null) // Clear old job ID
    setUploadedImage(file)
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl)
    }
    setPreviewImageUrl(URL.createObjectURL(file))
    setShowTryButton(true)
    setTryOnResult(null)
    setErrorMessage(null)
    setInfoMessage(null)
  }

  // --- Handle Try-On Request Initiation ---
  const handleTryOn = async () => {
    if (!uploadedImage || !product) return
    stopPolling() // Ensure no old polling is running
    setIsLoading(true) // Set loading for the initial POST request
    setErrorMessage(null)
    setInfoMessage('Initiating try-on request...')
    setTryOnResult(null)
    setCurrentJobId(null)

    const formData = new FormData()
    formData.append('userImage', uploadedImage)
    let imagePath = product.image
    let clothingImageUrl = imagePath.startsWith('/')
      ? `${backendApiUrl}${imagePath}`
      : `${backendApiUrl}/${imagePath}`
    formData.append('clothingImage', clothingImageUrl)

    try {
      // Call backend to START the job
      const res = await axios.post(`${backendApiUrl}/api/tryon`, formData)

      // Check response from backend initiating call
      if (res.data && res.data.jobId) {
        // Job initiated successfully, start polling for status
        startPolling(res.data.jobId)
        // Note: setIsLoading(true) is already set and will remain true during polling
      } else {
        // Backend didn't return jobId as expected
        console.error('Backend did not return jobId after initiation:', res.data)
        setErrorMessage(res.data?.message || 'Failed to start try-on job. Unexpected response.')
        setIsLoading(false) // Stop loading if initiation failed immediately
      }
    } catch (err) {
      // Handle errors from the initial POST request
      console.error('Try-on initiation failed:', err)
      const backendError =
        err.response?.data?.error ||
        err.response?.data?.details ||
        'Failed to initiate try-on request.'
      const status = err.response?.status
      let displayError = backendError
      // Customize based on status code if needed
      displayError = status ? `Error ${status}: ${backendError}` : backendError
      setErrorMessage(displayError)
      setIsLoading(false) // Stop loading if initiation fails
    }
    // No finally block needed here for setIsLoading, polling handles it
  }

  // --- Cleanup Preview URL and Polling on Unmount ---
  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl)
      }
      stopPolling() // Clean up interval on unmount
    }
  }, [previewImageUrl]) // Dependency array ensures this runs only when previewImageUrl changes or on unmount

  // --- Render Component ---
  return (
    <div className="min-h-screen bg-[#f8f6f2] flex flex-col items-center px-4 py-10">
      <h2 className="text-3xl font-semibold text-[#6b5745] mb-10">Virtual Try-On</h2>

      {/* Display Error or Info Messages */}
      {errorMessage /* Error has priority */ && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 max-w-lg w-full"
          role="alert"
        >
          <span className="block sm:inline">Error: {errorMessage}</span>
        </div>
      )}
      {!errorMessage && infoMessage /* Show info if no error */ && (
        <div
          className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-6 max-w-lg w-full"
          role="alert"
        >
          <span className="block sm:inline">{infoMessage}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Upload Section */}
        <div className="w-full max-w-[400px] bg-[#6b5745] text-[#c8a98a] p-6 rounded-xl shadow-md flex flex-col items-center">
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
                  {' '}
                  <Loader2 className="animate-spin mr-2 w-4 h-4" /> Processing...{' '}
                </>
              ) : (
                'Generate Try-On'
              )}
            </Button>
          )}
        </div>

        {/* Right: Try-On Result */}
        <div className="w-full max-w-[400px] bg-[#fffefc] text-[#6b5745] p-6 rounded-xl shadow-md flex flex-col items-center justify-center min-h-[400px]">
          <ImagePlus className="h-10 w-10 mb-3" />
          {/* Display Loading state (covers initial POST and polling) */}
          {isLoading && (
            <div className="flex flex-col items-center text-center">
              <Loader2 className="animate-spin w-8 h-8 mb-2" />
              <p>{infoMessage || 'Processing...'}</p> {/* Show specific info or generic */}
              <p className="text-sm text-gray-500">(May take up to a minute or two)</p>
            </div>
          )}
          {/* Display the final result image when loading is done and result exists */}
          {!isLoading && tryOnResult && (
            <img
              src={tryOnResult}
              alt="Try-On Result"
              className="w-full rounded-lg object-contain"
            />
          )}
          {/* Display Placeholder/Final Info/Error when not loading and no result image */}
          {!isLoading && !tryOnResult && (
            <p className="text-center text-[#6b5745]">
              {errorMessage
                ? 'Failed to generate.' // Show failure status
                : infoMessage
                ? infoMessage // Show final info message (like 'Completed!')
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
