'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MessageSquareText, Sparkles, Heart, Users, Baby, Star } from 'lucide-react';
import {
  LPHero,
  LPSocialProof,
  LPHowItWorks,
  LPAudioSample,
  LPTestimonials,
  LPFAQ,
  LPCTA,
  getFamilyTestimonials,
  getFamilySamples,
  familyFAQs,
} from '@/components/lp';

export function FamilyLPContent() {
  const searchParams = useSearchParams();
  const [ctaLink, setCtaLink] = useState('/bestellen?paket=plus&anlass=taufe');

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
      anlass: 'taufe',
    });

    // Merge UTM params
    preservedParams.forEach((value, key) => {
      baseParams.set(key, value);
    });

    setCtaLink(`/bestellen?${baseParams.toString()}`);
  }, [searchParams]);

  const familyTestimonials = getFamilyTestimonials();
  const familySamples = getFamilySamples();

  return (
    <>
      {/* Hero Section */}
      <LPHero
        headline="Ein Song fuer die Menschen, die"
        highlightedText="alles bedeuten"
        subheadline="Fuer Eltern, Grosseltern, zur Taufe oder einfach als Liebeserklaerung an die Familie. Ein Lied, das Generationen verbindet und fuer immer bleibt."
        urgencyText="Familienfeier geplant?"
        ctaText="Jetzt Familiensong erstellen"
        ctaLink={ctaLink}
        trustBadgeText="Ueber 300 Familiensongs"
        priceText="Ab 79 Euro"
        audioPreview={{
          title: '"Familienband"',
          subtitle: 'Fuer Oma & Opa zur Goldenen',
          quote: 'Die ganze Familie hat geweint - ein Geschenk fuer Generationen!',
          tags: ['Akustik', 'Emotional', 'Familie'],
        }}
      />

      {/* Social Proof Strip - Family Focus */}
      <LPSocialProof
        stats={[
          {
            icon: Users,
            value: '300+',
            label: 'Familien beruehrt',
          },
          {
            icon: Heart,
            value: '3',
            label: 'Generationen vereint',
          },
          {
            icon: Baby,
            value: '100+',
            label: 'Tauflieder erstellt',
          },
          {
            icon: Star,
            value: '5/5',
            label: 'Sterne-Bewertung',
          },
        ]}
      />

      {/* How It Works - Family focused */}
      <LPHowItWorks
        title="So einfach geht's"
        subtitle="In 3 Schritten zum unvergesslichen Familienlied"
        steps={[
          {
            icon: MessageSquareText,
            number: '01',
            title: 'Erzaehl uns eure Familiengeschichte',
            description:
              'Was macht eure Familie besonders? Welche Erinnerungen verbinden euch? Wer soll im Song vorkommen?',
          },
          {
            icon: Sparkles,
            number: '02',
            title: 'Wir komponieren euer Lied',
            description:
              'Von der Taufe bis zur Goldenen Hochzeit - wir schaffen ein Lied, das alle Herzen beruehrt.',
          },
          {
            icon: Heart,
            number: '03',
            title: 'Gemeinsamer Gaensehaut-Moment',
            description:
              'In 24h ist euer Familienlied da. Ob Familienfeier oder stilles Danke - ein Geschenk fuer die Ewigkeit.',
          },
        ]}
      />

      {/* Audio Samples */}
      <LPAudioSample
        samples={familySamples}
        title="Hoer selbst"
        subtitle="So koennten Familienlieder klingen"
        badgeText="Familien-Beispiele"
        maxDisplay={2}
      />

      {/* Testimonials - Family Only */}
      <LPTestimonials
        testimonials={familyTestimonials}
        title="Das sagen Familien"
        subtitle="Echte Familienmomente, echte Emotionen"
        badgeText="Familien-Kundenstimmen"
        maxDisplay={3}
      />

      {/* FAQ - Family Specific */}
      <LPFAQ
        faqs={familyFAQs}
        title="Haeufige Fragen zum Familienlied"
        subtitle="Alles, was du wissen musst"
      />

      {/* Final CTA */}
      <LPCTA
        headline="Ein Lied fuer die Ewigkeit"
        subheadline="Schenke deiner Familie einen Song, der Generationen verbindet. Persoenlicher und emotionaler geht es nicht."
        ctaText="Jetzt Familiensong erstellen"
        ctaLink={ctaLink}
        urgencyText="Familienfeier geplant? Wir liefern in 24h!"
      />
    </>
  );
}
