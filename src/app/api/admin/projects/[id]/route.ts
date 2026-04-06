import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/** GET /api/admin/projects/[id] — project detail with client info */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServiceRoleClient()

  const { data: project, error } = await supabase
    .from('projects')
    .select('id, name, address, area, property_type, status, current_stage_order, start_date, expected_end_date, client_id')
    .eq('id', id)
    .single()

  if (error || !project) {
    return NextResponse.json({ error: '项目不存在' }, { status: 404 })
  }

  // Get client info
  let clientName: string | null = null
  let clientPhone: string | null = null
  if (project.client_id) {
    const { data: client } = await supabase
      .from('clients')
      .select('name, phone')
      .eq('id', project.client_id)
      .single()
    if (client) {
      clientName = client.name
      clientPhone = client.phone
    }
  }

  return NextResponse.json({
    project: {
      ...project,
      client_name: clientName,
      client_phone: clientPhone,
    },
  })
}
