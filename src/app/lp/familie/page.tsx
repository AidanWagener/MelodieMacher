import type { Metadata } from 'next';
import { Suspense } from 'react';
import { FamilyLPContent } from './FamilyLPContent';

export const metadata: Metadata = {
  title: 'Familiensong - Ein Lied fuer die Menschen, die alles bedeuten | MelodieMacher',
  description:
    'Ein personalisierter Song fuer die ganze Familie. Zur Taufe, Konfirmation, Familienfeier oder einfach als Liebeserklaerung. In 24 Stunden bei dir.',
  keywords: [
    'Familienlied',
    'personalisierter Song Familie',
    'Tauflied',
    'Geschenk Eltern',
    'Geschenk Grosseltern',
    'Familiensong',
    'Song zur Taufe',
    'Kinderlied personalisiert',
  ],
  openGraph: {
    title: 'Ein Song fuer die Menschen, die alles bedeuten | MelodieMacher',
    description:
      'Ein personalisiertes Familienlied - zur Taufe, fuer Eltern, Grosseltern oder die ganze Familie. In 24h bei dir.',
    type: 'website',
    locale: 'de_DE',
    images: [
      {
        url: '/images/occasions/occasion-family.png',
        width: 1200,
        height: 630,
        alt: 'MelodieMacher Familiensong',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ein Song fuer die ganze Familie',
    description: 'Personalisierte Familienlieder - zur Taufe, fuer Eltern oder Grosseltern.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FamilieLandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <FamilyLPContent />
    </Suspense>
  );
}
