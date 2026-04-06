import { AnimateInView } from '@/components/ui/AnimateInView'

const systems = [
  { name: '水电预埋', desc: '管路走向 · 打压测试 · 点位精确定位' },
  { name: '排水系统', desc: '存水弯选型 · 坡度标准 · 检修口预留' },
  { name: '暖通系统', desc: '风盘安装 · 地暖分集水器 · 保温验收' },
  { name: '防水体系', desc: '基层处理 · 涂刷 · 闭水 · 四步验收' },
  { name: '瓦工体系', desc: '排砖审核 · 阳角对缝 · 薄贴法标准' },
  { name: '全屋定制', desc: '柜体收口 · 安装顺序 · 成品保护' },
  { name: '墙面工程', desc: '挂网找平 · 容差控制 · 涂料温湿度' },
  { name: '基础辅材', desc: '品牌锁定 · 不允许替换 · 全程可溯源' },
]

export function CraftSystems() {
  return (
    <section className="px-6 py-16 bg-brand-text">
      <div className="max-w-lg mx-auto">
        <AnimateInView>
          <p className="text-xs tracking-[0.3em] text-brand-accent-light uppercase mb-3">Standardization</p>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide mb-8">八大标准化工艺体系</h2>
        </AnimateInView>
        <div className="grid grid-cols-2 gap-3">
          {systems.map((sys, i) => (
            <AnimateInView key={sys.name} delay={i * 80}>
              <div className="border border-white/10 rounded-xl p-3.5">
                <div className="text-xs text-brand-accent font-serif mb-1">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="text-sm font-medium text-white mb-1">{sys.name}</h3>
                <p className="text-[11px] text-white/40 leading-relaxed">{sys.desc}</p>
              </div>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
