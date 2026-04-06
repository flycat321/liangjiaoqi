import { Package } from 'lucide-react'
import { AnimateInView } from '@/components/ui/AnimateInView'

const suppliers = [
  { category: '给水管路', brands: '伟星 / 日丰', note: '完善保险赔付体系' },
  { category: '电线电缆', brands: '远东 / 熊猫', note: '国标足线径' },
  { category: '防水材料', brands: '东方雨虹 / 德高', note: '质保可追溯' },
  { category: '板材', brands: '兔宝宝 / 千年舟', note: 'ENF 级环保标准' },
  { category: '暖通设备', brands: '大金 / 日立 / 曼瑞德', note: '设计师长期验证品牌' },
  { category: '全屋定制', brands: 'ODM 深度合作工厂', note: '按设计图纸标准生产' },
]

export function SupplierSystem() {
  return (
    <section className="px-6 py-16 bg-brand-bg">
      <div className="max-w-lg mx-auto">
        <AnimateInView>
          <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-3">Supply Chain</p>
          <h2 className="text-2xl font-serif font-bold tracking-wide mb-8">严选供应商体系</h2>
        </AnimateInView>
        <div className="space-y-3">
          {suppliers.map((s, i) => (
            <AnimateInView key={s.category} delay={i * 100}>
              <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-brand-border/50">
                <div className="w-9 h-9 rounded-lg bg-brand-accent/10 flex items-center justify-center shrink-0">
                  <Package size={16} className="text-brand-accent" />
                </div>
                <div>
                  <div className="text-xs text-brand-accent font-medium">{s.category}</div>
                  <h3 className="text-sm font-medium mt-0.5">{s.brands}</h3>
                  <p className="text-[11px] text-brand-text-muted mt-0.5">{s.note}</p>
                </div>
              </div>
            </AnimateInView>
          ))}
        </div>
        <AnimateInView delay={600}>
          <p className="text-xs text-brand-text-muted text-center mt-6">
            每品类锁定 2-3 家严选品牌 · 不赚材料差价 · 全程可溯源
          </p>
        </AnimateInView>
      </div>
    </section>
  )
}
