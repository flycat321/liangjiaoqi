import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/** GET — get or create quote for project */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServiceRoleClient()

  const { data: quote } = await supabase
    .from('quotes')
    .select('id, subtotal_design, management_fee_rate, notes, client_confirmed')
    .eq('project_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!quote) return NextResponse.json({ quote: null, items: [] })

  const { data: items } = await supabase
    .from('quote_items')
    .select('id, category, item_name, unit, quantity, unit_price')
    .eq('quote_id', quote.id)
    .order('sort_order')

  return NextResponse.json({ quote, items: items || [] })
}

/** POST — create quote + items */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { designFee, managementRate, notes, items } = await request.json()
  const supabase = await createServiceRoleClient()

  // Delete existing quote for this project
  await supabase.from('quotes').delete().eq('project_id', id)

  const constructionTotal = (items || []).reduce((s: number, i: { quantity: number; unit_price: number }) => s + i.quantity * i.unit_price, 0)

  const { data: quote, error: qErr } = await supabase
    .from('quotes')
    .insert({
      project_id: id,
      subtotal_design: designFee || 0,
      management_fee_rate: managementRate || 0.18,
      subtotal_construction: constructionTotal,
      subtotal_management: Math.round(constructionTotal * (managementRate || 0.18)),
      total_amount: (designFee || 0) + constructionTotal + Math.round(constructionTotal * (managementRate || 0.18)),
      notes: notes || null,
    })
    .select('id')
    .single()

  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 })

  if (items?.length > 0) {
    const quoteItems = items.map((item: { category: string; name: string; unit: string; quantity: number; unit_price: number }, idx: number) => ({
      quote_id: quote.id,
      category: item.category,
      item_name: item.name,
      unit: item.unit,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price,
      sort_order: idx,
    }))
    const { error: iErr } = await supabase.from('quote_items').insert(quoteItems)
    if (iErr) return NextResponse.json({ error: iErr.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, quoteId: quote.id })
}
