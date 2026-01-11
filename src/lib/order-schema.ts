import { z } from 'zod';

export const occasionOptions = [
  { value: 'hochzeit', label: 'Hochzeit' },
  { value: 'geburtstag', label: 'Geburtstag' },
  { value: 'jubilaeum', label: 'Jubilaeum' },
  { value: 'firma', label: 'Firmenfeier' },
  { value: 'taufe', label: 'Taufe' },
  { value: 'andere', label: 'Anderer Anlass' },
] as const;

export const genreOptions = [
  { value: 'pop', label: 'Pop', description: 'Modern, eingaengig, radiofreundlich' },
  { value: 'rock', label: 'Rock', description: 'Kraftvoll, energiegeladen' },
  { value: 'schlager', label: 'Schlager', description: 'Deutsch, froehlich, traditionell' },
  { value: 'akustik', label: 'Akustik/Folk', description: 'Intim, warm, Gitarre' },
  { value: 'hiphop', label: 'Hip-Hop', description: 'Rhythmisch, modern, urban' },
  { value: 'klassik', label: 'Klassisch', description: 'Elegant, orchestral, zeitlos' },
  { value: 'kinder', label: 'Kinderlied', description: 'Verspielt, einfach, liebevoll' },
  { value: 'electronic', label: 'Electronic', description: 'Beats, Synthesizer, tanzbar' },
  { value: 'jazz', label: 'Jazz', description: 'Improvisiert, swingt, stilvoll' },
  { value: 'volksmusik', label: 'Volksmusik', description: 'Traditionell, heimatlich, gemuetlich' },
] as const;

// Pricing constants
export const CUSTOM_LYRICS_PRICE = 89;

export const packageOptions = [
  {
    value: 'basis',
    label: 'Melodie Basis',
    price: 49,
    delivery: '48 Stunden',
    features: ['1 Song', 'MP3 Download', '1 Revision'],
    popular: false,
  },
  {
    value: 'plus',
    label: 'Melodie Plus',
    price: 79,
    delivery: '24 Stunden',
    features: ['1 Song', 'MP3 + Lyrics PDF', '2 Revisionen', 'Album-Cover'],
    popular: true,
  },
  {
    value: 'premium',
    label: 'Melodie Premium',
    price: 129,
    delivery: 'Same-Day',
    features: ['1 Song', 'MP3 + MP4 Video', '3 Revisionen', 'Instrumental-Version'],
    popular: false,
  },
] as const;

export const bumpOptions = [
  {
    id: 'karaoke',
    label: 'Karaoke-Version',
    price: 19,
    description: 'Instrumental mit Lyrics zum Mitsingen',
  },
  {
    id: 'rush',
    label: 'Rush-Upgrade',
    price: 29,
    description: 'Noch schnellere Bearbeitung - ganz vorne in der Warteschlange',
  },
  {
    id: 'gift',
    label: 'Geschenk-Paket',
    price: 15,
    description: 'Digitale Geschenkkarte + Ueberraschungs-Reveal-Seite',
  },
] as const;

// Bundle options for maximum AOV
export const bundleOptions = [
  {
    id: 'hochzeits-bundle',
    label: 'Hochzeits-Bundle',
    description: 'Melodie Plus + Geschenk-Paket + Karaoke-Version',
    includes: ['plus', 'gift', 'karaoke'] as const,
    price: 99,
    originalPrice: 113, // 79 + 15 + 19
    savings: 14,
  },
  {
    id: 'perfekt-bundle',
    label: 'Perfekt-Bundle',
    description: 'Alle 3 Extras zum Sparpreis',
    includes: ['karaoke', 'rush', 'gift'] as const,
    price: 49,
    originalPrice: 63, // 19 + 29 + 15
    savings: 14,
  },
] as const;

// Step 1: Story Schema
export const storySchema = z.object({
  recipientName: z
    .string()
    .min(1, 'Bitte gib einen Namen ein')
    .max(100, 'Name ist zu lang'),
  occasion: z.enum(['hochzeit', 'geburtstag', 'jubilaeum', 'firma', 'taufe', 'andere'], {
    errorMap: () => ({ message: 'Bitte waehle einen Anlass' }),
  }),
  relationship: z
    .string()
    .min(1, 'Bitte beschreibe eure Beziehung')
    .max(100, 'Bitte kuerzer fassen'),
  story: z
    .string()
    .min(50, 'Bitte erzaehl uns mehr (mindestens 50 Zeichen)')
    .max(2000, 'Bitte kuerzer fassen (maximal 2000 Zeichen)'),
});

// Step 2: Song Schema
export const songSchema = z.object({
  genre: z.enum(['pop', 'rock', 'schlager', 'akustik', 'hiphop', 'klassik', 'kinder', 'electronic', 'jazz', 'volksmusik'], {
    errorMap: () => ({ message: 'Bitte waehle ein Genre' }),
  }),
  mood: z.number().min(1).max(5).default(3),
  packageType: z.enum(['basis', 'plus', 'premium'], {
    errorMap: () => ({ message: 'Bitte waehle ein Paket' }),
  }),
  allowEnglish: z.boolean().default(false),
  customLyrics: z.string().max(500, 'Maximal 500 Zeichen erlaubt').optional(),
  hasCustomLyrics: z.boolean().default(false),
  bumpKaraoke: z.boolean().default(false),
  bumpRush: z.boolean().default(false),
  bumpGift: z.boolean().default(false),
  selectedBundle: z.enum(['hochzeits-bundle', 'perfekt-bundle', 'none']).default('none'),
});

// Step 3: Contact Schema
export const contactSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Bitte gib deinen Namen ein')
    .max(100, 'Name ist zu lang'),
  customerEmail: z
    .string()
    .email('Bitte gib eine gueltige E-Mail-Adresse ein'),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, 'Bitte akzeptiere die AGB'),
  acceptPrivacy: z
    .boolean()
    .refine((val) => val === true, 'Bitte akzeptiere die Datenschutzerklaerung'),
  waiveWithdrawal: z
    .boolean()
    .refine((val) => val === true, 'Bitte bestaetigen Sie den Widerrufsverzicht'),
});

// Complete Order Schema
export const orderSchema = storySchema.merge(songSchema).merge(contactSchema);

export type StoryFormData = z.infer<typeof storySchema>;
export type SongFormData = z.infer<typeof songSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;

// Calculate total price
export function calculateTotal(data: Partial<OrderFormData>): number {
  let total = 0;

  // Check if Hochzeits-Bundle is selected (includes Plus package)
  if (data.selectedBundle === 'hochzeits-bundle') {
    total += 99; // Bundle price includes Plus + Gift + Karaoke
    // Add rush if selected separately
    if (data.bumpRush) total += 29;
  } else {
    // Base package price
    const pkg = packageOptions.find((p) => p.value === data.packageType);
    if (pkg) {
      total += pkg.price;
    }

    // Check if Perfekt-Bundle is selected (all 3 bumps)
    if (data.selectedBundle === 'perfekt-bundle') {
      total += 49; // Bundle price for all bumps
    } else {
      // Add individual bumps
      if (data.bumpKaraoke) total += 19;
      if (data.bumpRush) total += 29;
      if (data.bumpGift) total += 15;
    }
  }

  // Add custom lyrics premium
  if (data.hasCustomLyrics && data.customLyrics && data.customLyrics.trim().length > 0) {
    total += CUSTOM_LYRICS_PRICE;
  }

  return total;
}

// Get breakdown of order items for display
export function getOrderBreakdown(data: Partial<OrderFormData>): Array<{ label: string; price: number }> {
  const items: Array<{ label: string; price: number }> = [];

  if (data.selectedBundle === 'hochzeits-bundle') {
    items.push({ label: 'Hochzeits-Bundle (Plus + Geschenk + Karaoke)', price: 99 });
    if (data.bumpRush) items.push({ label: '+ Rush-Upgrade', price: 29 });
  } else {
    const pkg = packageOptions.find((p) => p.value === data.packageType);
    if (pkg) {
      items.push({ label: pkg.label, price: pkg.price });
    }

    if (data.selectedBundle === 'perfekt-bundle') {
      items.push({ label: 'Perfekt-Bundle (Karaoke + Rush + Geschenk)', price: 49 });
    } else {
      if (data.bumpKaraoke) items.push({ label: '+ Karaoke-Version', price: 19 });
      if (data.bumpRush) items.push({ label: '+ Rush-Upgrade', price: 29 });
      if (data.bumpGift) items.push({ label: '+ Geschenk-Paket', price: 15 });
    }
  }

  if (data.hasCustomLyrics && data.customLyrics && data.customLyrics.trim().length > 0) {
    items.push({ label: '+ Eigene Lyrics', price: CUSTOM_LYRICS_PRICE });
  }

  return items;
}
