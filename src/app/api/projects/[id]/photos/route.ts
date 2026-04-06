import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/** GET /api/projects/[id]/photos — project photos with stage name */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServiceRoleClient()

  const { data, error } = await supabase
    .from('photos')
    .select('id, url, thumbnail_url, caption, created_at, stage_id, project_stages(name)')
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const photos = (data || []).map(p => ({
    id: p.id,
    url: p.url || p.thumbnail_url,
    caption: p.caption,
    created_at: p.created_at,
    stage_name: (p.project_stages as unknown as { name: string } | null)?.name || '其他',
  }))

  return NextResponse.json({ photos })
}
