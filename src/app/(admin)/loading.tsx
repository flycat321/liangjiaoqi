import { Skeleton, SkeletonList } from '@/components/ui/Skeleton'

export default function AdminLoading() {
  return (
    <div className="px-4 pt-6 pb-4">
      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-brand-border/50 bg-white p-4 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-7 w-12" />
          </div>
        ))}
      </div>
      <Skeleton className="h-5 w-28 mb-4" />
      <SkeletonList count={4} />
    </div>
  )
}
