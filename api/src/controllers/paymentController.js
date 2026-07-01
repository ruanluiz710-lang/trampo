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
          pending: `${process.env.FRONTEND_URL}/cadastro/sucesso`,
        },
        auto_return: 'approved',
        external_reference: JSON.stringify(formData),
        statement_descriptor: 'TRAMPO',
        notification_url: `${process.env.RAILWAY_PUBLIC_DOMAIN ? 'https://' + process.env.RAILWAY_PUBLIC_DOMAIN : 'https://trampo-production.up.railway.app'}/payment/webhook`,
      },
    })

    res.json({ init_point: response.init_point, preference_id: response.id })
  } catch (err) {
    console.error('MP Error:', err)
    res.status(500).json({ error: 'Erro ao criar preferência de pagamento' })
  }
}

async function saveProfessional(paymentId, externalReference) {
  // Checa se já foi salvo (idempotência)
  const { data: existing } = await supabase
    .from('professionals')
    .select('id')
    .eq('mp_payment_id', String(paymentId))
    .maybeSingle()

  if (existing) {
    console.log('Profissional já salvo para payment_id:', paymentId)
    return { already_saved: true, professional_id: existing.id }
  }

  const formData = JSON.parse(externalReference)
  const { name, bio, city, state, phone, category_id, description, price_range } = formData

  const { data: professional, error } = await supabase
    .from('professionals')
    .insert({ name, bio, city, state, phone, status: 'pending', mp_payment_id: String(paymentId) })
    .select()
    .single()

  if (error) throw new Error(error.message)

  if (category_id) {
    await supabase.from('professional_services').insert({
      professional_id: professional.id,
      category_id,
      description,
      price_range,
    })
  }

  return { professional_id: professional.id }
}

async function confirmPayment(req, res) {
  // Tenta pegar payment_id de diferentes parâmetros que o MP pode enviar
  const payment_id = req.query.payment_id || req.query.collection_id
  const status = req.query.status || req.query.collection_status
  const external_reference = req.query.external_reference

  console.log('Confirm params:', { payment_id, status, external_reference: external_reference?.substring(0, 50) })

  if (!payment_id) {
    return res.status(400).json({ error: 'payment_id não encontrado' })
  }

  try {
    const payment = new Payment(client)
    const paymentData = await payment.get({ id: payment_id })

    console.log('MP payment status:', paymentData.status)

    if (paymentData.status !== 'approved') {
      return res.status(400).json({ error: 'Pagamento não confirmado pelo Mercado Pago', status: paymentData.status })
    }

    const ref = paymentData.external_reference || external_reference
    if (!ref) return res.status(400).json({ error: 'Dados do profissional não encontrados' })

    const result = await saveProfessional(payment_id, ref)
    res.json({ success: true, ...result })
  } catch (err) {
    console.error('Confirm error:', err)
    res.status(500).json({ error: 'Erro ao confirmar pagamento' })
  }
}

async function handleWebhook(req, res) {
  // MP envia notificação imediatamente quando pagamento é aprovado
  res.sendStatus(200) // responde rápido para o MP

  const { type, data } = req.body
  console.log('Webhook recebido:', type, data)

  if (type !== 'payment' || !data?.id) return

  try {
    const payment = new Payment(client)
    const paymentData = await payment.get({ id: data.id })

    console.log('Webhook payment status:', paymentData.status, 'id:', data.id)

    if (paymentData.status !== 'approved') return
    if (!paymentData.external_reference) return

    await saveProfessional(data.id, paymentData.external_reference)
    console.log('Profissional salvo via webhook, payment_id:', data.id)
  } catch (err) {
    console.error('Webhook error:', err)
  }
}

module.exports = { createPreference, confirmPayment, handleWebhook }
