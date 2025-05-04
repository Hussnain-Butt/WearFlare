// src/pages/TryOnPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react' // Added useCallback
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Upload, ImagePlus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const POLLING_INTERVAL = 5000 // Check status every 5 seconds
const MAX_POLLING_ATTEMPTS = 24 // Try for max 2 minutes

const TryOnPage = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [tryOnResult, setTryOnResult] = useState<string | null>(null) // Final image URL
  const [showTryButton, setShowTryButton] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const pollingAttemptsRef = useRef<number>(0)

  // Use REACT_APP_ prefix for create-react-app or VITE_ prefix for Vite
  const backendApiUrl =
    process.env.REACT_APP_BACKEND_URL || process.env.VITE_BACKEND_URL || 'http://localhost:5000'

  // --- Stop Polling Function ---
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
      pollingAttemptsRef.current = 0
      console.log('Polling stopped.')
      // Only set loading to false if we are actually stopping polling
      // If it completes successfully or fails, the specific handlers will set isLoading.
      // This prevents stopping loading prematurely if component unmounts.
      // setIsLoading(false); // Removed from here
    }
  }, []) // No dependencies needed

  // --- Start Polling Function ---
  const startPolling = useCallback(
    (jobId) => {
      stopPolling() // Clear any previous interval
      setCurrentJobId(jobId)
      pollingAttemptsRef.current = 0
      setInfoMessage(`Processing started (Job ID: ${jobId.substring(0, 8)}...). Checking status...`)
      setErrorMessage(null) // Clear previous errors
      setTryOnResult(null) // Clear previous results
      setIsLoading(true) // Ensure loading is true

      pollingIntervalRef.current = setInterval(async () => {
        if (!jobId || !pollingIntervalRef.current) {
          // Check if polling was stopped
          // This check prevents calls after stopPolling is called elsewhere
          if (pollingIntervalRef.current) stopPolling()
          return
        }

        pollingAttemptsRef.current += 1
        console.log(`Polling attempt ${pollingAttemptsRef.current} for Job ID: ${jobId}`)

        if (pollingAttemptsRef.current > MAX_POLLING_ATTEMPTS) {
          console.error('Polling timeout reached for Job ID:', jobId)
          setErrorMessage('Try-on request timed out while waiting for results.')
          setInfoMessage(null)
          stopPolling()
          setIsLoading(false) // Stop loading on timeout
          return
        }

        try {
          const statusRes = await axios.get(`${backendApiUrl}/api/tryon/status/${jobId}`)
          const { status, outputImageUrl, error: statusErrorMessage } = statusRes.data

          console.log('Status check response:', { status, outputImageUrl, statusErrorMessage })

          // --- Handle different statuses ---
          if (status === 'completed' && outputImageUrl) {
            console.log('Polling success: Job completed!')
            setTryOnResult(outputImageUrl)
            setInfoMessage('Try-on completed!')
            setErrorMessage(null)
            stopPolling()
            setIsLoading(false) // Stop loading on completion
          } else if (status === 'failed') {
            console.error('Polling detected failure:', statusErrorMessage)
            // <<<--- UPDATED ERROR MESSAGE HANDLING --- >>>
            setErrorMessage(`Try-on failed: ${statusErrorMessage || 'Unknown reason'}`)
            setInfoMessage(null)
            stopPolling()
            setIsLoading(false) // Stop loading on failure
          } else if (status === 'check_failed') {
            // Error occurred during the status check itself (reported by backend)
            console.error('Polling status check failed:', statusErrorMessage)
            setErrorMessage(`Failed to check status: ${statusErrorMessage || 'Unknown error'}`)
            setInfoMessage(null)
            // Consider stopping polling if check fails repeatedly, but maybe allow retries for temporary issues
            // For now, stop polling on check failure
            stopPolling()
            setIsLoading(false)
          } else if (['processing', 'in_queue', 'starting', 'unknown'].includes(status)) {
            // Still processing, update info message
            setInfoMessage(`Status: ${status}... (Job ID: ${jobId.substring(0, 8)}...)`)
            // Keep polling, isLoading remains true
          } else {
            // Unexpected status
            console.warn('Received unexpected status during polling:', status)
            setInfoMessage(`Status: ${status}... (Job ID: ${jobId.substring(0, 8)}...)`)
          }
        } catch (pollError) {
          console.error('Error during status polling request:', pollError)
          const errMsg =
            pollError.response?.data?.error ||
            pollError.response?.data?.details ||
            pollError.message ||
            'Could not check job status.'
          setErrorMessage(`Error checking status: ${errMsg}`)
          setInfoMessage(null)
          stopPolling() // Stop polling on network/request error
          setIsLoading(false)
        }
      }, POLLING_INTERVAL)
    },
    [backendApiUrl, stopPolling],
  ) // Added dependencies

  // --- Fetch Product Details ---
  useEffect(() => {
    if (productId) {
      console.log('Fetching product details for ID:', productId)
      axios
        .get(`${backendApiUrl}/api/products/${productId}`)
        .then((res) => {
          console.log('Product details fetched:', res.data)
          setProduct(res.data)
        })
        .catch((err) => {
          console.error('Failed to fetch product:', err)
          setErrorMessage('Failed to load product details.')
        })
    }
    // Cleanup polling interval on component unmount or productId change
    return stopPolling // Return the cleanup function directly
  }, [productId, backendApiUrl, stopPolling]) // Added stopPolling dependency

  // --- Handle Image Upload ---
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    stopPolling() // Stop any active polling
    setCurrentJobId(null)
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
    if (!uploadedImage || !product) {
      console.warn('Attempted Try-On without image or product.')
      return
    }
    stopPolling()
    setIsLoading(true)
    setErrorMessage(null)
    setInfoMessage('Initiating try-on request...')
    setTryOnResult(null)
    setCurrentJobId(null)

    const formData = new FormData()
    formData.append('userImage', uploadedImage)
    let imagePath = product.image
    if (!imagePath) {
      setErrorMessage('Product information is missing the image path.')
      setIsLoading(false)
      return
    }
    let clothingImageUrl = imagePath.startsWith('/')
      ? `${backendApiUrl}${imagePath}`
      : `${backendApiUrl}/${imagePath}`
    formData.append('clothingImage', clothingImageUrl)
    console.log('Initiating Try-On with Model:', clothingImageUrl)

    try {
      const res = await axios.post(`${backendApiUrl}/api/tryon`, formData)

      if (res.data && res.data.jobId) {
        console.log('Received Job ID from backend:', res.data.jobId)
        startPolling(res.data.jobId) // Start polling with the received Job ID
      } else {
        console.error('Backend did not return jobId after initiation:', res.data)
        setErrorMessage(res.data?.message || 'Failed to start try-on job. No Job ID received.')
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Try-on initiation failed (POST /api/tryon):', err)
      const backendError =
        err.response?.data?.error ||
        err.response?.data?.details ||
        'Failed to initiate try-on request.'
      const status = err.response?.status
      let displayError = status ? `Error ${status}: ${backendError}` : backendError
      setErrorMessage(displayError)
      setIsLoading(false)
    }
  }

  // --- Cleanup Preview URL on Unmount ---
  useEffect(() => {
    // This effect specifically handles the preview URL cleanup
    const currentPreviewUrl = previewImageUrl // Capture value for cleanup function
    return () => {
      if (currentPreviewUrl) {
        URL.revokeObjectURL(currentPreviewUrl)
        console.log('Revoked preview URL:', currentPreviewUrl)
      }
    }
  }, [previewImageUrl])

  // --- Render Component ---
  return (
    <div className="min-h-screen bg-[#f8f6f2] flex flex-col items-center px-4 py-10">
      <h2 className="text-3xl font-semibold text-[#6b5745] mb-10">Virtual Try-On</h2>

      {/* Notifications Area */}
      <div className="w-full max-w-lg mb-6 space-y-2">
        {errorMessage && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
        {!errorMessage && infoMessage && (
          <div
            className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative"
            role="info"
          >
            <span className="block sm:inline">{infoMessage}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-10 w-full max-w-4xl justify-center">
        {/* Left: Upload Section */}
        <div className="w-full max-w-[400px] bg-[#6b5745] text-[#c8a98a] p-6 rounded-xl shadow-md flex flex-col items-center">
          <Upload className="h-12 w-12 mb-4" />
          <p className="mb-4 text-center">Upload your photo to try this outfit</p>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
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
          {showTryButton &&
            product && ( // Only show button if product details are loaded
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
          {!product && productId && <p className="mt-4 text-sm">Loading product...</p>}
        </div>

        {/* Right: Try-On Result */}
        <div className="w-full max-w-[400px] bg-[#fffefc] text-[#6b5745] p-6 rounded-xl shadow-md flex flex-col items-center justify-center min-h-[400px]">
          <ImagePlus className="h-10 w-10 mb-3" />
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center text-center">
              <Loader2 className="animate-spin w-8 h-8 mb-2" />
              {/* Show specific info message during loading/polling */}
              <p>{infoMessage || 'Processing...'}</p>
              <p className="text-sm text-gray-500">(May take up to a minute or two)</p>
            </div>
          )}
          {/* Result State */}
          {!isLoading && tryOnResult && (
            <img
              src={tryOnResult}
              alt="Try-On Result"
              className="w-full rounded-lg object-contain"
            />
          )}
          {/* Initial / Failed / Info State (when not loading and no result image) */}
          {!isLoading && !tryOnResult && (
            <p className="text-center text-[#6b5745]">
              {errorMessage
                ? 'Failed to generate.' // Indicates failure after processing
                : infoMessage
                ? infoMessage // Shows 'Completed!' or other final info
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
