import { Skeleton, SkeletonList } from '@/components/ui/Skeleton'

export default function PortalLoading() {
  return (
    <div className="px-4 pt-6 pb-4">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-32" />
      </div>
      <SkeletonList count={3} />
    </div>
  )
}
