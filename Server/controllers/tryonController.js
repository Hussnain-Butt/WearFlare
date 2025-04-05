// controllers/tryonController.js
const fs = require('fs')
const FormData = require('form-data')
const axios = require('axios')

exports.handleTryOn = async (req, res) => {
  try {
    const userImage = req.file
    const clothingImage = req.body.clothingImage?.trim() // Get clothing image URL/path

    // --- Input Validation ---
    if (!userImage) {
      console.error('❌ Error: No user image uploaded.')
      return res.status(400).json({ error: 'User image is required.' })
    }
    if (!clothingImage) {
      console.error('❌ Error: No clothing image URL provided.')
      return res.status(400).json({ error: 'Clothing image URL is required.' })
    }

    console.log('🧾 USER IMAGE Path:', userImage.path)
    console.log('🧾 CLOTHING IMAGE URL:', clothingImage)

    // --- Prepare data for Fashnai API ---
    const formData = new FormData()
    // IMPORTANT: Make sure the file stream is correctly created and the file exists
    try {
      formData.append('userImage', fs.createReadStream(userImage.path))
    } catch (streamError) {
      console.error('❌ Error creating read stream for user image:', streamError)
      console.error('❌ Faulty Path:', userImage.path)
      // Clean up uploaded file if stream fails
      if (userImage && userImage.path) {
        fs.unlink(userImage.path, (unlinkErr) => {
          if (unlinkErr) console.error('❌ Error deleting failed upload file:', unlinkErr)
        })
      }
      return res.status(500).json({ error: 'Failed to process uploaded user image.' })
    }
    formData.append('clothingImage', clothingImage) // Send the URL as received

    // --- Call Fashnai API ---
    console.log('⏳ Calling Fashnai API...')
    const response = await axios.post('https://api.fashnai.com/virtual-tryon', formData, {
      // No custom httpsAgent, use Axios/Node defaults
      headers: {
        ...formData.getHeaders(), // Sets Content-Type: multipart/form-data; boundary=...
        // Ensure this API key is correct and active!
        Authorization: `Bearer fa-1Lp3hA4GxY7N-UbGMCQjjW4BnAHXZbpDEkxT8`,
      },
      // Optional: Add a timeout if requests hang
      // timeout: 30000 // 30 seconds
    })

    console.log('✅ Fashnai API Success:', response.status)
    // console.log('✅ Fashnai API Data:', response.data); // Optional: Log success data

    // --- Send response to Frontend ---
    // Ensure the response structure from Fashnai is actually { outputImageUrl: '...' }
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
      // Error during the Axios request (e.g., network error, Fashnai API error)
      console.error('❌ Axios Error Code:', error.code)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('❌ Fashnai API Status:', error.response.status)
        console.error('❌ Fashnai API Data:', error.response.data)
        // Return the status from Fashnai if available, otherwise 500
        return res.status(error.response.status || 500).json({
          error: 'Virtual Try-On service failed.',
          details: error.response.data || 'No details from service.',
        })
      } else if (error.request) {
        // The request was made but no response was received
        console.error('❌ No response received from Fashnai API:', error.request)
        return res.status(502).json({ error: 'No response from Virtual Try-On service.' }) // Bad Gateway might be appropriate
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('❌ Error setting up request to Fashnai:', error.message)
        return res.status(500).json({ error: 'Failed to initiate Virtual Try-On request.' })
      }
    } else {
      // Non-Axios error (e.g., error in fs.createReadStream before the try/catch above, although unlikely now)
      console.error('❌ Non-Axios Error:', error)
      return res
        .status(500)
        .json({ error: 'An unexpected internal error occurred during Virtual Try-On.' })
    }
  } finally {
    // --- Cleanup ---
    // Optional: Clean up the uploaded user image file after processing
    // Be careful: if you need the file later, don't delete it here.
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('❌ Error deleting uploaded file:', req.file.path, err)
        } else {
          // console.log('🧹 Cleaned up uploaded file:', req.file.path);
        }
      })
    }
  }
}
