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
  const [isLoading, setIsLoading] = useState(false)
  const [isPolling, setIsPolling] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const pollingAttemptsRef = useRef<number>(0)

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
      pollingAttemptsRef.current = 0
      setIsPolling(false)
      console.log('Polling stopped.')
    }
  }, [])

  const startPolling = useCallback(
    (jobId: string) => {
      stopPolling()
      setCurrentJobId(jobId)
      pollingAttemptsRef.current = 0
      setInfoMessage(`Processing your try-on (Job: ${jobId.substring(0, 6)})...`)
      setErrorMessage(null)
      setTryOnResult(null)
      setIsLoading(true)
      setIsPolling(true)

      pollingIntervalRef.current = setInterval(async () => {
        if (!jobId || !pollingIntervalRef.current) {
          if (pollingIntervalRef.current) stopPolling()
          return
        }
        pollingAttemptsRef.current += 1
        if (pollingAttemptsRef.current > MAX_POLLING_ATTEMPTS) {
          setErrorMessage('Try-on request timed out.')
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
            setErrorMessage(`Try-on failed: ${statusErrorMessage || 'Unknown error'}`)
            setInfoMessage(null)
            stopPolling()
            setIsLoading(false)
          } else if (status === 'check_failed') {
            setErrorMessage(`Status check failed: ${statusErrorMessage || 'Unknown error'}`)
            setInfoMessage(null)
            stopPolling()
            setIsLoading(false)
          } else if (['processing', 'in_queue', 'starting', 'unknown'].includes(status)) {
            setInfoMessage(`Status: ${status}... (Job: ${jobId.substring(0, 6)}...)`)
          } else {
            setInfoMessage(`Status: ${status}... (Job: ${jobId.substring(0, 6)}...)`)
          }
        } catch (pollError: any) {
          setErrorMessage(`Error checking status: ${pollError.message || 'Connection issue'}`)
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
      setIsLoading(true)
      axios
        .get<Product>(`${backendApiUrl}/api/products/${productId}`)
        .then((res) => {
          setProduct(res.data)
        })
        .catch((err) => {
          console.error('Failed to fetch product:', err)
          setErrorMessage('Failed to load product details.')
        })
        .finally(() => setIsLoading(false))
    }
    return stopPolling
  }, [productId, backendApiUrl, stopPolling])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    stopPolling()
    setCurrentJobId(null)
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
    setIsLoading(true)
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
      const res = await axios.post(`${backendApiUrl}/api/tryon`, formData)
      if (res.data && res.data.jobId) {
        startPolling(res.data.jobId)
      } else {
        throw new Error(res.data?.message || 'Failed to start job. No Job ID.')
      }
    } catch (err: any) {
      const backendError =
        err.response?.data?.error || err.response?.data?.details || 'Failed to initiate try-on.'
      setErrorMessage(
        err.response?.status ? `Error ${err.response.status}: ${backendError}` : backendError,
      )
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const currentPreviewUrl = previewImageUrl
    return () => {
      if (currentPreviewUrl) URL.revokeObjectURL(currentPreviewUrl)
    }
  }, [previewImageUrl])

  return (
    <motion.div
      className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-12 sm:py-16 font-inter"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-trendzone-dark-blue mb-10 sm:mb-12 text-center"
        variants={itemVariants}
      >
        Virtual Try-On
      </motion.h2>

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            className="w-full max-w-lg mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 shadow-md"
            role="alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {' '}
            <XCircle size={18} className="flex-shrink-0" /> {errorMessage}{' '}
          </motion.div>
        )}
        {!errorMessage && infoMessage && !tryOnResult && !(isLoading || isPolling) && (
          <motion.div
            className="w-full max-w-lg mb-6 bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg text-sm shadow-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            role="status"
          >
            {' '}
            {infoMessage}{' '}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 w-full max-w-4xl lg:max-w-5xl">
        {/* Left: Upload Section */}
        <motion.div
          className="w-full bg-white text-trendzone-dark-blue p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col items-center"
          variants={cardVariants}
        >
          <UploadCloud
            className="h-12 w-12 sm:h-14 sm:w-14 mb-4 text-trendzone-light-blue"
            strokeWidth={1.5}
          />
          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center">Upload Your Photo</h3>
          <p className="text-sm text-gray-500 mb-6 text-center max-w-xs">
            Choose a clear, front-facing photo to virtually try on this {product?.title || 'outfit'}
            .
          </p>

          <label
            htmlFor="fileUpload"
            className="w-full cursor-pointer bg-trendzone-dark-blue text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-trendzone-light-blue hover:text-trendzone-dark-blue transition-colors duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mb-4"
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
              className="mt-4 mb-5 w-full aspect-[3/4] max-h-[300px] sm:max-h-[350px] overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200"
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
              disabled={isLoading || isPolling} // Disable while general loading OR specifically polling
              className="mt-auto w-full bg-trendzone-light-blue text-trendzone-dark-blue px-6 py-3 rounded-lg font-bold text-sm hover:bg-trendzone-dark-blue hover:text-white transition-colors duration-300 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              whileHover={!(isLoading || isPolling) ? { scale: 1.03 } : {}}
              whileTap={!(isLoading || isPolling) ? { scale: 0.98 } : {}}
            >
              {isLoading || isPolling ? ( // Check both flags for loading text
                <>
                  {' '}
                  <Loader2 className="animate-spin mr-2 w-5 h-5" />{' '}
                  {isPolling && infoMessage ? infoMessage.split('...')[0] : 'Processing...'}{' '}
                </>
              ) : (
                <>
                  <Sparkles size={18} className="mr-2" /> Generate Try-On
                </>
              )}
            </motion.button>
          )}
          {!product &&
            productId &&
            !errorMessage &&
            !isLoading && ( // Show if not loading product details
              <p className="mt-4 text-xs text-gray-500">Product details are loading...</p>
            )}
          {isLoading &&
            !isPolling &&
            !product && ( // Specifically for initial product load
              <div className="mt-4 flex items-center text-xs text-gray-500">
                <Loader2 className="animate-spin mr-2 w-4 h-4" />
                Loading product info...
              </div>
            )}
        </motion.div>

        {/* Right: Try-On Result */}
        <motion.div
          className="w-full bg-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center min-h-[350px] sm:min-h-[450px] md:min-h-full aspect-[3/4]"
          variants={cardVariants}
        >
          <AnimatePresence mode="wait">
            {isPolling || (isLoading && !tryOnResult && !errorMessage) ? ( // Show loading if polling or if general loading is true without a result/error yet
              <motion.div
                key="loading-result"
                className="flex flex-col items-center text-center text-trendzone-dark-blue p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className="animate-spin w-10 h-10 sm:w-12 sm:w-12 mb-4 text-trendzone-light-blue" />
                <p className="font-semibold text-sm sm:text-base">
                  {infoMessage || 'Generating your try-on...'}
                </p>
                <p className="text-xs text-gray-500 mt-1">This may take a moment, please wait.</p>
              </motion.div>
            ) : tryOnResult ? (
              <motion.img
                key="result-image"
                src={tryOnResult}
                alt="Virtual Try-On Result"
                className="w-full h-full object-contain rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'circOut' }}
              />
            ) : (
              <motion.div
                key="placeholder-result"
                className="flex flex-col items-center text-center text-gray-400 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ImageIcon className="h-12 w-12 sm:h-16 sm:h-16 mb-4" strokeWidth={1} />
                <p className="text-sm font-medium text-trendzone-dark-blue">
                  {errorMessage ? 'Try-on Failed' : 'Your try-on result will appear here'}
                </p>
                {errorMessage && (
                  <p className="text-xs text-red-500 mt-1">
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
