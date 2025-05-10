// src/pages/TryOnPage.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {
  UploadCloud,
  ImagePlus,
  Loader2,
  XCircle,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const POLLING_INTERVAL = 5000
const MAX_POLLING_ATTEMPTS = 24

// --- CORRECTED: Using your specified backend URL directly ---
const backendApiUrl = 'https://backend-production-c8ff.up.railway.app'
// --- END CORRECTION ---

interface Product {
  _id: string
  image: string
  title?: string
}

// Animation Variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, staggerChildren: 0.1, when: 'beforeChildren' },
  },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const TryOnPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [tryOnResult, setTryOnResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false) // General loading for product fetch / initial try-on request
  const [isPolling, setIsPolling] = useState(false) // Specific to polling status
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null) // For non-error status updates
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const pollingAttemptsRef = useRef<number>(0)

  // --- Logic Functions (stopPolling, startPolling, useEffect for product fetch, handleImageUpload, handleTryOn) - UNCHANGED except console.error ---
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
      pollingAttemptsRef.current = 0
      setIsPolling(false) // Ensure polling state is reset
      console.log('Polling stopped.')
    }
  }, [])

  const startPolling = useCallback(
    (jobId: string) => {
      stopPolling()
      setCurrentJobId(jobId)
      pollingAttemptsRef.current = 0
      setInfoMessage(`Processing your try-on (Job ID: ${jobId.substring(0, 6)})...`)
      setErrorMessage(null)
      setTryOnResult(null)
      setIsLoading(true) // General loading can be true while polling
      setIsPolling(true)

      pollingIntervalRef.current = setInterval(async () => {
        if (!jobId || !pollingIntervalRef.current) {
          // Check if polling should continue
          if (pollingIntervalRef.current) stopPolling()
          return
        }
        pollingAttemptsRef.current += 1
        if (pollingAttemptsRef.current > MAX_POLLING_ATTEMPTS) {
          setErrorMessage('Try-on request timed out. The server might be busy.')
          setInfoMessage(null)
          stopPolling()
          setIsLoading(false)
          return
        }
        try {
          const statusRes = await axios.get(`${backendApiUrl}/api/tryon/status/${jobId}`)
          const { status, outputImageUrl, error: statusErrorMessage } = statusRes.data
          if (status === 'completed' && outputImageUrl) {
            setTryOnResult(outputImageUrl)
            setInfoMessage('Your try-on is ready!')
            setErrorMessage(null)
            stopPolling()
            setIsLoading(false)
          } else if (status === 'failed') {
            setErrorMessage(
              `Try-on failed: ${statusErrorMessage || 'Unknown error during processing.'}`,
            )
            setInfoMessage(null)
            stopPolling()
            setIsLoading(false)
          } else if (status === 'check_failed') {
            setErrorMessage(
              `Status check failed: ${statusErrorMessage || 'Error retrieving status.'}`,
            )
            setInfoMessage(null)
            stopPolling()
            setIsLoading(false)
          } else if (['processing', 'in_queue', 'starting', 'unknown'].includes(status)) {
            setInfoMessage(
              `Status: ${status}... (Attempt ${pollingAttemptsRef.current}/${MAX_POLLING_ATTEMPTS})`,
            )
          } else {
            setInfoMessage(`Current status: ${status}... (Job: ${jobId.substring(0, 6)}...)`)
          }
        } catch (pollError: any) {
          console.error('Polling error:', pollError)
          setErrorMessage(
            `Error checking status: ${pollError.message || 'Connection issue during polling.'}`,
          )
          setInfoMessage(null)
          stopPolling()
          setIsLoading(false)
        }
      }, POLLING_INTERVAL)
    },
    [backendApiUrl, stopPolling],
  )

  useEffect(() => {
    if (productId) {
      setIsLoading(true) // For initial product load
      axios
        .get<Product>(`${backendApiUrl}/api/products/${productId}`)
        .then((res) => {
          setProduct(res.data)
        })
        .catch((err) => {
          console.error('Failed to fetch product:', err)
          setErrorMessage('Failed to load product details.')
        })
        .finally(() => setIsLoading(false)) // Reset general loading after product fetch
    }
    return stopPolling // Cleanup on unmount
  }, [productId, backendApiUrl, stopPolling])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    stopPolling()
    setCurrentJobId(null)
    setIsLoading(false) // Reset loading states
    setUploadedImage(file)
    if (previewImageUrl) URL.revokeObjectURL(previewImageUrl)
    setPreviewImageUrl(URL.createObjectURL(file))
    setTryOnResult(null)
    setErrorMessage(null)
    setInfoMessage('Image selected. Ready to generate try-on.')
  }

  const handleTryOn = async () => {
    if (!uploadedImage || !product) return
    stopPolling()
    setIsLoading(true) // General loading for try-on initiation
    setErrorMessage(null)
    setInfoMessage('Initiating try-on...')
    setTryOnResult(null)
    setCurrentJobId(null)

    const formData = new FormData()
    formData.append('userImage', uploadedImage)
    let imagePath = product.image
    if (!imagePath) {
      setErrorMessage('Product image path missing.')
      setIsLoading(false)
      return
    }
    let clothingImageUrl = imagePath.startsWith('/')
      ? `${backendApiUrl}${imagePath}`
      : `${backendApiUrl}/${imagePath}`
    formData.append('clothingImage', clothingImageUrl)
    try {
      const res = await axios.post<{
        jobId?: string
        message?: string
        error?: string
        details?: string
      }>(`${backendApiUrl}/api/tryon`, formData)
      if (res.data && res.data.jobId) {
        startPolling(res.data.jobId)
        // setIsLoading(false) will be handled by startPolling/stopPolling
      } else {
        throw new Error(
          res.data?.message || res.data?.error || 'Failed to start job. No Job ID received.',
        )
      }
    } catch (err: any) {
      console.error('Try-on initiation error:', err)
      const backendError =
        err.response?.data?.error ||
        err.response?.data?.details ||
        err.message ||
        'Failed to initiate try-on.'
      setErrorMessage(
        err.response?.status ? `Error ${err.response.status}: ${backendError}` : backendError,
      )
      setIsLoading(false) // Reset general loading on error
    }
  }

  useEffect(() => {
    const currentPreviewUrl = previewImageUrl
    return () => {
      if (currentPreviewUrl) URL.revokeObjectURL(currentPreviewUrl)
    }
  }, [previewImageUrl])
  // --- END Logic Functions ---

  return (
    <motion.div
      // bg-gray-50 -> bg-background
      className="min-h-screen bg-background flex flex-col items-center px-4 py-12 sm:py-16 font-inter"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        // text-trendzone-dark-blue -> text-primary (or text-foreground)
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-10 sm:mb-12 text-center"
        variants={itemVariants}
      >
        Virtual Try-On
      </motion.h2>

      <AnimatePresence>
        {errorMessage && (
          // UPDATED: Error message styling
          <motion.div
            className="w-full max-w-lg mb-6 bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2 shadow-md"
            role="alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <XCircle size={18} className="flex-shrink-0" /> {errorMessage}
          </motion.div>
        )}
        {/* UPDATED: Info message styling (using accent for info) */}
        {!errorMessage && infoMessage && !tryOnResult && !(isLoading || isPolling) && (
          <motion.div
            className="w-full max-w-lg mb-6 bg-accent/10 border border-accent/30 text-accent-foreground px-4 py-3 rounded-lg text-sm shadow-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            role="status"
          >
            {infoMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 w-full max-w-4xl lg:max-w-5xl">
        {/* Left: Upload Section */}
        <motion.div
          // bg-white -> bg-card
          // text-trendzone-dark-blue -> text-card-foreground
          className="w-full bg-card text-card-foreground p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col items-center"
          variants={cardVariants}
        >
          {/* text-trendzone-light-blue -> text-accent */}
          <UploadCloud className="h-12 w-12 sm:h-14 sm:w-14 mb-4 text-accent" strokeWidth={1.5} />
          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center">Upload Your Photo</h3>
          {/* text-gray-500 -> text-muted-foreground (relative to card bg) */}
          <p className="text-sm text-muted-foreground mb-6 text-center max-w-xs">
            Choose a clear, front-facing photo to virtually try on this {product?.title || 'outfit'}
            .
          </p>

          <label
            htmlFor="fileUpload"
            // UPDATED: Button styling
            className="w-full cursor-pointer bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:bg-primary/80 transition-colors duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mb-4"
          >
            <ImageIcon size={18} />
            <span>{uploadedImage ? 'Change Image' : 'Choose Image'}</span>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageUpload}
              className="hidden"
              id="fileUpload"
            />
          </label>

          {previewImageUrl && (
            <motion.div
              // bg-gray-100 -> bg-muted/50 (or bg-input)
              // border-gray-200 -> border-border
              className="mt-4 mb-5 w-full aspect-[3/4] max-h-[300px] sm:max-h-[350px] overflow-hidden rounded-lg bg-muted/50 flex items-center justify-center border border-border"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={previewImageUrl}
                alt="Uploaded Preview"
                className="object-contain max-h-full max-w-full rounded-md"
              />
            </motion.div>
          )}

          {uploadedImage && product && (
            <motion.button
              onClick={handleTryOn}
              disabled={isLoading || isPolling}
              // UPDATED: Button styling
              className="mt-auto w-full bg-accent text-accent-foreground px-6 py-3 rounded-lg font-bold text-sm hover:bg-accent/80 transition-colors duration-300 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              whileHover={!(isLoading || isPolling) ? { scale: 1.03 } : {}}
              whileTap={!(isLoading || isPolling) ? { scale: 0.98 } : {}}
            >
              {isLoading || isPolling ? (
                <>
                  {' '}
                  <Loader2 className="animate-spin mr-2 w-5 h-5" />{' '}
                  {isPolling && infoMessage ? infoMessage.split('...')[0] : 'Processing...'}{' '}
                </>
              ) : (
                <>
                  {' '}
                  <Sparkles size={18} className="mr-2" /> Generate Try-On{' '}
                </>
              )}
            </motion.button>
          )}
          {/* text-gray-500 -> text-muted-foreground */}
          {!product && productId && !errorMessage && !isLoading && (
            <p className="mt-4 text-xs text-muted-foreground">Product details are loading...</p>
          )}
          {isLoading && !isPolling && !product && (
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              <Loader2 className="animate-spin mr-2 w-4 h-4" />
              Loading product info...
            </div>
          )}
        </motion.div>

        {/* Right: Try-On Result */}
        <motion.div
          // bg-white -> bg-card
          className="w-full bg-card p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center min-h-[350px] sm:min-h-[450px] md:min-h-full aspect-[3/4]"
          variants={cardVariants}
        >
          <AnimatePresence mode="wait">
            {isPolling || (isLoading && !tryOnResult && !errorMessage) ? (
              <motion.div
                key="loading-result"
                // text-trendzone-dark-blue -> text-card-foreground
                className="flex flex-col items-center text-center text-card-foreground p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* text-trendzone-light-blue -> text-accent */}
                <Loader2 className="animate-spin w-10 h-10 sm:w-12 sm:w-12 mb-4 text-accent" />
                <p className="font-semibold text-sm sm:text-base">
                  {infoMessage || 'Generating your try-on...'}
                </p>
                {/* text-gray-500 -> text-muted-foreground */}
                <p className="text-xs text-muted-foreground mt-1">
                  This may take a moment, please wait.
                </p>
              </motion.div>
            ) : tryOnResult ? (
              <motion.img
                key="result-image"
                src={tryOnResult} // This will be a full URL from the backend
                alt="Virtual Try-On Result"
                className="w-full h-full object-contain rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'circOut' }}
              />
            ) : (
              <motion.div
                key="placeholder-result"
                // text-gray-400 -> text-muted-foreground/70
                className="flex flex-col items-center text-center text-muted-foreground/70 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ImageIcon className="h-12 w-12 sm:h-16 sm:h-16 mb-4" strokeWidth={1} />
                {/* text-trendzone-dark-blue -> text-card-foreground */}
                <p className="text-sm font-medium text-card-foreground">
                  {errorMessage ? 'Try-on Failed' : 'Your try-on result will appear here'}
                </p>
                {errorMessage && (
                  // text-red-500 -> text-destructive
                  <p className="text-xs text-destructive mt-1">
                    {errorMessage.includes('timed out')
                      ? 'The request took too long. Please try again.'
                      : 'An error occurred.'}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default TryOnPage
