import Link from 'next/link'
import { BRAND } from '@/lib/constants/brand'

const footerLinks = [
  { label: '服务流程', href: '/services' },
  { label: '关于我们', href: '/about' },
  { label: '联系我们', href: '/contact' },
  { label: '客户登录', href: '/login' },
]

export function Footer() {
  return (
    <footer className="bg-brand-text text-white/40">
      <div className="max-w-lg mx-auto px-6 py-12">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent">
            <span className="text-sm font-bold text-white font-serif">角</span>
          </div>
          <span className="text-base font-bold text-white tracking-wide">量角器</span>
        </div>

        <p className="text-sm leading-relaxed mb-8 max-w-xs">
          {BRAND.description}
        </p>

        {/* Links */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-col sm:flex-row gap-4 text-xs mb-8">
          <span>{BRAND.contact.phone}</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span>{BRAND.contact.email}</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span>{BRAND.contact.address}</span>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-white/10 pt-6">
          <p className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} {BRAND.name} Protractor Design &amp; Build. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
