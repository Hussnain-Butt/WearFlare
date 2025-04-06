// controllers/tryonController.js
const fs = require('fs')
const FormData = require('form-data')
const axios = require('axios')

// Timeout for Fashnai API (in milliseconds - this is 60 seconds)
const FASHNAI_API_TIMEOUT = 60000

exports.handleTryOn = async (req, res) => {
  const userImagePath = req.file ? req.file.path : null // Store file path for cleanup

  try {
    const userImage = req.file
    const clothingImage = req.body.clothingImage?.trim() // Clothing image URL

    // --- Input Validation ---
    if (!userImage) {
      console.error('❌ Error: User image not received.')
      return res.status(400).json({ error: 'User image is required.' })
    }
    if (!clothingImage) {
      console.error('❌ Error: Clothing image URL not received.')
      if (userImagePath) fs.unlink(userImagePath, () => {}) // Delete file if validation fails early
      return res.status(400).json({ error: 'Clothing image URL is required.' })
    }

    console.log('🧾 USER IMAGE Path:', userImage.path)
    console.log('🧾 CLOTHING IMAGE URL:', clothingImage)

    // --- Prepare Data for Fashnai API ---
    const formData = new FormData()
    let readStream
    try {
      // Create stream from file
      readStream = fs.createReadStream(userImage.path)
      formData.append('userImage', readStream)
    } catch (streamError) {
      console.error('❌ Error: Error reading user image file:', streamError)
      console.error('❌ Faulty Path:', userImage.path)
      if (userImagePath) fs.unlink(userImagePath, () => {}) // Cleanup
      return res.status(500).json({ error: 'Failed to process user image.' })
    }
    formData.append('clothingImage', clothingImage) // Send the URL

    // --- Call Fashnai API ---
    console.log(`⏳ Calling Fashnai API (Timeout: ${FASHNAI_API_TIMEOUT / 1000}s)...`)
    const response = await axios.post(
      'https://api.fashnai.com/virtual-tryon', // Fashnai API endpoint
      formData,
      {
        headers: {
          ...formData.getHeaders(), // Sets Content-Type: multipart/form-data
          // Ensure this API key is correct and active!
          Authorization: `Bearer fa-v0kUsjkkMQHI-Dqpu7R1k9ZmuTWkP6Y6Jbrpt`,
        },
        timeout: FASHNAI_API_TIMEOUT, // Set timeout
      },
    )

    console.log('✅ Fashnai API response received:', response.status)

    // --- Send Response to Frontend ---
    // Check if Fashnai returned 'outputImageUrl'
    if (response.data && response.data.outputImageUrl) {
      return res.json({ outputImageUrl: response.data.outputImageUrl })
    } else {
      console.error('❌ Fashnai API response missing outputImageUrl:', response.data)
      return res.status(500).json({ error: 'Virtual Try-On service returned unexpected data.' })
    }
  } catch (error) {
    // --- Handle Errors ---
    console.error('❌ Try-On process failed (catch block).')

    if (axios.isAxiosError(error)) {
      console.error('❌ Axios Error Code:', error.code) // Log error code (e.g., 'ECONNABORTED' for timeout)

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
          details: error.response.data || 'No details received from service.',
        })
      } else if (error.request) {
        // Request was made, but no response received (Network issue, Fashnai down, etc.)
        console.error(
          '❌ No response received from Fashnai API:',
          error.request ? 'Request object available' : 'Request object missing',
        )
        // Sending 502 error here
        return res.status(502).json({ error: 'No response from Virtual Try-On service.' })
      } else {
        // Error setting up the request
        console.error('❌ Error setting up request to Fashnai:', error.message)
        return res.status(500).json({ error: 'Failed to initiate Virtual Try-On request.' })
      }
    } else {
      // Any other error (non-Axios)
      console.error('❌ Non-Axios Error:', error)
      return res.status(500).json({ error: 'An unexpected internal error occurred during Try-On.' })
    }
  } finally {
    // --- Cleanup ---
    // Delete the uploaded user image file, whether success or fail
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
