'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function InvitePage() {
  const { token } = useParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) { toast.error('密码至少6位'); return }
    if (password !== confirmPassword) { toast.error('两次密码不一致'); return }

    setLoading(true)
    // TODO: verify token + create Supabase auth user + link to client
    await new Promise(r => setTimeout(r, 1000))
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-brand-bg">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-brand-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-brand-success" />
          </div>
          <h1 className="text-2xl font-serif font-bold mb-2">注册成功</h1>
          <p className="text-sm text-brand-text-muted mb-8">密码已设置，现在可以登录查看您的项目了</p>
          <Link href="/login">
            <Button size="lg" className="w-full max-w-xs">
              前往登录
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col bg-brand-bg">
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="max-w-sm mx-auto w-full">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-text">
              <span className="text-lg font-bold text-white font-serif">角</span>
            </div>
            <div>
              <span className="text-xl font-bold tracking-wide">量角器</span>
              <p className="text-[10px] text-brand-text-muted tracking-widest">PROTRACTOR</p>
            </div>
          </div>

          <h1 className="text-2xl font-serif font-bold mb-2">欢迎加入</h1>
          <p className="text-sm text-brand-text-muted mb-8">
            您的设计师邀请您查看项目进度。<br />请设置一个登录密码。
          </p>

          <Card className="mb-4 bg-brand-accent/5 border-brand-accent/20">
            <p className="text-xs text-brand-accent-dark">
              邀请码：{typeof token === 'string' ? token.substring(0, 8) : ''}...
            </p>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-brand-text-muted mb-1.5">设置密码</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-colors"
                  placeholder="至少6位"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted touch-manipulation"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-brand-text-muted mb-1.5">确认密码</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-colors"
                  placeholder="再次输入密码"
                />
              </div>
            </div>

            <Button type="submit" size="lg" loading={loading} className="w-full">
              设置密码并注册
            </Button>
          </form>
        </div>
      </div>

      <div className="text-center pb-6 text-[10px] text-brand-text-muted">
        <Link href="/" className="hover:text-brand-text transition-colors">← 返回首页</Link>
      </div>
    </div>
  )
}
