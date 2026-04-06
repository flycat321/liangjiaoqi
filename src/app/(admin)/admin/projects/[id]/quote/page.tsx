'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, FileText } from 'lucide-react'

export default function AdminProjectQuotePage() {
  const { id } = useParams()

  return (
    <div className="pb-8">
      <div className="sticky top-[52px] z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={`/admin/projects/${id}`} className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
          <h1 className="text-sm font-medium">报价单编辑</h1>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-24 px-6">
        <div className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center mb-4">
          <FileText size={28} className="text-brand-text-muted" />
        </div>
        <h2 className="text-base font-serif font-bold mb-2">报价单编辑</h2>
        <p className="text-sm text-brand-text-muted text-center leading-relaxed">
          在此编辑分项报价，完成后推送给客户在线确认。
        </p>
        <p className="text-xs text-brand-accent mt-4">功能开发中，敬请期待</p>
      </div>
    </div>
  )
}
