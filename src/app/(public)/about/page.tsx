import type { Metadata } from 'next'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { FounderProfile } from '@/components/brand/FounderProfile'
import { ContactCTA } from '@/components/brand/ContactCTA'
import { Footer } from '@/components/layout/Footer'
import { BRAND } from '@/lib/constants/brand'
import { Award, BookOpen, Lightbulb, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: '关于我们',
  description: `${BRAND.founder.name} — ${BRAND.founder.credentials[0]}，创立量角器装饰，专注设计师主导的全流程交付体系。`,
}

const advantages = [
  { icon: Award, title: '建筑师操盘', desc: '不是家装设计师，是驾驭过医院、博物馆的一级注册建筑师。空间把控降维打击。' },
  { icon: Lightbulb, title: '设计即施工图', desc: '不只画效果图，每个收口、每根管线都出施工大样，工人照图施工。' },
  { icon: Shield, title: '标准化不是标准', desc: '50+ 工艺卡确保底线一致，但每套方案都是为你量身定制。' },
  { icon: BookOpen, title: '全程透明', desc: '材料品牌锁定不替换、价格公开可比价、每个节点拍照存档可追溯。' },
]

export default function AboutPage() {
  return (
    <>
      <PublicHeader />
      <main className="pt-14">
        {/* Hero */}
        <section className="px-6 py-16 bg-brand-bg">
          <div className="max-w-lg mx-auto">
            <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-3">About Us</p>
            <h1 className="text-3xl font-serif font-bold tracking-wide mb-4">关于量角器</h1>
            <div className="w-8 h-px bg-brand-accent mb-6" />
            <p className="text-brand-text-secondary leading-relaxed">
              量角器不是传统装修公司，不是独立设计工作室，也不是千篇一律的整装套餐。
              我们是<strong className="text-brand-text">设计师主导的全流程交付体系</strong>——
              从第一次沟通到最后一颗螺丝，设计师全程参与。
            </p>
          </div>
        </section>

        <FounderProfile />

        {/* Advantages */}
        <section className="px-6 py-16 bg-brand-bg">
          <div className="max-w-lg mx-auto">
            <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-3">Why Protractor</p>
            <h2 className="text-2xl font-serif font-bold tracking-wide mb-8">为什么选择量角器</h2>
            <div className="space-y-4">
              {advantages.map((item, i) => (
                <div key={item.title} className="flex gap-4 bg-white rounded-xl p-4 border border-brand-border/50">
                  <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-brand-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-brand-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quality promise */}
        <section className="px-6 py-16">
          <div className="max-w-lg mx-auto text-center">
            <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-3">Quality Assurance</p>
            <h2 className="text-2xl font-serif font-bold tracking-wide mb-8">品质承诺</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '100%', label: '节点验收覆盖', sub: '每道工序验收通过才能进入下一步' },
                { value: '5年', label: '隐蔽工程质保', sub: '水电管路五年质保，终身维护' },
                { value: '48h', label: '售后响应', sub: '问题48h内响应，72h上门' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-2xl font-serif font-bold text-brand-accent">{item.value}</div>
                  <div className="text-xs font-medium mt-1">{item.label}</div>
                  <p className="text-[10px] text-brand-text-muted mt-1 leading-relaxed">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ContactCTA />
      </main>
      <Footer />
    </>
  )
}
