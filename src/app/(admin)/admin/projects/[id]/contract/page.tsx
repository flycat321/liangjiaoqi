'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Save, Loader2, FileText } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

interface FeeItem {
  category: string
  name: string
  unit: string
  quantity: number
  unitPrice: number
  total: number
}

const CONSTRUCTION_TEMPLATES = ['水电工程', '防水工程', '瓦工工程', '木工工程', '油漆工程']
const SPECIAL_TEMPLATES = ['全屋智能', '全屋定制', '家具', '电器', '软装']

export default function AdminProjectContractPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [area, setArea] = useState(0)
  const [designFeePerSqm, setDesignFeePerSqm] = useState('')
  const [notes, setNotes] = useState('')
  const [constructionItems, setConstructionItems] = useState<FeeItem[]>([])
  const [specialItems, setSpecialItems] = useState<FeeItem[]>([])

  useEffect(() => {
    fetch(`/api/admin/projects/${id}/contract-fee`)
      .then(r => r.json())
      .then(d => {
        setArea(d.area || 0)
        if (d.quote) {
          setDesignFeePerSqm(String(d.quote.design_fee_per_sqm || ''))
          setNotes(d.quote.notes || '')
        }
        if (d.items?.length > 0) {
          const ci: FeeItem[] = []
          const si: FeeItem[] = []
          for (const item of d.items) {
            const fi: FeeItem = {
              category: item.category,
              name: item.item_name,
              unit: item.unit || '项',
              quantity: Number(item.quantity || 1),
              unitPrice: Number(item.unit_price || 0),
              total: Number(item.total_price || 0),
            }
            if (item.category === '专项费用') si.push(fi)
            else ci.push(fi)
          }
          setConstructionItems(ci)
          setSpecialItems(si)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  function addConstructionItem() {
    setConstructionItems(prev => [...prev, { category: '施工费', name: '', unit: '项', quantity: 1, unitPrice: 0, total: 0 }])
  }
  function addSpecialItem() {
    setSpecialItems(prev => [...prev, { category: '专项费用', name: '', unit: '项', quantity: 1, unitPrice: 0, total: 0 }])
  }

  function updateItem(list: FeeItem[], setList: (fn: (prev: FeeItem[]) => FeeItem[]) => void, idx: number, key: string, value: string | number) {
    setList(prev => prev.map((item, i) => {
      if (i !== idx) return item
      const updated = { ...item, [key]: value }
      if (key === 'quantity' || key === 'unitPrice') {
        updated.total = Number(updated.quantity) * Number(updated.unitPrice)
      }
      return updated
    }))
  }

  function removeItem(setList: (fn: (prev: FeeItem[]) => FeeItem[]) => void, idx: number) {
    setList(prev => prev.filter((_, i) => i !== idx))
  }

  function quickAddConstruction(name: string) {
    if (constructionItems.some(i => i.name === name)) return
    setConstructionItems(prev => [...prev, { category: '施工费', name, unit: '项', quantity: 1, unitPrice: 0, total: 0 }])
  }
  function quickAddSpecial(name: string) {
    if (specialItems.some(i => i.name === name)) return
    setSpecialItems(prev => [...prev, { category: '专项费用', name, unit: '项', quantity: 1, unitPrice: 0, total: 0 }])
  }

  const designFee = (Number(designFeePerSqm) || 0) * area
  const constructionTotal = constructionItems.reduce((s, i) => s + i.total, 0)
  const specialTotal = specialItems.reduce((s, i) => s + i.total, 0)
  const constructionMgmt = Math.round(constructionTotal * 0.15)
  const specialMgmt = Math.round(specialTotal * 0.10)
  const grandTotal = designFee + constructionTotal + specialTotal + constructionMgmt + specialMgmt

  async function handleSave() {
    setSaving(true)
    try {
      const allItems = [
        ...constructionItems.map(i => ({ ...i, category: '施工费' })),
        ...specialItems.map(i => ({ ...i, category: '专项费用' })),
      ]
      const res = await fetch(`/api/admin/projects/${id}/contract-fee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          area,
          designFeePerSqm: Number(designFeePerSqm) || 0,
          notes,
          items: allItems,
        }),
      })
      if (res.ok) toast.success('合同费用已保存，客户可在线查看')
      else toast.error((await res.json()).error || '保存失败')
    } catch { toast.error('网络错误') }
    setSaving(false)
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-accent" /></div>

  return (
    <div className="pb-8">
      <div className="sticky top-[52px] z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={`/admin/projects/${id}`} className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
          <h1 className="text-sm font-medium flex-1">合同与费用</h1>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* 1. Design Fee */}
        <Card>
          <h3 className="text-xs font-medium text-brand-accent mb-3">一、设计费</h3>
          <div className="flex items-center gap-2 text-sm mb-2">
            <span className="text-brand-text-secondary">房屋面积</span>
            <span className="font-medium">{area} ㎡</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-brand-text-secondary shrink-0">单价</span>
            <input value={designFeePerSqm} onChange={e => setDesignFeePerSqm(e.target.value)} type="number" placeholder="元/㎡"
              className="w-24 h-9 px-2.5 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
            <span className="text-sm text-brand-text-secondary">元/㎡</span>
          </div>
          <div className="mt-2 text-right text-sm font-serif font-bold text-brand-accent">
            设计费 = {area} × {Number(designFeePerSqm) || 0} = ¥{designFee.toLocaleString()}
          </div>
        </Card>

        {/* 2. Construction Costs */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-brand-accent">二、施工费（人工+辅材）</h3>
            <button onClick={addConstructionItem} className="flex items-center gap-1 text-xs text-brand-accent touch-manipulation"><Plus size={13} /> 添加</button>
          </div>
          {/* Quick add */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {CONSTRUCTION_TEMPLATES.map(t => (
              <button key={t} onClick={() => quickAddConstruction(t)}
                className="text-[11px] px-2 py-1 rounded-md bg-brand-bg text-brand-text-secondary hover:bg-brand-accent/10 touch-manipulation">{t}</button>
            ))}
          </div>
          {constructionItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input value={item.name} onChange={e => updateItem(constructionItems, setConstructionItems, idx, 'name', e.target.value)} placeholder="名称"
                className="flex-1 h-9 px-2.5 rounded-lg border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
              <input value={item.unitPrice || ''} onChange={e => updateItem(constructionItems, setConstructionItems, idx, 'unitPrice', Number(e.target.value))} placeholder="金额" type="number"
                className="w-24 h-9 px-2.5 rounded-lg border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
              <span className="text-xs text-brand-text-muted shrink-0">元</span>
              <button onClick={() => removeItem(setConstructionItems, idx)} className="text-brand-text-muted hover:text-red-500 touch-manipulation"><Trash2 size={13} /></button>
            </div>
          ))}
          <div className="text-right text-sm font-medium mt-2">小计 ¥{constructionTotal.toLocaleString()}</div>
          <div className="text-right text-xs text-brand-text-muted">管理费 15% = ¥{constructionMgmt.toLocaleString()}</div>
        </Card>

        {/* 3. Special Costs */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-brand-accent">三、专项费用</h3>
            <button onClick={addSpecialItem} className="flex items-center gap-1 text-xs text-brand-accent touch-manipulation"><Plus size={13} /> 添加</button>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {SPECIAL_TEMPLATES.map(t => (
              <button key={t} onClick={() => quickAddSpecial(t)}
                className="text-[11px] px-2 py-1 rounded-md bg-brand-bg text-brand-text-secondary hover:bg-brand-accent/10 touch-manipulation">{t}</button>
            ))}
          </div>
          {specialItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input value={item.name} onChange={e => updateItem(specialItems, setSpecialItems, idx, 'name', e.target.value)} placeholder="名称"
                className="flex-1 h-9 px-2.5 rounded-lg border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
              <input value={item.unitPrice || ''} onChange={e => updateItem(specialItems, setSpecialItems, idx, 'unitPrice', Number(e.target.value))} placeholder="金额" type="number"
                className="w-24 h-9 px-2.5 rounded-lg border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
              <span className="text-xs text-brand-text-muted shrink-0">元</span>
              <button onClick={() => removeItem(setSpecialItems, idx)} className="text-brand-text-muted hover:text-red-500 touch-manipulation"><Trash2 size={13} /></button>
            </div>
          ))}
          <div className="text-right text-sm font-medium mt-2">小计 ¥{specialTotal.toLocaleString()}</div>
          <div className="text-right text-xs text-brand-text-muted">管理费 10% = ¥{specialMgmt.toLocaleString()}</div>
        </Card>

        {/* Notes */}
        <div>
          <label className="block text-[11px] text-brand-text-muted mb-1">备注说明</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="合同补充说明..."
            className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 resize-none" />
        </div>

        {/* Summary */}
        <Card className="bg-brand-bg border-none">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-brand-text-secondary">设计费</span><span>¥{designFee.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-brand-text-secondary">施工费</span><span>¥{constructionTotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-brand-text-secondary">专项费用</span><span>¥{specialTotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-brand-text-secondary">施工管理费 (15%)</span><span>¥{constructionMgmt.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-brand-text-secondary">专项管理费 (10%)</span><span>¥{specialMgmt.toLocaleString()}</span></div>
            <div className="flex justify-between pt-2 border-t border-brand-border/30 font-serif font-bold text-base">
              <span>合同总价</span><span className="text-brand-accent text-xl">¥{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <Button size="lg" className="w-full" loading={saving} onClick={handleSave}>
          <Save size={16} className="mr-2" /> 保存合同费用
        </Button>
        <p className="text-[11px] text-brand-text-muted text-center">保存后客户可在项目页查看费用明细</p>
      </div>
    </div>
  )
}
