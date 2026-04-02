import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/clients', label: 'Clients' },
]

const roleLinks = [
  { href: '/consultants', label: 'Consultant' },
  { href: '/leads', label: 'Lead' },
]

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const isRoleView = router.pathname === '/consultants' || router.pathname === '/leads'

  return (
    <div className="min-h-screen bg-ui-background flex flex-col">
      {/* Top nav */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-lg font-bold text-brand-primary tracking-tight">Clientpedia</span>
          </Link>

          {/* Main nav */}
          <nav className="flex items-center gap-1">
            {navLinks.map(link => {
              const active = router.pathname === link.href || router.pathname.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    active
                      ? 'bg-brand-primary text-white'
                      : 'text-ui-foreground hover:bg-neutral-100'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Role toggle + profile — right side */}
          <div className="flex items-center gap-3 ml-auto">
            {/* View-as role toggle */}
            <div className="flex items-center">
              <span className="text-xs text-ui-muted mr-2 hidden sm:block whitespace-nowrap">View as:</span>
              <div className="flex rounded-lg border border-neutral-200 overflow-hidden">
                {roleLinks.map(rl => {
                  const active = router.pathname === rl.href
                  return (
                    <Link
                      key={rl.href}
                      href={rl.href}
                      className={`px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-brand-primary text-white'
                          : 'bg-white text-ui-foreground hover:bg-neutral-50'
                      }`}
                    >
                      {rl.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Profile avatar */}
            <div
              title="Koi Hernandez — Prototype User"
              className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 cursor-pointer"
            >
              KH
            </div>
          </div>
        </div>
      </header>

      {/* Page content (64px margin on all sides) */}
      <main className="flex-1 m-16">
        {children}
      </main>

      <footer className="border-t border-neutral-200 bg-white py-3 text-center text-xs text-ui-muted">
        Clientpedia · Internal Use Only · {new Date().getFullYear()}
      </footer>
    </div>
  )
}

export default Layout

