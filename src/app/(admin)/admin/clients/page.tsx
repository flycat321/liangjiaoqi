'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Plus, User, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Client {
  id: string
  name: string
  phone: string
  address: string | null
  property_area: number | null
  property_type: string | null
  user_id: string | null
  created_at: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
      setClients(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-serif font-bold">客户管理</h1>
        <Link href="/admin/clients/new">
          <Button size="sm"><Plus size={14} className="mr-1" /> 新建客户</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-brand-accent" />
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brand-text-muted text-sm">暂无客户</p>
          <p className="text-brand-text-muted text-xs mt-1">点击右上角新建客户</p>
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map((c) => (
            <Card key={c.id} className="active:scale-[0.99] transition-transform touch-manipulation">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center shrink-0">
                  <User size={18} className="text-brand-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-medium text-sm">{c.name}</h2>
                    {c.user_id ? (
                      <Badge variant="success">已注册</Badge>
                    ) : (
                      <Badge variant="warning">待注册</Badge>
                    )}
                  </div>
                  <p className="text-xs text-brand-text-muted mt-0.5">
                    {c.phone}
                    {c.property_type && ` · ${c.property_type}`}
                    {c.property_area && ` · ${c.property_area}㎡`}
                  </p>
                  {c.address && (
                    <p className="text-[11px] text-brand-text-muted mt-0.5 truncate">{c.address}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
