// src/components/ui/Button.jsx
// Reusable button with variant system: primary, secondary, ghost, danger.

import { cn } from '@/utils/cn'

const variants = {
  primary: `bg-leaf-600 hover:bg-leaf-500 text-white border border-leaf-500/50
             shadow-leaf hover:shadow-leaf focus:ring-2 focus:ring-leaf-500/40`,
  secondary: `bg-white/[0.06] hover:bg-white/[0.1] text-stone-200
              border border-white/[0.1] hover:border-white/[0.15]`,
  ghost: `text-stone-400 hover:text-stone-200 hover:bg-white/[0.05]
          border border-transparent`,
  danger: `bg-red-900/40 hover:bg-red-900/60 text-red-400
           border border-red-800/50 hover:border-red-700/60`,
  harvest: `bg-harvest-600 hover:bg-harvest-500 text-harvest-950
            border border-harvest-400/40 font-semibold`,
}

const sizes = {
  xs: 'text-xs px-2.5 py-1.5 rounded-lg gap-1.5',
  sm: 'text-sm px-3.5 py-2 rounded-xl gap-2',
  md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
  lg: 'text-base px-5 py-3 rounded-xl gap-2.5',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  className,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium',
        'transition-all duration-200 active:scale-[0.97]',
        'focus:outline-none focus:ring-offset-2 focus:ring-offset-stone-900',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      ) : (
        Icon && <Icon size={size === 'lg' ? 18 : 16} className="flex-shrink-0" />
      )}
      {children}
      {IconRight && !loading && (
        <IconRight size={size === 'lg' ? 18 : 16} className="flex-shrink-0" />
      )}
    </button>
  )
}
