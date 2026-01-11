import type { Metadata } from 'next';
import { Suspense } from 'react';
import { WeddingLPContent } from './WeddingLPContent';

export const metadata: Metadata = {
  title: 'Hochzeitssong - Dein personalisierter Song in 24h | MelodieMacher',
  description:
    'Der perfekte Hochzeitssong - individuell fuer euch komponiert. Einzigartig, emotional, in nur 24 Stunden. Gaensehaut-Garantie inklusive.',
  keywords: [
    'Hochzeitssong',
    'personalisierter Song Hochzeit',
    'Hochzeitslied',
    'Hochzeitsmusik',
    'individueller Song',
    'Hochzeitsgeschenk',
    'Eroeffnungstanz Musik',
  ],
  openGraph: {
    title: 'Der perfekte Hochzeitssong - in 24 Stunden | MelodieMacher',
    description:
      'Schenkt euch einen Song, der euch ein Leben lang begleitet. Personalisiert, emotional, einzigartig - in nur 24h.',
    type: 'website',
    locale: 'de_DE',
    images: [
      {
        url: '/images/occasions/occasion-wedding.png',
        width: 1200,
        height: 630,
        alt: 'MelodieMacher Hochzeitssong',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Der perfekte Hochzeitssong - in 24 Stunden',
    description: 'Euer personalisierter Hochzeitssong. Einzigartig, emotional, unvergesslich.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HochzeitLandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <WeddingLPContent />
    </Suspense>
  );
}
