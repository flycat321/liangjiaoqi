import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/** GET /api/admin/notifications — list all sent notifications with client name */
export async function GET() {
  const supabase = await createServiceRoleClient()

  const { data, error } = await supabase
    .from('notifications')
    .select('id, title, body, created_at, recipient_id')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Get profile → client name mapping
  const recipientIds = [...new Set((data || []).map(n => n.recipient_id).filter(Boolean))]
  let clientMap = new Map<string, string>()

  if (recipientIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', recipientIds)
    if (profiles) {
      clientMap = new Map(profiles.map(p => [p.id, p.full_name]))
    }
  }

  const notifications = (data || []).map(n => ({
    id: n.id,
    title: n.title,
    body: n.body,
    created_at: n.created_at,
    client_name: clientMap.get(n.recipient_id) || '未知客户',
  }))

  return NextResponse.json({ notifications })
}
