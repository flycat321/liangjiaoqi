'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Package, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

interface Material {
  id: string
  category: string
  brand: string
  model: string | null
  specification: string | null
  unit: string
  unit_price: number
  quantity: number
  client_confirmed: boolean
}

const emptyForm = { category: '', brand: '', model: '', specification: '', unit: '项', unit_price: '', quantity: '1' }

export default function AdminProjectMaterialsPage() {
  const { id } = useParams()
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    fetch(`/api/admin/projects/${id}/materials`)
      .then(r => r.json())
      .then(d => { setMaterials(d.materials || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.category || !form.brand || !form.unit_price) { toast.error('请填写品类、品牌和单价'); return }
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/projects/${id}/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, sort_order: materials.length }),
      })
      const data = await res.json()
      if (res.ok) {
        setMaterials(prev => [...prev, data.material])
        setForm(emptyForm)
        setShowForm(false)
        toast.success('材料已添加')
      } else {
        toast.error(data.error || '添加失败')
      }
    } catch { toast.error('网络错误') }
    setSaving(false)
  }

  async function handleDelete(materialId: string) {
    try {
      const res = await fetch(`/api/admin/projects/${id}/materials`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialId }),
      })
      if (res.ok) {
        setMaterials(prev => prev.filter(m => m.id !== materialId))
        toast.success('已删除')
      }
    } catch { toast.error('删除失败') }
  }

  const total = materials.reduce((s, m) => s + m.unit_price * m.quantity, 0)

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-accent" /></div>

  return (
    <div className="pb-8">
      <div className="sticky top-[52px] z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={`/admin/projects/${id}`} className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
          <div className="flex-1">
            <h1 className="text-sm font-medium">项目材料管理</h1>
            <p className="text-[11px] text-brand-text-muted">{materials.length} 项 · 合计 ¥{total.toLocaleString()}</p>
          </div>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus size={14} className="mr-1" /> 添加
          </Button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="px-4 pt-4 space-y-3">
          <Card>
            <h3 className="text-xs font-medium mb-3">添加材料</h3>
            <div className="space-y-2.5">
              <input value={form.category} onChange={e => set('category', e.target.value)} placeholder="品类 *（如：给水管路）"
                className="w-full h-10 px-3 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
              <input value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="品牌 *（如：伟星）"
                className="w-full h-10 px-3 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
              <div className="grid grid-cols-2 gap-2">
                <input value={form.model} onChange={e => set('model', e.target.value)} placeholder="型号"
                  className="w-full h-10 px-3 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
                <input value={form.specification} onChange={e => set('specification', e.target.value)} placeholder="规格"
                  className="w-full h-10 px-3 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input value={form.unit_price} onChange={e => set('unit_price', e.target.value)} placeholder="单价 *" type="number"
                  className="w-full h-10 px-3 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
                <input value={form.quantity} onChange={e => set('quantity', e.target.value)} placeholder="数量" type="number"
                  className="w-full h-10 px-3 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
                <input value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="单位"
                  className="w-full h-10 px-3 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm" loading={saving} className="flex-1">保存</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setShowForm(false)} className="flex-1">取消</Button>
              </div>
            </div>
          </Card>
        </form>
      )}

      <div className="px-4 pt-4 space-y-3">
        {materials.length === 0 && !showForm ? (
          <div className="text-center py-16">
            <Package size={32} className="text-brand-border mx-auto mb-3" />
            <p className="text-brand-text-muted text-sm">暂无材料</p>
            <p className="text-brand-text-muted text-xs mt-1">点击"添加"为项目添加材料清单</p>
          </div>
        ) : (
          materials.map(m => (
            <Card key={m.id} padding="sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-accent/10 flex items-center justify-center shrink-0">
                  <Package size={16} className="text-brand-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-brand-accent">{m.category}</div>
                  <h3 className="text-sm font-medium">{m.brand} {m.model || ''}</h3>
                  {m.specification && <p className="text-[11px] text-brand-text-muted">{m.specification}</p>}
                  <p className="text-xs text-brand-text-secondary mt-1">
                    ¥{m.unit_price}/{m.unit} × {m.quantity} = <span className="font-medium">¥{(m.unit_price * m.quantity).toLocaleString()}</span>
                    {m.client_confirmed && <span className="text-brand-success ml-2">✓ 客户已确认</span>}
                  </p>
                </div>
                <button onClick={() => handleDelete(m.id)} className="p-1 text-brand-text-muted hover:text-red-500 transition-colors touch-manipulation">
                  <Trash2 size={14} />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
