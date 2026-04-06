import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/** GET — list project materials */
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

/** POST — add a material to the project */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const supabase = await createServiceRoleClient()

  const { data, error } = await supabase
    .from('project_materials')
    .insert({
      project_id: id,
      category: body.category,
      brand: body.brand,
      model: body.model || null,
      specification: body.specification || null,
      unit: body.unit || '项',
      unit_price: Number(body.unit_price),
      quantity: Number(body.quantity || 1),
      sort_order: body.sort_order || 0,
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ material: data })
}

/** DELETE — remove a material */
export async function DELETE(request: NextRequest) {
  const { materialId } = await request.json()
  const supabase = await createServiceRoleClient()
  const { error } = await supabase.from('project_materials').delete().eq('id', materialId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
