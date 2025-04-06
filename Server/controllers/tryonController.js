// controllers/tryonController.js
const fs = require('fs')
// FormData is no longer needed for this request type
// const FormData = require('form-data');
const axios = require('axios')
const path = require('path') // Path module might be needed depending on path construction

// Timeout for Fashn.ai API (in milliseconds - this is 60 seconds)
const FASHNAI_API_TIMEOUT = 60000
// Your public backend URL (Better to keep this in environment variables)
const MY_BACKEND_BASE_URL =
  process.env.BACKEND_URL || 'https://backend-production-c8ff.up.railway.app' // Use environment variable or fallback

exports.handleTryOn = async (req, res) => {
  const userImageFile = req.file // The uploaded file object from Multer
  const userImagePath = userImageFile ? userImageFile.path : null // Store file path for cleanup

  try {
    const clothingImageURL = req.body.clothingImage?.trim() // Clothing image URL from frontend

    // --- Input Validation ---
    if (!userImageFile) {
      console.error('❌ Error: User image file not received.')
      return res.status(400).json({ error: 'User image is required.' })
    }
    if (!clothingImageURL) {
      console.error('❌ Error: Clothing image URL not received.')
      if (userImagePath) fs.unlink(userImagePath, () => {}) // Cleanup if validation fails
      return res.status(400).json({ error: 'Clothing image URL is required.' })
    }

    // --- Construct Public URL for User Image ---
    // Use the filename provided by Multer
    const userImageFileName = userImageFile.filename
    // IMPORTANT: Ensure this path segment matches your static file serving route and Multer's destination
    // Check your server.js/app.js: app.use('/uploads', express.static(...))
    // Check your Multer config: destination: 'uploads/userImages/'
    // The final URL needs to be accessible publicly by Fashn.ai
    const userImagePublicURL = `${MY_BACKEND_BASE_URL}/uploads/userImages/${userImageFileName}` // Adjust '/userImages/' if needed

    console.log('🧾 USER IMAGE Public URL:', userImagePublicURL)
    console.log('🧾 CLOTHING IMAGE URL:', clothingImageURL)

    // --- Prepare JSON Data for Fashn.ai API ---
    // Defaulting category to 'auto' as per documentation preference
    const requestData = {
      model_image: userImagePublicURL, // Send the public URL
      garment_image: clothingImageURL, // Send the clothing URL
      category: 'auto', // Use 'auto' or get from product data if available
      // Add other optional parameters from docs if needed, e.g.:
      // moderation_level: 'permissive',
      // cover_feet: false,
    }

    // --- Call Fashn.ai API (New Endpoint and JSON Format) ---
    console.log(`⏳ Calling Fashn.ai API V1 (Timeout: ${FASHNAI_API_TIMEOUT / 1000}s)...`)
    console.log('🚀 Sending JSON Data:', JSON.stringify(requestData)) // Log the data being sent

    const response = await axios.post(
      'https://api.fashn.ai/v1/run', // <-- CORRECT API ENDPOINT
      requestData, // <-- Send JSON data
      {
        headers: {
          // Set headers for JSON
          'Content-Type': 'application/json',
          Accept: 'application/json', // Good practice to add Accept header
          // Ensure your API key is correct and active!
          Authorization: `Bearer fa-v0kUsjkkMQHI-Dqpu7R1k9ZmuTWkP6Y6Jbrpt`, // <-- Your API Key
        },
        timeout: FASHNAI_API_TIMEOUT, // Set timeout
      },
    )

    // --- Process Fashn.ai Response ---
    console.log('✅ Fashn.ai API V1 Response Status:', response.status)
    console.log('✅ Fashn.ai API V1 Response Data:', response.data) // <-- See what you get back

    // --- Send Response to Frontend ---
    // Based on your curl test, the response is { id: "...", error: null } on success.
    // The frontend needs to know the job started, but won't get the image URL immediately.
    if (response.data && response.data.id && response.data.error === null) {
      // Job started successfully, return the ID and a message
      console.log(`✅ Try-on job started successfully with ID: ${response.data.id}`)
      // The frontend currently expects 'outputImageUrl'. We can't provide it yet.
      // Send a success message and the job ID. Frontend needs adjustment.
      return res.json({
        message: 'Try-on job initiated successfully. Result will be available later.',
        jobId: response.data.id,
        // outputImageUrl: null // Explicitly set to null if frontend checks for it
      })
    } else if (response.data && response.data.error) {
      // Fashn.ai returned an error in the response body
      console.error('❌ Fashn.ai V1 returned an error in response:', response.data.error)
      return res.status(400).json({
        // Use 400 or appropriate status based on error type
        error: 'Virtual Try-On service reported an error.',
        details: response.data.error,
      })
    } else {
      // Unexpected response format from Fashn.ai
      console.error('❌ Fashn.ai V1 response format unexpected:', response.data)
      return res
        .status(500)
        .json({ error: 'Virtual Try-On service returned unexpected data structure.' })
    }
  } catch (error) {
    // --- Handle Errors (Connection, Timeout, etc.) ---
    console.error('❌ Try-On process failed (catch block).')
    if (axios.isAxiosError(error)) {
      console.error('❌ Axios Error Code:', error.code)
      if (error.code === 'ECONNABORTED') {
        console.error(
          `❌ Fashn.ai API request timed out after ${FASHNAI_API_TIMEOUT / 1000} seconds.`,
        )
        return res
          .status(504)
          .json({ error: 'Virtual Try-On service timed out. Please try again later.' })
      }
      if (error.response) {
        // The request was made and the server responded with a status code != 2xx
        console.error('❌ Fashn.ai API Status:', error.response.status)
        console.error('❌ Fashn.ai API Data:', error.response.data)
        // Try to forward Fashn.ai's error details if possible
        const fashnError = error.response.data?.error || error.response.data
        return res.status(error.response.status || 500).json({
          error: 'Virtual Try-On service request failed.',
          details: fashnError || 'No specific details from service.',
        })
      } else if (error.request) {
        // The request was made but no response was received
        console.error('❌ No response received from Fashn.ai API:', error.message)
        return res
          .status(502)
          .json({ error: 'No response from Virtual Try-On service (Bad Gateway).' })
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('❌ Error setting up request to Fashn.ai:', error.message)
        return res.status(500).json({ error: 'Failed to initiate Virtual Try-On request.' })
      }
    } else {
      // Non-Axios error
      console.error('❌ Non-Axios Error:', error)
      return res.status(500).json({ error: 'An unexpected internal error occurred during Try-On.' })
    }
  } finally {
    // --- Cleanup ---
    // Delete the locally uploaded user image file after processing
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
