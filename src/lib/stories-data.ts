// Song stories data for MelodieMacher preview section and Echte Geschichten page

export interface SongStory {
  id: string;
  title: string;
  hookLine: string;
  storyContext: string;
  quote: string;
  quoteAuthor: string;
  quoteLocation: string;
  genre: string;
  mood: string;
  occasion: string;
  targetPersona: string;
  audioPreviewUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  category: 'wedding' | 'birthday' | 'corporate' | 'family' | 'friendship';
}

export const songStories: SongStory[] = [
  // WEDDING / ROMANTIC SONGS
  {
    id: 'sieben-jahre',
    title: 'Sieben Jahre',
    hookLine: 'Sie sagte "Ja" zu einem Kaffee, nicht zu einem Antrag. Sieben Jahre spaeter kam beides wahr.',
    storyContext: 'Anna und Thomas trafen sich zufaellig in einem kleinen Cafe in Koeln. Er fragte sie nur nach einem Kaffee - sie blieb fuer immer. Nach sieben Jahren gemeinsamer Abenteuer, drei Umzuegen und unzaehligen Sonntagmorgen-Fruehstuecken im Bett, spielte er diesen Song bei ihrer Hochzeit. Als die ersten Toene erklangen, wusste sie sofort: Das ist unsere Geschichte.',
    quote: 'Ich habe sieben Jahre lang auf diesen Moment gewartet, ohne zu wissen, dass ich wartete.',
    quoteAuthor: 'Anna',
    quoteLocation: 'Koeln',
    genre: 'Pop Ballade',
    mood: 'Emotional',
    occasion: 'Hochzeitssong',
    targetPersona: 'Wedding Perfectionist',
    audioPreviewUrl: '/samples/sieben-jahre.mp3',
    imageUrl: '/images/stories/wedding-cafe.jpg',
    featured: true,
    category: 'wedding',
  },
  {
    id: 'im-regen-von-muenchen',
    title: 'Im Regen von Muenchen',
    hookLine: 'Sie trafen sich auf der Flucht vor demselben Gewitter. Keiner wollte danach gehen.',
    storyContext: 'Markus und Lena rannten beide in denselben Hauseingang als ein Sommergewitter ueber Muenchen hereinbrach. Sie standen eine Stunde lang im Trockenen, redeten ueber alles und nichts, und tauschten Nummern aus bevor die Sonne wiederkam. Fuenf Jahre spaeter, bei ihrer Verlobungsfeier, spielte Markus diesen Song.',
    quote: 'Jedes Mal wenn es regnet, denke ich an diesen Hauseingang - und laechle.',
    quoteAuthor: 'Lena',
    quoteLocation: 'Muenchen',
    genre: 'Akustik Folk',
    mood: 'Warm & Sanft',
    occasion: 'Verlobung',
    targetPersona: 'Anniversary Couples',
    audioPreviewUrl: '/samples/regen-muenchen.mp3',
    imageUrl: '/images/stories/rain-munich.jpg',
    category: 'wedding',
  },
  {
    id: 'du-bist-mein-zuhause',
    title: 'Du bist mein Zuhause',
    hookLine: 'Drei Staedte. Zwei Karrieren. Ein Zuhause - wo immer der andere ist.',
    storyContext: 'Lisa und Marco lebten in fuenf Jahren in drei verschiedenen Staedten - Berlin, Hamburg, jetzt Koeln. Jobs kamen und gingen, Wohnungen wechselten, aber eines blieb konstant: die Gewissheit, dass Zuhause kein Ort ist, sondern eine Person. Zu ihrem 10. Jahrestag ueberraschte Marco Lisa mit diesem Song.',
    quote: 'Ich wusste nicht, dass er so gut zuhoeren kann. Jetzt weiss ich es.',
    quoteAuthor: 'Lisa',
    quoteLocation: 'Koeln',
    genre: 'Moderner Schlager',
    mood: 'Froehlich & Warm',
    occasion: 'Jahrestag',
    targetPersona: 'Long-term Couples',
    audioPreviewUrl: '/samples/zuhause.mp3',
    imageUrl: '/images/stories/home-couple.jpg',
    category: 'wedding',
  },

  // BIRTHDAY / MILESTONE SONGS
  {
    id: 'sechzig-jahre-sonnenschein',
    title: 'Sechzig Jahre Sonnenschein',
    hookLine: 'Eine Tochter die 60 Jahre Erinnerungen in 3 Minuten packen wollte.',
    storyContext: 'Claudia wusste nicht, was sie ihrer Mutter zum 60. Geburtstag schenken sollte. "Sie hat alles," dachte sie. Dann erinnerte sie sich an all die Sommer in Omas Garten, die Gutenachtgeschichten, die Anrufe wenn das Leben schwer war. Sie schrieb alles auf - und bekam diesen Song zurueck.',
    quote: 'Meine Tochter hat mir mein Leben in einem Lied geschenkt. Ich hatte keine Ahnung, dass sie so viel davon mitbekommen hat.',
    quoteAuthor: 'Helga',
    quoteLocation: 'Stuttgart',
    genre: 'Froehlicher Pop',
    mood: 'Nostalgisch & Dankbar',
    occasion: 'Geburtstagslied',
    targetPersona: 'Thoughtful Planner',
    audioPreviewUrl: '/samples/sonnenschein.mp3',
    imageUrl: '/images/stories/mother-daughter.jpg',
    featured: true,
    category: 'birthday',
  },
  {
    id: 'von-null-auf-dreissig',
    title: 'Von Null auf Dreissig',
    hookLine: 'Er benutzt immer noch dieselben schrecklichen Witze aus der Uni. Seine Freunde wuerden es nicht anders wollen.',
    storyContext: 'Als Timo dreissig wurde, wollten seine besten Freunde aus Studienzeiten etwas Besonderes. Zehn Jahre Freundschaft, unzaehlige schlechte Entscheidungen, und noch mehr gute Erinnerungen. Sie sammelten Insider-Witze, peinliche Geschichten und die Momente die nur sie verstehen.',
    quote: 'Ich wusste nicht ob ich lachen oder weinen soll. Also hab ich beides gemacht.',
    quoteAuthor: 'Timo',
    quoteLocation: 'Frankfurt',
    genre: 'Pop Rock',
    mood: 'Energiegeladen & Lustig',
    occasion: 'Geburtstagslied',
    targetPersona: 'Friend Groups',
    audioPreviewUrl: '/samples/null-dreissig.mp3',
    imageUrl: '/images/stories/friends-party.jpg',
    category: 'birthday',
  },
  {
    id: 'meine-kleine-schwester',
    title: 'Meine kleine Schwester',
    hookLine: 'Frueher hat sie seine T-Shirts geklaut. Heute klaut sie Herzen. Happy 30th, Sarah.',
    storyContext: 'Als seine kleine Schwester Sarah dreissig wurde, wollte Max mehr als eine Karte. Er erinnerte sich an die nervige kleine Schwester die ihm ueberallhin folgte - und sah die unglaubliche Frau die sie geworden ist. Aerztin, Mutter, immer noch die Person die ihn zum Lachen bringt.',
    quote: 'Mein grosser Bruder ist nicht der emotionale Typ. Aber dieser Song hat alles gesagt was er nie sagen konnte.',
    quoteAuthor: 'Sarah',
    quoteLocation: 'Duesseldorf',
    genre: 'Akustik Ballade',
    mood: 'Emotional & Liebevoll',
    occasion: 'Geburtstagslied',
    targetPersona: 'Siblings',
    audioPreviewUrl: '/samples/kleine-schwester.mp3',
    imageUrl: '/images/stories/siblings.jpg',
    category: 'birthday',
  },

  // CORPORATE / PROFESSIONAL SONGS
  {
    id: 'dreissig-jahre-bei-uns',
    title: 'Dreissig Jahre bei uns',
    hookLine: 'Als Klaus anfing, gab es keine Computer. Als er ging, brachte er den Robotern etwas bei.',
    storyContext: 'Nach dreissig Jahren bei derselben Firma ging Klaus Bergmann in den Ruhestand. Er hatte die Digitalisierung miterlebt, drei Geschaeftsfuehrer ueberlebt, und Generationen von Kollegen ausgebildet. Die HR-Abteilung wollte etwas Besonderes - kein Standard-Geschenk, keine langweilige Rede.',
    quote: 'In zehn Jahren Geschaeftsfuehrung habe ich noch nie so eine Reaktion bei einer Verabschiedung gesehen. Unbezahlbar.',
    quoteAuthor: 'Dr. Kerstin M.',
    quoteLocation: 'Geschaeftsfuehrerin',
    genre: 'Wuerdevoller Pop',
    mood: 'Respektvoll & Warm',
    occasion: 'Firmenjubilaeum',
    targetPersona: 'HR Decision-Maker',
    audioPreviewUrl: '/samples/song-7.mp3',
    imageUrl: '/images/stories/retirement.jpg',
    category: 'corporate',
  },
  {
    id: 'kaffeemaschinen-legende',
    title: 'Die Kaffeemaschinen-Legende',
    hookLine: 'Jeder weiss, wer das Buero wirklich am Laufen haelt. Und es ist nicht der CEO.',
    storyContext: 'Jedes Buero hat diese eine Person - die, ohne die nichts funktionieren wuerde. Bei der Agentur Kreativ Plus ist das Sabine, seit zwanzig Jahren die gute Seele des Unternehmens. Sie kennt jeden Geburtstag, jede Allergie, und macht den besten Kaffee der Stadt.',
    quote: 'Endlich hat mal jemand gesagt, was wir alle wissen: Ohne Sabine laeuft hier gar nichts.',
    quoteAuthor: 'Das gesamte Team',
    quoteLocation: 'Kreativ Plus',
    genre: 'Beschwingter Pop',
    mood: 'Lustig & Herzlich',
    occasion: 'Mitarbeiter-Anerkennung',
    targetPersona: 'Team Culture',
    audioPreviewUrl: '/samples/song-8.mp3',
    imageUrl: '/images/stories/office-hero.jpg',
    category: 'corporate',
  },

  // FAMILY / EMOTIONAL SONGS
  {
    id: 'fuer-meinen-vater',
    title: 'Fuer meinen Vater',
    hookLine: 'Er brachte mir Fahrradfahren bei. Ich wollte ihm beibringen, dass er mein Held ist.',
    storyContext: 'Als Sebastians Vater sechzig wurde, suchte er nach Worten fuer Dinge die er nie gesagt hatte. Die fruehen Morgen wenn Papa ihn zur Schule fuhr. Die Wochenenden in der Werkstatt. Die stillen Momente wo Worte ueberfluessig waren.',
    quote: 'Mein Vater hat danach kein Wort gesagt. Aber seine Umarmung hat mir alles erzaehlt.',
    quoteAuthor: 'Sebastian',
    quoteLocation: 'Nuernberg',
    genre: 'Klavierballade',
    mood: 'Tiefgruendig & Emotional',
    occasion: 'Vatertag / Geburtstag',
    targetPersona: 'Father Appreciation',
    audioPreviewUrl: '/samples/song-9.mp3',
    imageUrl: '/images/stories/father-son.jpg',
    featured: true,
    category: 'family',
  },
  {
    id: 'omas-kueche',
    title: 'Omas Kueche',
    hookLine: 'Das Rezeptbuch ist voll, aber nichts schmeckt wie ihre Liebe.',
    storyContext: 'Als Oma Else fuenfundachtzig wurde, wollten ihre Enkel ihr zeigen, was sie ihnen bedeutet. Nicht die Geschenke, nicht das Geld - sondern die Stunden in ihrer Kueche, der Geruch von Apfelkuchen, die Geschichten beim Plaetzchenbacken.',
    quote: 'Das ist das schoenste Geschenk, das mir je jemand gemacht hat. Und ich hab viele Geschenke bekommen.',
    quoteAuthor: 'Oma Else',
    quoteLocation: 'Familie Hoffmann',
    genre: 'Folk Pop',
    mood: 'Nostalgisch & Warm',
    occasion: 'Geburtstagslied',
    targetPersona: 'Grandparent Appreciation',
    audioPreviewUrl: '/samples/song-10.mp3',
    imageUrl: '/images/stories/grandma-kitchen.jpg',
    category: 'family',
  },

  // FRIENDSHIP / FUN SONGS
  {
    id: 'samstagabend-helden',
    title: 'Samstagabend Helden',
    hookLine: 'Zehn Jahre Freundschaft. Acht Festivals. Ein unvergesslicher Song.',
    storyContext: 'Fuenf Freunde die sich beim Studium kennenlernten, treffen sich seit zehn Jahren zu einem jaehrlichen Festival-Trip. Egal wo das Leben sie hinfuehrt - dieser eine Samstagabend im Jahr gehoert ihnen. Zum zehnjahrigen Jubilaeum ihrer Tradition schenkten sie sich gegenseitig diesen Song.',
    quote: 'Das ist unsere inoffizielle Hymne jetzt. Wir spielen ihn jedes Jahr. Und jedes Jahr wird er besser.',
    quoteAuthor: 'Die Samstagabend-Helden',
    quoteLocation: 'Deutschland',
    genre: 'Indie Rock',
    mood: 'Energiegeladen & Mitreissend',
    occasion: 'Freundschafts-Hymne',
    targetPersona: 'Friend Groups',
    audioPreviewUrl: '/samples/song-11.mp3',
    imageUrl: '/images/stories/festival-friends.jpg',
    category: 'friendship',
  },
  {
    id: 'bessere-haelfte',
    title: 'Bessere Haelfte',
    hookLine: 'Nicht romantische Partner, aber Partner in allem anderen was zaehlt.',
    storyContext: 'Maria und Julia sind seit der Schulzeit beste Freundinnen. Sie haben sich durch alles begleitet - erste Lieben, gebrochene Herzen, neue Jobs, Umzuege, Ehen, Kinder. Als Julia vierzig wurde, wollte Maria ihr sagen, was diese Freundschaft fuer sie bedeutet.',
    quote: 'Es gibt Menschen, ohne die waere ich nicht ich. Julia ist einer davon. Jetzt weiss sie es auch.',
    quoteAuthor: 'Maria',
    quoteLocation: 'Bremen',
    genre: 'Akustik Pop',
    mood: 'Herzlich & Warm',
    occasion: 'Beste-Freundin-Song',
    targetPersona: 'Best Friend Appreciation',
    audioPreviewUrl: '/samples/song-12.mp3',
    imageUrl: '/images/stories/best-friends.jpg',
    category: 'friendship',
  },
];

// Helper functions
export function getFeaturedStories(): SongStory[] {
  return songStories.filter((story) => story.featured);
}

export function getStoriesByCategory(category: SongStory['category']): SongStory[] {
  return songStories.filter((story) => story.category === category);
}

export function getStoryById(id: string): SongStory | undefined {
  return songStories.find((story) => story.id === id);
}

export const categoryLabels: Record<SongStory['category'], string> = {
  wedding: 'Hochzeit & Liebe',
  birthday: 'Geburtstag & Meilensteine',
  corporate: 'Firma & Beruf',
  family: 'Familie & Emotion',
  friendship: 'Freundschaft & Spass',
};

export const categoryDescriptions: Record<SongStory['category'], string> = {
  wedding: 'Lieder fuer den schoensten Tag eures Lebens - Hochzeiten, Verlobungen und Jahrestage.',
  birthday: 'Von runden Geburtstagen bis zu besonderen Meilensteinen - Lieder die feiern.',
  corporate: 'Professionelle Songs fuer Firmenevents, Jubilaeumsfeiern und Mitarbeiter-Anerkennung.',
  family: 'Emotionale Lieder die sagen, was Worte allein nicht koennen - fuer Eltern, Grosseltern und Familie.',
  friendship: 'Hymnen fuer die Menschen, die das Leben besser machen - beste Freunde und Weggefaehrten.',
};
