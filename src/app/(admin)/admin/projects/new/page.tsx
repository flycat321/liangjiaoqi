'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { STAGE_DEFINITIONS } from '@/lib/constants/stages'

interface ClientOption {
  id: string
  name: string
  phone: string
}

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<ClientOption[]>([])
  const [form, setForm] = useState({
    name: '', clientId: '', address: '', area: '', propertyType: '',
    designer: '', projectManager: '', startDate: '', expectedEndDate: '', notes: '',
  })

  useEffect(() => {
    async function loadClients() {
      const supabase = createClient()
      const { data } = await supabase
        .from('clients')
        .select('id, name, phone')
        .order('created_at', { ascending: false })
      setClients(data || [])
    }
    loadClients()
  }, [])

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.address) { toast.error('请填写项目名称和地址'); return }
    if (!form.clientId) { toast.error('请选择关联客户'); return }

    setLoading(true)
    try {
      const supabase = createClient()

      // Create project
      const { data: project, error: projErr } = await supabase
        .from('projects')
        .insert({
          client_id: form.clientId,
          name: form.name,
          address: form.address,
          area: form.area ? Number(form.area) : null,
          property_type: form.propertyType || null,
          status: 'in_progress',
          current_stage_order: 1,
          start_date: form.startDate || null,
          expected_end_date: form.expectedEndDate || null,
          notes: form.notes || null,
        })
        .select('id')
        .single()

      if (projErr) throw new Error(projErr.message)

      // Create 11 stages + items
      for (const stage of STAGE_DEFINITIONS) {
        const { data: stageData, error: stageErr } = await supabase
          .from('project_stages')
          .insert({
            project_id: project.id,
            stage_order: stage.order,
            name: stage.name,
            description: stage.description,
            status: stage.order === 1 ? 'in_progress' : 'locked',
          })
          .select('id')
          .single()

        if (stageErr) throw new Error(stageErr.message)

        const items = stage.items.map((item, idx) => ({
          stage_id: stageData.id,
          item_code: item.code,
          category: item.category,
          name: item.name,
          standard: item.standard,
          responsible: item.responsible,
          status: 'pending' as const,
          photo_required: item.photoRequired,
          client_confirmation_required: item.clientConfirmationRequired,
          sort_order: idx,
        }))
        await supabase.from('stage_items').insert(items)
      }

      toast.success('项目已创建，11个阶段已自动生成')
      router.push('/admin/projects')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '创建失败'
      toast.error(msg)
    }
    setLoading(false)
  }

  return (
    <div className="pb-8">
      <div className="sticky top-[52px] z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/projects" className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
          <h1 className="text-sm font-medium">新建项目</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 pt-4 space-y-4">
        <div>
          <label className="block text-xs text-brand-text-muted mb-1.5">项目名称 *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)}
            className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors"
            placeholder="如：张先生·曲江大平层" />
        </div>

        <div>
          <label className="block text-xs text-brand-text-muted mb-1.5">关联客户 *</label>
          <select value={form.clientId} onChange={e => set('clientId', e.target.value)}
            className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors appearance-none">
            <option value="">选择客户</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-brand-text-muted mb-1.5">施工地址 *</label>
          <input value={form.address} onChange={e => set('address', e.target.value)}
            className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors"
            placeholder="详细地址" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-brand-text-muted mb-1.5">面积（㎡）</label>
            <input value={form.area} onChange={e => set('area', e.target.value)} type="number"
              className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-brand-text-muted mb-1.5">户型</label>
            <select value={form.propertyType} onChange={e => set('propertyType', e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors appearance-none">
              <option value="">选择</option>
              <option>平层</option><option>大平层</option><option>复式</option>
              <option>跃层</option><option>别墅</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-brand-text-muted mb-1.5">开工日期</label>
            <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-brand-text-muted mb-1.5">预计竣工</label>
            <input type="date" value={form.expectedEndDate} onChange={e => set('expectedEndDate', e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-brand-text-muted mb-1.5">备注</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
            className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors resize-none"
            placeholder="项目备注（选填）" />
        </div>

        <Button type="submit" size="lg" loading={loading} className="w-full">
          创建项目
        </Button>
        <p className="text-[11px] text-brand-text-muted text-center">
          创建后将自动生成 11 个阶段及 90+ 个检查项
        </p>
      </form>
    </div>
  )
}
