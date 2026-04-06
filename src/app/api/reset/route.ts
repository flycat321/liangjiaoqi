import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createServiceRoleClient()

  // Delete in order (respect foreign keys)
  await supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('signatures').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('photos').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('contracts').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('quote_items').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('quotes').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('project_materials').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('stage_items').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('project_stages').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('invitations').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('clients').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('contact_inquiries').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  // Delete non-admin profiles and auth users
  const { data: nonAdminProfiles } = await supabase
    .from('profiles')
    .select('id')
    .neq('role', 'admin')

  if (nonAdminProfiles) {
    for (const p of nonAdminProfiles) {
      await supabase.from('profiles').delete().eq('id', p.id)
      await supabase.auth.admin.deleteUser(p.id)
    }
  }

  // Clear materials too
  await supabase.from('materials').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  return NextResponse.json({
    success: true,
    message: '所有客户、项目、材料数据已清空。管理员账号保留。',
    admin: { phone: '18629148762', password: 'admin123' },
  })
}
