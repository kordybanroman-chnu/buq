import { serverSupabaseServiceRole } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { clientId, tableNumber, guestName, items } = body
  if (!clientId || !tableNumber || !guestName || !items || !Array.isArray(items) || items.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Некоректні дані замовлення' })
  }
  const supabase = serverSupabaseServiceRole(event)
  const productIds = items.map(item => item.productId)
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, price, is_available')
    .in('id', productIds)
  if (productsError || !products) {
    throw createError({ statusCode: 500, statusMessage: 'Помилка бази даних під час перевірки товарів' })
  }
  let totalAmount = 0
  const orderItemsData = items.map(item => {
    const product = products.find(p => p.id === item.productId)
    if (!product || !product.is_available) {
      throw createError({ statusCode: 400, statusMessage: `Товар недоступний` })
    }
    totalAmount += product.price * item.quantity
    return {
      product_id: product.id,
      quantity: item.quantity,
      price_at_time: product.price
    }
  })
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      client_id: clientId,
      table_number: tableNumber,
      guest_name: guestName,
      total_amount: totalAmount,
      status: 'pending'
    })
    .select('id')
    .single()
  if (orderError || !order) {
    throw createError({ statusCode: 500, statusMessage: 'Помилка створення замовлення' })
  }
  const itemsToInsert = orderItemsData.map(item => ({
    ...item,
    order_id: order.id
  }))
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsToInsert)
  if (itemsError) {
    console.error('Failed to create order items:', itemsError)
    throw createError({ statusCode: 500, statusMessage: 'Помилка створення списку товарів' })
  }
  return {
    success: true,
    orderId: order.id,
    message: 'Замовлення успішно створено'
  }
})