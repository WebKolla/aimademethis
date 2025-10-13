import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { createClient } from "@/lib/supabase/server";

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
    default: "AIMMT - AI Made Me This | Discover AI Products Built by the Community",
    template: "%s | AIMMT"
  },
  description: "Explore, share, and discover AI products created by innovators worldwide. A community-driven platform for AI tools, applications, and innovations.",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
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
  authors: [{ name: "AIMMT" }],
  creator: "AIMMT",
  publisher: "AIMMT",
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
    title: 'AIMMT - AI Made Me This | Discover AI Products Built by the Community',
    description: 'Explore, share, and discover AI products created by innovators worldwide.',
    siteName: 'AIMMT',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AIMMT - AI Product Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIMMT - AI Made Me This | Discover AI Products Built by the Community',
    description: 'Explore, share, and discover AI products created by innovators worldwide.',
    creator: '@aimademethis',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://aimademethis.com',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://aimademethis.com'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-icon',
  },
  manifest: '/manifest.json',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch footer data for SEO internal linking
  const supabase = await createClient();

  const [categoriesResult, productsResult] = await Promise.all([
    supabase
      .from("categories")
      .select("slug, name")
      .order("name", { ascending: true })
      .limit(5),
    supabase
      .from("products")
      .select("slug, name")
      .eq("status", "published")
      .order("trending_score", { ascending: false })
      .limit(3),
  ]);

  const footerCategories = categoriesResult.data || [];
  const footerProducts = productsResult.data || [];

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.documentElement.classList.add('dark');
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable} antialiased`} suppressHydrationWarning>
        <Providers>
          <ConditionalLayout
            footerCategories={footerCategories}
            footerProducts={footerProducts}
          >
            {children}
          </ConditionalLayout>
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
              name: 'AIMMT (AI Made Me This)',
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
              name: 'AIMMT (AI Made Me This)',
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
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
