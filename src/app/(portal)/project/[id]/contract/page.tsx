'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText, FileCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

interface FeeItem {
  category: string
  item_name: string
  total_price: number
}

interface QuoteData {
  design_fee_per_sqm: number
  subtotal_design: number
  total_amount: number
  notes: string | null
  client_confirmed: boolean
}

export default function ContractPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [area, setArea] = useState(0)
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [items, setItems] = useState<FeeItem[]>([])

  useEffect(() => {
    fetch(`/api/admin/projects/${id}/contract-fee`)
      .then(r => r.json())
      .then(d => {
        setArea(d.area || 0)
        setQuote(d.quote)
        setItems(d.items || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-accent" /></div>

  if (!quote || items.length === 0) {
    return (
      <div className="pb-8">
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href={`/project/${id}`} className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
            <h1 className="text-sm font-medium">合同费用明细</h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-24 px-6">
          <FileText size={32} className="text-brand-border mb-3" />
          <h2 className="text-base font-serif font-bold mb-2">暂无合同费用</h2>
          <p className="text-sm text-brand-text-muted text-center">设计师正在整理费用明细，完成后将推送给您确认。</p>
        </div>
      </div>
    )
  }

  const constructionItems = items.filter(i => i.category === '施工费')
  const specialItems = items.filter(i => i.category === '专项费用')
  const constructionTotal = constructionItems.reduce((s, i) => s + Number(i.total_price || 0), 0)
  const specialTotal = specialItems.reduce((s, i) => s + Number(i.total_price || 0), 0)
  const constructionMgmt = Math.round(constructionTotal * 0.15)
  const specialMgmt = Math.round(specialTotal * 0.10)
  const designFee = Number(quote.subtotal_design || 0)
  const grandTotal = Number(quote.total_amount || 0)

  async function handleConfirm() {
    try {
      // Reuse the existing quote confirm API
      const res = await fetch(`/api/projects/${id}/quote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed' }),
      })
      if (res.ok) {
        setQuote(prev => prev ? { ...prev, client_confirmed: true } : prev)
        toast.success('合同费用已确认')
      }
    } catch { toast.error('操作失败') }
  }

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={`/project/${id}`} className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
          <h1 className="text-sm font-medium">合同费用明细</h1>
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Design Fee */}
        <div className="py-3 border-b border-brand-border/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-serif font-semibold">一、设计费</span>
            <span className="font-serif font-bold text-brand-accent-dark">¥{designFee.toLocaleString()}</span>
          </div>
          <p className="text-[11px] text-brand-text-muted mt-1">{area}㎡ × ¥{Number(quote.design_fee_per_sqm || 0)}/㎡</p>
        </div>

        {/* Construction */}
        {constructionItems.length > 0 && (
          <div className="py-3 border-b border-brand-border/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-serif font-semibold">二、施工费（人工+辅材）</span>
              <span className="text-xs text-brand-text-muted">小计 ¥{constructionTotal.toLocaleString()}</span>
            </div>
            {constructionItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <span className="text-xs text-brand-text-secondary">{item.item_name}</span>
                <span className="text-xs text-brand-text-muted">¥{Number(item.total_price || 0).toLocaleString()}</span>
              </div>
            ))}
            <div className="text-right text-[11px] text-brand-text-muted mt-1">施工管理费 15% = ¥{constructionMgmt.toLocaleString()}</div>
          </div>
        )}

        {/* Special */}
        {specialItems.length > 0 && (
          <div className="py-3 border-b border-brand-border/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-serif font-semibold">三、专项费用</span>
              <span className="text-xs text-brand-text-muted">小计 ¥{specialTotal.toLocaleString()}</span>
            </div>
            {specialItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <span className="text-xs text-brand-text-secondary">{item.item_name}</span>
                <span className="text-xs text-brand-text-muted">¥{Number(item.total_price || 0).toLocaleString()}</span>
              </div>
            ))}
            <div className="text-right text-[11px] text-brand-text-muted mt-1">专项管理费 10% = ¥{specialMgmt.toLocaleString()}</div>
          </div>
        )}

        {/* Grand total */}
        <div className="flex items-center justify-between py-4">
          <span className="text-base font-serif font-bold">合同总价</span>
          <span className="text-xl font-serif font-bold text-brand-accent">¥{grandTotal.toLocaleString()}</span>
        </div>

        {quote.notes && <p className="text-[11px] text-brand-text-muted mb-6 leading-relaxed">{quote.notes}</p>}

        {!quote.client_confirmed ? (
          <Button size="lg" className="w-full" onClick={handleConfirm}>
            <FileCheck size={16} className="mr-2" /> 确认合同费用
          </Button>
        ) : (
          <div className="text-center py-4 bg-green-50 rounded-xl border border-brand-success/20">
            <FileCheck size={24} className="text-brand-success mx-auto mb-2" />
            <p className="text-sm font-medium text-brand-success">合同费用已确认</p>
          </div>
        )}
      </div>
    </div>
  )
}
