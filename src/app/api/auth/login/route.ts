import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const { phone, password } = await request.json()

  if (!phone || !password) {
    return NextResponse.json({ error: '请填写手机号和密码' }, { status: 400 })
  }

  try {
    const supabase = await createServiceRoleClient()
    const email = `${phone}@protractor.local`

    // Use admin API to list users and verify, since signInWithPassword
    // requires client-side session handling
    const { data: userList } = await supabase.auth.admin.listUsers()
    const authUser = userList?.users?.find(u => u.email === email)

    if (!authUser) {
      return NextResponse.json({ error: '账号不存在' }, { status: 401 })
    }

    // Verify password by attempting sign-in via admin client
    // We create a temporary client for password verification
    const { createClient } = await import('@supabase/supabase-js')
    const tempClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    )

    const { data: signInData, error: signInError } = await tempClient.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError || !signInData?.user) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 })
    }

    const role = signInData.user.user_metadata?.role || 'client'
    const name = signInData.user.user_metadata?.name || ''

    return NextResponse.json({
      success: true,
      user: { name, phone, role },
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '登录失败'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
