'use client';

import { motion } from 'framer-motion';
import { AudioPlayer } from '@/components/shared/AudioPlayer';

export interface AudioSample {
  id: number;
  src: string;
  title: string;
  genre: string;
  mood: string;
  occasion: string;
}

// All available samples - mapped to SONG_CATALOG.md
export const allAudioSamples: AudioSample[] = [
  {
    id: 1,
    src: '/samples/sieben-jahre.mp3',
    title: 'Sieben Jahre',
    genre: 'Pop Ballade',
    mood: 'Emotional',
    occasion: 'hochzeit',
  },
  {
    id: 2,
    src: '/samples/regen-muenchen.mp3',
    title: 'Im Regen von Muenchen',
    genre: 'Akustik Folk',
    mood: 'Warm',
    occasion: 'hochzeit',
  },
  {
    id: 3,
    src: '/samples/zuhause.mp3',
    title: 'Du bist mein Zuhause',
    genre: 'Moderner Schlager',
    mood: 'Froehlich',
    occasion: 'hochzeit',
  },
  {
    id: 4,
    src: '/samples/sonnenschein.mp3',
    title: 'Sechzig Jahre Sonnenschein',
    genre: 'Froehlicher Pop',
    mood: 'Nostalgisch',
    occasion: 'geburtstag',
  },
  {
    id: 5,
    src: '/samples/null-dreissig.mp3',
    title: 'Von Null auf Dreissig',
    genre: 'Pop Rock',
    mood: 'Energiegeladen',
    occasion: 'geburtstag',
  },
  {
    id: 6,
    src: '/samples/kleine-schwester.mp3',
    title: 'Meine kleine Schwester',
    genre: 'Akustik Ballade',
    mood: 'Liebevoll',
    occasion: 'geburtstag',
  },
  {
    id: 7,
    src: '/samples/song-7.mp3',
    title: 'Dreissig Jahre bei uns',
    genre: 'Wuerdevoller Pop',
    mood: 'Respektvoll',
    occasion: 'geburtstag',
  },
  {
    id: 8,
    src: '/samples/song-8.mp3',
    title: 'Die Kaffeemaschinen-Legende',
    genre: 'Beschwingter Pop',
    mood: 'Herzlich',
    occasion: 'geburtstag',
  },
  {
    id: 9,
    src: '/samples/song-9.mp3',
    title: 'Fuer meinen Vater',
    genre: 'Klavierballade',
    mood: 'Emotional',
    occasion: 'familie',
  },
  {
    id: 10,
    src: '/samples/song-10.mp3',
    title: 'Omas Kueche',
    genre: 'Folk Pop',
    mood: 'Nostalgisch',
    occasion: 'familie',
  },
  {
    id: 11,
    src: '/samples/song-11.mp3',
    title: 'Samstagabend Helden',
    genre: 'Indie Rock',
    mood: 'Energiegeladen',
    occasion: 'familie',
  },
  {
    id: 12,
    src: '/samples/song-12.mp3',
    title: 'Bessere Haelfte',
    genre: 'Akustik Pop',
    mood: 'Herzlich',
    occasion: 'familie',
  },
];

// Filter functions
export function getWeddingSamples(): AudioSample[] {
  return allAudioSamples.filter((s) => s.occasion === 'hochzeit');
}

export function getBirthdaySamples(): AudioSample[] {
  return allAudioSamples.filter((s) => s.occasion === 'geburtstag');
}

export function getFamilySamples(): AudioSample[] {
  return allAudioSamples.filter((s) => s.occasion === 'familie');
}

interface LPAudioSampleProps {
  samples: AudioSample[];
  title?: string;
  subtitle?: string;
  badgeText?: string;
  maxDisplay?: number;
}

export function LPAudioSample({
  samples,
  title = 'Hoer selbst',
  subtitle = 'So koennte dein Song klingen',
  badgeText = 'Beispiel',
  maxDisplay = 2,
}: LPAudioSampleProps) {
  const displaySamples = samples.slice(0, maxDisplay);

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold-100 text-gold-700 text-sm font-medium mb-3">
            {badgeText}
          </span>
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-primary-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600">{subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {displaySamples.map((sample, index) => (
            <motion.div
              key={sample.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AudioPlayer
                src={sample.src}
                title={sample.title}
                genre={sample.genre}
                mood={sample.mood}
                occasion={sample.occasion}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className="text-gray-500 text-xs">
            * Beispiele. Dein Song wird 100% individuell fuer dich erstellt.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
