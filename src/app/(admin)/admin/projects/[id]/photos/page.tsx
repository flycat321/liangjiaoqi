'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Camera } from 'lucide-react'

export default function AdminProjectPhotosPage() {
  const { id } = useParams()

  return (
    <div className="pb-8">
      <div className="sticky top-[52px] z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={`/admin/projects/${id}`} className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
          <h1 className="text-sm font-medium">施工照片管理</h1>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-24 px-6">
        <div className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center mb-4">
          <Camera size={28} className="text-brand-text-muted" />
        </div>
        <h2 className="text-base font-serif font-bold mb-2">施工照片</h2>
        <p className="text-sm text-brand-text-muted text-center leading-relaxed">
          在此上传各阶段施工照片，客户可在项目页查看。
        </p>
        <p className="text-xs text-brand-accent mt-4">功能开发中，敬请期待</p>
      </div>
    </div>
  )
}
