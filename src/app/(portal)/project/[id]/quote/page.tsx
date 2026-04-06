'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, FileCheck, FileX, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface QuoteItem {
  id: string
  category: string
  name: string
  unit: string
  quantity: number
  unit_price: number
}

interface Quote {
  id: string
  status: string
  design_fee: number | null
  management_fee_rate: number | null
  notes: string | null
  items: QuoteItem[]
}

export default function QuotePage() {
  const { id } = useParams()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/projects/${id}/quote`)
        if (res.ok) {
          const data = await res.json()
          setQuote(data.quote)
        }
      } catch {
        // Network error
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-accent" /></div>
  }

  // No quote yet — show waiting state
  if (!quote || quote.items.length === 0) {
    return (
      <div className="pb-8">
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href={`/project/${id}`} className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
            <h1 className="text-sm font-medium">装修工程报价单</h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-24 px-6">
          <div className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center mb-4">
            <FileX size={28} className="text-brand-text-muted" />
          </div>
          <h2 className="text-base font-serif font-bold mb-2">暂无报价单</h2>
          <p className="text-sm text-brand-text-muted text-center leading-relaxed">
            设计师正在整理您的项目报价，<br />完成后将推送给您确认。
          </p>
        </div>
      </div>
    )
  }

  // Group items by category
  const categories = quote.items.reduce<Record<string, QuoteItem[]>>((acc, item) => {
    const cat = item.category || '其他'
    if (!acc[cat]) acc[cat] = []
    acc[cat] = [...acc[cat], item]
    return acc
  }, {})

  const constructionTotal = quote.items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0)
  const designFee = quote.design_fee || 0
  const managementFeeRate = quote.management_fee_rate || 0.18
  const managementFee = Math.round(constructionTotal * managementFeeRate)
  const grandTotal = designFee + constructionTotal + managementFee
  const isConfirmed = quote.status === 'confirmed'

  async function handleConfirm() {
    try {
      const res = await fetch(`/api/projects/${id}/quote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed' }),
      })
      if (res.ok) {
        setQuote(prev => prev ? { ...prev, status: 'confirmed' } : prev)
        toast.success('报价已确认')
      }
    } catch {
      toast.error('操作失败，请重试')
    }
  }

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={`/project/${id}`} className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
          <h1 className="text-sm font-medium">装修工程报价单</h1>
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Design fee */}
        {designFee > 0 && (
          <div className="flex items-center justify-between py-3 border-b border-brand-border/30">
            <span className="text-sm font-serif font-semibold">设计费</span>
            <span className="font-serif font-bold text-brand-accent-dark">¥{designFee.toLocaleString()}</span>
          </div>
        )}

        {/* Categories */}
        {Object.entries(categories).map(([catName, items]) => {
          const catTotal = items.reduce((s, i) => s + i.quantity * i.unit_price, 0)
          return (
            <div key={catName} className="py-3 border-b border-brand-border/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-serif font-semibold">{catName}</span>
                <span className="text-xs text-brand-text-muted">小计 ¥{catTotal.toLocaleString()}</span>
              </div>
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-1">
                  <span className="text-xs text-brand-text-secondary">{item.name}</span>
                  <span className="text-xs text-brand-text-muted">
                    {item.quantity}{item.unit} × ¥{item.unit_price} = ¥{(item.quantity * item.unit_price).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )
        })}

        {/* Management fee */}
        {managementFee > 0 && (
          <div className="flex items-center justify-between py-3 border-b border-brand-border/30">
            <div>
              <span className="text-sm font-serif font-semibold">施工管理费</span>
              <p className="text-[11px] text-brand-text-muted">工程造价 × {Math.round(managementFeeRate * 100)}%</p>
            </div>
            <span className="font-serif font-bold text-brand-accent-dark">¥{managementFee.toLocaleString()}</span>
          </div>
        )}

        {/* Grand total */}
        <div className="flex items-center justify-between py-4">
          <span className="text-base font-serif font-bold">合计</span>
          <span className="text-xl font-serif font-bold text-brand-accent">¥{grandTotal.toLocaleString()}</span>
        </div>

        {quote.notes && (
          <p className="text-[11px] text-brand-text-muted mb-6 leading-relaxed">{quote.notes}</p>
        )}

        {!isConfirmed ? (
          <Button size="lg" className="w-full" onClick={handleConfirm}>
            <FileCheck size={16} className="mr-2" />
            确认报价单
          </Button>
        ) : (
          <div className="text-center py-4 bg-green-50 rounded-xl border border-brand-success/20">
            <FileCheck size={24} className="text-brand-success mx-auto mb-2" />
            <p className="text-sm font-medium text-brand-success">报价已确认</p>
          </div>
        )}
      </div>
    </div>
  )
}
