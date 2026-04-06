import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createServiceRoleClient()

  // Check if admin already exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin')
    .limit(1)

  if (existing && existing.length > 0) {
    return NextResponse.json({ message: '管理员已存在，跳过初始化' })
  }

  // Create admin auth user
  const { data: adminAuth, error: adminError } = await supabase.auth.admin.createUser({
    email: '18629148762@protractor.local',
    password: 'admin123',
    email_confirm: true,
    user_metadata: { phone: '18629148762', name: '郭高亮', role: 'admin' },
  })

  if (adminError) {
    return NextResponse.json({ error: adminError.message }, { status: 400 })
  }

  // Create admin profile
  await supabase.from('profiles').insert({
    id: adminAuth.user.id,
    role: 'admin',
    full_name: '郭高亮',
    phone: '18629148762',
  })

  // Create demo client 1
  const { data: client1 } = await supabase.from('clients').insert({
    name: '张伟', phone: '13800001111', address: '曲江新区·中海天钻 3-2-1201',
    property_area: 186, property_type: '大平层',
  }).select('id').single()

  // Create demo client 2
  const { data: client2 } = await supabase.from('clients').insert({
    name: '李婷', phone: '13800002222', address: '高新区·绿地世纪城 A-801',
    property_area: 220, property_type: '复式',
  }).select('id').single()

  // Create auth users for demo clients
  for (const { phone, name, clientId } of [
    { phone: '13800001111', name: '张伟', clientId: client1?.id },
    { phone: '13800002222', name: '李婷', clientId: client2?.id },
  ]) {
    const { data: userAuth } = await supabase.auth.admin.createUser({
      email: `${phone}@protractor.local`,
      password: '123456',
      email_confirm: true,
      user_metadata: { phone, name, role: 'client' },
    })
    if (userAuth?.user) {
      await supabase.from('profiles').insert({
        id: userAuth.user.id, role: 'client', full_name: name, phone,
      })
      if (clientId) {
        await supabase.from('clients').update({ user_id: userAuth.user.id }).eq('id', clientId)
      }
    }
  }

  // Create demo project for client 1
  if (client1?.id) {
    const { data: project } = await supabase.from('projects').insert({
      client_id: client1.id,
      name: '张先生·曲江大平层',
      address: '曲江新区·中海天钻 3-2-1201',
      area: 186,
      property_type: '大平层',
      status: 'in_progress',
      current_stage_order: 7,
      designer_id: adminAuth.user.id,
      start_date: '2026-02-15',
      expected_end_date: '2026-07-30',
    }).select('id').single()

    // Create 11 stages for the project
    if (project?.id) {
      const { STAGE_DEFINITIONS } = await import('@/lib/constants/stages')
      for (const stage of STAGE_DEFINITIONS) {
        const status = stage.order < 7 ? 'completed' : stage.order === 7 ? 'in_progress' : 'locked'
        const { data: stageData } = await supabase.from('project_stages').insert({
          project_id: project.id,
          stage_order: stage.order,
          name: stage.name,
          description: stage.description,
          status,
          started_at: stage.order <= 7 ? new Date().toISOString() : null,
          completed_at: stage.order < 7 ? new Date().toISOString() : null,
        }).select('id').single()

        // Insert stage items
        if (stageData?.id) {
          const items = stage.items.map((item, idx) => ({
            stage_id: stageData.id,
            item_code: item.code,
            category: item.category,
            name: item.name,
            standard: item.standard,
            responsible: item.responsible,
            status: stage.order < 7 ? 'completed' : 'pending',
            photo_required: item.photoRequired,
            client_confirmation_required: item.clientConfirmationRequired,
            sort_order: idx,
          }))
          await supabase.from('stage_items').insert(items)
        }
      }
    }
  }

  return NextResponse.json({
    success: true,
    message: '初始化完成：1个管理员 + 2个客户 + 1个演示项目（含11阶段90+检查项）',
    accounts: [
      { role: '管理员', phone: '18629148762', password: 'admin123' },
      { role: '客户', phone: '13800001111', password: '123456' },
      { role: '客户', phone: '13800002222', password: '123456' },
    ],
  })
}
