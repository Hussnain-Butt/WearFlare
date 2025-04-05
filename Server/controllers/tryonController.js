// controllers/tryonController.js
const fs = require('fs')
const FormData = require('form-data')
const axios = require('axios')

// Define timeout duration in milliseconds (e.g., 60 seconds)
const FASHNAI_API_TIMEOUT = 60000

exports.handleTryOn = async (req, res) => {
  const userImagePath = req.file ? req.file.path : null // Store path for cleanup

  try {
    const userImage = req.file
    const clothingImage = req.body.clothingImage?.trim()

    // --- Input Validation ---
    if (!userImage) {
      console.error('❌ Error: No user image uploaded.')
      return res.status(400).json({ error: 'User image is required.' })
    }
    if (!clothingImage) {
      console.error('❌ Error: No clothing image URL provided.')
      // Clean up uploaded file if validation fails early
      if (userImagePath) fs.unlink(userImagePath, () => {})
      return res.status(400).json({ error: 'Clothing image URL is required.' })
    }

    console.log('🧾 USER IMAGE Path:', userImage.path)
    console.log('🧾 CLOTHING IMAGE URL:', clothingImage)

    // --- Prepare data for Fashnai API ---
    const formData = new FormData()
    let readStream
    try {
      readStream = fs.createReadStream(userImage.path)
      formData.append('userImage', readStream)
    } catch (streamError) {
      console.error('❌ Error creating read stream for user image:', streamError)
      console.error('❌ Faulty Path:', userImage.path)
      if (userImagePath) fs.unlink(userImagePath, () => {}) // Cleanup
      return res.status(500).json({ error: 'Failed to process uploaded user image.' })
    }
    formData.append('clothingImage', clothingImage)

    // --- Call Fashnai API ---
    console.log(`⏳ Calling Fashnai API (Timeout: ${FASHNAI_API_TIMEOUT / 1000}s)...`)
    const response = await axios.post('https://api.fashnai.com/virtual-tryon', formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer fa-1Lp3hA4GxY7N-UbGMCQjjW4BnAHXZbpDEkxT8`, // Ensure this key is valid!
      },
      timeout: FASHNAI_API_TIMEOUT, // Set timeout
    })

    console.log('✅ Fashnai API Success:', response.status)

    // --- Send response to Frontend ---
    if (response.data && response.data.outputImageUrl) {
      return res.json({ outputImageUrl: response.data.outputImageUrl })
    } else {
      console.error('❌ Fashnai API response missing outputImageUrl:', response.data)
      return res.status(500).json({ error: 'Virtual Try-On service returned unexpected data.' })
    }
  } catch (error) {
    // --- Handle Errors ---
    console.error('❌ Try-On failed in catch block.')

    if (axios.isAxiosError(error)) {
      console.error('❌ Axios Error Code:', error.code) // Log code (e.g., 'ECONNABORTED' for timeout)

      // Check for timeout specifically
      if (error.code === 'ECONNABORTED') {
        console.error(
          `❌ Fashnai API request timed out after ${FASHNAI_API_TIMEOUT / 1000} seconds.`,
        )
        return res
          .status(504)
          .json({ error: 'Virtual Try-On service timed out. Please try again later.' }) // 504 Gateway Timeout
      }

      if (error.response) {
        // Fashnai responded with an error status (4xx, 5xx)
        console.error('❌ Fashnai API Status:', error.response.status)
        console.error('❌ Fashnai API Data:', error.response.data)
        return res.status(error.response.status || 500).json({
          error: 'Virtual Try-On service failed.',
          details: error.response.data || 'No details from service.',
        })
      } else if (error.request) {
        // Request made, but no response (could be network issue, DNS, Fashnai down)
        console.error('❌ No response received from Fashnai API:', error.request)
        // This still leads to the 502 error
        return res.status(502).json({ error: 'No response from Virtual Try-On service.' })
      } else {
        // Error setting up the request
        console.error('❌ Error setting up request to Fashnai:', error.message)
        return res.status(500).json({ error: 'Failed to initiate Virtual Try-On request.' })
      }
    } else {
      // Non-Axios error
      console.error('❌ Non-Axios Error:', error)
      return res
        .status(500)
        .json({ error: 'An unexpected internal error occurred during Virtual Try-On.' })
    }
  } finally {
    // --- Cleanup ---
    // Ensure file is deleted even if API call fails
    if (userImagePath) {
      fs.unlink(userImagePath, (err) => {
        if (err) {
          console.error('❌ Error deleting uploaded file:', userImagePath, err)
        } else {
          // console.log('🧹 Cleaned up uploaded file:', userImagePath);
        }
      })
    }
  }
}
