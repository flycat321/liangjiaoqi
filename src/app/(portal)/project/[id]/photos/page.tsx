'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Camera } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

const demoPhotos = [
  { id: '1', stage: '水电预埋', url: '', caption: '给水管路走顶', date: '2026-03-15' },
  { id: '2', stage: '水电预埋', url: '', caption: '打压测试 0.8MPa', date: '2026-03-16' },
  { id: '3', stage: '水电预埋', url: '', caption: '强弱电分管', date: '2026-03-16' },
  { id: '4', stage: '防水工程', url: '', caption: '第一遍防水涂刷', date: '2026-03-20' },
  { id: '5', stage: '防水工程', url: '', caption: '闭水试验 48h', date: '2026-03-22' },
  { id: '6', stage: '瓦工工程', url: '', caption: '墙砖薄贴施工', date: '2026-03-28' },
  { id: '7', stage: '瓦工工程', url: '', caption: '阳角45°对缝', date: '2026-03-28' },
  { id: '8', stage: '瓦工工程', url: '', caption: '地砖铺贴完成', date: '2026-03-30' },
]

const stages = [...new Set(demoPhotos.map(p => p.stage))]

export default function PhotosPage() {
  const { id } = useParams()
  const [activeStage, setActiveStage] = useState<string | null>(null)

  const filtered = activeStage ? demoPhotos.filter(p => p.stage === activeStage) : demoPhotos

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={`/project/${id}`} className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
          <h1 className="text-sm font-medium">工地照片</h1>
          <span className="text-xs text-brand-text-muted ml-auto">{demoPhotos.length} 张</span>
        </div>
      </div>

      {/* Stage filter tabs */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveStage(null)}
          className={cn(
            'shrink-0 px-3 py-1.5 rounded-full text-xs transition-colors touch-manipulation',
            !activeStage ? 'bg-brand-text text-white' : 'bg-brand-bg text-brand-text-secondary'
          )}
        >
          全部
        </button>
        {stages.map(s => (
          <button
            key={s}
            onClick={() => setActiveStage(s)}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-full text-xs transition-colors touch-manipulation',
              activeStage === s ? 'bg-brand-text text-white' : 'bg-brand-bg text-brand-text-secondary'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Photo grid */}
      <div className="px-4 grid grid-cols-2 gap-2">
        {filtered.map((photo) => (
          <div key={photo.id} className="aspect-square rounded-xl bg-brand-bg border border-brand-border/30 overflow-hidden relative group">
            {/* Placeholder — real images from Supabase Storage */}
            <div className="w-full h-full flex flex-col items-center justify-center text-brand-text-muted">
              <Camera size={24} className="mb-1 opacity-30" />
              <span className="text-[10px] opacity-50">待上传</span>
            </div>
            {/* Caption overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <p className="text-[11px] text-white font-medium">{photo.caption}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Badge variant="default" className="!text-[9px] !px-1.5 !py-0 bg-white/20 text-white/80">{photo.stage}</Badge>
                <span className="text-[9px] text-white/50">{photo.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
