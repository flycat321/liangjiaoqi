import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/** GET /api/projects?phone=xxx — list projects for a client by phone */
export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get('phone')
  const role = request.nextUrl.searchParams.get('role')

  if (!phone) {
    return NextResponse.json({ error: '缺少 phone 参数' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  // Admin: return all projects
  if (role === 'admin') {
    const { data, error } = await supabase
      .from('projects')
      .select('id, name, address, current_stage_order, status, client_id')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ projects: data || [] })
  }

  // Client: find client record, then their projects
  const { data: clientData } = await supabase
    .from('clients')
    .select('id')
    .eq('phone', phone)
    .single()

  if (!clientData) {
    return NextResponse.json({ projects: [] })
  }

  const { data, error } = await supabase
    .from('projects')
    .select('id, name, address, current_stage_order, status')
    .eq('client_id', clientData.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ projects: data || [] })
}
