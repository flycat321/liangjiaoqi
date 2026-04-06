'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ChevronRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { demoGetUser } from '@/lib/utils/demo-auth'
import { STAGE_DEFINITIONS } from '@/lib/constants/stages'

interface Project {
  id: string
  name: string
  address: string
  current_stage_order: number
  status: string
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const user = demoGetUser()

  useEffect(() => {
    async function load() {
      const supabase = createClient()

      // Get client record by phone
      const phone = user?.phone
      if (!phone) { setLoading(false); return }

      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('phone', phone)
        .single()

      if (!clientData) {
        // Admin user — show all projects
        if (user?.role === 'admin') {
          const { data } = await supabase
            .from('projects')
            .select('id, name, address, current_stage_order, status')
            .order('created_at', { ascending: false })
          setProjects(data || [])
        }
        setLoading(false)
        return
      }

      // Client user — show only their projects
      const { data } = await supabase
        .from('projects')
        .select('id, name, address, current_stage_order, status')
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false })

      setProjects(data || [])
      setLoading(false)
    }
    load()
  }, [user?.phone, user?.role])

  function getStageName(order: number): string {
    return STAGE_DEFINITIONS.find(s => s.order === order)?.name || `阶段 ${order}`
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="mb-6">
        <p className="text-xs text-brand-text-muted mb-1">欢迎回来{user?.name ? `，${user.name}` : ''}</p>
        <h1 className="text-xl font-serif font-bold">我的项目</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-brand-accent" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brand-text-muted text-sm">暂无项目</p>
          <p className="text-brand-text-muted text-xs mt-1">项目创建后将在这里显示</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Link key={project.id} href={`/project/${project.id}`}>
              <Card className="active:scale-[0.99] transition-transform touch-manipulation">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="font-medium text-sm">{project.name}</h2>
                    <p className="text-xs text-brand-text-muted mt-0.5">{project.address}</p>
                  </div>
                  <ChevronRight size={18} className="text-brand-text-muted mt-0.5 shrink-0" />
                </div>
                <ProgressBar value={project.current_stage_order} max={11} size="sm" showLabel className="mb-3" />
                <Badge variant="accent">{getStageName(project.current_stage_order)}</Badge>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
