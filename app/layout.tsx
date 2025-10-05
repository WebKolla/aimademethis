import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "AIMadeThis - Discover AI Products Built by the Community",
    template: "%s | AIMadeThis"
  },
  description: "Explore, share, and discover AI products created by innovators worldwide. A community-driven platform for AI tools, applications, and innovations.",
  keywords: [
    "AI products",
    "artificial intelligence",
    "AI tools",
    "machine learning",
    "AI community",
    "AI directory",
    "AI innovation",
    "AI applications",
    "AI marketplace",
    "AI product discovery"
  ],
  authors: [{ name: "AIMadeThis" }],
  creator: "AIMadeThis",
  publisher: "AIMadeThis",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://aimademethis.com',
    title: 'AIMadeThis - Discover AI Products Built by the Community',
    description: 'Explore, share, and discover AI products created by innovators worldwide.',
    siteName: 'AIMadeThis',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AIMadeThis - AI Product Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIMadeThis - Discover AI Products Built by the Community',
    description: 'Explore, share, and discover AI products created by innovators worldwide.',
    creator: '@aimademethis',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://aimademethis.com',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://aimademethis.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} ${poppins.variable} antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>

        {/* JSON-LD Structured Data - Website */}
        <Script
          id="json-ld-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'AIMadeThis',
              description: 'Community-driven platform for discovering and sharing AI products',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://aimademethis.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://aimademethis.com'}/products?q={search_term_string}`
                },
                'query-input': 'required name=search_term_string'
              },
            })
          }}
        />

        {/* JSON-LD Structured Data - Organization */}
        <Script
          id="json-ld-organization"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'AIMadeThis',
              description: 'Community platform for AI product discovery and sharing',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://aimademethis.com',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://aimademethis.com'}/logo.png`,
              sameAs: [
                'https://twitter.com/aimademethis',
                'https://github.com/aimademethis',
              ]
            })
          }}
        />

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
