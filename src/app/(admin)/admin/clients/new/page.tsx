'use client'

import Link from 'next/link'
import { ArrowLeft, Copy, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useState } from 'react'
import { toast } from 'sonner'

function generatePassword(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
  let pwd = ''
  for (let i = 0; i < 8; i++) pwd += chars[Math.floor(Math.random() * chars.length)]
  return pwd
}

interface CreatedInfo {
  name: string
  phone: string
  password: string
  loginUrl: string
}

export default function NewClientPage() {
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState<CreatedInfo | null>(null)
  const [showPwd, setShowPwd] = useState(true)
  const [form, setForm] = useState({
    name: '', phone: '', email: '', password: '',
    address: '', area: '', propertyType: '', notes: '',
  })

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function autoGenPassword() {
    const pwd = generatePassword()
    setForm(prev => ({ ...prev, password: pwd }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone) { toast.error('请填写客户姓名和手机号'); return }
    if (!form.password || form.password.length < 6) { toast.error('请设置至少6位的初始密码'); return }

    setLoading(true)
    try {
      // 1. Create client record via Supabase
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert({
          name: form.name,
          phone: form.phone,
          email: form.email || null,
          address: form.address || null,
          property_area: form.area ? Number(form.area) : null,
          property_type: form.propertyType || null,
          notes: form.notes || null,
        })
        .select('id')
        .single()

      if (clientError) throw new Error(clientError.message)

      // 2. Create auth user + profile via API
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: form.phone,
          password: form.password,
          name: form.name,
          clientId: clientData.id,
        }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || '创建失败')

      setCreated({
        name: form.name,
        phone: form.phone,
        password: form.password,
        loginUrl: `${window.location.origin}/login`,
      })
      toast.success('客户账号已创建')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '创建失败'
      toast.error(msg)
    }
    setLoading(false)
  }

  function copyCredentials() {
    if (!created) return
    const text = `【量角器】${created.name} 您好，您的项目管理账号已创建：\n\n登录地址：${created.loginUrl}\n手机号：${created.phone}\n密码：${created.password}\n\n登录后可查看项目进度、确认材料、签署合同。`
    navigator.clipboard.writeText(text)
    toast.success('账号信息已复制，可直接粘贴发给客户')
  }

  if (created) {
    return (
      <div className="pb-8">
        <div className="sticky top-[52px] z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/admin/clients" className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
            <h1 className="text-sm font-medium">客户创建成功</h1>
          </div>
        </div>

        <div className="px-4 pt-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-brand-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-brand-success" />
            </div>
            <h2 className="text-lg font-serif font-bold mb-1">账号创建成功</h2>
            <p className="text-sm text-brand-text-muted">请将登录信息发送给客户</p>
          </div>

          {/* Credentials card */}
          <Card className="mb-4">
            <h3 className="text-xs text-brand-text-muted mb-3 tracking-wider">客户登录信息</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-text-secondary">客户姓名</span>
                <span className="text-sm font-medium">{created.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-text-secondary">登录手机号</span>
                <span className="text-sm font-medium font-mono">{created.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-text-secondary">初始密码</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium font-mono">
                    {showPwd ? created.password : '••••••••'}
                  </span>
                  <button onClick={() => setShowPwd(!showPwd)} className="text-brand-text-muted touch-manipulation">
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-text-secondary">登录地址</span>
                <span className="text-xs text-brand-accent break-all">{created.loginUrl}</span>
              </div>
            </div>
          </Card>

          {/* One-click copy */}
          <Button size="lg" className="w-full mb-3" onClick={copyCredentials}>
            <Copy size={16} className="mr-2" />
            一键复制发送给客户
          </Button>

          <Card className="mb-6 bg-brand-bg border-none">
            <p className="text-xs text-brand-text-secondary leading-relaxed">
              <strong>复制后的消息格式：</strong>
            </p>
            <div className="mt-2 p-3 bg-white rounded-lg text-xs text-brand-text-secondary leading-relaxed whitespace-pre-line">
              【量角器】{created.name} 您好，您的项目管理账号已创建：{'\n\n'}
              登录地址：{created.loginUrl}{'\n'}
              手机号：{created.phone}{'\n'}
              密码：{created.password}{'\n\n'}
              登录后可查看项目进度、确认材料、签署合同。
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => {
              setCreated(null)
              setForm({ name: '', phone: '', email: '', password: '', address: '', area: '', propertyType: '', notes: '' })
            }}>
              继续添加
            </Button>
            <Link href="/admin/clients" className="flex-1">
              <Button variant="secondary" className="w-full">返回列表</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-8">
      <div className="sticky top-[52px] z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/clients" className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
          <h1 className="text-sm font-medium">新建客户</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 pt-4 space-y-4">
        <div>
          <label className="block text-xs text-brand-text-muted mb-1.5">客户姓名 *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)}
            className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors"
            placeholder="客户全名" />
        </div>
        <div>
          <label className="block text-xs text-brand-text-muted mb-1.5">手机号 *（用于登录）</label>
          <input value={form.phone} onChange={e => set('phone', e.target.value)} type="tel"
            className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors"
            placeholder="客户手机号" />
        </div>

        {/* Password section */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-brand-text-muted">初始密码 *（用于登录）</label>
            <button type="button" onClick={autoGenPassword}
              className="text-xs text-brand-accent hover:text-brand-accent-dark transition-colors touch-manipulation">
              自动生成
            </button>
          </div>
          <div className="relative">
            <input
              value={form.password}
              onChange={e => set('password', e.target.value)}
              type={showPwd ? 'text' : 'password'}
              className="w-full h-11 px-4 pr-10 rounded-lg border border-brand-border bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors"
              placeholder="至少6位"
            />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted touch-manipulation">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-[11px] text-brand-text-muted mt-1">创建后将显示完整登录信息供您发送给客户</p>
        </div>

        <div>
          <label className="block text-xs text-brand-text-muted mb-1.5">邮箱</label>
          <input value={form.email} onChange={e => set('email', e.target.value)} type="email"
            className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors"
            placeholder="邮箱（选填）" />
        </div>
        <div>
          <label className="block text-xs text-brand-text-muted mb-1.5">装修地址</label>
          <input value={form.address} onChange={e => set('address', e.target.value)}
            className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors"
            placeholder="装修房屋地址" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-brand-text-muted mb-1.5">面积（㎡）</label>
            <input value={form.area} onChange={e => set('area', e.target.value)} type="number"
              className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-brand-text-muted mb-1.5">房屋类型</label>
            <select value={form.propertyType} onChange={e => set('propertyType', e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors appearance-none">
              <option value="">选择</option>
              <option>平层</option><option>大平层</option><option>复式</option>
              <option>跃层</option><option>别墅</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs text-brand-text-muted mb-1.5">备注</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
            className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors resize-none"
            placeholder="客户备注（选填）" />
        </div>
        <Button type="submit" size="lg" loading={loading} className="w-full">
          创建客户账号
        </Button>
      </form>
    </div>
  )
}
