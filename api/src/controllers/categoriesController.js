const supabase = require('../config/supabase')

async function getCategories(req, res) {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, icon')
    .order('name')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

module.exports = { getCategories }
