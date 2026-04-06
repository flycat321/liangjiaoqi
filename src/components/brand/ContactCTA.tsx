'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import { BRAND } from '@/lib/constants/brand'

export function ContactCTA() {
  return (
    <section className="px-6 py-16 bg-brand-text text-white">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-3">
          Get In Touch
        </p>
        <h2 className="text-3xl font-serif font-black tracking-wider mb-2">
          量角器
        </h2>
        <div className="w-8 h-px bg-brand-accent mx-auto my-4" />
        <p className="text-white/60 tracking-wide mb-8">
          {BRAND.slogan}
        </p>

        <div className="space-y-3 mb-8 text-sm">
          <a
            href={`tel:${BRAND.contact.phone.replace(/-/g, '')}`}
            className="flex items-center justify-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <Phone size={14} className="text-brand-accent" />
            {BRAND.contact.phone}
          </a>
          <a
            href={`mailto:${BRAND.contact.email}`}
            className="flex items-center justify-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <Mail size={14} className="text-brand-accent" />
            {BRAND.contact.email}
          </a>
          <p className="flex items-center justify-center gap-2 text-white/40">
            <MapPin size={14} className="text-brand-accent/60" />
            {BRAND.contact.address}
          </p>
        </div>

        <Link
          href="/contact"
          className="inline-flex items-center justify-center h-12 px-8 bg-brand-accent text-white text-sm font-medium rounded-lg hover:bg-brand-accent-dark active:scale-[0.98] transition-all touch-manipulation"
        >
          预约免费空间诊断
          <ArrowRight size={16} className="ml-2" />
        </Link>

        <p className="text-xs text-white/20 mt-12">
          © 2026 量角器 Protractor Design & Build. All rights reserved.
        </p>
      </div>
    </section>
  )
}
