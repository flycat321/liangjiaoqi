import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/** PATCH /api/projects/[id]/quote — confirm contract fee */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { status } = await request.json()
  const supabase = await createServiceRoleClient()

  const confirmed = status === 'confirmed'
  const { error } = await supabase
    .from('quotes')
    .update({
      client_confirmed: confirmed,
      client_confirmed_at: confirmed ? new Date().toISOString() : null,
    })
    .eq('project_id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
