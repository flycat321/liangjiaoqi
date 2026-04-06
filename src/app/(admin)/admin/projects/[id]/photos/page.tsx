'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Camera, Loader2, Upload } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface Photo {
  id: string
  url: string | null
  caption: string | null
  stage_name: string
  created_at: string
}

export default function AdminProjectPhotosPage() {
  const { id } = useParams()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/projects/${id}/photos`)
      .then(r => r.json())
      .then(d => { setPhotos(d.photos || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-accent" /></div>

  return (
    <div className="pb-8">
      <div className="sticky top-[52px] z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={`/admin/projects/${id}`} className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
          <div className="flex-1">
            <h1 className="text-sm font-medium">施工照片管理</h1>
            <p className="text-[11px] text-brand-text-muted">{photos.length} 张照片</p>
          </div>
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center mb-4">
            <Camera size={28} className="text-brand-text-muted" />
          </div>
          <h2 className="text-base font-serif font-bold mb-2">暂无施工照片</h2>
          <p className="text-sm text-brand-text-muted text-center leading-relaxed mb-6">
            拍摄施工现场照片后可在此上传，客户可在项目页查看。
          </p>
          <Card className="w-full bg-brand-accent/5 border-brand-accent/15">
            <div className="flex items-center gap-3">
              <Upload size={18} className="text-brand-accent" />
              <div>
                <p className="text-sm font-medium">照片上传功能</p>
                <p className="text-xs text-brand-text-muted">开发中，敬请期待</p>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="px-4 pt-4 grid grid-cols-2 gap-2">
          {photos.map(photo => (
            <div key={photo.id} className="aspect-square rounded-xl bg-brand-bg border border-brand-border/30 overflow-hidden relative">
              {photo.url ? (
                <img src={photo.url} alt={photo.caption || ''} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-text-muted">
                  <Camera size={24} className="opacity-30" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                {photo.caption && <p className="text-[11px] text-white">{photo.caption}</p>}
                <Badge variant="default" className="!text-[9px] !px-1.5 !py-0 bg-white/20 text-white/80 mt-0.5">{photo.stage_name}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
