'use client'

import { BRAND } from '@/lib/constants/brand'

export function ValueCards() {
  return (
    <section className="px-6 py-16 bg-brand-text">
      <div className="max-w-lg mx-auto">
        <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-3">
          Our Values
        </p>
        <h2 className="text-2xl font-serif font-bold text-white tracking-wide mb-8">
          我们相信
        </h2>

        <div className="space-y-4">
          {BRAND.values.map((value, i) => (
            <div
              key={value.title}
              className="flex gap-4 p-4 rounded-xl border border-white/10 animate-[fadeInUp_0.5s_ease_both]"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <span className="font-serif text-2xl text-brand-accent/30 font-bold leading-none shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-white font-medium mb-1">{value.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{value.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
