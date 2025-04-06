// controllers/tryonController.js
const fs = require('fs')
const FormData = require('form-data')
const axios = require('axios')

// Fashnai API ke liye timeout (milliseconds mein - yeh 60 seconds hai)
const FASHNAI_API_TIMEOUT = 60000

exports.handleTryOn = async (req, res) => {
  const userImagePath = req.file ? req.file.path : null // File path save karein cleanup ke liye

  try {
    const userImage = req.file
    const clothingImage = req.body.clothingImage?.trim() // Clothing image URL

    // --- Input Check ---
    if (!userImage) {
      console.error('❌ Error: User image nahi mili.')
      return res.status(400).json({ error: 'User image zaroori hai.' })
    }
    if (!clothingImage) {
      console.error('❌ Error: Clothing image URL nahi mila.')
      if (userImagePath) fs.unlink(userImagePath, () => {}) // Agar validation fail ho toh file delete kardein
      return res.status(400).json({ error: 'Clothing image URL zaroori hai.' })
    }

    console.log('🧾 USER IMAGE Path:', userImage.path)
    console.log('🧾 CLOTHING IMAGE URL:', clothingImage)

    // --- Fashnai API ke liye Data Tayyar Karein ---
    const formData = new FormData()
    let readStream
    try {
      // File se stream banayein
      readStream = fs.createReadStream(userImage.path)
      formData.append('userImage', readStream)
    } catch (streamError) {
      console.error('❌ Error: User image file read karne mein error:', streamError)
      console.error('❌ Kharab Path:', userImage.path)
      if (userImagePath) fs.unlink(userImagePath, () => {}) // Cleanup
      return res.status(500).json({ error: 'User image process nahi ho saki.' })
    }
    formData.append('clothingImage', clothingImage) // URL bhejein

    // --- Fashnai API Call Karein ---
    console.log(`⏳ Fashnai API ko call ja rahi hai (Timeout: ${FASHNAI_API_TIMEOUT / 1000}s)...`)
    const response = await axios.post(
      'https://api.fashnai.com/virtual-tryon', // Fashnai API endpoint
      formData,
      {
        headers: {
          ...formData.getHeaders(), // Content-Type: multipart/form-data set karega
          // API Key check karein ke yeh sahi aur active hai!
          Authorization: `Bearer fa-v0kUsjkkMQHI-Dqpu7R1k9ZmuTWkP6Y6Jbrpt`,
        },
        timeout: FASHNAI_API_TIMEOUT, // Timeout set karein
      },
    )

    console.log('✅ Fashnai API se response mil gaya:', response.status)

    // --- Frontend ko Jawab Bhejein ---
    // Check karein ke Fashnai se 'outputImageUrl' mila hai
    if (response.data && response.data.outputImageUrl) {
      return res.json({ outputImageUrl: response.data.outputImageUrl })
    } else {
      console.error('❌ Fashnai API response mein outputImageUrl nahi hai:', response.data)
      return res.status(500).json({ error: 'Virtual Try-On service se ajeeb data mila.' })
    }
  } catch (error) {
    // --- Error Handle Karein ---
    console.error('❌ Try-On process fail ho gaya (catch block).')

    if (axios.isAxiosError(error)) {
      console.error('❌ Axios Error Code:', error.code) // Error code log karein (Jaise 'ECONNABORTED' timeout ke liye)

      // Timeout ka error check karein
      if (error.code === 'ECONNABORTED') {
        console.error(
          `❌ Fashnai API request ${FASHNAI_API_TIMEOUT / 1000} seconds ke baad time out ho gayi.`,
        )
        return res
          .status(504)
          .json({ error: 'Virtual Try-On service time out ho gayi. Baad mein try karein.' }) // 504 Gateway Timeout
      }

      if (error.response) {
        // Fashnai ne error status ke saath jawab diya (4xx, 5xx)
        console.error('❌ Fashnai API Status:', error.response.status)
        console.error('❌ Fashnai API Data:', error.response.data)
        return res.status(error.response.status || 500).json({
          error: 'Virtual Try-On service fail ho gayi.',
          details: error.response.data || 'Service se koi details nahi mili.',
        })
      } else if (error.request) {
        // Request bheji gayi, lekin Fashnai se koi jawab nahi aaya (Network issue, Fashnai down, etc.)
        console.error(
          '❌ Fashnai API se koi response nahi mila:',
          error.request ? 'Request object available' : 'Request object missing',
        )
        // Yahan 502 error bhej rahe hain
        return res.status(502).json({ error: 'No response from Virtual Try-On service.' })
      } else {
        // Request set karne mein hi error aa gaya
        console.error('❌ Fashnai request set karne mein error:', error.message)
        return res.status(500).json({ error: 'Virtual Try-On request shuru nahi ho saki.' })
      }
    } else {
      // Koi aur error (Axios ke alawa)
      console.error('❌ Non-Axios Error:', error)
      return res.status(500).json({ error: 'Try-On ke dauran unexpected internal error aaya.' })
    }
  } finally {
    // --- Safai (Cleanup) ---
    // User ki upload ki hui image file delete kardein, chahe success ho ya fail
    if (userImagePath) {
      fs.unlink(userImagePath, (err) => {
        if (err) {
          console.error('❌ Uploaded file delete karne mein error:', userImagePath, err)
        } else {
          // console.log('🧹 Uploaded file delete ho gayi:', userImagePath);
        }
      })
    }
  }
}
