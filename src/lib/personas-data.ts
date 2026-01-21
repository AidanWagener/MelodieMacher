// Target personas for MelodieMacher
// These personas drive targeted content, messaging, and UX decisions

export interface Persona {
  id: string;
  name: string;
  nickname: string;
  demographics: {
    ageRange: string;
    gender?: string;
    occupation: string;
    location: string;
    income: string;
  };
  situation: string;
  emotionalState: string[];
  searchQueries: string[];
  painPoints: string[];
  whatTheyNeedToHear: string;
  priceSensitivity: 'low' | 'medium' | 'high';
  preferredPackage: 'basis' | 'plus' | 'premium';
  decisionTriggers: string[];
  storyResonance: string;
  urgency: 'low' | 'medium' | 'high';
  category: 'wedding' | 'birthday' | 'corporate' | 'family' | 'friendship';
}

export const personas: Persona[] = [
  {
    id: 'last-minute-lars',
    name: 'Lars',
    nickname: 'Last-Minute Lars',
    demographics: {
      ageRange: '28-40',
      gender: 'male',
      occupation: 'Project Manager',
      location: 'Duesseldorf',
      income: '55.000 EUR/Jahr',
    },
    situation: 'Remembered anniversary is TOMORROW at 10pm',
    emotionalState: ['Panic', 'Guilt', 'Desperate hope'],
    searchQueries: [
      'Besonderes Geschenk schnell',
      'einzigartiges Hochzeitstag Geschenk',
      'Last Minute Geschenk Partner',
    ],
    painPoints: [
      'No time to shop',
      'Everything feels generic',
      'Guilt about forgetting',
    ],
    whatTheyNeedToHear: 'In 24 Stunden bei dir - noch heute bestellen',
    priceSensitivity: 'low',
    preferredPackage: 'premium',
    decisionTriggers: ['Speed guarantee', 'Gaensehaut-Garantie', 'Rush delivery option'],
    storyResonance: 'Couples who almost forgot - redemption narrative',
    urgency: 'high',
    category: 'wedding',
  },
  {
    id: 'thoughtful-tanja',
    name: 'Tanja',
    nickname: 'Thoughtful Tanja',
    demographics: {
      ageRange: '40-55',
      gender: 'female',
      occupation: 'Kindergarten Teacher',
      location: 'Hamburg',
      income: '42.000 EUR/Jahr',
    },
    situation: "Planning mother's 70th birthday - 8 weeks away",
    emotionalState: ['Thoughtful', 'Wants to honor', 'Slightly anxious it is enough'],
    searchQueries: [
      'Personalisiertes Geschenk Mama 70. Geburtstag',
      'besonderes Geschenk Eltern',
      'einzigartiges Geschenk Mutter',
    ],
    painPoints: [
      'She already has everything',
      'Generic gifts feel impersonal',
      'Want to show deep appreciation',
    ],
    whatTheyNeedToHear: 'Das Geschenk, das sie nie vergessen wird',
    priceSensitivity: 'medium',
    preferredPackage: 'plus',
    decisionTriggers: ['Sample stories from mother-daughter moments', 'Emotional testimonials'],
    storyResonance: 'A daughter who wanted to say everything words could not',
    urgency: 'medium',
    category: 'birthday',
  },
  {
    id: 'corporate-karsten',
    name: 'Karsten',
    nickname: 'Corporate Karsten',
    demographics: {
      ageRange: '45-60',
      gender: 'male',
      occupation: 'HR Director',
      location: 'Munich',
      income: '95.000 EUR/Jahr',
    },
    situation: 'Long-time employee retiring after 30 years - needs something memorable',
    emotionalState: ['Professional obligation', 'Genuine appreciation', 'Time pressure'],
    searchQueries: [
      'Firmenjubilaeum Geschenk besonders',
      'Verabschiedung Ruhestand Song',
      'Mitarbeiter Anerkennung Geschenk',
    ],
    painPoints: [
      'Standard gifts are forgettable',
      'Needs to impress management',
      'Requires proper invoicing',
    ],
    whatTheyNeedToHear: 'Rechnung mit USt. - Professionelle Qualitaet - In 24h',
    priceSensitivity: 'low',
    preferredPackage: 'premium',
    decisionTriggers: ['Business tier availability', 'Company testimonials', 'Invoice option'],
    storyResonance: 'The company that made their retiring CFO cry tears of joy',
    urgency: 'medium',
    category: 'corporate',
  },
  {
    id: 'bride-britta',
    name: 'Britta',
    nickname: 'Bride-to-Be Britta',
    demographics: {
      ageRange: '25-35',
      gender: 'female',
      occupation: 'Marketing Manager',
      location: 'Berlin',
      income: '52.000 EUR/Jahr',
    },
    situation: 'Wedding in 4 months, wants a unique first dance song',
    emotionalState: ['Excited', 'Overwhelmed', 'Wants to create magic'],
    searchQueries: [
      'Personalisierter Hochzeitssong',
      'Eigener Song Hochzeit',
      'Erster Tanz Lied personalisiert',
    ],
    painPoints: [
      'Every wedding feels the same',
      'Want something truly unique',
      'Budget is already stretched',
    ],
    whatTheyNeedToHear: 'Euer Lied. Eure Geschichte. Euer Moment.',
    priceSensitivity: 'low',
    preferredPackage: 'premium',
    decisionTriggers: ['Wedding song samples', 'Video reactions', 'Revision guarantee'],
    storyResonance: 'Wedding couple testimonial with the moment they pressed play',
    urgency: 'medium',
    category: 'wedding',
  },
  {
    id: 'guilty-gabi',
    name: 'Gabi',
    nickname: 'Guilty Gift Gabi',
    demographics: {
      ageRange: '35-45',
      gender: 'female',
      occupation: 'Nurse',
      location: 'Cologne',
      income: '48.000 EUR/Jahr',
    },
    situation: "Missed best friend's 40th last month, wants to make up for it",
    emotionalState: ['Guilt', 'Desire to show she cares', 'Its never too late'],
    searchQueries: [
      'Nachtraegliches Geburtstagsgeschenk besonders',
      'Entschuldigung Geschenk Freundin',
      'Besonderes Geschenk beste Freundin',
    ],
    painPoints: [
      'Guilt about missing the day',
      'Normal gifts seem insufficient',
      'Wants to make up for it',
    ],
    whatTheyNeedToHear: 'Besser spaet als nie - und besser als alles andere',
    priceSensitivity: 'medium',
    preferredPackage: 'plus',
    decisionTriggers: ['Story of someone who made up for lost time', 'Emotional impact'],
    storyResonance: 'Late gift that became the BEST gift',
    urgency: 'medium',
    category: 'friendship',
  },
];

// Helper functions
export function getPersonaById(id: string): Persona | undefined {
  return personas.find((p) => p.id === id);
}

export function getPersonasByCategory(category: Persona['category']): Persona[] {
  return personas.filter((p) => p.category === category);
}

export function getPersonasByUrgency(urgency: Persona['urgency']): Persona[] {
  return personas.filter((p) => p.urgency === urgency);
}

// Content suggestions based on persona
export function getPersonaMessaging(persona: Persona) {
  return {
    headline: persona.whatTheyNeedToHear,
    subheadline: persona.storyResonance,
    cta: persona.urgency === 'high' ? 'Jetzt schnell bestellen' : 'Song erstellen',
    badges: persona.decisionTriggers.slice(0, 2),
  };
}

// Map URL params to personas for targeted landing pages
export const occasionToPersonaMap: Record<string, string[]> = {
  hochzeit: ['last-minute-lars', 'bride-britta'],
  geburtstag: ['thoughtful-tanja'],
  firma: ['corporate-karsten'],
  freunde: ['guilty-gabi'],
};
