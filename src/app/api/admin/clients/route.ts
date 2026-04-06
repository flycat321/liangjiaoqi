import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/** GET /api/admin/clients — list all clients */
export async function GET() {
  const supabase = await createServiceRoleClient()
  const { data, error } = await supabase
    .from('clients')
    .select('id, name, phone')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ clients: data || [] })
}
