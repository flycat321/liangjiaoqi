import { BRAND } from '@/lib/constants/brand'

const rows = [
  { item: '设计费', value: BRAND.pricing.designFee, note: '核心价值，含概念方案 + 全套施工图' },
  { item: '施工管理费', value: BRAND.pricing.managementFee, note: '含项目管理、节点验收、质量保障' },
  { item: '材料代购', value: BRAND.pricing.materialMarkup, note: '透明报价，业主亦可自行采购' },
]

export function PricingTable() {
  return (
    <section className="px-6 py-16 bg-brand-bg">
      <div className="max-w-lg mx-auto">
        <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-3">
          Transparent Pricing
        </p>
        <h2 className="text-2xl font-serif font-bold tracking-wide mb-2">
          透明定价
        </h2>
        <p className="text-sm text-brand-text-muted mb-8">
          不赚隐性差价，不做低价套餐，每一分钱对应明确的服务
        </p>

        <div className="bg-white rounded-xl border border-brand-border/50 overflow-hidden animate-[fadeInUp_0.5s_ease_both]">
          {rows.map((row, i) => (
            <div
              key={row.item}
              className={`px-5 py-4 ${i < rows.length - 1 ? 'border-b border-brand-border/30' : ''}`}
            >
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-serif font-semibold text-sm">{row.item}</span>
                <span className="font-serif text-brand-accent-dark font-bold text-sm">
                  {row.value}
                </span>
              </div>
              <p className="text-xs text-brand-text-muted">{row.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
