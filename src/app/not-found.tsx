import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      {/* Brand mark */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-text mb-8">
        <span className="text-xl font-bold text-brand-accent font-serif">角</span>
      </div>

      <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-3">
        Page Not Found
      </p>

      <h1 className="text-5xl font-serif font-black tracking-wider text-brand-text mb-4">
        404
      </h1>

      <p className="text-brand-text-secondary text-sm leading-relaxed max-w-xs mb-8">
        抱歉，您访问的页面不存在或已被移动。
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center h-11 px-6 bg-brand-text text-white text-sm font-medium rounded-lg hover:bg-neutral-800 active:scale-[0.98] transition-all touch-manipulation"
        >
          返回首页
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center h-11 px-6 border border-brand-border text-brand-text text-sm font-medium rounded-lg hover:bg-brand-bg active:scale-[0.98] transition-all touch-manipulation"
        >
          联系我们
        </Link>
      </div>
    </div>
  )
}
