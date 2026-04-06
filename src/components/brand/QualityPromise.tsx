import { AnimateInView } from '@/components/ui/AnimateInView'

export function QualityPromise() {
  const promises = [
    { value: '100%', label: '节点验收覆盖', sub: '每道工序验收通过才能进入下一步' },
    { value: '5年', label: '隐蔽工程质保', sub: '水电管路五年质保，终身维护支持' },
    { value: '48h', label: '售后响应', sub: '问题48h内响应，72h上门处理' },
  ]

  return (
    <section className="px-6 py-16">
      <div className="max-w-lg mx-auto text-center">
        <AnimateInView>
          <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-3">Quality Assurance</p>
          <h2 className="text-2xl font-serif font-bold tracking-wide mb-8">品质承诺</h2>
        </AnimateInView>
        <div className="grid grid-cols-3 gap-4">
          {promises.map((p, i) => (
            <AnimateInView key={p.label} delay={i * 150}>
              <div className="text-2xl font-serif font-bold text-brand-accent">{p.value}</div>
              <div className="text-xs font-medium mt-1">{p.label}</div>
              <p className="text-[10px] text-brand-text-muted mt-1 leading-relaxed">{p.sub}</p>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
