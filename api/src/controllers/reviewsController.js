const supabase = require('../config/supabase')

async function getReviews(req, res) {
  const { professionalId } = req.params

  const { data, error } = await supabase
    .from('reviews')
    .select('id, client_name, rating, comment, response, response_at, created_at')
    .eq('professional_id', professionalId)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

async function createReview(req, res) {
  const { professionalId } = req.params
  const { client_name, rating, comment } = req.body

  if (!client_name || !rating) {
    return res.status(400).json({ error: 'Nome e nota são obrigatórios' })
  }

  // Impede avaliação duplicada do mesmo nome para o mesmo profissional
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('professional_id', professionalId)
    .ilike('client_name', client_name.trim())
    .single()

  if (existing) {
    return res.status(409).json({ error: 'Você já avaliou este profissional.' })
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({ professional_id: professionalId, client_name: client_name.trim(), rating, comment })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
}

async function deleteReview(req, res) {
  const { id } = req.params

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ success: true })
}

module.exports = { getReviews, createReview, deleteReview }
