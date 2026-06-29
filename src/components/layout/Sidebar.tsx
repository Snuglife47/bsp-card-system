'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ListChecks, Search, Upload,
  FileSpreadsheet, MailWarning, ScrollText,
} from 'lucide-react'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/worklist', label: 'Ready worklist', icon: ListChecks },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/intake', label: 'Card intake', icon: Upload },
  { href: '/reports', label: 'Reports & export', icon: FileSpreadsheet },
  { href: '/failed', label: 'Failed notifications', icon: MailWarning },
  { href: '/audit', label: 'Audit log', icon: ScrollText },
]

interface SidebarProps {
  outstandingCount: number
  failedCount: number
}

export function Sidebar({ outstandingCount, failedCount }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-teal-900 text-sage-100 md:flex">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <Image src="/bsp-logo.svg" alt="BSP" width={36} height={36} className="rounded-lg" />
        <div className="leading-tight">
          <div className="text-sm font-bold text-white">BSP Cards</div>
          <div className="text-[11px] text-sage-200">Notification console</div>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-0.5 px-3">
        {NAV.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          const badge =
            item.href === '/worklist' ? outstandingCount
              : item.href === '/failed' ? failedCount
              : 0
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? 'bg-white/12 font-semibold text-white'
                  : 'text-sage-200 hover:bg-white/8 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {badge > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                    item.href === '/failed' ? 'bg-danger text-white' : 'bg-amber text-white'
                  }`}
                >
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
