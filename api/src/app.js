const express = require('express')
const cors = require('cors')
require('dotenv').config()

const professionalsRoutes = require('./routes/professionals')
const categoriesRoutes = require('./routes/categories')
const adminRoutes = require('./routes/admin')
const reviewsRoutes = require('./routes/reviews')
const authRoutes = require('./routes/auth')
const paymentRoutes = require('./routes/payment')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Trampo API rodando' })
})

app.use('/auth', authRoutes)
app.use('/payment', paymentRoutes)
app.use('/professionals', professionalsRoutes)
app.use('/categories', categoriesRoutes)
app.use('/admin', adminRoutes)
app.use('/reviews', reviewsRoutes)

module.exports = app
