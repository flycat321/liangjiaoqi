'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ArrowLeft, Check, Circle, ChevronRight, Camera, FileText, Package, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Project {
  id: string
  name: string
  address: string
  current_stage_order: number
}

interface Stage {
  id: string
  stage_order: number
  name: string
  description: string
  status: string
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [stages, setStages] = useState<Stage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/projects/${id}`)
        if (res.ok) {
          const data = await res.json()
          setProject(data.project)
          setStages(data.stages || [])
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

  if (!project) {
    return <div className="p-4 text-center text-brand-text-muted">项目不存在</div>
  }

  const progress = Math.round((project.current_stage_order / 11) * 100)

  return (
    <div className="pb-4">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-medium truncate">{project.name}</h1>
            <p className="text-[11px] text-brand-text-muted">{project.address}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-brand-text-muted">整体进度</span>
            <span className="text-xs font-medium text-brand-accent">{progress}%</span>
          </div>
          <ProgressBar value={project.current_stage_order} max={11} />
          <div className="flex gap-4 mt-3 pt-3 border-t border-brand-border/30">
            <Link href={`/project/${id}/materials`} className="flex items-center gap-1.5 text-xs text-brand-text-secondary hover:text-brand-text transition-colors touch-manipulation">
              <Package size={14} className="text-brand-accent" /> 材料清单
            </Link>
            <Link href={`/project/${id}/contract`} className="flex items-center gap-1.5 text-xs text-brand-text-secondary hover:text-brand-text transition-colors touch-manipulation">
              <FileText size={14} className="text-brand-accent" /> 合同费用
            </Link>
            <Link href={`/project/${id}/photos`} className="flex items-center gap-1.5 text-xs text-brand-text-secondary hover:text-brand-text transition-colors touch-manipulation">
              <Camera size={14} className="text-brand-accent" /> 工地照片
            </Link>
          </div>
        </Card>
      </div>

      <div className="px-4">
        <h2 className="text-xs text-brand-text-muted mb-4 tracking-wider">施工阶段</h2>
        <div className="relative">
          <div className="absolute left-[15px] top-4 bottom-4 w-px bg-brand-border" />
          <div className="space-y-1">
            {stages.map((stage) => {
              const isCompleted = stage.status === 'completed'
              const isActive = stage.status === 'in_progress' || stage.status === 'pending_confirmation'
              const isLocked = stage.status === 'locked'

              return (
                <Link
                  key={stage.id}
                  href={isLocked ? '#' : `/project/${id}/stage/${stage.stage_order}`}
                  className={cn(
                    'flex items-center gap-3 py-3 px-1 rounded-lg transition-colors touch-manipulation',
                    isActive && 'bg-brand-accent/5',
                    isLocked && 'opacity-40 pointer-events-none',
                    !isLocked && 'active:bg-brand-bg'
                  )}
                >
                  <div className={cn(
                    'relative z-10 w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0',
                    isCompleted && 'bg-brand-success text-white',
                    isActive && 'bg-brand-accent text-white ring-4 ring-brand-accent/20',
                    isLocked && 'bg-white border border-brand-border'
                  )}>
                    {isCompleted ? <Check size={14} strokeWidth={3} /> :
                     isActive ? <span className="text-xs font-bold">{stage.stage_order}</span> :
                     <Circle size={8} className="text-brand-border" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{stage.name}</span>
                      {isActive && <Badge variant="accent">进行中</Badge>}
                    </div>
                    <p className="text-[11px] text-brand-text-muted mt-0.5 truncate">{stage.description}</p>
                  </div>
                  {!isLocked && <ChevronRight size={16} className="text-brand-text-muted shrink-0" />}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
