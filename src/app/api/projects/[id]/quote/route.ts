import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/** GET /api/projects/[id]/quote — get quote with items for a project */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServiceRoleClient()

  // Find quote for this project
  const { data: quote } = await supabase
    .from('quotes')
    .select('id, status, design_fee, management_fee_rate, notes')
    .eq('project_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!quote) {
    return NextResponse.json({ quote: null })
  }

  // Get quote items
  const { data: items } = await supabase
    .from('quote_items')
    .select('id, category, name, unit, quantity, unit_price')
    .eq('quote_id', quote.id)
    .order('sort_order')

  return NextResponse.json({
    quote: { ...quote, items: items || [] },
  })
}

/** PATCH /api/projects/[id]/quote — confirm quote */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { status } = await request.json()
  const supabase = await createServiceRoleClient()

  const { error } = await supabase
    .from('quotes')
    .update({ status })
    .eq('project_id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
