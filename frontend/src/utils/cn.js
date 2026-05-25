// src/utils/cn.js
import { clsx } from 'clsx'

/**
 * Merge class names conditionally.
 * Usage: cn('base', condition && 'extra', { 'active': isActive })
 */
export function cn(...inputs) {
  return clsx(...inputs)
}
