import { AnimateInView } from '@/components/ui/AnimateInView'

export function TwoEngines() {
  const engines = [
    { letter: 'A', title: '设计引擎', items: ['建筑师级别的空间把控', '从概念到施工图全链路设计', '材料、光线、比例、收口一体化思考'] },
    { letter: 'B', title: '交付引擎', items: ['标准化施工工艺体系', '节点验收制度 + 严选供应链', '设计师全过程驻场管控'] },
  ]

  return (
    <section className="px-6 py-16 bg-brand-bg">
      <div className="max-w-lg mx-auto">
        <AnimateInView>
          <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-3">Core System</p>
          <h2 className="text-2xl font-serif font-bold tracking-wide mb-8">双引擎驱动</h2>
        </AnimateInView>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {engines.map((engine, i) => (
            <AnimateInView key={engine.letter} delay={i * 200} direction={i === 0 ? 'left' : 'right'}>
              <div className="bg-white rounded-xl border border-brand-border/50 p-5 text-center">
                <span className="font-serif text-4xl text-brand-accent/20 font-bold">{engine.letter}</span>
                <h3 className="font-serif font-semibold text-base mt-2 mb-3 tracking-wide">{engine.title}</h3>
                <div className="space-y-1.5">
                  {engine.items.map((item) => (
                    <p key={item} className="text-xs text-brand-text-secondary leading-relaxed">{item}</p>
                  ))}
                </div>
              </div>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
