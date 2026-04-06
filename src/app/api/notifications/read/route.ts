import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/** POST — mark notifications as read */
export async function POST(request: NextRequest) {
  const { ids } = await request.json()
  if (!ids?.length) return NextResponse.json({ error: '缺少 ids' }, { status: 400 })

  const supabase = await createServiceRoleClient()
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .in('id', ids)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
