import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/** GET /api/projects/[id]/quote — get quote with items */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServiceRoleClient()

  const { data: quote } = await supabase
    .from('quotes')
    .select('id, client_confirmed, subtotal_design, management_fee_rate, notes')
    .eq('project_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!quote) return NextResponse.json({ quote: null })

  const { data: items } = await supabase
    .from('quote_items')
    .select('id, category, item_name, unit, quantity, unit_price')
    .eq('quote_id', quote.id)
    .order('sort_order')

  return NextResponse.json({
    quote: {
      id: quote.id,
      status: quote.client_confirmed ? 'confirmed' : 'pending',
      design_fee: quote.subtotal_design ? Number(quote.subtotal_design) : 0,
      management_fee_rate: quote.management_fee_rate ? Number(quote.management_fee_rate) : 0.18,
      notes: quote.notes,
      items: (items || []).map(i => ({
        id: i.id,
        category: i.category,
        name: i.item_name,
        unit: i.unit,
        quantity: Number(i.quantity || 0),
        unit_price: Number(i.unit_price || 0),
      })),
    },
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
