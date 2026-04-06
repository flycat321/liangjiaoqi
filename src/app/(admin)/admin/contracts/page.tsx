'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Plus, FileText, Check, Eye, Send, Loader2, X, Pencil, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Contract {
  id: string
  title: string
  status: string
  signed_at: string | null
  created_at: string
  design_fee: number | null
  construction_fee: number | null
  management_fee_rate: number | null
  content_html: string | null
  projects: { id: string; name: string; address: string; area: number | null; clients: { name: string; phone: string } | null } | null
}

interface ProjectOption { id: string; name: string }

type View = 'list' | 'create' | 'edit'

const statusCfg: Record<string, { badge: 'default' | 'warning' | 'accent' | 'success'; label: string }> = {
  draft: { badge: 'default', label: '草稿' },
  sent: { badge: 'warning', label: '已发送' },
  viewed: { badge: 'accent', label: '已查看' },
  signed: { badge: 'success', label: '已签署' },
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [projects, setProjects] = useState<ProjectOption[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('list')
  const [saving, setSaving] = useState(false)
  const [editContract, setEditContract] = useState<Contract | null>(null)
  const [form, setForm] = useState({
    projectId: '', title: '住宅装饰装修工程施工合同',
    designFee: '', constructionFee: '', managementFeeRate: '18',
  })

  async function load() {
    const supabase = createClient()
    const [{ data: cData }, { data: pData }] = await Promise.all([
      supabase.from('contracts').select('*, projects(id, name, address, area, clients(name, phone))').order('created_at', { ascending: false }),
      supabase.from('projects').select('id, name').order('created_at', { ascending: false }),
    ])
    setContracts((cData as unknown as Contract[]) || [])
    setProjects(pData || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.projectId) { toast.error('请选择项目'); return }
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('contracts').insert({
      project_id: form.projectId,
      title: form.title,
      status: 'draft',
      design_fee: form.designFee ? Number(form.designFee) : null,
      construction_fee: form.constructionFee ? Number(form.constructionFee) : null,
      management_fee_rate: form.managementFeeRate ? Number(form.managementFeeRate) : null,
    })
    if (error) { toast.error(error.message) } else {
      toast.success('合同已创建')
      setView('list')
      setForm({ projectId: '', title: '住宅装饰装修工程施工合同', designFee: '', constructionFee: '', managementFeeRate: '18' })
      await load()
    }
    setSaving(false)
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editContract) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('contracts').update({
      title: form.title,
      design_fee: form.designFee ? Number(form.designFee) : null,
      construction_fee: form.constructionFee ? Number(form.constructionFee) : null,
      management_fee_rate: form.managementFeeRate ? Number(form.managementFeeRate) : null,
    }).eq('id', editContract.id)
    if (error) { toast.error(error.message) } else {
      toast.success('合同已更新')
      setView('list')
      setEditContract(null)
      await load()
    }
    setSaving(false)
  }

  async function handleSend(contractId: string) {
    const supabase = createClient()
    await supabase.from('contracts').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', contractId)
    toast.success('合同已发送给客户')
    await load()
  }

  function openEdit(c: Contract) {
    setEditContract(c)
    setForm({
      projectId: c.projects?.id || '',
      title: c.title,
      designFee: c.design_fee?.toString() || '',
      constructionFee: c.construction_fee?.toString() || '',
      managementFeeRate: c.management_fee_rate?.toString() || '18',
    })
    setView('edit')
  }

  // Contract form (shared between create and edit)
  function renderForm(isEdit: boolean) {
    const totalMgmt = form.constructionFee && form.managementFeeRate
      ? Math.round(Number(form.constructionFee) * Number(form.managementFeeRate) / 100)
      : 0
    const grandTotal = (Number(form.designFee) || 0) + (Number(form.constructionFee) || 0) + totalMgmt

    return (
      <div className="pb-8">
        <div className="sticky top-[52px] z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => { setView('list'); setEditContract(null) }} className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></button>
            <h1 className="text-sm font-medium">{isEdit ? '编辑合同' : '新建合同'}</h1>
          </div>
        </div>
        <form onSubmit={isEdit ? handleUpdate : handleCreate} className="px-4 pt-4 space-y-4">
          {!isEdit && (
            <div>
              <label className="block text-xs text-brand-text-muted mb-1.5">关联项目 *</label>
              <select value={form.projectId} onChange={e => setForm(p => ({ ...p, projectId: e.target.value }))}
                className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 appearance-none">
                <option value="">选择项目</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs text-brand-text-muted mb-1.5">合同标题</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
          </div>
          <div>
            <label className="block text-xs text-brand-text-muted mb-1.5">方案设计费（元）</label>
            <input type="number" value={form.designFee} onChange={e => setForm(p => ({ ...p, designFee: e.target.value }))}
              className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
              placeholder="如：37200" />
          </div>
          <div>
            <label className="block text-xs text-brand-text-muted mb-1.5">施工费（元）</label>
            <input type="number" value={form.constructionFee} onChange={e => setForm(p => ({ ...p, constructionFee: e.target.value }))}
              className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
              placeholder="如：150000" />
          </div>
          <div>
            <label className="block text-xs text-brand-text-muted mb-1.5">施工管理费率（%）</label>
            <input type="number" value={form.managementFeeRate} onChange={e => setForm(p => ({ ...p, managementFeeRate: e.target.value }))}
              className="w-full h-11 px-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
              placeholder="18" />
          </div>

          {grandTotal > 0 && (
            <Card className="bg-brand-bg border-none">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-brand-text-secondary">方案设计费</span><span className="font-serif font-bold">¥{Number(form.designFee || 0).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-brand-text-secondary">施工费</span><span className="font-serif font-bold">¥{Number(form.constructionFee || 0).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-brand-text-secondary">施工管理费（{form.managementFeeRate}%）</span><span className="font-serif font-bold">¥{totalMgmt.toLocaleString()}</span></div>
                <div className="flex justify-between pt-2 border-t border-brand-border/30">
                  <span className="font-medium">合同总额</span>
                  <span className="font-serif font-bold text-brand-accent text-lg">¥{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          )}

          <Button type="submit" size="lg" loading={saving} className="w-full">
            {isEdit ? '保存修改' : '创建合同'}
          </Button>
        </form>
      </div>
    )
  }

  if (view === 'create') return renderForm(false)
  if (view === 'edit') return renderForm(true)

  // List view
  const signedContracts = contracts.filter(c => c.status === 'signed')
  const otherContracts = contracts.filter(c => c.status !== 'signed')

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-serif font-bold">合同管理</h1>
        <Button size="sm" onClick={() => setView('create')}>
          <Plus size={14} className="mr-1" /> 新建合同
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-accent" /></div>
      ) : contracts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brand-text-muted text-sm">暂无合同</p>
        </div>
      ) : (
        <>
          {otherContracts.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs text-brand-text-muted tracking-wider mb-3">待处理</h2>
              <div className="space-y-3">
                {otherContracts.map((c) => {
                  const cfg = statusCfg[c.status] || statusCfg.draft
                  return (
                    <Card key={c.id}>
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-9 h-9 rounded-lg bg-brand-accent/10 flex items-center justify-center shrink-0">
                          <FileText size={16} className="text-brand-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium">{c.projects?.name || '未关联项目'}</h3>
                          <p className="text-[11px] text-brand-text-muted mt-0.5">{c.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={cfg.badge}>{cfg.label}</Badge>
                            {c.design_fee && <span className="text-[11px] text-brand-text-muted">设计费 ¥{c.design_fee.toLocaleString()}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-brand-border/30">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(c)}>
                          <Pencil size={12} className="mr-1" /> 编辑
                        </Button>
                        {c.status === 'draft' && (
                          <Button size="sm" className="flex-1" onClick={() => handleSend(c.id)}>
                            <Send size={12} className="mr-1" /> 发送给客户
                          </Button>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {signedContracts.length > 0 && (
            <div>
              <h2 className="text-xs text-brand-text-muted tracking-wider mb-3">已签署</h2>
              <div className="space-y-3">
                {signedContracts.map((c) => (
                  <Card key={c.id}>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                        <Check size={16} className="text-brand-success" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium">{c.projects?.name || ''}</h3>
                        <p className="text-[11px] text-brand-text-muted mt-0.5">{c.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="success">已签署</Badge>
                          {c.signed_at && <span className="text-[11px] text-brand-text-muted">{c.signed_at.slice(0, 10)}</span>}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
