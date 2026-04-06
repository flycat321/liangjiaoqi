export function IdealClient() {
  const traits = [
    '相信好设计值得付费，而不只是要一张"免费效果图"',
    '在意施工细节和材料品质，不追求最低价',
    '希望装修过程透明、可控、可预期',
    '大平层、别墅、复式等有一定空间复杂度的住宅',
  ]

  return (
    <section className="px-6 py-16 bg-brand-text">
      <div className="max-w-lg mx-auto">
        <p className="text-xs tracking-[0.3em] text-brand-accent-light uppercase mb-3">Ideal Client</p>
        <h2 className="text-2xl font-serif font-bold text-white tracking-wide mb-8">我们的理想客户</h2>
        <div className="space-y-3 mb-8">
          {traits.map((t) => (
            <div key={t} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0 mt-1.5" />
              <p className="text-sm text-white/70 leading-relaxed">{t}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-6">
          <p className="text-xs text-white/30 leading-relaxed text-center">
            如果你追求的是最低报价和最快工期，我们可能不是最佳选择。<br />
            但如果你追求的是设计被完美执行——我们就是为此而生。
          </p>
        </div>
      </div>
    </section>
  )
}
