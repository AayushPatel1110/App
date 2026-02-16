import "../styles/globals.css"
import GlobalFooter from "@/components/ui/GlobalFooter"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://seaneb.com"

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "SeaNeB - Find Your Perfect Property | Real Estate Platform",
  description: "Discover verified apartments, houses, and commercial properties in your area. List, buy, sell, and rent properties with India's trusted real estate marketplace. Connect with qualified sellers instantly.",
  keywords: "real estate, property listing, buy property, sell property, rent property, apartments, houses, commercial properties, India real estate",
  manifest: "/manifest.json",
  icons: {
    icon: "/logos/Fav.svg",
    apple: "/logos/Fav.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://seaneb.com",
    title: "SeaNeB - Find Your Perfect Property",
    description: "Discover verified apartments, houses, and commercial properties in your area.",
    siteName: "SeaNeB",
    images: [
      {
        url: "/logos/light-logo.svg",
        width: 1200,
        height: 630,
        alt: "SeaNeB - Real Estate Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SeaNeB - Find Your Perfect Property",
    description: "Discover verified apartments, houses, and commercial properties in your area.",
    creator: "@seaneb",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://seaneb.com",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#d73f57",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SeaNeB" />
        <meta name="msapplication-TileColor" content="#d73f57" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Manifest Link */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Icons */}
        <link rel="icon" href="/logos/Fav.svg" />
        <link rel="apple-touch-icon" href="/logos/Fav.svg" />
        <link rel="mask-icon" href="/logos/light-logo.svg" color="#d73f57" />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    .then((reg) => console.log('Service Worker registered'))
                    .catch((err) => console.log('Service Worker registration failed:', err));
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#f8f9fb]">
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>
          <GlobalFooter />
        </div>
      </body>
    </html>
  )
}
