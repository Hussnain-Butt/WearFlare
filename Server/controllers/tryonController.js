// controllers/tryonController.js
const fs = require('fs')
const axios = require('axios')
const path = require('path')
const util = require('util') // For better error object inspection if needed

console.log('--- Loading tryonController.js ---')

// --- Configuration ---
const FASHNAI_API_TIMEOUT = 60000 // Timeout for POST /run (60 seconds)
const FASHNAI_STATUS_TIMEOUT = 15000 // Timeout for GET /status (15 seconds)
const MY_BACKEND_BASE_URL =
  process.env.BACKEND_URL || 'https://backend-production-c8ff.up.railway.app'
const FASHNAI_API_KEY = process.env.FASHNAI_API_KEY || 'fa-v0kUsjkkMQHI-Dqpu7R1k9ZmuTWkP6Y6Jbrpt' // Default for testing ONLY if env var not set

// --- Helper: Check API Key on startup/load ---
if (!FASHNAI_API_KEY || FASHNAI_API_KEY === 'YOUR_API_KEY_HERE' || FASHNAI_API_KEY.length < 10) {
  console.warn(
    '⚠️ WARNING: FASHNAI_API_KEY environment variable seems missing or invalid! API calls will likely fail.',
  )
}

// --- Function to initiate the try-on job ---
exports.handleTryOn = async (req, res) => {
  console.log('--- ENTERED handleTryOn controller ---')
  const userImageFile = req.file // File object from Multer
  const userImagePath = userImageFile ? userImageFile.path : null // Path for potential cleanup

  // --- Pre-check: API Key ---
  if (!FASHNAI_API_KEY || FASHNAI_API_KEY.length < 10) {
    console.error('❌ ERROR: Cannot proceed, Fashn.ai API Key is missing or invalid.')
    return res.status(500).json({ error: 'Server configuration error: Missing API Key.' })
  }

  try {
    const clothingImageURL = req.body.clothingImage?.trim()

    // --- Input Validation ---
    if (!userImageFile) {
      // This should ideally be caught by Multer check in router if file is mandatory
      console.error('❌ Error: User image file object not found in request.')
      return res.status(400).json({ error: 'User image file upload failed or missing.' })
    }
    if (!clothingImageURL) {
      console.error('❌ Error: Clothing image URL not received in request body.')
      // Cleanup uploaded file if validation fails after upload
      if (userImagePath)
        fs.unlink(userImagePath, () => {
          console.log(`Deleted ${userImagePath} due to missing clothing URL.`)
        })
      return res.status(400).json({ error: 'Clothing image URL is required.' })
    }
    console.log('--- Input validation passed ---')

    // --- Construct Public URL for User Image ---
    const userImageFileName = userImageFile.filename
    if (!userImageFileName) {
      // Should not happen if Multer succeeded, but good to check
      console.error('❌ Error: Multer did not provide a filename.')
      if (userImagePath)
        fs.unlink(userImagePath, () => {
          console.log(`Deleted ${userImagePath} due to missing filename.`)
        })
      return res.status(500).json({ error: 'Failed to get filename for uploaded image.' })
    }
    // Ensure the base URL has no trailing slash and the path has a leading slash
    const userImagePublicURL = `${MY_BACKEND_BASE_URL.replace(
      /\/$/,
      '',
    )}/uploads/userImages/${userImageFileName}`

    console.log('🧾 USER IMAGE Public URL:', userImagePublicURL)
    console.log('🧾 CLOTHING IMAGE URL:', clothingImageURL)

    // --- Prepare JSON Data for Fashn.ai ---
    const requestData = {
      model_image: userImagePublicURL,
      garment_image: clothingImageURL,
      category: 'auto', // Or derive from product data
    }

    // --- Call Fashn.ai API ---
    console.log(`⏳ Calling Fashn.ai API V1 /run (Timeout: ${FASHNAI_API_TIMEOUT / 1000}s)...`)
    // console.log('🚀 Sending JSON Data:', JSON.stringify(requestData)); // Optional: Log data for debugging

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

    // --- Process Response ---
    if (response.data && response.data.id && response.data.error === null) {
      console.log(`✅ Try-on job started successfully with ID: ${response.data.id}`)
      return res.json({
        message: 'Try-on job initiated successfully.',
        jobId: response.data.id,
      })
    } else if (response.data && response.data.error) {
      console.error('❌ Fashn.ai V1 /run returned an error in response:', response.data.error)
      // Try to extract a meaningful message from the error object
      const errorMessage = response.data.error.message || JSON.stringify(response.data.error)
      return res
        .status(400)
        .json({ error: 'Virtual Try-On service reported an error.', details: errorMessage })
    } else {
      console.error('❌ Fashn.ai V1 /run response format unexpected:', response.data)
      return res
        .status(500)
        .json({ error: 'Virtual Try-On service returned unexpected data structure.' })
    }
  } catch (error) {
    // --- Handle Errors ---
    console.error('--- ERROR caught in handleTryOn ---')
    // console.error(util.inspect(error, {depth: 5})); // Log detailed error object if needed

    if (axios.isAxiosError(error)) {
      console.error('Axios Error Details:', {
        code: error.code,
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
      })
      if (error.response) {
        console.error('API Response Error Status:', error.response.status)
        console.error('API Response Error Data:', error.response.data)
        const apiError =
          error.response.data?.error ||
          error.response.data?.message ||
          error.response.data ||
          'Unknown API error'
        return res
          .status(error.response.status || 500)
          .json({ error: 'Request to Try-On service failed.', details: apiError })
      } else if (error.request) {
        console.error('API No Response Error:', error.message)
        return res.status(502).json({ error: 'No response from Try-On service (Bad Gateway).' })
      } else {
        console.error('Axios Request Setup Error:', error.message)
        return res.status(500).json({ error: 'Failed to setup request to Try-On service.' })
      }
    } else {
      // Non-Axios error
      console.error('Non-Axios Error in handleTryOn:', error)
      return res
        .status(500)
        .json({ error: 'An unexpected internal error occurred.', details: error.message })
    }
  } finally {
    // --- Cleanup ---
    // File cleanup is temporarily disabled for debugging ImageLoadError
    console.log('--- Exiting handleTryOn controller (File cleanup temporarily disabled) ---')
    /*
    if (userImagePath) {
        fs.access(userImagePath, fs.constants.F_OK, (errAccess) => {
            if (!errAccess) {
                 fs.unlink(userImagePath, (errUnlink) => {
                    if (errUnlink) { console.error('❌ Error deleting uploaded file:', userImagePath, errUnlink); }
                    else { console.log('🧹 Cleaned up uploaded file:', userImagePath); }
                });
            } else { console.log(`🧹 File ${userImagePath} not found or inaccessible, skipping delete.`); }
        });
    } else { console.log("🧹 No user image path, skipping cleanup."); }
    */
  }
}

// <<<--- Function to check the status --- >>>
exports.checkTryOnStatus = async (req, res) => {
  console.log('--- ENTERED checkTryOnStatus controller ---')
  const { jobId } = req.params

  // --- Pre-checks ---
  if (!jobId) {
    console.log('❌ Missing jobId in status check request.')
    return res.status(400).json({ error: 'Job ID is required.' })
  }
  if (!FASHNAI_API_KEY || FASHNAI_API_KEY.length < 10) {
    console.error('❌ ERROR: Cannot check status, Fashn.ai API Key is missing or invalid.')
    return res
      .status(500)
      .json({ status: 'check_failed', error: 'Server configuration error: Missing API Key.' })
  }

  console.log(`⏳ Checking status for Job ID: ${jobId}...`)

  try {
    const response = await axios.get(`https://api.fashn.ai/v1/status/${jobId}`, {
      headers: {
        Authorization: `Bearer ${FASHNAI_API_KEY}`,
        Accept: 'application/json',
      },
      timeout: FASHNAI_STATUS_TIMEOUT,
    })

    console.log(`✅ Fashn.ai API V1 /status/${jobId} Response Status:`, response.status)
    // console.log(`✅ Fashn.ai API V1 /status/${jobId} Response Data:`, response.data);

    // --- Process Status Response ---
    if (response.data && response.data.id === jobId) {
      const status = response.data.status
      const output = response.data.output
      const errorDetails = response.data.error // Expecting { name, message } or null

      if (status === 'completed' && output && output.length > 0) {
        console.log(`✅ Job ${jobId} completed successfully.`)
        return res.json({ status: 'completed', outputImageUrl: output[0] }) // Send first image URL
      } else if (status === 'failed') {
        // <<<--- CORRECTED ERROR HANDLING --- >>>
        const errorMessage =
          errorDetails?.message ||
          JSON.stringify(errorDetails) ||
          'Processing failed for an unknown reason.'
        console.error(
          `❌ Job ID ${jobId} failed. API Error Name: ${errorDetails?.name}, Message: ${errorMessage}`,
        )
        return res.json({
          status: 'failed',
          error: errorMessage, // Send the error message string
        })
        // <<<--- END OF CORRECTION --- >>>
      } else if (['processing', 'in_queue', 'starting'].includes(status)) {
        // Job is still in progress
        console.log(`⏳ Job ${jobId} status is: ${status}`)
        return res.json({ status: status })
      } else {
        // Unknown status from Fashn.ai
        console.warn(`⚠️ Job ${jobId} has unknown status: ${status}`)
        return res.json({ status: status || 'unknown' })
      }
    } else {
      console.error(
        `❌ Fashn.ai V1 /status/${jobId} response format unexpected or ID mismatch:`,
        response.data,
      )
      return res
        .status(500)
        .json({ status: 'check_failed', error: 'Unexpected status data structure from service.' })
    }
  } catch (error) {
    console.error(`--- ERROR caught in checkTryOnStatus for Job ID ${jobId} ---`)
    // console.error(util.inspect(error, {depth: 5})); // Detailed logging if needed

    if (axios.isAxiosError(error)) {
      console.error('Axios Error Details:', {
        code: error.code,
        message: error.message,
        url: error.config?.url,
      })
      if (error.response) {
        console.error('Status API Response Error Status:', error.response.status)
        console.error('Status API Response Error Data:', error.response.data)
        const apiError =
          error.response.data?.error ||
          error.response.data?.message ||
          error.response.data ||
          'Unknown API error'
        // Don't treat 404 as a server error necessarily, job might just not exist (or finished long ago)
        const clientErrorStatus = [400, 401, 403, 404, 429].includes(error.response.status)
          ? error.response.status
          : 500
        return res
          .status(clientErrorStatus)
          .json({
            status: 'check_failed',
            error: `Status check failed (API Error ${error.response.status}).`,
            details: apiError,
          })
      } else if (error.request) {
        console.error('Status API No Response Error:', error.message)
        return res
          .status(502)
          .json({ status: 'check_failed', error: 'No response when checking job status.' })
      } else {
        console.error('Axios Request Setup Error:', error.message)
        return res
          .status(500)
          .json({ status: 'check_failed', error: 'Could not initiate status check.' })
      }
    } else {
      console.error('Non-Axios Error in checkTryOnStatus:', error)
      return res
        .status(500)
        .json({
          status: 'check_failed',
          error: 'Internal error checking status.',
          details: error.message,
        })
    }
  }
}

console.log('--- tryonController.js loaded successfully ---')
