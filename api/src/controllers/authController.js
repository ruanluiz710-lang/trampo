const supabase = require('../config/supabase')

const normalize = str => str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()

async function login(req, res) {
  const { phone, name } = req.body

  if (!phone || !name) {
    return res.status(400).json({ error: 'Telefone e nome são obrigatórios' })
  }

  const phoneDigits = phone.replace(/\D/g, '')

  // Busca todos e filtra em JS (teefone pode ter formatação variada)
  const { data: all, error } = await supabase
    .from('professionals')
    .select('id, name, phone, city, state, status, photo_url')

  if (error) return res.status(500).json({ error: 'Erro interno' })

  const match = all.find(p => {
    const storedDigits = p.phone.replace(/\D/g, '')
    const phoneMatch = storedDigits === phoneDigits || storedDigits.endsWith(phoneDigits.slice(-8))
    const nameMatch = normalize(p.name).includes(normalize(name)) || normalize(name).includes(normalize(p.name))
    return phoneMatch && nameMatch
  })

  if (!match) {
    return res.status(401).json({ error: 'Nome ou telefone incorretos. Verifique os dados cadastrados.' })
  }

  if (match.status === 'pending') {
    return res.status(403).json({ error: 'Seu cadastro ainda está em análise. Aguarde a aprovação.' })
  }

  if (match.status === 'rejected') {
    return res.status(403).json({ error: 'Seu cadastro não foi aprovado. Entre em contato com o suporte.' })
  }

  res.json({ professional: match })
}

module.exports = { login }
