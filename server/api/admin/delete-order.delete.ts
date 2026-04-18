import { serverSupabaseServiceRole } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id } = body
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing ID' })
  const supabase = serverSupabaseServiceRole(event)
  const { error } = await supabase.from('orders').delete().eq('id', id)
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { success: true }
})