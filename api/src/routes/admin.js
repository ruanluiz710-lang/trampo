const express = require('express')
const router = express.Router()
const {
  getPending,
  approveProfessional,
  rejectProfessional,
} = require('../controllers/adminController')

router.get('/pending', getPending)
router.patch('/:id/approve', approveProfessional)
router.patch('/:id/reject', rejectProfessional)

module.exports = router
