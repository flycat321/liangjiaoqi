'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, FileText, Loader2, Save } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

interface QuoteItem {
  category: string
  name: string
  unit: string
  quantity: number
  unit_price: number
}

export default function AdminProjectQuotePage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [designFee, setDesignFee] = useState('')
  const [managementRate, setManagementRate] = useState('18')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<QuoteItem[]>([])
  const [hasExisting, setHasExisting] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/projects/${id}/quote`)
      .then(r => r.json())
      .then(d => {
        if (d.quote) {
          setDesignFee(String(d.quote.subtotal_design || ''))
          setManagementRate(String((d.quote.management_fee_rate || 0.18) * 100))
          setNotes(d.quote.notes || '')
          setHasExisting(true)
        }
        if (d.items?.length > 0) {
          setItems(d.items.map((i: { category: string; item_name: string; unit: string; quantity: number; unit_price: number }) => ({
            category: i.category, name: i.item_name, unit: i.unit || '',
            quantity: Number(i.quantity), unit_price: Number(i.unit_price),
          })))
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  function addItem() {
    setItems(prev => [...prev, { category: '', name: '', unit: '项', quantity: 1, unit_price: 0 }])
  }

  function updateItem(idx: number, key: string, value: string | number) {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [key]: value } : item))
  }

  function removeItem(idx: number) {
    setItems(prev => prev.filter((_, i) => i !== idx))
  }

  async function handleSave() {
    if (items.length === 0) { toast.error('请至少添加一项报价'); return }
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/projects/${id}/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designFee: Number(designFee) || 0,
          managementRate: Number(managementRate) / 100,
          notes,
          items: items.filter(i => i.name && i.unit_price > 0),
        }),
      })
      if (res.ok) {
        toast.success('报价单已保存，客户可在线查看')
        setHasExisting(true)
      } else {
        const data = await res.json()
        toast.error(data.error || '保存失败')
      }
    } catch { toast.error('网络错误') }
    setSaving(false)
  }

  const constructionTotal = items.reduce((s, i) => s + i.quantity * i.unit_price, 0)
  const mgmtFee = Math.round(constructionTotal * (Number(managementRate) / 100))
  const grandTotal = (Number(designFee) || 0) + constructionTotal + mgmtFee

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-accent" /></div>

  return (
    <div className="pb-8">
      <div className="sticky top-[52px] z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={`/admin/projects/${id}`} className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
          <div className="flex-1">
            <h1 className="text-sm font-medium">报价单编辑</h1>
            {hasExisting && <p className="text-[11px] text-brand-success">已有报价单</p>}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Design fee + management rate */}
        <Card>
          <h3 className="text-xs font-medium mb-3">基础费用</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-brand-text-muted mb-1">设计费 (元)</label>
              <input value={designFee} onChange={e => setDesignFee(e.target.value)} type="number" placeholder="0"
                className="w-full h-10 px-3 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
            </div>
            <div>
              <label className="block text-[11px] text-brand-text-muted mb-1">管理费比例 (%)</label>
              <input value={managementRate} onChange={e => setManagementRate(e.target.value)} type="number" placeholder="18"
                className="w-full h-10 px-3 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
            </div>
          </div>
        </Card>

        {/* Quote items */}
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium">施工分项 ({items.length})</h3>
          <button onClick={addItem} className="flex items-center gap-1 text-xs text-brand-accent touch-manipulation">
            <Plus size={14} /> 添加项目
          </button>
        </div>

        {items.map((item, idx) => (
          <Card key={idx} padding="sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-brand-text-muted">第 {idx + 1} 项</span>
              <button onClick={() => removeItem(idx)} className="text-brand-text-muted hover:text-red-500 touch-manipulation"><Trash2 size={13} /></button>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input value={item.category} onChange={e => updateItem(idx, 'category', e.target.value)} placeholder="分类（如：水电）"
                  className="h-9 px-2.5 rounded-lg border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
                <input value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)} placeholder="名称 *"
                  className="h-9 px-2.5 rounded-lg border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input value={item.unit_price || ''} onChange={e => updateItem(idx, 'unit_price', Number(e.target.value))} placeholder="单价 *" type="number"
                  className="h-9 px-2.5 rounded-lg border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
                <input value={item.quantity || ''} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))} placeholder="数量" type="number"
                  className="h-9 px-2.5 rounded-lg border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
                <input value={item.unit} onChange={e => updateItem(idx, 'unit', e.target.value)} placeholder="单位"
                  className="h-9 px-2.5 rounded-lg border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
              </div>
              <p className="text-right text-[11px] text-brand-text-muted">小计 ¥{(item.quantity * item.unit_price).toLocaleString()}</p>
            </div>
          </Card>
        ))}

        {items.length === 0 && (
          <div className="text-center py-10">
            <FileText size={28} className="text-brand-border mx-auto mb-2" />
            <p className="text-xs text-brand-text-muted">点击"添加项目"开始编辑报价</p>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-[11px] text-brand-text-muted mb-1">备注说明</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="如：以上报价不含主材..."
            className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 resize-none" />
        </div>

        {/* Total summary */}
        <Card className="bg-brand-bg border-none">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-brand-text-secondary">设计费</span><span>¥{(Number(designFee) || 0).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-brand-text-secondary">施工费</span><span>¥{constructionTotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-brand-text-secondary">管理费 ({managementRate}%)</span><span>¥{mgmtFee.toLocaleString()}</span></div>
            <div className="flex justify-between pt-2 border-t border-brand-border/30 font-serif font-bold">
              <span>合计</span><span className="text-brand-accent text-lg">¥{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <Button size="lg" className="w-full" loading={saving} onClick={handleSave}>
          <Save size={16} className="mr-2" /> 保存报价单
        </Button>
        <p className="text-[11px] text-brand-text-muted text-center">保存后客户可在项目页查看并确认报价</p>
      </div>
    </div>
  )
}
