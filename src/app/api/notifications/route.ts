import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/** GET /api/notifications?phone=xxx — list notifications for a client */
export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get('phone')
  if (!phone) return NextResponse.json({ error: '缺少 phone' }, { status: 400 })

  const supabase = await createServiceRoleClient()

  // Find profile by phone
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('phone', phone)
    .single()

  if (!profile) return NextResponse.json({ notifications: [] })

  const { data } = await supabase
    .from('notifications')
    .select('id, title, body, link, is_read, created_at')
    .eq('recipient_id', profile.id)
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

  // Find client's user_id (profile id) from clients table
  const { data: client } = await supabase
    .from('clients')
    .select('user_id')
    .eq('id', clientId)
    .single()

  if (!client?.user_id) {
    return NextResponse.json({ error: '该客户尚未关联登录账号' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      recipient_id: client.user_id,
      title,
      body: body || null,
      type: 'general',
      is_read: false,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, id: data.id })
}
