'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './navbar'
import { Footer } from './footer'

interface FooterCategory {
  slug: string;
  name: string;
}

interface FooterProduct {
  slug: string;
  name: string;
}

interface ConditionalLayoutProps {
  children: React.ReactNode;
  footerCategories?: FooterCategory[];
  footerProducts?: FooterProduct[];
}

export function ConditionalLayout({
  children,
  footerCategories = [],
  footerProducts = []
}: ConditionalLayoutProps) {
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
      <Footer categories={footerCategories} products={footerProducts} />
    </>
  )
}
