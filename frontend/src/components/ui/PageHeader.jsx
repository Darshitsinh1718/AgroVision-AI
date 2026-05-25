// src/components/ui/PageHeader.jsx
// Consistent page header with breadcrumb, title, subtitle, and action slot.

import { cn } from '@/utils/cn'

export function PageHeader({ title, subtitle, children, className, badge }) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8', className)}>
      <div>
        {badge && (
          <span className="inline-flex items-center gap-1.5 text-2xs font-mono font-medium
                           text-leaf-400 bg-leaf-950 border border-leaf-800/60
                           px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-leaf-400 animate-pulse-slow" />
            {badge}
          </span>
        )}
        <h1 className="font-display text-2xl sm:text-3xl text-stone-100 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-stone-500 mt-1.5 text-sm leading-relaxed max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {children}
        </div>
      )}
    </div>
  )
}
