const express = require('express')
const router = express.Router()
const { createPreference, confirmPayment } = require('../controllers/paymentController')

router.post('/create-preference', createPreference)
router.get('/confirm', confirmPayment)

module.exports = router
