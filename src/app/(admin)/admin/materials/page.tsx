'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, Package, Search, Loader2, X, Pencil, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Material {
  id: string
  category: string
  brand: string
  model: string | null
  specification: string | null
  unit: string
  reference_price: number | null
}

const emptyForm = { category: '', brand: '', model: '', specification: '', unit: '项', price: '' }

export default function MaterialsLibraryPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  async function load() {
    const supabase = createClient()
    const { data } = await supabase.from('materials').select('*').eq('is_active', true).order('category')
    setMaterials(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = materials.filter(m =>
    !search || m.brand.includes(search) || (m.model && m.model.includes(search)) || m.category.includes(search)
  )
  const categories = [...new Set(filtered.map(m => m.category))]

  function startEdit(m: Material) {
    setForm({
      category: m.category,
      brand: m.brand,
      model: m.model || '',
      specification: m.specification || '',
      unit: m.unit,
      price: m.reference_price?.toString() || '',
    })
    setEditingId(m.id)
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.category || !form.brand) { toast.error('请填写品类和品牌'); return }
    setSaving(true)
    const supabase = createClient()
    const payload = {
      category: form.category,
      brand: form.brand,
      model: form.model || null,
      specification: form.specification || null,
      unit: form.unit,
      reference_price: form.price ? Number(form.price) : null,
    }

    if (editingId) {
      const { error } = await supabase.from('materials').update(payload).eq('id', editingId)
      if (error) { toast.error(error.message) } else { toast.success('材料已更新') }
    } else {
      const { error } = await supabase.from('materials').insert(payload)
      if (error) { toast.error(error.message) } else { toast.success('材料已添加') }
    }

    cancelForm()
    await load()
    setSaving(false)
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`确定删除「${name}」吗？`)) return
    const supabase = createClient()
    await supabase.from('materials').update({ is_active: false }).eq('id', id)
    toast.success('已删除')
    await load()
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-serif font-bold">材料库</h1>
        <Button size="sm" onClick={() => showForm ? cancelForm() : setShowForm(true)}>
          {showForm ? <X size={14} className="mr-1" /> : <Plus size={14} className="mr-1" />}
          {showForm ? '取消' : '添加材料'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-4 bg-brand-bg border-brand-accent/20">
          <p className="text-xs font-medium mb-3">{editingId ? '编辑材料' : '添加材料'}</p>
          <form onSubmit={handleSave} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="h-10 px-3 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
                placeholder="品类 *" />
              <input value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))}
                className="h-10 px-3 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
                placeholder="品牌 *" />
            </div>
            <input value={form.model} onChange={e => setForm(p => ({ ...p, model: e.target.value }))}
              className="w-full h-10 px-3 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
              placeholder="型号" />
            <div className="grid grid-cols-3 gap-3">
              <input value={form.specification} onChange={e => setForm(p => ({ ...p, specification: e.target.value }))}
                className="h-10 px-3 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
                placeholder="规格" />
              <input value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                className="h-10 px-3 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
                placeholder="单位" />
              <input value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} type="number"
                className="h-10 px-3 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
                placeholder="参考价" />
            </div>
            <Button type="submit" size="md" loading={saving} className="w-full">
              {editingId ? '保存修改' : '添加'}
            </Button>
          </form>
        </Card>
      )}

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-lg border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors"
          placeholder="搜索品牌/型号/品类..." />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-accent" /></div>
      ) : materials.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brand-text-muted text-sm">暂无材料</p>
        </div>
      ) : (
        categories.map((cat) => (
          <div key={cat} className="mb-6">
            <h2 className="text-xs text-brand-text-muted tracking-wider mb-3 uppercase">{cat}</h2>
            <div className="space-y-2">
              {filtered.filter(m => m.category === cat).map((m) => (
                <Card key={m.id} padding="sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-accent/10 flex items-center justify-center shrink-0">
                      <Package size={16} className="text-brand-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium">{m.brand}</h3>
                      <p className="text-[11px] text-brand-text-muted truncate">{m.model}{m.specification && ` · ${m.specification}`}</p>
                    </div>
                    {m.reference_price && (
                      <div className="text-right shrink-0 mr-2">
                        <span className="text-sm font-serif font-bold text-brand-accent-dark">¥{m.reference_price.toLocaleString()}</span>
                        <p className="text-[10px] text-brand-text-muted">/{m.unit}</p>
                      </div>
                    )}
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => startEdit(m)} className="p-1.5 text-brand-text-muted hover:text-brand-accent rounded-lg transition-colors touch-manipulation">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(m.id, m.brand)} className="p-1.5 text-brand-text-muted hover:text-red-500 rounded-lg transition-colors touch-manipulation">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
