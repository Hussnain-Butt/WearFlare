// routes/contactRoutes.js
const express = require('express')
const contactController = require('../controllers/contactController')

const router = express.Router()

// POST /api/contact
router.post('/', contactController.handleContactForm)

module.exports = router
