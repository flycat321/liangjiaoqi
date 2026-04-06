'use client'

import { useState } from 'react'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Button } from '@/components/ui/Button'
import { Phone, Mail, MapPin, Send } from 'lucide-react'
import { BRAND } from '@/lib/constants/brand'
import { toast } from 'sonner'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', propertyType: '', area: '', message: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone) {
      toast.error('请填写姓名和电话')
      return
    }
    setLoading(true)
    // TODO: submit to Supabase contact_inquiries table
    await new Promise(r => setTimeout(r, 1000))
    toast.success('提交成功！我们将在24小时内与您联系。')
    setForm({ name: '', phone: '', propertyType: '', area: '', message: '' })
    setLoading(false)
  }

  return (
    <>
      <PublicHeader />
      <main className="pt-14">
        <section className="px-6 py-16 bg-brand-bg">
          <div className="max-w-lg mx-auto">
            <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-3">Contact Us</p>
            <h1 className="text-3xl font-serif font-bold tracking-wide mb-4">预约咨询</h1>
            <div className="w-8 h-px bg-brand-accent mb-6" />
            <p className="text-brand-text-secondary leading-relaxed mb-8">
              带着你的户型图来聊聊。我们提供免费的空间诊断服务，帮你评估设计可能性和预算范围。
            </p>

            {/* Contact info */}
            <div className="space-y-3 mb-10">
              <a href={`tel:${BRAND.contact.phone.replace(/-/g, '')}`} className="flex items-center gap-3 text-sm text-brand-text-secondary hover:text-brand-text transition-colors">
                <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center"><Phone size={14} className="text-brand-accent" /></div>
                {BRAND.contact.phone}
              </a>
              <a href={`mailto:${BRAND.contact.email}`} className="flex items-center gap-3 text-sm text-brand-text-secondary hover:text-brand-text transition-colors">
                <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center"><Mail size={14} className="text-brand-accent" /></div>
                {BRAND.contact.email}
              </a>
              <div className="flex items-center gap-3 text-sm text-brand-text-muted">
                <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center"><MapPin size={14} className="text-brand-accent" /></div>
                {BRAND.contact.address}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-brand-text-muted mb-1.5">姓名 *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-colors"
                  placeholder="您的称呼"
                />
              </div>
              <div>
                <label className="block text-xs text-brand-text-muted mb-1.5">电话 *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-colors"
                  placeholder="联系电话"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-brand-text-muted mb-1.5">房屋类型</label>
                  <select
                    value={form.propertyType}
                    onChange={e => setForm({...form, propertyType: e.target.value})}
                    className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-colors appearance-none"
                  >
                    <option value="">请选择</option>
                    <option>平层</option>
                    <option>大平层</option>
                    <option>复式</option>
                    <option>跃层</option>
                    <option>别墅</option>
                    <option>其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-brand-text-muted mb-1.5">面积（㎡）</label>
                  <input
                    type="text"
                    value={form.area}
                    onChange={e => setForm({...form, area: e.target.value})}
                    className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-colors"
                    placeholder="约多少平方"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-brand-text-muted mb-1.5">留言</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-colors resize-none"
                  placeholder="简单描述你的需求或想法（选填）"
                />
              </div>
              <Button type="submit" size="lg" loading={loading} className="w-full">
                <Send size={16} className="mr-2" />
                提交预约
              </Button>
              <p className="text-[11px] text-brand-text-muted text-center">
                我们将在 24 小时内与您联系，您的信息仅用于咨询服务
              </p>
            </form>
          </div>
        </section>
      </main>
    </>
  )
}
