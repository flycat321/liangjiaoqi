'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Check, Circle, Camera, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface StageItem {
  id: string
  item_code: string
  category: string
  name: string
  standard: string
  responsible: string
  status: string
  photo_required: boolean
  client_confirmation_required: boolean
}

interface Stage {
  id: string
  name: string
  stage_order: number
}

export default function StageDetailPage() {
  const { id, stageId } = useParams()
  const [stage, setStage] = useState<Stage | null>(null)
  const [items, setItems] = useState<StageItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: stageData } = await supabase
        .from('project_stages')
        .select('id, name, stage_order')
        .eq('project_id', id)
        .eq('stage_order', Number(stageId))
        .single()

      if (stageData) {
        setStage(stageData)
        const { data: itemsData } = await supabase
          .from('stage_items')
          .select('*')
          .eq('stage_id', stageData.id)
          .order('sort_order')
        setItems(itemsData || [])
      }
      setLoading(false)
    }
    load()
  }, [id, stageId])

  async function handleConfirm(itemId: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('stage_items')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', itemId)
    if (error) { toast.error(error.message); return }
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, status: 'completed' } : i))
    toast.success('已确认')
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-accent" /></div>
  }

  if (!stage) {
    return <div className="p-4 text-center text-brand-text-muted">阶段不存在</div>
  }

  const completedCount = items.filter(i => i.status === 'completed').length
  const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0

  // Group by category
  const categories = new Map<string, StageItem[]>()
  for (const item of items) {
    const arr = categories.get(item.category) || []
    arr.push(item)
    categories.set(item.category, arr)
  }

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={`/project/${id}`} className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-medium truncate">{stage.name}</h1>
            <p className="text-[11px] text-brand-text-muted">{completedCount}/{items.length} 项完成 · {progress}%</p>
          </div>
          <Badge variant="accent">阶段 {stage.stage_order}/11</Badge>
        </div>
      </div>

      <div className="px-4 py-3 bg-brand-bg border-b border-brand-border/30">
        <div className="h-1.5 rounded-full bg-brand-border/50 overflow-hidden">
          <div className="h-full rounded-full bg-brand-accent transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="px-4 pt-4 space-y-6">
        {Array.from(categories.entries()).map(([category, catItems]) => (
          <div key={category}>
            <h3 className="text-xs text-brand-text-muted tracking-wider mb-3 uppercase">{category}</h3>
            <div className="space-y-2">
              {catItems.map((item) => {
                const isCompleted = item.status === 'completed'
                const needsConfirm = item.client_confirmation_required && !isCompleted

                return (
                  <div key={item.id} className={cn(
                    'rounded-xl border p-3 transition-colors',
                    isCompleted ? 'border-brand-success/20 bg-green-50/50' :
                    needsConfirm ? 'border-brand-warning/30 bg-amber-50/50' :
                    'border-brand-border/50 bg-white'
                  )}>
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                        isCompleted ? 'bg-brand-success text-white' :
                        needsConfirm ? 'bg-brand-warning text-white' :
                        'bg-brand-border/30'
                      )}>
                        {isCompleted ? <Check size={12} strokeWidth={3} /> :
                         needsConfirm ? <AlertCircle size={12} /> :
                         <Circle size={8} className="text-brand-text-muted" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-brand-text-muted font-serif">{item.item_code}</span>
                          {item.photo_required && <Camera size={12} className="text-brand-accent" />}
                          {needsConfirm && <Badge variant="warning">需确认</Badge>}
                        </div>
                        <h4 className="text-sm font-medium mt-0.5">{item.name}</h4>
                        <p className="text-[11px] text-brand-text-muted mt-0.5">{item.standard}</p>
                        <p className="text-[11px] text-brand-text-muted">责任人：{item.responsible}</p>
                      </div>
                    </div>
                    {needsConfirm && (
                      <div className="mt-3 pt-3 border-t border-brand-border/30">
                        <Button size="sm" className="w-full" onClick={() => handleConfirm(item.id)}>确认此项</Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
