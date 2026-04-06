'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Camera, Loader2, Upload, Trash2, Plus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

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
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch(`/api/projects/${id}/photos`)
      .then(r => r.json())
      .then(d => { setPhotos(d.photos || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('图片不能超过 5MB'); return }

    setUploading(true)
    try {
      // Convert to base64
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      const res = await fetch(`/api/admin/projects/${id}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64,
          fileName: file.name,
          caption: caption || file.name.replace(/\.\w+$/, ''),
        }),
      })

      const data = await res.json()
      if (res.ok && data.photo) {
        setPhotos(prev => [{ ...data.photo, stage_name: '其他' }, ...prev])
        setCaption('')
        toast.success('照片上传成功')
      } else {
        toast.error(data.error || '上传失败')
      }
    } catch {
      toast.error('网络错误')
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleDelete(photoId: string) {
    try {
      const res = await fetch(`/api/admin/projects/${id}/photos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId }),
      })
      if (res.ok) {
        setPhotos(prev => prev.filter(p => p.id !== photoId))
        toast.success('已删除')
      }
    } catch { toast.error('删除失败') }
  }

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

      {/* Upload area */}
      <div className="px-4 pt-4">
        <Card className="mb-4">
          <h3 className="text-xs font-medium mb-3">上传照片</h3>
          <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="照片说明（选填）"
            className="w-full h-9 px-3 rounded-lg border border-brand-border text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <Button size="md" className="w-full" loading={uploading} onClick={() => fileRef.current?.click()}>
            <Upload size={14} className="mr-1.5" /> {uploading ? '上传中...' : '选择图片上传'}
          </Button>
          <p className="text-[11px] text-brand-text-muted mt-2 text-center">支持 JPG/PNG，最大 5MB</p>
        </Card>
      </div>

      {/* Photo grid */}
      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <Camera size={32} className="text-brand-border mb-3" />
          <p className="text-brand-text-muted text-sm">暂无施工照片</p>
          <p className="text-brand-text-muted text-xs mt-1">上传照片后客户可在项目页查看</p>
        </div>
      ) : (
        <div className="px-4 grid grid-cols-2 gap-2">
          {photos.map(photo => (
            <div key={photo.id} className="aspect-square rounded-xl bg-brand-bg border border-brand-border/30 overflow-hidden relative group">
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
              <button onClick={() => handleDelete(photo.id)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center text-white/70 hover:text-white touch-manipulation">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
