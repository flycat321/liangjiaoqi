import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/** GET /api/admin/notifications — list all sent notifications with client name */
export async function GET() {
  const supabase = await createServiceRoleClient()

  const { data, error } = await supabase
    .from('notifications')
    .select('id, title, body, created_at, client_id')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Enrich with client names
  const clientIds = [...new Set((data || []).map(n => n.client_id).filter(Boolean))]
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name')
    .in('id', clientIds.length > 0 ? clientIds : ['_none_'])

  const clientMap = new Map((clients || []).map(c => [c.id, c.name]))

  const notifications = (data || []).map(n => ({
    id: n.id,
    title: n.title,
    body: n.body,
    created_at: n.created_at,
    client_name: clientMap.get(n.client_id) || '未知客户',
  }))

  return NextResponse.json({ notifications })
}
