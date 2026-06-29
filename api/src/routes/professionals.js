const express = require('express')
const router = express.Router()
const {
  getProfessionals,
  getProfessionalById,
  createProfessional,
} = require('../controllers/professionalsController')

router.get('/', getProfessionals)
router.get('/:id', getProfessionalById)
router.post('/', createProfessional)

module.exports = router
