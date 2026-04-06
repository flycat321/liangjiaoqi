import { AnimateInView } from '@/components/ui/AnimateInView'

export function PainPoints() {
  const points = [
    { num: '01', title: '设计与落地脱节', desc: '效果图很美，交付现场面目全非。设计师画完图就消失，工人按经验施工。' },
    { num: '02', title: '施工无标准可循', desc: '同一个工序，十个工人十种做法。质量完全取决于"师傅的手艺和心情"。' },
    { num: '03', title: '材料体系混乱', desc: '低价中标、以次充好、偷换品牌。业主花了钱，却不知道墙里埋了什么。' },
  ]

  return (
    <section className="px-6 py-16 bg-brand-text">
      <div className="max-w-lg mx-auto">
        <AnimateInView>
          <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-3">The Problem</p>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide mb-8">装修行业的三个真相</h2>
        </AnimateInView>
        <div className="space-y-4">
          {points.map((p, i) => (
            <AnimateInView key={p.num} delay={i * 120}>
              <div className="flex gap-4 p-4 rounded-xl border border-white/10">
                <span className="font-serif text-2xl text-brand-accent/30 font-bold leading-none shrink-0">{p.num}</span>
                <div>
                  <h3 className="text-white font-medium mb-1">{p.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
