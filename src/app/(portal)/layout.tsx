import { PortalBottomNav } from '@/components/layout/PortalBottomNav'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh pb-16">
      {children}
      <PortalBottomNav />
    </div>
  )
}
