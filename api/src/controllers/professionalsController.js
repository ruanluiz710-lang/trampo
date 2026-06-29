const supabase = require('../config/supabase')

async function getProfessionals(req, res) {
  const { category_id, city } = req.query

  let query = supabase
    .from('professionals')
    .select(`
      id, name, bio, city, state, phone, photo_url,
      professional_services (
        category_id,
        categories ( name, icon )
      ),
      reviews ( rating )
    `)
    .eq('status', 'approved')

  if (city) query = query.ilike('city', `%${city}%`)

  const { data, error } = await query

  if (error) return res.status(500).json({ error: error.message })

  // Filtra por categoria em JS (filtro em tabela relacionada não funciona direto no Supabase)
  const filtered = category_id
    ? data.filter(p => p.professional_services?.some(s => String(s.category_id) === String(category_id)))
    : data

  // Calcula média de avaliações
  const result = filtered.map(p => {
    const ratings = p.reviews?.map(r => r.rating) || []
    const avg_rating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : null
    const { reviews, ...rest } = p
    return { ...rest, avg_rating, review_count: ratings.length }
  })

  res.json(result)
}

async function getProfessionalById(req, res) {
  const { id } = req.params

  const { data, error } = await supabase
    .from('professionals')
    .select(`
      id, name, bio, city, state, phone, photo_url,
      professional_services (
        description, price_range,
        categories ( name, icon )
      ),
      reviews ( id, client_name, rating, comment, response, response_at, created_at )
    `)
    .eq('id', id)
    .eq('status', 'approved')
    .single()

  if (error) return res.status(404).json({ error: 'Profissional não encontrado' })
  res.json(data)
}

async function createProfessional(req, res) {
  const { name, bio, city, state, phone, category_id, description, price_range } = req.body

  if (!name || !city || !state || !phone || !category_id) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' })
  }

  const { data: professional, error } = await supabase
    .from('professionals')
    .insert({ name, bio, city, state, phone, status: 'pending' })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  const { error: serviceError } = await supabase
    .from('professional_services')
    .insert({
      professional_id: professional.id,
      category_id,
      description,
      price_range,
    })

  if (serviceError) return res.status(500).json({ error: serviceError.message })

  res.status(201).json({ message: 'Cadastro enviado para aprovação', id: professional.id })
}

module.exports = { getProfessionals, getProfessionalById, createProfessional }
