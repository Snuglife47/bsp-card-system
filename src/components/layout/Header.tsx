'use client'

import { LogOut } from 'lucide-react'
import type { User } from '@/types'

interface HeaderProps {
  title: string
  subtitle: string
  user: User | null
  onSignOut: () => void
}

export function Header({ title, subtitle, user, onSignOut }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-sage-200 bg-white px-5 py-3.5">
      <div>
        <h1 className="text-lg font-bold text-ink">{title}</h1>
        <p className="text-xs text-muted">{subtitle}</p>
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-semibold text-ink">{user.name}</div>
            <div className="text-[11px] capitalize text-muted">
              {user.role} · branch {user.branch_code === '000' ? 'all' : user.branch_code}
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="grid h-9 w-9 place-items-center rounded-lg text-muted ring-1 ring-sage-300 hover:bg-sage-50 hover:text-ink"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )}
    </header>
  )
}
