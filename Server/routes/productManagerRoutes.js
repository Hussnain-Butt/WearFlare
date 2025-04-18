// routes/productManagerRoutes.js
const express = require('express')
const { productManagerLogin } = require('../controllers/productManagerController')
const router = express.Router()

router.post('/login', productManagerLogin)

module.exports = router
