import { serverSupabaseServiceRole } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, status } = body
  if (!id || !status) throw createError({ statusCode: 400, statusMessage: 'Missing ID or Status' })
  const supabase = serverSupabaseServiceRole(event)
  const { error } = await supabase.from('orders').update({ status }).eq('id', id)
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { success: true }
})