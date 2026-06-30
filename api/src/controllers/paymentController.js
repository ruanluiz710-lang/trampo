const { MercadoPagoConfig, Preference, Payment } = require('mercadopago')
const supabase = require('../config/supabase')

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || 'placeholder',
})

async function createPreference(req, res) {
  const formData = req.body

  if (!formData.name || !formData.phone) {
    return res.status(400).json({ error: 'Dados do profissional incompletos' })
  }

  try {
    const preference = new Preference(client)

    const response = await preference.create({
      body: {
        items: [
          {
            id: 'trampo-cadastro',
            title: 'Cadastro Trampo — Perfil de Profissional',
            description: `Perfil de ${formData.name}`,
            quantity: 1,
            unit_price: 14.90,
            currency_id: 'BRL',
          },
        ],
        payer: {
          name: formData.name,
          phone: { number: formData.phone?.replace(/\D/g, '') },
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/cadastro/sucesso`,
          failure: `${process.env.FRONTEND_URL}/cadastro/falhou`,
          pending: `${process.env.FRONTEND_URL}/cadastro/pendente`,
        },
        auto_return: 'approved',
        external_reference: JSON.stringify(formData),
        statement_descriptor: 'TRAMPO',
      },
    })

    res.json({ init_point: response.init_point, preference_id: response.id })
  } catch (err) {
    console.error('MP Error:', err)
    res.status(500).json({ error: 'Erro ao criar preferência de pagamento' })
  }
}

async function confirmPayment(req, res) {
  const { payment_id, status, external_reference } = req.query

  if (status !== 'approved' || !payment_id) {
    return res.status(400).json({ error: 'Pagamento não aprovado' })
  }

  try {
    // Verifica o pagamento direto no MP
    const payment = new Payment(client)
    const paymentData = await payment.get({ id: payment_id })

    if (paymentData.status !== 'approved') {
      return res.status(400).json({ error: 'Pagamento não confirmado pelo Mercado Pago' })
    }

    // Salva o profissional no banco
    const formData = JSON.parse(external_reference)
    const { name, bio, city, state, phone, category_id, description, price_range } = formData

    const { data: professional, error } = await supabase
      .from('professionals')
      .insert({ name, bio, city, state, phone, status: 'pending' })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })

    if (category_id) {
      await supabase.from('professional_services').insert({
        professional_id: professional.id,
        category_id,
        description,
        price_range,
      })
    }

    res.json({ success: true, professional_id: professional.id })
  } catch (err) {
    console.error('Confirm error:', err)
    res.status(500).json({ error: 'Erro ao confirmar pagamento' })
  }
}

module.exports = { createPreference, confirmPayment }
