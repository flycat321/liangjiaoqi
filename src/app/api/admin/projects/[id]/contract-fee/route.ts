import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/** GET — get project fee breakdown from quotes table */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServiceRoleClient()

  // Get project area from client
  const { data: project } = await supabase
    .from('projects')
    .select('area, client_id')
    .eq('id', id)
    .single()

  let clientArea = project?.area ? Number(project.area) : 0

  // Get existing quote (we reuse quotes table to store the fee structure)
  const { data: quote } = await supabase
    .from('quotes')
    .select('id, design_fee_per_sqm, subtotal_design, subtotal_construction, subtotal_materials, subtotal_management, management_fee_rate, material_markup_rate, total_amount, notes, client_confirmed')
    .eq('project_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Get quote items (fee line items)
  let items: unknown[] = []
  if (quote) {
    const { data } = await supabase
      .from('quote_items')
      .select('id, category, item_name, unit, quantity, unit_price, total_price, notes')
      .eq('quote_id', quote.id)
      .order('sort_order')
    items = data || []
  }

  return NextResponse.json({ area: clientArea, quote, items })
}

/** POST — save fee breakdown */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const supabase = await createServiceRoleClient()

  // Delete existing
  await supabase.from('quotes').delete().eq('project_id', id)

  // Calculate totals
  const constructionItems = (body.items || []).filter((i: { category: string }) => i.category === '施工费')
  const specialItems = (body.items || []).filter((i: { category: string }) => i.category === '专项费用')

  const constructionTotal = constructionItems.reduce((s: number, i: { total: number }) => s + (i.total || 0), 0)
  const specialTotal = specialItems.reduce((s: number, i: { total: number }) => s + (i.total || 0), 0)
  const designFee = (body.designFeePerSqm || 0) * (body.area || 0)
  const constructionMgmt = Math.round(constructionTotal * 0.15)
  const specialMgmt = Math.round(specialTotal * 0.10)
  const totalMgmt = constructionMgmt + specialMgmt
  const grandTotal = designFee + constructionTotal + specialTotal + totalMgmt

  const { data: quote, error: qErr } = await supabase
    .from('quotes')
    .insert({
      project_id: id,
      design_fee_per_sqm: body.designFeePerSqm || 0,
      subtotal_design: designFee,
      subtotal_construction: constructionTotal,
      subtotal_materials: specialTotal,
      subtotal_management: totalMgmt,
      management_fee_rate: 0.15,
      material_markup_rate: 0.10,
      total_amount: grandTotal,
      notes: body.notes || null,
    })
    .select('id')
    .single()

  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 })

  // Insert items
  const allItems = (body.items || []).map((item: { category: string; name: string; unit: string; quantity: number; unitPrice: number; total: number }, idx: number) => ({
    quote_id: quote.id,
    category: item.category,
    item_name: item.name,
    unit: item.unit || '项',
    quantity: item.quantity || 1,
    unit_price: item.unitPrice || 0,
    total_price: item.total || 0,
    sort_order: idx,
  }))

  if (allItems.length > 0) {
    const { error: iErr } = await supabase.from('quote_items').insert(allItems)
    if (iErr) return NextResponse.json({ error: iErr.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, quoteId: quote.id })
}
