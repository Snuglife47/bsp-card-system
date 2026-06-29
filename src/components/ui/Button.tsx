'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled,
  type = 'button',
  className,
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
  const sizes = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-2 text-sm'
  const variants = {
    primary: 'bg-teal-900 text-white hover:bg-teal-800',
    secondary: 'bg-white text-teal-900 ring-1 ring-sage-300 hover:bg-sage-50',
    ghost: 'text-teal-800 hover:bg-sage-100',
    danger: 'bg-danger text-white hover:bg-danger/90',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, sizes, variants[variant], className)}
    >
      {children}
    </button>
  )
}
