'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MessageSquareText, Sparkles, Gift, Heart, Clock, Star } from 'lucide-react';
import {
  LPHero,
  LPSocialProof,
  LPHowItWorks,
  LPAudioSample,
  LPTestimonials,
  LPFAQ,
  LPCTA,
  getBirthdayTestimonials,
  getBirthdaySamples,
  birthdayFAQs,
} from '@/components/lp';

export function BirthdayLPContent() {
  const searchParams = useSearchParams();
  const [ctaLink, setCtaLink] = useState('/bestellen?paket=plus&anlass=geburtstag');

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
      anlass: 'geburtstag',
    });

    // Merge UTM params
    preservedParams.forEach((value, key) => {
      baseParams.set(key, value);
    });

    setCtaLink(`/bestellen?${baseParams.toString()}`);
  }, [searchParams]);

  const birthdayTestimonials = getBirthdayTestimonials();
  const birthdaySamples = getBirthdaySamples();

  return (
    <>
      {/* Hero Section */}
      <LPHero
        headline="Ein Geburtstagslied so einzigartig wie"
        highlightedText="[Name]"
        subheadline="Das persoenlichste Geschenk, das du machen kannst. Ein Song ueber den Menschen, der alles bedeutet - mit Erinnerungen, Insider-Witzen und purem Gefuehl."
        urgencyText="Noch 24 Stunden bis zum Geburtstag?"
        ctaText="Jetzt Geburtstagslied erstellen"
        ctaLink={ctaLink}
        trustBadgeText="Ueber 800 verschenkte Songs"
        priceText="Ab 79 Euro"
        audioPreview={{
          title: '"Alles Gute fuer Dich"',
          subtitle: 'Geburtstagslied fuer Mama',
          quote: 'Meine Mama hat gedacht, ich hab den Song selbst gesungen. Das schoenste Kompliment!',
          tags: ['Schlager', 'Froehlich', 'Geburtstag'],
        }}
      />

      {/* Social Proof Strip - Gift Focus */}
      <LPSocialProof
        stats={[
          {
            icon: Gift,
            value: '800+',
            label: 'Verschenkte Songs',
          },
          {
            icon: Heart,
            value: '99%',
            label: 'Traenen der Freude',
          },
          {
            icon: Clock,
            value: '24h',
            label: 'Last-Minute Lieferung',
          },
          {
            icon: Star,
            value: '5/5',
            label: 'Sterne-Bewertung',
          },
        ]}
      />

      {/* How It Works - Birthday/Gift focused */}
      <LPHowItWorks
        title="So einfach geht's"
        subtitle="In 3 Schritten zum unvergesslichen Geschenk"
        steps={[
          {
            icon: MessageSquareText,
            number: '01',
            title: 'Erzaehl uns vom Geburtstagskind',
            description:
              'Was macht die Person besonders? Welche Erinnerungen verbinden euch? Welche Insider habt ihr?',
          },
          {
            icon: Sparkles,
            number: '02',
            title: 'Wir komponieren das Lied',
            description:
              'Unser Team verwandelt deine Geschichte in einen einzigartigen Song - froehlich, emotional, oder was zum Lachen.',
          },
          {
            icon: Gift,
            number: '03',
            title: 'Geschenk-Moment',
            description:
              'In 24h erhaeltst du den Song. Als Ueberraschung zum Auspacken oder live auf der Party - Gaensehaut garantiert!',
          },
        ]}
      />

      {/* Audio Samples */}
      <LPAudioSample
        samples={birthdaySamples}
        title="Hoer selbst"
        subtitle="So koennten Geburtstagslieder klingen"
        badgeText="Geburtstags-Beispiele"
        maxDisplay={2}
      />

      {/* Testimonials - Birthday Only */}
      <LPTestimonials
        testimonials={birthdayTestimonials}
        title="Das sagen unsere Schenker"
        subtitle="Echte Geschichten von echten Geburtstagsueberraschungen"
        badgeText="Kundenstimmen"
        maxDisplay={3}
      />

      {/* FAQ - Birthday Specific */}
      <LPFAQ
        faqs={birthdayFAQs}
        title="Haeufige Fragen zum Geburtstagslied"
        subtitle="Schnelle Antworten fuer Last-Minute-Schenker"
      />

      {/* Final CTA */}
      <LPCTA
        headline="Das Geschenk, das niemand vergisst"
        subheadline="Ein Song ueber den Menschen, der dir wichtig ist. Persoenlicher geht nicht. In nur 24 Stunden bei dir."
        ctaText="Jetzt Geburtstagslied erstellen"
        ctaLink={ctaLink}
        urgencyText="Last-Minute? Wir liefern in 24h!"
      />
    </>
  );
}
