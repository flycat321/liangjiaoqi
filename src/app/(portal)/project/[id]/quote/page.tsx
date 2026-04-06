'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, FileCheck } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const demoQuote = {
  area: 186,
  designFeePerSqm: 200,
  categories: [
    { name: '基础拆改', items: [{ name: '墙体拆除', unit: '㎡', qty: 12, price: 80 }, { name: '墙体新建', unit: '㎡', qty: 8, price: 150 }] },
    { name: '水电工程', items: [{ name: '给水管路', unit: '米', qty: 120, price: 18 }, { name: '排水管路', unit: '米', qty: 35, price: 65 }, { name: '强电线路', unit: '米', qty: 800, price: 6.5 }, { name: '弱电线路', unit: '米', qty: 200, price: 8 }] },
    { name: '防水工程', items: [{ name: '防水涂刷（卫生间）', unit: '㎡', qty: 42, price: 85 }, { name: '闭水试验', unit: '次', qty: 3, price: 200 }] },
    { name: '瓦工工程', items: [{ name: '墙砖薄贴', unit: '㎡', qty: 65, price: 75 }, { name: '地砖铺贴', unit: '㎡', qty: 110, price: 65 }] },
    { name: '木工工程', items: [{ name: '吊顶（轻钢龙骨）', unit: '㎡', qty: 90, price: 120 }] },
    { name: '油漆工程', items: [{ name: '墙面基层处理+涂刷', unit: '㎡', qty: 320, price: 38 }] },
  ],
}

export default function QuotePage() {
  const { id } = useParams()
  const [confirmed, setConfirmed] = useState(false)

  const designFee = demoQuote.area * demoQuote.designFeePerSqm
  const constructionTotal = demoQuote.categories.reduce(
    (sum, cat) => sum + cat.items.reduce((s, i) => s + i.qty * i.price, 0), 0
  )
  const managementFee = Math.round(constructionTotal * 0.18)
  const grandTotal = designFee + constructionTotal + managementFee

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={`/project/${id}`} className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
          <h1 className="text-sm font-medium">装修工程报价单</h1>
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Design fee */}
        <div className="flex items-center justify-between py-3 border-b border-brand-border/30">
          <div>
            <span className="text-sm font-serif font-semibold">设计费</span>
            <p className="text-[11px] text-brand-text-muted">{demoQuote.area}㎡ × ¥{demoQuote.designFeePerSqm}/㎡</p>
          </div>
          <span className="font-serif font-bold text-brand-accent-dark">¥{designFee.toLocaleString()}</span>
        </div>

        {/* Categories */}
        {demoQuote.categories.map((cat) => {
          const catTotal = cat.items.reduce((s, i) => s + i.qty * i.price, 0)
          return (
            <div key={cat.name} className="py-3 border-b border-brand-border/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-serif font-semibold">{cat.name}</span>
                <span className="text-xs text-brand-text-muted">小计 ¥{catTotal.toLocaleString()}</span>
              </div>
              {cat.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between py-1">
                  <span className="text-xs text-brand-text-secondary">{item.name}</span>
                  <span className="text-xs text-brand-text-muted">
                    {item.qty}{item.unit} × ¥{item.price} = ¥{(item.qty * item.price).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )
        })}

        {/* Management fee */}
        <div className="flex items-center justify-between py-3 border-b border-brand-border/30">
          <div>
            <span className="text-sm font-serif font-semibold">施工管理费</span>
            <p className="text-[11px] text-brand-text-muted">工程造价 × 18%</p>
          </div>
          <span className="font-serif font-bold text-brand-accent-dark">¥{managementFee.toLocaleString()}</span>
        </div>

        {/* Grand total */}
        <div className="flex items-center justify-between py-4">
          <span className="text-base font-serif font-bold">合计</span>
          <span className="text-xl font-serif font-bold text-brand-accent">¥{grandTotal.toLocaleString()}</span>
        </div>

        <p className="text-[11px] text-brand-text-muted mb-6 leading-relaxed">
          * 以上报价不含主材（瓷砖/地板/卫浴等）和全屋定制费用，主材可自行采购或委托代购（实价+5-8%服务费）。
          本报价有效期30天。
        </p>

        {!confirmed ? (
          <Button size="lg" className="w-full" onClick={() => { setConfirmed(true); toast.success('报价已确认') }}>
            <FileCheck size={16} className="mr-2" />
            确认报价单
          </Button>
        ) : (
          <div className="text-center py-4 bg-green-50 rounded-xl border border-brand-success/20">
            <FileCheck size={24} className="text-brand-success mx-auto mb-2" />
            <p className="text-sm font-medium text-brand-success">报价已确认</p>
          </div>
        )}
      </div>
    </div>
  )
}
