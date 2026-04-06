'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { BRAND } from '@/lib/constants/brand'

export function HeroSection() {
  return (
    <section className="relative min-h-dvh flex flex-col justify-center px-6 pt-14 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-bg via-white to-white" />

      {/* Geometric decoration */}
      <div className="absolute top-20 right-4 w-32 h-32 opacity-[0.06]">
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M100 10 A90 90 0 0 1 190 100" />
          <path d="M100 30 A70 70 0 0 1 170 100" />
          <path d="M100 50 A50 50 0 0 1 150 100" />
          <line x1="100" y1="100" x2="190" y2="100" />
          <line x1="100" y1="100" x2="170" y2="40" />
        </svg>
      </div>

      <div className="relative z-10 max-w-lg mx-auto w-full">
        <div className="animate-[fadeInUp_0.6s_ease_both]">
          <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-4">
            Protractor Design & Build
          </p>

          <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-wider leading-tight mb-4">
            量角器
          </h1>

          <div className="w-8 h-px bg-brand-accent mb-4" />

          <p className="text-lg text-brand-text-secondary leading-relaxed tracking-wide mb-8">
            {BRAND.slogan}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-12 animate-[fadeInUp_0.6s_0.2s_ease_both]">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center h-12 px-6 bg-brand-text text-white text-sm font-medium rounded-lg hover:bg-neutral-800 active:scale-[0.98] transition-all touch-manipulation"
          >
            预约免费空间诊断
            <ArrowRight size={16} className="ml-2" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center h-12 px-6 border border-brand-border text-brand-text text-sm font-medium rounded-lg hover:bg-brand-bg active:scale-[0.98] transition-all touch-manipulation"
          >
            了解服务流程
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-8 animate-[fadeInUp_0.6s_0.4s_ease_both]">
          {BRAND.stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-serif font-bold text-brand-accent">
                {stat.value}
              </div>
              <div className="text-xs text-brand-text-muted mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
