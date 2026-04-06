import { Award, Lightbulb, Shield, BookOpen } from 'lucide-react'

const reasons = [
  { icon: Award, num: '01', title: '建筑师操盘', desc: '不是家装设计师，是驾驭过医院、博物馆的一级注册建筑师。空间把控降维打击。' },
  { icon: Lightbulb, num: '02', title: '设计即施工图', desc: '不只画效果图，每个收口、每根管线都出施工大样，工人照图施工。' },
  { icon: Shield, num: '03', title: '标准化不是标准', desc: '50+ 工艺卡确保底线一致，但每套方案都是为你量身定制。' },
  { icon: BookOpen, num: '04', title: '全程透明', desc: '材料品牌锁定不替换、价格公开可比价、每个节点拍照存档可追溯。' },
]

export function WhyProtractor() {
  return (
    <section className="px-6 py-16 bg-brand-text">
      <div className="max-w-lg mx-auto">
        <p className="text-xs tracking-[0.3em] text-brand-accent-light uppercase mb-3">Why Protractor</p>
        <h2 className="text-2xl font-serif font-bold text-white tracking-wide mb-8">为什么选择量角器</h2>
        <div className="space-y-4">
          {reasons.map((r, i) => (
            <div key={r.title} className="flex gap-4 p-4 rounded-xl border border-white/10 animate-[fadeInUp_0.5s_ease_both]" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <r.icon size={18} className="text-brand-accent" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">{r.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
