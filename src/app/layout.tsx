import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { AnalyticsProvider } from '@/components/analytics';
import { StickyCTA } from '@/components/shared/StickyCTA';
import { ExitIntentPopup } from '@/components/shared/ExitIntentPopup';
import { RealtimeNotifications } from '@/components/shared/RealtimeNotifications';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://melodiemacher.de'),
  title: 'MelodieMacher - Personalisierte Songs als Geschenk | Ab 49 Euro',
  description:
    'Schenke einen einzigartigen Song fuer Hochzeit, Geburtstag oder jeden besonderen Moment. In 24 Stunden geliefert. 100% Zufriedenheitsgarantie.',
  keywords: [
    'personalisiertes lied',
    'eigener song',
    'hochzeitslied',
    'geburtstagslied',
    'geschenk',
    'personalisierter song',
    'lied schenken',
  ],
  authors: [{ name: 'MelodieMacher' }],
  creator: 'MelodieMacher',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://melodiemacher.de',
    siteName: 'MelodieMacher',
    title: 'MelodieMacher - Dein personalisierter Song',
    description:
      'Einzigartige Songs als Geschenk. Ab 49 Euro, in 24h geliefert.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MelodieMacher - Personalisierte Songs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MelodieMacher - Personalisierte Songs als Geschenk',
    description:
      'Schenke einen einzigartigen Song. In 24 Stunden geliefert.',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1E3A5F" />
      </head>
      <body className="min-h-screen flex flex-col">
        <AnalyticsProvider>
          {children}

          {/* Conversion Optimization Components */}
          <StickyCTA />
          <ExitIntentPopup />
          <RealtimeNotifications />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
