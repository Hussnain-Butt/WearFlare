const https = require('https')
const fs = require('fs')
const FormData = require('form-data')
const tls = require('tls')
const axios = require('axios')

// Force TLS version
tls.DEFAULT_MIN_VERSION = 'TLSv1.2'

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Keep for now if needed for dev, but try removing later
  secureProtocol: 'TLSv1_2_method', // Explicitly use TLS 1.2 method
})

exports.handleTryOn = async (req, res) => {
  try {
    const userImage = req.file
    const clothingImage = req.body.clothingImage?.trim() // ⬅️ strip any whitespace
    try {
      console.log('Attempting test request to google.com...')
      const testRes = await axios.get('https://google.com', { httpsAgent })
      console.log('Test request successful:', testRes.status)
    } catch (testErr) {
      console.error('Test request failed:', testErr)
      // You might want to return an error here during testing
    }

    console.log('🧾 USER IMAGE:', userImage?.path)
    console.log('🧾 CLOTHING IMAGE:', clothingImage)

    const formData = new FormData()
    formData.append('userImage', fs.createReadStream(userImage.path))
    formData.append('clothingImage', clothingImage)

    const response = await axios.post('https://api.fashnai.com/virtual-tryon', formData, {
      // httpsAgent,
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer fa-1Lp3hA4GxY7N-UbGMCQjjW4BnAHXZbpDEkxT8`,
      },
    })

    return res.json({ outputImageUrl: response.data.outputImageUrl })
  } catch (error) {
    console.error('❌ Try-On Error:', error?.response?.status)
    console.error('❌ Try-On Data:', error?.response?.data)
    console.error('❌ Full Error:', error)
    return res.status(500).json({ error: 'Virtual Try-On failed' })
  }
}
