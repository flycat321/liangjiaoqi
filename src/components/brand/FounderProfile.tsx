import { BRAND } from '@/lib/constants/brand'

export function FounderProfile() {
  const { founder } = BRAND

  return (
    <section className="px-6 py-16">
      <div className="max-w-lg mx-auto">
        <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-3">
          Founder
        </p>
        <h2 className="text-2xl font-serif font-bold tracking-wide mb-8">
          创始人
        </h2>

        <div className="animate-[fadeInUp_0.5s_ease_both]">
          {/* Avatar placeholder */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-brand-text flex items-center justify-center shrink-0">
              <span className="text-xl font-serif font-bold text-brand-accent">G</span>
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold">{founder.name}</h3>
              <p className="text-sm text-brand-text-secondary">{founder.title}</p>
            </div>
          </div>

          {/* Credentials */}
          <div className="space-y-2 mb-6">
            {founder.credentials.map((c) => (
              <div key={c} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-brand-accent shrink-0" />
                <span className="text-sm text-brand-text-secondary">{c}</span>
              </div>
            ))}
          </div>

          {/* Highlights */}
          <div className="bg-brand-bg rounded-xl p-4 space-y-3">
            {founder.highlights.map((h) => (
              <p key={h} className="text-xs text-brand-text-secondary leading-relaxed">
                {h}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
