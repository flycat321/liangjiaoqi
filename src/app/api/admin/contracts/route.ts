import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/** GET /api/admin/contracts — list all projects with their fee/contract status */
export async function GET() {
  const supabase = await createServiceRoleClient()

  // Get all projects with client info
  const { data: projects, error: pErr } = await supabase
    .from('projects')
    .select('id, name, address, area, client_id, status')
    .order('created_at', { ascending: false })

  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 })

  // Get all quotes (fee data)
  const { data: quotes } = await supabase
    .from('quotes')
    .select('project_id, total_amount, client_confirmed, client_confirmed_at')
    .order('created_at', { ascending: false })

  // Get client names
  const clientIds = [...new Set((projects || []).map(p => p.client_id).filter(Boolean))]
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name')
    .in('id', clientIds.length > 0 ? clientIds : ['_none_'])

  const clientMap = new Map((clients || []).map(c => [c.id, c.name]))
  const quoteMap = new Map((quotes || []).map(q => [q.project_id, q]))

  const result = (projects || []).map(p => {
    const q = quoteMap.get(p.id)
    return {
      id: p.id,
      name: p.name,
      address: p.address,
      area: p.area,
      client_name: clientMap.get(p.client_id) || '未关联',
      has_fee: !!q,
      total_amount: q?.total_amount ? Number(q.total_amount) : 0,
      client_confirmed: q?.client_confirmed || false,
      client_confirmed_at: q?.client_confirmed_at || null,
    }
  })

  return NextResponse.json({ projects: result })
}
