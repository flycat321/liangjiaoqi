'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ArrowLeft, Users, Ruler, MapPin, Calendar, ChevronRight, Camera, FileText, Package, Bell, Loader2 } from 'lucide-react'

interface ProjectDetail {
  id: string
  name: string
  address: string
  area: number | null
  property_type: string | null
  status: string
  current_stage_order: number
  start_date: string | null
  expected_end_date: string | null
  client_name: string | null
  client_phone: string | null
}

export default function AdminProjectDetailPage() {
  const { id } = useParams()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/projects/${id}`)
        if (res.ok) {
          const data = await res.json()
          setProject(data.project)
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
  const maskedPhone = project.client_phone
    ? project.client_phone.slice(0, 3) + '****' + project.client_phone.slice(-4)
    : ''

  const actions = [
    { icon: Ruler, label: '阶段进度管理', desc: '查看/切换阶段状态，勾选检查项', href: `/admin/projects/${id}/stages` },
    { icon: Package, label: '项目材料管理', desc: '选型、定价、确认状态', href: `/admin/projects/${id}/materials` },
    { icon: FileText, label: '报价单编辑', desc: '编辑分项报价，推送给客户确认', href: `/admin/projects/${id}/quote` },
    { icon: Camera, label: '施工照片', desc: '上传/管理施工照片', href: `/admin/projects/${id}/photos` },
    { icon: FileText, label: '合同管理', desc: '上传合同、查看签署状态', href: `/admin/projects/${id}/contract` },
    { icon: Bell, label: '推送通知', desc: '给客户发送消息通知', href: '/admin/notifications' },
  ]

  return (
    <div className="pb-8">
      <div className="sticky top-[52px] z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/projects" className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-medium truncate">{project.name}</h1>
            <p className="text-[11px] text-brand-text-muted">项目管理</p>
          </div>
          <Badge variant="accent">{project.status === 'in_progress' ? '进行中' : project.status === 'completed' ? '已完工' : '待启动'}</Badge>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        <Card>
          <div className="space-y-2 text-sm">
            {project.client_name && (
              <div className="flex items-center gap-2 text-brand-text-secondary">
                <Users size={14} className="text-brand-accent" /> 客户：{project.client_name} · {maskedPhone}
              </div>
            )}
            <div className="flex items-center gap-2 text-brand-text-secondary">
              <MapPin size={14} className="text-brand-accent" /> {project.address}
            </div>
            {(project.area || project.property_type) && (
              <div className="flex items-center gap-2 text-brand-text-secondary">
                <Ruler size={14} className="text-brand-accent" /> {project.area ? `${project.area}㎡` : ''}{project.area && project.property_type ? ' · ' : ''}{project.property_type || ''}
              </div>
            )}
            {(project.start_date || project.expected_end_date) && (
              <div className="flex items-center gap-2 text-brand-text-secondary">
                <Calendar size={14} className="text-brand-accent" /> {project.start_date || '—'} — {project.expected_end_date || '—'}
              </div>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-brand-border/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-brand-text-muted">进度：阶段 {project.current_stage_order}/11</span>
              <span className="text-xs font-medium text-brand-accent">{progress}%</span>
            </div>
            <ProgressBar value={project.current_stage_order} max={11} />
          </div>
        </Card>

        <div className="space-y-2">
          <h2 className="text-xs text-brand-text-muted tracking-wider">管理操作</h2>
          {actions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Card className="flex items-center gap-3 active:scale-[0.99] transition-transform touch-manipulation">
                <div className="w-9 h-9 rounded-lg bg-brand-accent/10 flex items-center justify-center shrink-0">
                  <action.icon size={16} className="text-brand-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium">{action.label}</h3>
                  <p className="text-[11px] text-brand-text-muted">{action.desc}</p>
                </div>
                <ChevronRight size={16} className="text-brand-text-muted shrink-0" />
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
