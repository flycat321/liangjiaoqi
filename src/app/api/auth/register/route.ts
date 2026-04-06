import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const { phone, password, name, clientId } = await request.json()

  if (!phone || !password || !name) {
    return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  // Create auth user with phone as email (Supabase requires email)
  const email = `${phone}@protractor.local`
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { phone, name, role: clientId ? 'client' : 'admin' },
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  const userId = authData.user.id
  const role = clientId ? 'client' : 'admin'

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ id: userId, role, full_name: name, phone })

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 })
  }

  // Link to client record if clientId provided
  if (clientId) {
    await supabase
      .from('clients')
      .update({ user_id: userId })
      .eq('id', clientId)
  }

  return NextResponse.json({ success: true, userId })
}
