import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/** GET /api/projects/[id]/materials — project materials list */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServiceRoleClient()

  const { data, error } = await supabase
    .from('project_materials')
    .select('*')
    .eq('project_id', id)
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ materials: data || [] })
}

/** PATCH /api/projects/[id]/materials — confirm a material */
export async function PATCH(request: NextRequest) {
  const { materialId } = await request.json()
  if (!materialId) return NextResponse.json({ error: '缺少 materialId' }, { status: 400 })

  const supabase = await createServiceRoleClient()
  const { error } = await supabase
    .from('project_materials')
    .update({ client_confirmed: true, client_confirmed_at: new Date().toISOString() })
    .eq('id', materialId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
