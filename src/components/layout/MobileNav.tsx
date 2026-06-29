'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/worklist', label: 'Worklist' },
  { href: '/search', label: 'Search' },
  { href: '/intake', label: 'Intake' },
  { href: '/reports', label: 'Reports' },
  { href: '/failed', label: 'Failed' },
  { href: '/audit', label: 'Audit' },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="flex gap-1 overflow-x-auto border-b border-sage-200 bg-white px-2 py-1.5 md:hidden">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium ${
            pathname === item.href ? 'bg-teal-900 text-white' : 'text-teal-900'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}
