'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Check, Package, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ProjectMaterial {
  id: string
  category: string
  brand: string
  model: string | null
  specification: string | null
  unit: string
  unit_price: number
  quantity: number
  client_confirmed: boolean
}

export default function MaterialsPage() {
  const { id } = useParams()
  const [materials, setMaterials] = useState<ProjectMaterial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/projects/${id}/materials`)
        if (res.ok) {
          const data = await res.json()
          setMaterials(data.materials || [])
        }
      } catch {
        // Network error
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function handleConfirm(materialId: string) {
    try {
      const res = await fetch(`/api/projects/${id}/materials`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialId }),
      })
      if (res.ok) {
        setMaterials(prev => prev.map(m => m.id === materialId ? { ...m, client_confirmed: true } : m))
        toast.success('材料已确认')
      }
    } catch {
      toast.error('操作失败')
    }
  }

  const total = materials.reduce((s, m) => s + m.unit_price * m.quantity, 0)
  const confirmedCount = materials.filter(m => m.client_confirmed).length

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-accent" /></div>
  }

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={`/project/${id}`} className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
          <div className="flex-1">
            <h1 className="text-sm font-medium">材料清单</h1>
            {materials.length > 0 && <p className="text-[11px] text-brand-text-muted">{confirmedCount}/{materials.length} 项已确认</p>}
          </div>
          {total > 0 && <Badge variant="accent">¥{(total / 10000).toFixed(1)}万</Badge>}
        </div>
      </div>

      {materials.length === 0 ? (
        <div className="text-center py-20">
          <Package size={32} className="text-brand-border mx-auto mb-3" />
          <p className="text-brand-text-muted text-sm">暂无材料清单</p>
          <p className="text-brand-text-muted text-xs mt-1">设计师确认材料后将在这里显示</p>
        </div>
      ) : (
        <div className="px-4 pt-4 space-y-3">
          {materials.map((m) => (
            <Card key={m.id} padding="sm" className={m.client_confirmed ? 'border-brand-success/20' : ''}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-bg flex items-center justify-center shrink-0">
                  <Package size={18} className="text-brand-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-brand-accent">{m.category}</span>
                    {m.client_confirmed && <Check size={12} className="text-brand-success" />}
                  </div>
                  <h3 className="text-sm font-medium">{m.brand} {m.model || ''}</h3>
                  {m.specification && <p className="text-[11px] text-brand-text-muted">{m.specification} · {m.unit}</p>}
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-sm font-serif font-bold text-brand-accent-dark">¥{m.unit_price.toLocaleString()}/{m.unit}</span>
                    <span className="text-[11px] text-brand-text-muted">× {m.quantity} = ¥{(m.unit_price * m.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              {!m.client_confirmed && (
                <div className="mt-3 pt-3 border-t border-brand-border/30">
                  <Button size="sm" variant="outline" className="w-full" onClick={() => handleConfirm(m.id)}>确认此材料</Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
