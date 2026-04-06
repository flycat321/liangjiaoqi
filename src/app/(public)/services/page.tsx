import type { Metadata } from 'next'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { ServiceTimeline } from '@/components/brand/ServiceTimeline'
import { PricingTable } from '@/components/brand/PricingTable'
import { ContactCTA } from '@/components/brand/ContactCTA'

export const metadata: Metadata = {
  title: '服务流程',
  description: '量角器11阶段标准化服务流程：从需求沟通到售后服务，设计师全程参与，50+标准工艺节点，100%验收覆盖。',
}

const craftSystems = [
  { name: '水电预埋', desc: '管路走向·打压测试·点位精确定位' },
  { name: '排水系统', desc: '存水弯选型·坡度标准·检修口预留' },
  { name: '暖通系统', desc: '风盘安装·地暖分集水器·保温验收' },
  { name: '防水体系', desc: '基层处理·涂刷·闭水·四步验收' },
  { name: '瓦工体系', desc: '排砖审核·阳角对缝·薄贴法标准' },
  { name: '全屋定制', desc: '柜体收口·安装顺序·成品保护' },
  { name: '墙面工程', desc: '挂网找平·容差控制·涂料温湿度' },
  { name: '基础辅材', desc: '品牌锁定·不允许替换·全程可溯源' },
]

export default function ServicesPage() {
  return (
    <>
      <PublicHeader />
      <main className="pt-14">
        {/* Hero */}
        <section className="px-6 py-16 bg-brand-bg">
          <div className="max-w-lg mx-auto">
            <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-3">Our Services</p>
            <h1 className="text-3xl font-serif font-bold tracking-wide mb-4">服务流程</h1>
            <div className="w-8 h-px bg-brand-accent mb-6" />
            <p className="text-brand-text-secondary leading-relaxed">
              11个标准化阶段，从第一次沟通到售后跟踪。每个阶段都有明确的检查项、验收标准和责任人——
              确保设计师画的每一根线，工地都能一毫米不差地落下去。
            </p>
          </div>
        </section>

        <ServiceTimeline />

        {/* 8 Craft Systems */}
        <section className="px-6 py-16 bg-brand-text">
          <div className="max-w-lg mx-auto">
            <p className="text-xs tracking-[0.3em] text-brand-accent-light uppercase mb-3">Craft Standards</p>
            <h2 className="text-2xl font-serif font-bold text-white tracking-wide mb-8">八大标准化工艺体系</h2>
            <div className="grid grid-cols-2 gap-3">
              {craftSystems.map((sys, i) => (
                <div key={sys.name} className="border border-white/10 rounded-lg p-3">
                  <div className="text-xs text-brand-accent font-serif mb-1">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-sm font-medium text-white mb-1">{sys.name}</h3>
                  <p className="text-[11px] text-white/40 leading-relaxed">{sys.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Craft card example */}
        <section className="px-6 py-16">
          <div className="max-w-lg mx-auto">
            <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-3">Craft Card</p>
            <h2 className="text-2xl font-serif font-bold tracking-wide mb-2">每一个节点，一张工艺卡</h2>
            <p className="text-sm text-brand-text-muted mb-6">首批覆盖核心 50+ 个节点，每张卡附实拍照片</p>

            <div className="border border-brand-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border bg-brand-bg">
                <span className="font-serif font-semibold text-sm">防水涂刷工艺</span>
                <span className="text-xs text-brand-accent tracking-widest font-serif">QC-04-02</span>
              </div>
              <div className="grid grid-cols-2 gap-4 p-4">
                {[
                  { label: '材料要求', value: '东方雨虹/德高柔性防水涂料\n涂刷厚度 ≥ 1.5mm' },
                  { label: '验收标准', value: '闭水试验 48 小时无渗漏\n阴角圆弧处理 R≥30mm' },
                  { label: '施工步骤', value: '基层清理 → 阴角处理 → 第一遍\n→ 干燥4h → 交叉第二遍 → 闭水' },
                  { label: '常见错误', value: '✗ 阴角未做圆弧直接涂刷\n✗ 未干透即进行下一遍' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-xs text-brand-accent font-medium mb-1">{item.label}</div>
                    <p className="text-[11px] text-brand-text-secondary leading-relaxed whitespace-pre-line">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <PricingTable />
        <ContactCTA />
      </main>
    </>
  )
}
