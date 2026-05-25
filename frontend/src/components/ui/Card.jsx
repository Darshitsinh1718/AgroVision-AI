// src/components/ui/Card.jsx
// Reusable card system: Card (base), StatCard, FeatureCard.
// All variants accept className overrides and animate on mount.

import { cn } from '@/utils/cn'
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

/* ──────────────────────────────────────────
   Base Card
────────────────────────────────────────── */
export function Card({
  children,
  className,
  hover = true,
  glass = true,
  onClick,
  as: Tag = 'div',
  ...props
}) {
  return (
    <Tag
      onClick={onClick}
      className={cn(
        'relative rounded-2xl border border-white/[0.06] overflow-hidden',
        'transition-all duration-300',
        glass && 'bg-gradient-to-br from-stone-900/80 to-stone-950/80',
        hover && 'hover:border-white/[0.1] hover:-translate-y-0.5 hover:shadow-card',
        onClick && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

/* ──────────────────────────────────────────
   Stat Card — key metric display
────────────────────────────────────────── */
export function StatCard({
  label,
  value,
  unit = '',
  trend,
  trendUp,
  icon: Icon,
  iconColor = 'text-leaf-400',
  iconBg = 'bg-leaf-950',
  description,
  className,
}) {
  return (
    <Card className={cn('p-5', className)} hover>
      <div className="flex items-start justify-between gap-3">
        {/* Value block */}
        <div>
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
            {label}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-display font-normal text-stone-100 tabular-nums">
              {value}
            </span>
            {unit && (
              <span className="text-sm text-stone-500 font-mono">{unit}</span>
            )}
          </div>
          {trend && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-xs font-medium',
              trendUp ? 'text-leaf-400' : 'text-red-400'
            )}>
              {trendUp
                ? <TrendingUp  size={12} />
                : <TrendingDown size={12} />
              }
              <span>{trend}</span>
            </div>
          )}
          {description && (
            <p className="text-xs text-stone-600 mt-1">{description}</p>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
            iconBg
          )}>
            <Icon size={20} className={iconColor} />
          </div>
        )}
      </div>

      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r
                      from-transparent via-leaf-700/30 to-transparent" />
    </Card>
  )
}

/* ──────────────────────────────────────────
   Feature Card — for feature showcase grid
────────────────────────────────────────── */
export function FeatureCard({
  title,
  description,
  icon: Icon,
  badge,
  badgeVariant = 'leaf',
  to,
  accentColor = 'leaf',
  comingSoon = false,
  className,
}) {
  const accent = {
    leaf:    { glow: 'hover:shadow-leaf',    iconBg: 'bg-leaf-950',    iconColor: 'text-leaf-400',    border: 'hover:border-leaf-700/50'    },
    harvest: { glow: 'hover:shadow-harvest', iconBg: 'bg-harvest-950', iconColor: 'text-harvest-400', border: 'hover:border-harvest-700/50' },
    sky:     { glow: 'hover:shadow-none',    iconBg: 'bg-sky-950',     iconColor: 'text-sky-400',     border: 'hover:border-sky-700/40'     },
    red:     { glow: 'hover:shadow-none',    iconBg: 'bg-red-950',     iconColor: 'text-red-400',     border: 'hover:border-red-700/40'     },
  }[accentColor] || {}

  const Wrapper = to && !comingSoon ? Link : 'div'

  return (
    <Wrapper
      to={to}
      className={cn(
        'group relative flex flex-col gap-4 p-5 rounded-2xl border border-white/[0.06]',
        'bg-gradient-to-br from-stone-900/70 to-stone-950/90',
        'transition-all duration-300',
        !comingSoon && 'hover:-translate-y-1 hover:border-white/[0.1]',
        !comingSoon && accent.glow,
        !comingSoon && accent.border,
        comingSoon && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      {/* Top row: icon + badge */}
      <div className="flex items-start justify-between">
        <div className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center',
          'transition-transform duration-300 group-hover:scale-110',
          accent.iconBg
        )}>
          {Icon && <Icon size={22} className={accent.iconColor} />}
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className={cn(
              'feature-badge',
              badgeVariant === 'harvest'
                ? 'bg-harvest-900/60 text-harvest-400 border border-harvest-700/40'
                : 'bg-leaf-900/60 text-leaf-400 border border-leaf-700/40'
            )}>
              {badge}
            </span>
          )}
          {comingSoon && (
            <span className="feature-badge bg-stone-800 text-stone-500 border border-stone-700">
              Soon
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-medium text-stone-100 mb-1.5 group-hover:text-white
                       transition-colors duration-200">
          {title}
        </h3>
        <p className="text-sm text-stone-500 leading-relaxed group-hover:text-stone-400
                      transition-colors duration-200">
          {description}
        </p>
      </div>

      {/* Arrow indicator */}
      {to && !comingSoon && (
        <div className="flex items-center gap-1 text-xs text-stone-600
                        group-hover:text-leaf-400 transition-colors duration-200">
          <span>Open feature</span>
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      )}

      {/* Hover glow overlay */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                      transition-opacity duration-300 pointer-events-none
                      bg-gradient-to-br from-white/[0.02] to-transparent" />
    </Wrapper>
  )
}

/* ──────────────────────────────────────────
   Activity Item — for recent activity list
────────────────────────────────────────── */
export function ActivityItem({ icon: Icon, iconColor, iconBg, title, subtitle, time, action }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/[0.04] last:border-0
                    hover:bg-white/[0.02] transition-colors -mx-1 px-1 rounded-lg">
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', iconBg)}>
        {Icon && <Icon size={15} className={iconColor} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-stone-200 font-medium leading-snug">{title}</p>
        {subtitle && <p className="text-xs text-stone-600 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-2xs text-stone-700 font-mono whitespace-nowrap">{time}</span>
        {action && (
          <span className={cn('text-2xs font-medium px-1.5 py-0.5 rounded-full', action.className)}>
            {action.label}
          </span>
        )}
      </div>
    </div>
  )
}
