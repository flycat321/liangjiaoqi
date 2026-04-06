'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Camera, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils/cn'

interface Photo {
  id: string
  stage_name: string
  url: string | null
  caption: string | null
  created_at: string
}

export default function PhotosPage() {
  const { id } = useParams()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [activeStage, setActiveStage] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/projects/${id}/photos`)
        if (res.ok) {
          const data = await res.json()
          setPhotos(data.photos || [])
        }
      } catch {
        // Network error
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-accent" /></div>
  }

  const stages = [...new Set(photos.map(p => p.stage_name))]
  const filtered = activeStage ? photos.filter(p => p.stage_name === activeStage) : photos

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={`/project/${id}`} className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
          <h1 className="text-sm font-medium">工地照片</h1>
          <span className="text-xs text-brand-text-muted ml-auto">{photos.length} 张</span>
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-20">
          <Camera size={32} className="text-brand-border mx-auto mb-3" />
          <p className="text-brand-text-muted text-sm">暂无施工照片</p>
          <p className="text-brand-text-muted text-xs mt-1">设计师上传照片后将在这里显示</p>
        </div>
      ) : (
        <>
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
              <div key={photo.id} className="aspect-square rounded-xl bg-brand-bg border border-brand-border/30 overflow-hidden relative">
                {photo.url ? (
                  <img src={photo.url} alt={photo.caption || ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-brand-text-muted">
                    <Camera size={24} className="mb-1 opacity-30" />
                    <span className="text-[10px] opacity-50">待上传</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  {photo.caption && <p className="text-[11px] text-white font-medium">{photo.caption}</p>}
                  <div className="flex items-center gap-1 mt-0.5">
                    <Badge variant="default" className="!text-[9px] !px-1.5 !py-0 bg-white/20 text-white/80">{photo.stage_name}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
