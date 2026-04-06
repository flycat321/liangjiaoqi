'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { toast } from 'sonner'
import { Lock, Phone, Info } from 'lucide-react'
import { demoLogin, demoSetUser, demoLogout } from '@/lib/utils/demo-auth'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!phone || !password) {
      toast.error('请填写手机号和密码')
      return
    }
    setLoading(true)

    // Clear any previous session data before login attempt
    demoLogout()

    try {
      // Server-side auth via our own API (avoids browser → Supabase connectivity issues)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      })
      const result = await res.json()

      if (res.ok && result.user) {
        const { name, role } = result.user as { name: string; role: 'admin' | 'client' }
        demoSetUser({ name, phone, role })
        toast.success(`欢迎回来，${name}`)
        router.push(role === 'admin' ? '/admin' : '/dashboard')
        setLoading(false)
        return
      }

      // API returned error — try demo fallback
      if (res.status !== 401) {
        // Server error, try demo mode silently
      } else {
        // 401 = wrong credentials, still try demo as last resort
      }
    } catch {
      // Network error, fall through to demo mode
    }

    // Fallback to demo mode (hardcoded accounts for offline/demo use)
    const demoUser = demoLogin(phone, password)
    if (demoUser) {
      toast.success(`欢迎回来，${demoUser.name}`)
      router.push(demoUser.role === 'admin' ? '/admin' : '/dashboard')
    } else {
      toast.error('手机号或密码错误')
    }

    setLoading(false)
  }

  function quickLogin(phone: string, password: string) {
    setPhone(phone)
    setPassword(password)
  }

  return (
    <div className="min-h-dvh flex flex-col bg-brand-bg">
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="max-w-sm mx-auto w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-text">
              <span className="text-lg font-bold text-white font-serif">角</span>
            </div>
            <div>
              <span className="text-xl font-bold tracking-wide">量角器</span>
              <p className="text-[10px] text-brand-text-muted tracking-widest">PROTRACTOR</p>
            </div>
          </Link>

          <h1 className="text-2xl font-serif font-bold mb-2">客户登录</h1>
          <p className="text-sm text-brand-text-muted mb-8">
            登录查看您的项目进度、材料清单和合同文件
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-brand-text-muted mb-1.5">手机号</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-colors"
                  placeholder="输入手机号"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-brand-text-muted mb-1.5">密码</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-colors"
                  placeholder="输入密码"
                />
              </div>
            </div>

            <Button type="submit" size="lg" loading={loading} className="w-full">
              登录
            </Button>
          </form>

          {/* Demo accounts */}
          <Card className="mt-6 bg-brand-accent/5 border-brand-accent/15">
            <div className="flex items-start gap-2 mb-3">
              <Info size={14} className="text-brand-accent shrink-0 mt-0.5" />
              <span className="text-xs text-brand-accent-dark font-medium">演示账号（点击自动填入）</span>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => quickLogin('18629148762', 'admin123')}
                className="w-full flex items-center justify-between px-3 py-2 bg-white rounded-lg text-left touch-manipulation active:scale-[0.98] transition-transform"
              >
                <div>
                  <span className="text-xs font-medium">管理员 — 郭高亮</span>
                  <p className="text-[11px] text-brand-text-muted">18629148762 / admin123</p>
                </div>
                <span className="text-[10px] text-brand-accent">管理后台 →</span>
              </button>
              <button
                type="button"
                onClick={() => quickLogin('13800001111', '123456')}
                className="w-full flex items-center justify-between px-3 py-2 bg-white rounded-lg text-left touch-manipulation active:scale-[0.98] transition-transform"
              >
                <div>
                  <span className="text-xs font-medium">客户 — 张伟</span>
                  <p className="text-[11px] text-brand-text-muted">13800001111 / 123456</p>
                </div>
                <span className="text-[10px] text-brand-accent">客户门户 →</span>
              </button>
              <button
                type="button"
                onClick={() => quickLogin('13800002222', '123456')}
                className="w-full flex items-center justify-between px-3 py-2 bg-white rounded-lg text-left touch-manipulation active:scale-[0.98] transition-transform"
              >
                <div>
                  <span className="text-xs font-medium">客户 — 李婷</span>
                  <p className="text-[11px] text-brand-text-muted">13800002222 / 123456</p>
                </div>
                <span className="text-[10px] text-brand-accent">客户门户 →</span>
              </button>
            </div>
          </Card>

          <p className="mt-6 text-center text-xs text-brand-text-muted">
            首次使用？请联系设计师获取登录账号
          </p>
        </div>
      </div>

      <div className="text-center pb-6 text-[10px] text-brand-text-muted">
        <Link href="/" className="hover:text-brand-text transition-colors">← 返回首页</Link>
      </div>
    </div>
  )
}
