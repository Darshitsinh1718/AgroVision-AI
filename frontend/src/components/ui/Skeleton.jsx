// src/components/ui/Skeleton.jsx
// Loading skeleton components matching the shape of real content.
// Used while data is being fetched from the backend.

import { cn } from '@/utils/cn'

/* Base skeleton block */
export function SkeletonBlock({ className }) {
  return (
    <div className={cn('skeleton', className)} />
  )
}

/* Skeleton for StatCard */
export function StatCardSkeleton({ className }) {
  return (
    <div className={cn(
      'rounded-2xl border border-white/[0.06] bg-stone-900/80 p-5',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <SkeletonBlock className="h-3 w-24 mb-3" />
          <SkeletonBlock className="h-9 w-20 mb-2" />
          <SkeletonBlock className="h-3 w-16" />
        </div>
        <SkeletonBlock className="w-10 h-10 rounded-xl" />
      </div>
    </div>
  )
}

/* Skeleton for FeatureCard */
export function FeatureCardSkeleton({ className }) {
  return (
    <div className={cn(
      'rounded-2xl border border-white/[0.06] bg-stone-900/80 p-5 flex flex-col gap-4',
      className
    )}>
      <div className="flex items-start justify-between">
        <SkeletonBlock className="w-11 h-11 rounded-xl" />
        <SkeletonBlock className="h-5 w-14 rounded-full" />
      </div>
      <div>
        <SkeletonBlock className="h-4 w-3/4 mb-2" />
        <SkeletonBlock className="h-3 w-full mb-1.5" />
        <SkeletonBlock className="h-3 w-5/6" />
      </div>
      <SkeletonBlock className="h-3 w-24" />
    </div>
  )
}

/* Skeleton for activity list item */
export function ActivitySkeleton({ className }) {
  return (
    <div className={cn('flex items-start gap-3 py-3 border-b border-white/[0.04]', className)}>
      <SkeletonBlock className="w-8 h-8 rounded-lg flex-shrink-0" />
      <div className="flex-1">
        <SkeletonBlock className="h-3.5 w-3/4 mb-2" />
        <SkeletonBlock className="h-3 w-1/2" />
      </div>
      <SkeletonBlock className="h-3 w-12" />
    </div>
  )
}

/* Skeleton for chart area */
export function ChartSkeleton({ className }) {
  return (
    <div className={cn('rounded-2xl border border-white/[0.06] bg-stone-900/80 p-5', className)}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <SkeletonBlock className="h-4 w-32 mb-2" />
          <SkeletonBlock className="h-3 w-48" />
        </div>
        <SkeletonBlock className="h-8 w-24 rounded-xl" />
      </div>
      {/* Fake bar chart */}
      <div className="flex items-end gap-2 h-32">
        {[65, 45, 80, 55, 70, 40, 85, 60, 75, 50, 90, 68].map((h, i) => (
          <div
            key={i}
            className="flex-1 skeleton rounded-t-md"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map(m => (
          <SkeletonBlock key={m} className="h-2.5 w-6" />
        ))}
      </div>
    </div>
  )
}

/* Full page skeleton — used on initial load */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <SkeletonBlock className="h-7 w-56 mb-2" />
        <SkeletonBlock className="h-4 w-80" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Features grid */}
      <div>
        <SkeletonBlock className="h-4 w-32 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <FeatureCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartSkeleton className="lg:col-span-2" />
        <div className="rounded-2xl border border-white/[0.06] bg-stone-900/80 p-5">
          <SkeletonBlock className="h-4 w-32 mb-4" />
          {[...Array(4)].map((_, i) => (
            <ActivitySkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
