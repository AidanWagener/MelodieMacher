'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MessageSquareText, Sparkles, Heart } from 'lucide-react';
import {
  LPHero,
  LPSocialProof,
  LPHowItWorks,
  LPAudioSample,
  LPTestimonials,
  LPFAQ,
  LPCTA,
  getWeddingTestimonials,
  getWeddingSamples,
  weddingFAQs,
} from '@/components/lp';

export function WeddingLPContent() {
  const searchParams = useSearchParams();
  const [ctaLink, setCtaLink] = useState('/bestellen?paket=plus&anlass=hochzeit');

  // Preserve UTM parameters
  useEffect(() => {
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    const preservedParams = new URLSearchParams();

    utmParams.forEach((param) => {
      const value = searchParams.get(param);
      if (value) {
        preservedParams.set(param, value);
      }
    });

    // Build CTA link with preserved UTMs
    const baseParams = new URLSearchParams({
      paket: 'plus',
      anlass: 'hochzeit',
    });

    // Merge UTM params
    preservedParams.forEach((value, key) => {
      baseParams.set(key, value);
    });

    setCtaLink(`/bestellen?${baseParams.toString()}`);
  }, [searchParams]);

  const weddingTestimonials = getWeddingTestimonials();
  const weddingSamples = getWeddingSamples();

  return (
    <>
      {/* Hero Section */}
      <LPHero
        headline="Der perfekte Hochzeitssong -"
        highlightedText="in 24 Stunden"
        subheadline="Euer personalisierter Song fuer den schoensten Tag eures Lebens. Von eurer Liebesgeschichte zu eurem unvergesslichen Moment. Gaensehaut garantiert."
        urgencyText="Hochzeitstermin naht?"
        ctaText="Jetzt Hochzeitssong erstellen"
        ctaLink={ctaLink}
        trustBadgeText="Ueber 500 Hochzeitspaare"
        priceText="Ab 79 Euro"
        audioPreview={{
          title: '"Fuer immer Dein"',
          subtitle: 'Hochzeitssong von Lisa & Max',
          quote: 'Der schoenste Moment unserer Hochzeit war, als unser Song lief. Alle haben geweint!',
          tags: ['Pop', 'Romantisch', 'Hochzeit'],
        }}
      />

      {/* Social Proof Strip */}
      <LPSocialProof />

      {/* How It Works - Wedding focused */}
      <LPHowItWorks
        title="So einfach geht's"
        subtitle="In 3 Schritten zu eurem Hochzeitssong"
        steps={[
          {
            icon: MessageSquareText,
            number: '01',
            title: 'Erzaehlt uns eure Geschichte',
            description:
              'Wie habt ihr euch kennengelernt? Was macht eure Liebe besonders? Welche Momente sollen verewigt werden?',
          },
          {
            icon: Sparkles,
            number: '02',
            title: 'Wir komponieren euren Song',
            description:
              'Unser Team verwandelt eure Liebesgeschichte in einen einzigartigen Song - romantisch, emotional, unvergesslich.',
          },
          {
            icon: Heart,
            number: '03',
            title: 'Gaensehaut-Moment',
            description:
              'In 24h erhaltet ihr euren Song. Beim Eroeffnungstanz, bei der Trauung - oder als Ueberraschung fuer den Partner.',
          },
        ]}
      />

      {/* Audio Samples */}
      <LPAudioSample
        samples={weddingSamples}
        title="Hoer selbst"
        subtitle="So koennten eure Hochzeitssongs klingen"
        badgeText="Hochzeitsbeispiele"
        maxDisplay={2}
      />

      {/* Testimonials - Wedding Only */}
      <LPTestimonials
        testimonials={weddingTestimonials}
        title="Das sagen Hochzeitspaare"
        subtitle="Echte Liebesgeschichten, echte Emotionen"
        badgeText="Hochzeits-Kundenstimmen"
        maxDisplay={3}
      />

      {/* FAQ - Wedding Specific */}
      <LPFAQ
        faqs={weddingFAQs}
        title="Haeufige Fragen zum Hochzeitssong"
        subtitle="Alles, was ihr wissen muesst"
      />

      {/* Final CTA */}
      <LPCTA
        headline="Euer perfekter Hochzeitssong wartet"
        subheadline="Schenkt euch einen Song, der euch ein Leben lang begleitet. In nur 24 Stunden bei euch."
        ctaText="Jetzt Hochzeitssong erstellen"
        ctaLink={ctaLink}
        urgencyText="Hochzeitstermin naht? Wir liefern in 24h!"
      />
    </>
  );
}
