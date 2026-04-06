'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { FolderKanban, Users, Package, FileText, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Stats {
  projects: number
  clients: number
  materials: number
  contracts: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, clients: 0, materials: 0, contracts: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [{ count: pc }, { count: cc }, { count: mc }, { count: ctc }] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('materials').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('contracts').select('*', { count: 'exact', head: true }),
      ])
      setStats({ projects: pc || 0, clients: cc || 0, materials: mc || 0, contracts: ctc || 0 })
      setLoading(false)
    }
    load()
  }, [])

  const statCards = [
    { icon: FolderKanban, label: '项目', value: stats.projects, href: '/admin/projects' },
    { icon: Users, label: '客户', value: stats.clients, href: '/admin/clients' },
    { icon: Package, label: '材料品类', value: stats.materials, href: '/admin/materials' },
    { icon: FileText, label: '合同', value: stats.contracts, href: '/admin/contracts' },
  ]

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-xl font-serif font-bold mb-6">管理概览</h1>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-accent" /></div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((s) => (
            <Link key={s.label} href={s.href}>
              <Card className="active:scale-[0.98] transition-transform touch-manipulation">
                <s.icon size={18} className="text-brand-accent mb-2" />
                <div className="text-2xl font-serif font-bold">{s.value}</div>
                <div className="text-xs text-brand-text-muted">{s.label}</div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
