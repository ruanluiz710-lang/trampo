const express = require('express')
const router = express.Router()
const { getReviews, createReview, deleteReview } = require('../controllers/reviewsController')

router.get('/:professionalId', getReviews)
router.post('/:professionalId', createReview)
router.delete('/:id', deleteReview)

module.exports = router
