'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Phone, LogOut, ChevronRight, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { demoGetUser, demoLogout, type DemoUser } from '@/lib/utils/demo-auth'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<DemoUser | null>(null)

  useEffect(() => {
    setUser(demoGetUser())
  }, [])

  function handleLogout() {
    demoLogout()
    router.push('/login')
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-xl font-serif font-bold mb-6">我的</h1>

      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-text flex items-center justify-center">
            <User size={24} className="text-white" />
          </div>
          <div>
            <h2 className="font-medium">{user?.name || '未登录'}</h2>
            <div className="flex items-center gap-1 mt-1 text-xs text-brand-text-muted">
              <Phone size={12} />
              <span>{user?.phone || '—'}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="bg-white rounded-xl border border-brand-border/50 divide-y divide-brand-border/30 mb-6">
        <Link href="/contact" className="flex items-center gap-3 px-4 py-3.5 active:bg-brand-bg transition-colors touch-manipulation">
          <HelpCircle size={18} className="text-brand-text-muted" />
          <span className="flex-1 text-sm">帮助与反馈</span>
          <ChevronRight size={16} className="text-brand-text-muted" />
        </Link>
      </div>

      <Button variant="outline" size="lg" className="w-full text-red-500 border-red-200 hover:bg-red-50" onClick={handleLogout}>
        <LogOut size={16} className="mr-2" />
        退出登录
      </Button>

      <p className="text-center text-[10px] text-brand-text-muted mt-8">
        量角器 v1.0 · Protractor Design & Build
      </p>
    </div>
  )
}
