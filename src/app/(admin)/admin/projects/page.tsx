'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { Plus, ChevronRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Project {
  id: string
  name: string
  address: string
  area: number | null
  status: string
  current_stage_order: number
  clients: { name: string } | null
}

const statusBadge: Record<string, { variant: 'default' | 'accent' | 'warning' | 'success'; label: string }> = {
  draft: { variant: 'default', label: '草稿' },
  in_progress: { variant: 'accent', label: '进行中' },
  paused: { variant: 'warning', label: '暂停' },
  completed: { variant: 'success', label: '已完成' },
  archived: { variant: 'default', label: '已归档' },
}

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('projects')
        .select('id, name, address, area, status, current_stage_order, clients(name)')
        .order('created_at', { ascending: false })
      setProjects((data as unknown as Project[]) || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-serif font-bold">项目管理</h1>
        <Link href="/admin/projects/new">
          <Button size="sm"><Plus size={14} className="mr-1" /> 新建项目</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-brand-accent" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brand-text-muted text-sm">暂无项目</p>
          <p className="text-brand-text-muted text-xs mt-1">点击右上角新建项目</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => {
            const badge = statusBadge[p.status] || statusBadge.draft
            return (
              <Link key={p.id} href={`/admin/projects/${p.id}`}>
                <Card className="active:scale-[0.99] transition-transform touch-manipulation">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="font-medium text-sm">{p.name}</h2>
                      <p className="text-xs text-brand-text-muted mt-0.5">
                        {p.clients?.name && `客户：${p.clients.name} · `}{p.area && `${p.area}㎡`}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-brand-text-muted shrink-0" />
                  </div>
                  <ProgressBar value={p.current_stage_order} max={11} size="sm" showLabel className="mb-2" />
                  <div className="flex items-center gap-2">
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                    <span className="text-xs text-brand-text-muted">阶段 {p.current_stage_order}/11</span>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
