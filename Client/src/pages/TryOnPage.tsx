// Pichla version hi theek hai, yahan dobara de raha hoon reference ke liye
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null) // Error message ke liye state

  useEffect(() => {
    // Sahi backend URL use karein
    const backendApiUrl = 'https://backend-production-c8ff.up.railway.app'
    axios
      .get(`${backendApiUrl}/api/products/${productId}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error('Product fetch karne mein fail:', err)
        setErrorMessage('Product details load nahi ho sake.')
      })
  }, [productId])

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedImage(file)
    // Purana preview URL free karein memory bachane ke liye
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl)
    }
    setPreviewImageUrl(URL.createObjectURL(file))
    setShowTryButton(true)
    setTryOnResult(null) // Purana result clear karein
    setErrorMessage(null) // Purana error clear karein
  }

  const handleTryOn = async () => {
    if (!uploadedImage || !product) return
    setIsLoading(true)
    setErrorMessage(null) // Purana error clear karein

    const formData = new FormData()
    formData.append('userImage', uploadedImage)

    // Clothing image URL banayein (double slash na ho)
    const backendUrl = 'https://backend-production-c8ff.up.railway.app' // Backend URL define karein
    let imagePath = product.image
    let clothingImageUrl = imagePath.startsWith('/')
      ? `${backendUrl}${imagePath}`
      : `${backendUrl}/${imagePath}`

    formData.append('clothingImage', clothingImageUrl)

    try {
      const res = await axios.post(
        `${backendUrl}/api/tryon`, // Defined backend URL use karein
        formData,
        {
          // Content-Type browser FormData ke liye khud set kar deta hai
        },
      )
      setTryOnResult(res.data.outputImageUrl)
    } catch (err) {
      console.error('Try-on fail ho gaya:', err)
      // Backend se specific error message lene ki koshish karein
      const backendError =
        err.response?.data?.error ||
        err.response?.data?.details ||
        'Try-on request fail ho gayi. Console check karein ya baad mein try karein.'
      const status = err.response?.status // Status code lein agar available hai

      // Specific errors ke liye message customize karein
      let displayError = backendError
      if (status === 504) {
        displayError =
          'Virtual try-on service ne jawab dene mein bahut time lagaya. Kuch der baad try karein.'
      } else if (status === 502) {
        displayError =
          'Virtual try-on service se connect nahi ho pa raha. Shayad woh abhi band hai.'
      }

      setErrorMessage(`Error: ${displayError}`)
      setTryOnResult(null) // Error par result clear karein
    } finally {
      setIsLoading(false)
      // Decide karein ke button hide karna hai ya nahi
      // setShowTryButton(false);
    }
  }

  // Component unmount hone par preview URL cleanup karein
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

      {/* Error Message Dikhayein */}
      {errorMessage && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 max-w-md w-full"
          role="alert"
        >
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Upload Section */}
        <div className="w-[400px] bg-[#6b5745] text-[#c8a98a] p-6 rounded-xl shadow-md flex flex-col items-center">
          <Upload className="h-12 w-12 mb-4" />
          <p className="mb-4 text-center">Outfit try karne ke liye apni photo upload karein</p>

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
            Image Chunein
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
                  <Loader2 className="animate-spin mr-2 w-4 h-4" /> Generate ho raha hai...
                </>
              ) : (
                'Try-On Generate Karein'
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
              <p>Aapka try-on generate ho raha hai...</p>
              <p className="text-sm text-gray-500">(Ismein ek minute tak lag sakta hai)</p>
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
              {errorMessage ? 'Generate nahi ho saka.' : 'Aapka try-on preview yahan dikhega'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TryOnPage
