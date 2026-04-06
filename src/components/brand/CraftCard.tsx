'use client'

import { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'

const craftCards = [
  {
    title: '防水涂刷工艺',
    code: 'QC-04-02',
    fields: [
      { label: '材料要求', value: '东方雨虹/德高柔性防水涂料\n涂刷厚度 ≥ 1.5mm' },
      { label: '验收标准', value: '闭水试验 48 小时无渗漏\n阴角圆弧处理 R≥30mm' },
      { label: '施工步骤', value: '基层清理 → 阴角处理 → 第一遍\n→ 干燥4h → 交叉第二遍 → 闭水' },
      { label: '常见错误', value: '✗ 阴角未做圆弧直接涂刷\n✗ 未干透即进行下一遍' },
    ],
  },
  {
    title: '给水管路打压',
    code: 'QC-06-05',
    fields: [
      { label: '材料要求', value: '伟星/日丰 PPR S3.2\n管卡间距 ≤ 60cm' },
      { label: '验收标准', value: '0.8MPa 保压 30 分钟\n压降 ≤ 0.05MPa' },
      { label: '施工步骤', value: '管路安装 → 管卡固定 → 接口检查\n→ 安装压力表 → 加压至0.8MPa → 保压记录' },
      { label: '常见错误', value: '✗ 打压时间不足30分钟\n✗ 未逐个检查接口渗漏' },
    ],
  },
  {
    title: '墙砖薄贴工艺',
    code: 'QC-07-02',
    fields: [
      { label: '材料要求', value: '瓷砖胶（C2级）\n齿形刮刀 10mm 齿距' },
      { label: '验收标准', value: '空鼓率 ≤ 3%\n平整度 ≤ 2mm/2m' },
      { label: '施工步骤', value: '基层找平 → 弹线排砖 → 背涂+满刮\n→ 揉压就位 → 十字卡控缝 → 24h后勾缝' },
      { label: '常见错误', value: '✗ 未做排砖方案直接铺贴\n✗ 齿形胶不饱满导致空鼓' },
    ],
  },
  {
    title: '吊顶龙骨安装',
    code: 'QC-07-11',
    fields: [
      { label: '材料要求', value: '轻钢龙骨（国标0.8mm厚）\n吊杆 Φ8 镀锌丝杆' },
      { label: '验收标准', value: '主龙骨间距 ≤ 1m\n副龙骨间距 ≤ 40cm\n吊杆间距 ≤ 1m' },
      { label: '施工步骤', value: '弹线定标高 → 打膨胀螺栓 → 安装吊杆\n→ 安装主龙骨 → 调平 → 安装副龙骨' },
      { label: '常见错误', value: '✗ 吊杆间距过大导致下沉\n✗ 未预留检修口位置' },
    ],
  },
]

export function CraftCard() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    function handleScroll() {
      if (!el) return
      const cardWidth = el.scrollWidth / craftCards.length
      const idx = Math.round(el.scrollLeft / cardWidth)
      setActive(idx)
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="py-16">
      <div className="max-w-lg mx-auto px-6">
        <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-3">Craft Standard</p>
        <h2 className="text-2xl font-serif font-bold tracking-wide mb-2">每一个节点，一张工艺卡</h2>
        <p className="text-sm text-brand-text-muted mb-6">首批覆盖核心 50+ 个节点 · 左右滑动查看</p>
      </div>

      {/* Scrollable cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-4 no-scrollbar"
        style={{ scrollPaddingInline: '24px' }}
      >
        {/* Left spacer for centering on larger screens */}
        <div className="shrink-0 w-[max(0px,calc((100vw-512px)/2-24px))]" />

        {craftCards.map((card, i) => (
          <div
            key={card.code}
            className="shrink-0 w-[calc(100vw-48px)] max-w-[440px] snap-center border border-brand-border rounded-xl overflow-hidden bg-white"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border bg-brand-bg">
              <span className="font-serif font-semibold text-sm">{card.title}</span>
              <span className="text-xs text-brand-accent tracking-widest font-serif">{card.code}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4">
              {card.fields.map((field) => (
                <div key={field.label}>
                  <div className="text-xs text-brand-accent font-medium mb-1">{field.label}</div>
                  <p className="text-[11px] text-brand-text-secondary leading-relaxed whitespace-pre-line">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Right spacer */}
        <div className="shrink-0 w-[max(0px,calc((100vw-512px)/2-24px))]" />
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5 mt-4">
        {craftCards.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              active === i ? 'w-6 bg-brand-accent' : 'w-1.5 bg-brand-border'
            )}
          />
        ))}
      </div>
    </section>
  )
}
