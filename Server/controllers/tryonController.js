// controllers/tryonController.js
const fs = require('fs')
const axios = require('axios')
const path = require('path')

const FASHNAI_API_TIMEOUT = 60000 // Timeout for POST /run
const FASHNAI_STATUS_TIMEOUT = 10000 // Shorter timeout for GET /status
const MY_BACKEND_BASE_URL =
  process.env.BACKEND_URL || 'https://backend-production-c8ff.up.railway.app'
const FASHNAI_API_KEY = process.env.FASHNAI_API_KEY || 'fa-v0kUsjkkMQHI-Dqpu7R1k9ZmuTWkP6Y6Jbrpt' // Use environment variable

// <<<--- [ EXISTING handleTryOn function remains the same as the previous good version ] --- >>>
// (Woh function jo POST /v1/run call karta hai aur jobId return karta hai)
exports.handleTryOn = async (req, res) => {
  const userImageFile = req.file
  const userImagePath = userImageFile ? userImageFile.path : null

  try {
    const clothingImageURL = req.body.clothingImage?.trim()
    if (!userImageFile) {
      /* ... validation ... */ return res.status(400).json({ error: 'User image is required.' })
    }
    if (!clothingImageURL) {
      /* ... validation ... */ if (userImagePath) fs.unlink(userImagePath, () => {})
      return res.status(400).json({ error: 'Clothing image URL is required.' })
    }

    const userImageFileName = userImageFile.filename
    // Make sure this path segment '/uploads/userImages/' matches your static serving route
    const userImagePublicURL = `${MY_BACKEND_BASE_URL}/uploads/userImages/${userImageFileName}`

    console.log('🧾 USER IMAGE Public URL:', userImagePublicURL)
    console.log('🧾 CLOTHING IMAGE URL:', clothingImageURL)

    const requestData = {
      model_image: userImagePublicURL,
      garment_image: clothingImageURL,
      category: 'auto',
    }

    console.log(`⏳ Calling Fashn.ai API V1 /run (Timeout: ${FASHNAI_API_TIMEOUT / 1000}s)...`)
    console.log('🚀 Sending JSON Data:', JSON.stringify(requestData))

    const response = await axios.post('https://api.fashn.ai/v1/run', requestData, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${FASHNAI_API_KEY}`,
      },
      timeout: FASHNAI_API_TIMEOUT,
    })

    console.log('✅ Fashn.ai API V1 /run Response Status:', response.status)
    console.log('✅ Fashn.ai API V1 /run Response Data:', response.data)

    if (response.data && response.data.id && response.data.error === null) {
      console.log(`✅ Try-on job started successfully with ID: ${response.data.id}`)
      return res.json({
        message: 'Try-on job initiated successfully.', // Keep message concise
        jobId: response.data.id,
      })
    } else if (response.data && response.data.error) {
      console.error('❌ Fashn.ai V1 /run returned an error in response:', response.data.error)
      return res
        .status(400)
        .json({ error: 'Virtual Try-On service reported an error.', details: response.data.error })
    } else {
      console.error('❌ Fashn.ai V1 /run response format unexpected:', response.data)
      return res
        .status(500)
        .json({ error: 'Virtual Try-On service returned unexpected data structure.' })
    }
  } catch (error) {
    // ... [ Existing detailed error handling for axios errors ] ...
    console.error('❌ Try-On process failed (catch block in handleTryOn).')
    if (axios.isAxiosError(error)) {
      /* ... Detailed Axios error handling ... */
    } else {
      /* ... Non-Axios error handling ... */
    }
    // Ensure appropriate error response is sent
    // Example simplified:
    return res.status(500).json({ error: 'Failed to initiate try-on job.', details: error.message })
  } finally {
    if (userImagePath) {
      fs.unlink(userImagePath, (err) => {
        /* ... unlink logic ... */
      })
    }
  }
}

// <<<--- [ NEW function to check status ] --- >>>
exports.checkTryOnStatus = async (req, res) => {
  const { jobId } = req.params // Get jobId from URL parameter

  if (!jobId) {
    return res.status(400).json({ error: 'Job ID is required.' })
  }

  console.log(`⏳ Checking status for Job ID: ${jobId}...`)

  try {
    const response = await axios.get(
      `https://api.fashn.ai/v1/status/${jobId}`, // <-- Correct status endpoint
      {
        headers: {
          // Key needs to be stored securely, preferably environment variable
          Authorization: `Bearer ${FASHNAI_API_KEY}`,
          Accept: 'application/json',
        },
        timeout: FASHNAI_STATUS_TIMEOUT, // Use a shorter timeout for status checks
      },
    )

    console.log(`✅ Fashn.ai API V1 /status/${jobId} Response Status:`, response.status)
    console.log(`✅ Fashn.ai API V1 /status/${jobId} Response Data:`, response.data)

    // Check the response structure based on documentation
    if (response.data && response.data.id === jobId) {
      const status = response.data.status
      const output = response.data.output // This is an array
      const errorDetails = response.data.error

      if (status === 'completed' && output && output.length > 0) {
        // Job completed successfully, return the first image URL
        return res.json({
          status: 'completed',
          outputImageUrl: output[0], // Send the first URL from the array
        })
      } else if (status === 'failed') {
        // Job failed
        console.error(`❌ Job ID ${jobId} failed. Error: ${errorDetails}`)
        return res.json({
          status: 'failed',
          error: errorDetails || 'Processing failed for an unknown reason.',
        })
      } else {
        // Job is still processing, starting, or in queue
        return res.json({
          status: status, // Send the current status (e.g., 'processing')
        })
      }
    } else {
      // Unexpected response structure from Fashn.ai status endpoint
      console.error(`❌ Fashn.ai V1 /status/${jobId} response format unexpected:`, response.data)
      return res
        .status(500)
        .json({ error: 'Received unexpected status data structure from service.' })
    }
  } catch (error) {
    console.error(`❌ Error checking status for Job ID ${jobId}:`, error)
    if (axios.isAxiosError(error)) {
      // Handle specific errors like 404 (Job not found), 429 (Rate limit), etc.
      if (error.response) {
        console.error('❌ Fashn.ai Status API Error Status:', error.response.status)
        console.error('❌ Fashn.ai Status API Error Data:', error.response.data)
        // Return a specific status indicating the check failed
        return res.status(error.response.status === 404 ? 404 : 500).json({
          status: 'check_failed', // Custom status for frontend
          error: `Failed to check job status (API Error ${error.response.status}).`,
          details: error.response.data?.error || error.response.data,
        })
      } else if (error.request) {
        console.error('❌ No response received from Fashn.ai Status API.')
        return res
          .status(502)
          .json({ status: 'check_failed', error: 'No response when checking job status.' })
      } else {
        console.error('❌ Error setting up status check request:', error.message)
        return res
          .status(500)
          .json({ status: 'check_failed', error: 'Could not initiate status check.' })
      }
    } else {
      return res
        .status(500)
        .json({
          status: 'check_failed',
          error: 'An unexpected internal error occurred while checking status.',
        })
    }
  }
}
