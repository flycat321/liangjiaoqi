'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, Users, Package, FileText, Bell, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const adminNav = [
  { icon: LayoutDashboard, label: '概览', href: '/admin' },
  { icon: FolderKanban, label: '项目', href: '/admin/projects' },
  { icon: Users, label: '客户', href: '/admin/clients' },
  { icon: Package, label: '材料库', href: '/admin/materials' },
  { icon: FileText, label: '合同', href: '/admin/contracts' },
  { icon: Bell, label: '推送', href: '/admin/notifications' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-dvh pb-16">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-brand-text text-white px-4 py-3 flex items-center gap-3">
        <Link href="/" className="text-xs text-white/40 hover:text-white/60 transition-colors">
          <ChevronLeft size={16} />
        </Link>
        <div className="flex h-7 w-7 items-center justify-center rounded bg-brand-accent">
          <span className="text-xs font-bold text-white font-serif">角</span>
        </div>
        <span className="text-sm font-medium tracking-wide">量角器 · 管理后台</span>
      </header>

      {children}

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-brand-text/95 backdrop-blur-lg border-t border-white/10 safe-bottom">
        <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
          {adminNav.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-2 py-1 touch-manipulation transition-colors',
                  active ? 'text-brand-accent' : 'text-white/40'
                )}
              >
                <item.icon size={18} strokeWidth={active ? 2.5 : 1.5} />
                <span className="text-[9px]">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
