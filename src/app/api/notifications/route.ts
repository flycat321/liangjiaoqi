import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/** GET /api/notifications?phone=xxx — list notifications for a client */
export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get('phone')
  if (!phone) return NextResponse.json({ error: '缺少 phone' }, { status: 400 })

  const supabase = await createServiceRoleClient()

  // Find client by phone
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('phone', phone)
    .single()

  if (!client) return NextResponse.json({ notifications: [] })

  const { data } = await supabase
    .from('notifications')
    .select('id, title, body, link, is_read, created_at')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return NextResponse.json({ notifications: data || [] })
}

/** POST /api/notifications — send notification to a client */
export async function POST(request: NextRequest) {
  const { clientId, title, body } = await request.json()

  if (!clientId || !title) {
    return NextResponse.json({ error: '缺少客户或标题' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      client_id: clientId,
      title,
      body: body || null,
      is_read: false,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, id: data.id })
}
