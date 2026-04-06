import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/** POST — upload photo (base64) and create record */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { base64, fileName, caption, stageId } = await request.json()

  if (!base64) return NextResponse.json({ error: '缺少图片数据' }, { status: 400 })

  const supabase = await createServiceRoleClient()

  // Decode base64 to buffer
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64Data, 'base64')

  // Upload to Supabase Storage
  const ext = fileName?.split('.').pop() || 'jpg'
  const storagePath = `projects/${id}/${Date.now()}.${ext}`

  const { error: uploadErr } = await supabase.storage
    .from('photos')
    .upload(storagePath, buffer, {
      contentType: `image/${ext === 'png' ? 'png' : 'jpeg'}`,
      upsert: false,
    })

  if (uploadErr) {
    return NextResponse.json({ error: `上传失败: ${uploadErr.message}` }, { status: 500 })
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from('photos').getPublicUrl(storagePath)
  const url = urlData.publicUrl

  // Get a default admin profile id for uploaded_by
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin')
    .limit(1)
    .single()

  // Create photo record
  const { data: photo, error: dbErr } = await supabase
    .from('photos')
    .insert({
      project_id: id,
      stage_id: stageId || null,
      url,
      caption: caption || null,
      uploaded_by: adminProfile?.id || '00000000-0000-0000-0000-000000000000',
    })
    .select('id, url, caption, created_at')
    .single()

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })

  return NextResponse.json({ photo })
}

/** DELETE — delete a photo */
export async function DELETE(request: NextRequest) {
  const { photoId } = await request.json()
  const supabase = await createServiceRoleClient()
  const { error } = await supabase.from('photos').delete().eq('id', photoId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
