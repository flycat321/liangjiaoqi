'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { label: '首页', href: '/' },
  { label: '服务流程', href: '/services' },
  { label: '关于我们', href: '/about' },
  { label: '联系我们', href: '/contact' },
]

export function PublicHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-brand-border/30">
      <nav className="mx-auto flex h-14 max-w-screen-lg items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-text">
            <span className="text-sm font-bold text-white font-serif">角</span>
          </div>
          <span className="text-lg font-bold tracking-wide">量角器</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-brand-text-secondary hover:text-brand-text transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-sm font-medium text-brand-accent hover:text-brand-accent-dark transition-colors"
          >
            客户登录
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 -mr-2 touch-manipulation"
          onClick={() => setOpen(!open)}
          aria-label="菜单"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 bg-white border-b border-brand-border/30',
          open ? 'max-h-72' : 'max-h-0 border-b-0'
        )}
      >
        <div className="px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2.5 text-sm text-brand-text-secondary hover:text-brand-text transition-colors"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="block py-2.5 text-sm font-medium text-brand-accent"
            onClick={() => setOpen(false)}
          >
            客户登录 →
          </Link>
        </div>
      </div>
    </header>
  )
}
