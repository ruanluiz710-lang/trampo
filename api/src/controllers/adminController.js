const supabase = require('../config/supabase')

async function getPending(req, res) {
  const { data, error } = await supabase
    .from('professionals')
    .select(`
      id, name, city, state, phone, created_at,
      professional_services (
        categories ( name )
      )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

async function approveProfessional(req, res) {
  const { id } = req.params

  const { error } = await supabase
    .from('professionals')
    .update({ status: 'approved' })
    .eq('id', id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Profissional aprovado' })
}

async function rejectProfessional(req, res) {
  const { id } = req.params

  const { error } = await supabase
    .from('professionals')
    .update({ status: 'rejected' })
    .eq('id', id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Profissional rejeitado' })
}

module.exports = { getPending, approveProfessional, rejectProfessional }
