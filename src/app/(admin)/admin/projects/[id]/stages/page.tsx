'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Circle, Play, Pause, ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { STAGE_DEFINITIONS } from '@/lib/constants/stages'
import { cn } from '@/lib/utils/cn'
import { useState } from 'react'
import { toast } from 'sonner'

type Status = 'locked' | 'in_progress' | 'completed'

const initialStatuses: Record<number, Status> = {
  1: 'completed', 2: 'completed', 3: 'completed', 4: 'completed',
  5: 'completed', 6: 'completed', 7: 'in_progress',
  8: 'locked', 9: 'locked', 10: 'locked', 11: 'locked',
}

export default function StageManagementPage() {
  const { id } = useParams()
  const [statuses, setStatuses] = useState(initialStatuses)
  const [expanded, setExpanded] = useState<number | null>(7)

  function updateStatus(order: number, status: Status) {
    setStatuses(prev => ({ ...prev, [order]: status }))
    const label = status === 'completed' ? '已完成' : status === 'in_progress' ? '进行中' : '已锁定'
    toast.success(`阶段 ${order} 已切换为"${label}"`)
  }

  return (
    <div className="pb-8">
      <div className="sticky top-[52px] z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={`/admin/projects/${id}`} className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
          <h1 className="text-sm font-medium">阶段进度管理</h1>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-2">
        {STAGE_DEFINITIONS.map((stage) => {
          const status = statuses[stage.order]
          const isExpanded = expanded === stage.order

          return (
            <div key={stage.order} className="border border-brand-border/50 rounded-xl overflow-hidden bg-white">
              {/* Stage header */}
              <button
                onClick={() => setExpanded(isExpanded ? null : stage.order)}
                className="w-full flex items-center gap-3 p-3 text-left touch-manipulation"
              >
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold',
                  status === 'completed' && 'bg-brand-success text-white',
                  status === 'in_progress' && 'bg-brand-accent text-white',
                  status === 'locked' && 'bg-brand-border/30 text-brand-text-muted',
                )}>
                  {status === 'completed' ? <Check size={14} strokeWidth={3} /> : stage.order}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate">{stage.name}</h3>
                  <p className="text-[11px] text-brand-text-muted">{stage.items.length} 个检查项</p>
                </div>
                <Badge variant={
                  status === 'completed' ? 'success' :
                  status === 'in_progress' ? 'accent' : 'default'
                }>
                  {status === 'completed' ? '已完成' : status === 'in_progress' ? '进行中' : '未开始'}
                </Badge>
                {isExpanded ? <ChevronUp size={16} className="text-brand-text-muted" /> : <ChevronDown size={16} className="text-brand-text-muted" />}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-brand-border/30 p-3 bg-brand-bg/50">
                  {/* Status controls */}
                  <div className="flex gap-2 mb-3">
                    {status !== 'in_progress' && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(stage.order, 'in_progress')}>
                        <Play size={12} className="mr-1" /> 开始
                      </Button>
                    )}
                    {status === 'in_progress' && (
                      <Button size="sm" onClick={() => updateStatus(stage.order, 'completed')}>
                        <Check size={12} className="mr-1" /> 完成
                      </Button>
                    )}
                    {status === 'completed' && (
                      <Button size="sm" variant="ghost" onClick={() => updateStatus(stage.order, 'in_progress')}>
                        撤回完成
                      </Button>
                    )}
                  </div>

                  {/* Checklist items */}
                  <div className="space-y-1.5">
                    {stage.items.map((item) => (
                      <label key={item.code} className="flex items-start gap-2 py-1.5 cursor-pointer">
                        <input type="checkbox" defaultChecked={status === 'completed'}
                          className="mt-0.5 rounded border-brand-border text-brand-accent focus:ring-brand-accent/30" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-brand-text-muted font-serif">{item.code}</span>
                            <span className="text-xs">{item.name}</span>
                          </div>
                          <p className="text-[10px] text-brand-text-muted">{item.standard}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
