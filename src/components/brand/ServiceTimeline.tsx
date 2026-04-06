'use client'

import { STAGE_DEFINITIONS } from '@/lib/constants/stages'
import {
  MessageSquare, Palette, Ruler, Package, ClipboardList,
  Zap, Hammer, Paintbrush, Sofa, CheckCircle, HeartHandshake, Circle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  MessageSquare, Palette, Ruler, Package, ClipboardList,
  Zap, Hammer, Paintbrush, Sofa, CheckCircle, HeartHandshake,
}

function getIcon(name: string): LucideIcon {
  return iconMap[name] || Circle
}

export function ServiceTimeline() {
  return (
    <section className="px-6 py-16">
      <div className="max-w-lg mx-auto">
        <p className="text-xs tracking-[0.3em] text-brand-accent uppercase mb-3">
          Service Flow
        </p>
        <h2 className="text-2xl font-serif font-bold tracking-wide mb-2">
          全流程服务
        </h2>
        <p className="text-sm text-brand-text-muted mb-8">
          11个标准化阶段，从沟通到售后，设计师全程参与
        </p>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-brand-border" />

          <div className="space-y-1">
            {STAGE_DEFINITIONS.map((stage, i) => {
              const Icon = getIcon(stage.icon)
              return (
                <div
                  key={stage.order}
                  className="flex items-start gap-4 py-3 animate-[fadeInUp_0.4s_ease_both]"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-brand-border shadow-sm">
                    <Icon size={16} className="text-brand-accent" />
                  </div>
                  <div className="pt-1.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-brand-text-muted font-serif">
                        {String(stage.order).padStart(2, '0')}
                      </span>
                      <h3 className="text-sm font-medium">{stage.name}</h3>
                    </div>
                    <p className="text-xs text-brand-text-muted mt-0.5 leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
