'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './navbar'
import { Footer } from './footer'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Hide navbar and footer on dashboard and auth pages
  const isDashboard = pathname.startsWith('/dashboard')
  const isAuth = pathname.startsWith('/login') || pathname.startsWith('/signup')

  if (isDashboard || isAuth) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
