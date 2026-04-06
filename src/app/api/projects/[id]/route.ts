import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/** GET /api/projects/[id] — project detail with stages */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createServiceRoleClient()

  const [{ data: project, error: projErr }, { data: stages, error: stgErr }] = await Promise.all([
    supabase.from('projects').select('id, name, address, current_stage_order, status').eq('id', id).single(),
    supabase.from('project_stages').select('*').eq('project_id', id).order('stage_order'),
  ])

  if (projErr || !project) {
    return NextResponse.json({ error: '项目不存在' }, { status: 404 })
  }

  return NextResponse.json({ project, stages: stages || [] })
}
