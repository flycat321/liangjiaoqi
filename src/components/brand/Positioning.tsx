import { AnimateInView } from '@/components/ui/AnimateInView'

export function Positioning() {
  return (
    <section className="px-6 py-16">
      <div className="max-w-lg mx-auto text-center">
        <AnimateInView>
          <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-3">Our Answer</p>
          <h2 className="text-2xl font-serif font-bold tracking-wide mb-4">第四类装饰公司</h2>
          <div className="w-8 h-px bg-brand-accent mx-auto mb-6" />
        </AnimateInView>
        <AnimateInView delay={150}>
          <blockquote className="text-lg font-serif leading-relaxed text-brand-text pl-4 border-l-2 border-brand-accent text-left max-w-md mx-auto mb-6">
            设计师画的每一根线，<br />工地都能一毫米不差地落下去。
          </blockquote>
          <p className="text-sm text-brand-text-muted leading-relaxed max-w-md mx-auto">
            不是只管画图的设计工作室，不是用设计当销售工具的传统装修公司，也不是千篇一律的整装套餐——
            量角器是<strong className="text-brand-text">设计师主导的全流程交付体系</strong>。
          </p>
        </AnimateInView>
      </div>
    </section>
  )
}
