// src/components/layout/Sidebar.jsx
// Fixed left sidebar. Renders nav items from navigation.js,
// shows AI badges, active route highlight, quick field stats.

import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Sprout, ScanLine, CloudSun,
  TrendingUp, BarChart3, Settings, ChevronRight,
  Thermometer, Droplets, Wind, Sun, BadgeIndianRupee
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { navItems, bottomNavItems } from '@/data/navigation'

// Map icon name strings to Lucide components
const ICONS = {
  LayoutDashboard, Sprout, ScanLine, CloudSun,
  TrendingUp, BarChart3, Settings, BadgeIndianRupee,
}

function NavItem({ item, onClick }) {
  const location = useLocation()
  const isActive = item.exact
    ? location.pathname === item.path
    : location.pathname.startsWith(item.path) && item.path !== '/'
      ? true
      : location.pathname === item.path

  const Icon = ICONS[item.icon]

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      end={item.exact}
      className={({ isActive: navIsActive }) =>
        cn(
          'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group',
          navIsActive
            ? 'bg-leaf-900/60 text-leaf-300 border border-leaf-800/60'
            : 'text-stone-400 hover:text-stone-200 hover:bg-white/[0.04] border border-transparent'
        )
      }
    >
      {({ isActive: navIsActive }) => (
        <>
          {/* Active left bar */}
          {navIsActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6
                             rounded-r-full bg-leaf-400 animate-fade-in" />
          )}

          {/* Icon */}
          {Icon && (
            <Icon
              size={18}
              className={cn(
                'flex-shrink-0 transition-colors duration-200',
                navIsActive ? 'text-leaf-400' : 'text-stone-500 group-hover:text-stone-300'
              )}
            />
          )}

          {/* Label + description */}
          <div className="flex-1 min-w-0">
            <span className="block font-medium leading-none truncate">{item.label}</span>
            {item.description && (
              <span className="block text-2xs text-stone-600 mt-0.5 truncate
                               group-hover:text-stone-500 transition-colors">
                {item.description}
              </span>
            )}
          </div>

          {/* Badge */}
          {item.badge && (
            <span className={cn(
              'text-2xs font-bold px-1.5 py-0.5 rounded-md tracking-wider uppercase',
              item.badgeColor === 'harvest'
                ? 'bg-harvest-500/20 text-harvest-400 border border-harvest-700/40'
                : 'bg-leaf-800/40 text-leaf-400 border border-leaf-700/40'
            )}>
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar({ sidebar }) {
  const closeOnMobile = () => {
    if (sidebar.isMobile) sidebar.close()
  }

  return (
    <aside
      className={cn(
        'fixed top-16 left-0 bottom-0 z-30 w-[260px] flex flex-col',
        'border-r border-white/[0.06] bg-slate-900/95 backdrop-blur-xl',
        'transition-transform duration-300 ease-spring',
        sidebar.isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* ── Section: Main nav ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="text-2xs font-mono text-stone-600 uppercase tracking-widest px-3 pb-2">
          Main Menu
        </p>
        {navItems.map((item, i) => (
          <div
            key={item.id}
            className="animate-slide-in-left opacity-0-start"
            style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'forwards' }}
          >
            <NavItem item={item} onClick={closeOnMobile} />
          </div>
        ))}

        {/* ── Divider ── */}
        <div className="my-3 border-t border-white/[0.05]" />

        {/* ── Field status mini-widget ── */}
        <div className="glass-card p-3 mx-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-stone-300">Field Conditions</span>
            <span className="stat-pill bg-leaf-950 text-leaf-400 border border-leaf-800/50">
              Live
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Thermometer, label: 'Temp',     value: '28°C',  color: 'text-harvest-400' },
              { icon: Droplets,    label: 'Moisture', value: '62%',   color: 'text-sky-400' },
              { icon: Wind,        label: 'Wind',     value: '12 km', color: 'text-stone-300' },
              { icon: Sun,         label: 'UV',       value: 'High',  color: 'text-harvest-300' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-1.5 bg-white/[0.03] rounded-lg p-2">
                <Icon size={13} className={cn('flex-shrink-0', color)} />
                <div>
                  <p className="text-2xs text-stone-600 leading-none">{label}</p>
                  <p className={cn('text-xs font-medium mt-0.5', color)}>{value}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-2xs text-stone-700 text-right mt-2 font-mono">Updated 2m ago</p>
        </div>
      </nav>

      {/* ── Bottom: settings + version ── */}
      <div className="px-3 py-3 border-t border-white/[0.06] space-y-0.5">
        {bottomNavItems.map(item => (
          <NavItem key={item.id} item={item} onClick={closeOnMobile} />
        ))}
        <div className="px-3 pt-2">
          <p className="text-2xs text-stone-700 font-mono">AgroVision AI v1.0.0</p>
          <p className="text-2xs text-stone-800 font-mono">© 2025 AgroVision</p>
        </div>
      </div>
    </aside>
  )
}