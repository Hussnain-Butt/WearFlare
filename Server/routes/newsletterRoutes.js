// routes/newsletterRoutes.js
const express = require('express')
const newsletterController = require('../controllers/newsletterController')

const router = express.Router()

// POST /api/newsletter/subscribe
router.post('/subscribe', newsletterController.subscribeNewsletter)

module.exports = router
