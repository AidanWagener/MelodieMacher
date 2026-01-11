import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BirthdayLPContent } from './BirthdayLPContent';

export const metadata: Metadata = {
  title: 'Geburtstagslied - Personalisierter Song in 24h | MelodieMacher',
  description:
    'Ein Geburtstagslied so einzigartig wie der Beschenkte. Das persoenlichste Geschenk zum Geburtstag - in nur 24 Stunden. Gaensehaut garantiert.',
  keywords: [
    'Geburtstagslied',
    'personalisiertes Geburtstagslied',
    'Geburtstagsgeschenk',
    'individueller Song',
    'Geschenk zum Geburtstag',
    'persoenliches Geschenk',
    'einzigartiges Geschenk',
  ],
  openGraph: {
    title: 'Ein Geburtstagslied so einzigartig wie [Name] | MelodieMacher',
    description:
      'Das persoenlichste Geburtstagsgeschenk ever. Ein Song ueber das Geburtstagskind - in nur 24h.',
    type: 'website',
    locale: 'de_DE',
    images: [
      {
        url: '/images/occasions/occasion-birthday.png',
        width: 1200,
        height: 630,
        alt: 'MelodieMacher Geburtstagslied',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Das persoenlichste Geburtstagsgeschenk',
    description: 'Ein einzigartiges Geburtstagslied - in nur 24 Stunden bei dir.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GeburtstagLandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <BirthdayLPContent />
    </Suspense>
  );
}
