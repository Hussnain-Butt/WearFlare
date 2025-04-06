// controllers/tryonController.js
const fs = require('fs')
const axios = require('axios')
const path = require('path') // Keep path required if used

console.log('--- Loading tryonController.js ---') // Log: Controller loaded

// Timeout for Fashn.ai API (in milliseconds - this is 60 seconds)
const FASHNAI_API_TIMEOUT = 60000
const FASHNAI_STATUS_TIMEOUT = 15000 // Increased status timeout slightly
// Your public backend URL (Use environment variable)
const MY_BACKEND_BASE_URL =
  process.env.BACKEND_URL || 'https://backend-production-c8ff.up.railway.app'
// Fashn.ai API Key (Use environment variable)
const FASHNAI_API_KEY = process.env.FASHNAI_API_KEY || 'fa-v0kUsjkkMQHI-Dqpu7R1k9ZmuTWkP6Y6Jbrpt'

if (!FASHNAI_API_KEY || FASHNAI_API_KEY === 'YOUR_API_KEY_HERE' || FASHNAI_API_KEY.length < 10) {
  console.warn('⚠️ WARNING: FASHNAI_API_KEY environment variable seems missing or invalid!')
}

// <<<--- Function to initiate the job --- >>>
exports.handleTryOn = async (req, res) => {
  console.log('--- ENTERED handleTryOn controller ---') // Log: Function entered
  const userImageFile = req.file
  const userImagePath = userImageFile ? userImageFile.path : null

  // Ensure Fashn.ai API key is somewhat valid before proceeding
  if (!FASHNAI_API_KEY || FASHNAI_API_KEY.length < 10) {
    console.error('❌ ERROR: Fashn.ai API Key is missing or invalid in environment variables.')
    // Don't try to delete file if it wasn't uploaded
    // if (userImagePath) fs.unlink(userImagePath, ()=>{});
    return res.status(500).json({ error: 'Server configuration error: Missing API Key.' })
  }

  try {
    const clothingImageURL = req.body.clothingImage?.trim()

    // --- Input Validation ---
    if (!userImageFile) {
      console.error('❌ Error: User image file object not found in request after Multer.')
      // No need to check userImagePath here as file object is missing
      return res.status(400).json({ error: 'User image file upload failed or missing.' })
    }
    if (!clothingImageURL) {
      console.error('❌ Error: Clothing image URL not received in request body.')
      if (userImagePath)
        fs.unlink(userImagePath, () => {
          console.log(`Deleted ${userImagePath} due to missing clothing URL.`)
        })
      return res.status(400).json({ error: 'Clothing image URL is required.' })
    }
    console.log('--- Input validation passed ---') // Log: Validation passed

    // --- Construct Public URL for User Image ---
    const userImageFileName = userImageFile.filename
    if (!userImageFileName) {
      console.error('❌ Error: Multer did not provide a filename for the uploaded user image.')
      if (userImagePath)
        fs.unlink(userImagePath, () => {
          console.log(`Deleted ${userImagePath} due to missing filename.`)
        })
      return res.status(500).json({ error: 'Failed to get filename for uploaded image.' })
    }
    const userImagePublicURL = `${MY_BACKEND_BASE_URL}/uploads/userImages/${userImageFileName}`

    console.log('🧾 USER IMAGE Public URL:', userImagePublicURL)
    console.log('🧾 CLOTHING IMAGE URL:', clothingImageURL)

    // --- Prepare JSON Data ---
    const requestData = {
      model_image: userImagePublicURL,
      garment_image: clothingImageURL,
      category: 'auto', // Or derive from product if needed
    }

    // --- Call Fashn.ai API ---
    console.log(`⏳ Calling Fashn.ai API V1 /run (Timeout: ${FASHNAI_API_TIMEOUT / 1000}s)...`)
    // console.log('🚀 Sending JSON Data:', JSON.stringify(requestData)); // Avoid logging potentially large URLs unless debugging

    const response = await axios.post(
      /* ... same axios call as before ... */
      'https://api.fashn.ai/v1/run',
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${FASHNAI_API_KEY}`,
        },
        timeout: FASHNAI_API_TIMEOUT,
      },
    )

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
    // --- Handle Errors ---
    console.error('--- ERROR caught in handleTryOn ---') // Log: Error caught
    // Log the specific error before detailed handling
    console.error(error)

    if (axios.isAxiosError(error)) {
      console.error('❌ Axios Error Code:', error.code)
      if (error.code === 'ECONNABORTED') {
        /* ... Timeout handling ... */ return res
          .status(504)
          .json({ error: 'Virtual Try-On service timed out.' })
      }
      if (error.response) {
        /* ... API error handling ... */ console.error(
          '❌ Fashn.ai API Status:',
          error.response.status,
        )
        console.error('❌ Fashn.ai API Data:', error.response.data)
        const fashnError = error.response.data?.error || error.response.data
        return res
          .status(error.response.status || 500)
          .json({
            error: 'Virtual Try-On service request failed.',
            details: fashnError || 'No details.',
          })
      }
      if (error.request) {
        /* ... No response handling ... */ console.error(
          '❌ No response from Fashn.ai API:',
          error.message,
        )
        return res.status(502).json({ error: 'No response from Virtual Try-On service.' })
      } else {
        /* ... Request setup error handling ... */ console.error(
          '❌ Error setting up request:',
          error.message,
        )
        return res.status(500).json({ error: 'Failed to initiate request.' })
      }
    } else {
      // Non-Axios error
      console.error('❌ Non-Axios Error in handleTryOn:', error)
      return res
        .status(500)
        .json({ error: 'An unexpected internal error occurred.', details: error.message })
    }
  } finally {
    // --- Cleanup ---
    // Only attempt delete if userImagePath was set (meaning upload likely started)
    if (userImagePath) {
      // Check if file still exists before unlinking
      fs.access(userImagePath, fs.constants.F_OK, (errAccess) => {
        if (!errAccess) {
          fs.unlink(userImagePath, (errUnlink) => {
            if (errUnlink) {
              console.error('❌ Error deleting uploaded file:', userImagePath, errUnlink)
            } else {
              console.log('🧹 Cleaned up uploaded file:', userImagePath)
            }
          })
        } else {
          console.log(`🧹 File already gone or inaccessible, no need to delete: ${userImagePath}`)
        }
      })
    } else {
      console.log('🧹 No user image path recorded, skipping cleanup.')
    }
  }
}

// <<<--- Function to check the status --- >>>
exports.checkTryOnStatus = async (req, res) => {
  console.log('--- ENTERED checkTryOnStatus controller ---') // Log: Status check entered
  const { jobId } = req.params

  if (!jobId) {
    console.log('❌ Missing jobId in status check request.')
    return res.status(400).json({ error: 'Job ID is required.' })
  }
  // Ensure Fashn.ai API key is somewhat valid before proceeding
  if (!FASHNAI_API_KEY || FASHNAI_API_KEY.length < 10) {
    console.error('❌ ERROR: Fashn.ai API Key is missing or invalid in environment variables.')
    return res
      .status(500)
      .json({ status: 'check_failed', error: 'Server configuration error: Missing API Key.' })
  }

  console.log(`⏳ Checking status for Job ID: ${jobId}...`)

  try {
    const response = await axios.get(
      /* ... same status check axios call ... */
      `https://api.fashn.ai/v1/status/${jobId}`,
      {
        headers: {
          Authorization: `Bearer ${FASHNAI_API_KEY}`,
          Accept: 'application/json',
        },
        timeout: FASHNAI_STATUS_TIMEOUT,
      },
    )

    console.log(`✅ Fashn.ai API V1 /status/${jobId} Response Status:`, response.status)
    // console.log(`✅ Fashn.ai API V1 /status/${jobId} Response Data:`, response.data); // Log data only if needed

    // --- Process Status Response ---
    if (response.data && response.data.id === jobId) {
      /* ... Same logic as before to return status/output/error ... */
      const status = response.data.status
      const output = response.data.output
      const errorDetails = response.data.error

      if (status === 'completed' && output && output.length > 0) {
        return res.json({ status: 'completed', outputImageUrl: output[0] })
      } else if (status === 'failed') {
        console.error(`❌ Job ID ${jobId} failed. Error: ${errorDetails}`)
        return res.json({ status: 'failed', error: errorDetails || 'Processing failed.' })
      } else {
        return res.json({ status: status }) // processing, starting, in_queue
      }
    } else {
      console.error(`❌ Fashn.ai V1 /status/${jobId} response format unexpected:`, response.data)
      return res
        .status(500)
        .json({ status: 'check_failed', error: 'Unexpected status data structure.' })
    }
  } catch (error) {
    console.error(`--- ERROR caught in checkTryOnStatus for Job ID ${jobId} ---`) // Log: Status check error
    // console.error(error); // Log full error object if needed for details

    if (axios.isAxiosError(error)) {
      if (error.response) {
        /* ... Status check API error handling ... */ console.error(
          '❌ Status API Status:',
          error.response.status,
        )
        console.error('❌ Status API Data:', error.response.data)
        return res
          .status(error.response.status === 404 ? 404 : 500)
          .json({
            status: 'check_failed',
            error: `Status check failed (API Error ${error.response.status}).`,
            details: error.response.data?.error || error.response.data,
          })
      }
      if (error.request) {
        /* ... No response handling ... */ console.error('❌ No response from Status API.')
        return res
          .status(502)
          .json({ status: 'check_failed', error: 'No response checking status.' })
      } else {
        /* ... Request setup error handling ... */ console.error(
          '❌ Error setting up status check:',
          error.message,
        )
        return res
          .status(500)
          .json({ status: 'check_failed', error: 'Could not initiate status check.' })
      }
    } else {
      console.error('❌ Non-Axios Error in checkTryOnStatus:', error)
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

console.log('--- tryonController.js loaded successfully ---') // Log: Controller loaded end
