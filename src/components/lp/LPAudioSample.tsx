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

// All available samples
export const allAudioSamples: AudioSample[] = [
  {
    id: 1,
    src: '/samples/wedding-pop.mp3',
    title: 'Fuer immer Dein',
    genre: 'Pop',
    mood: 'Romantisch',
    occasion: 'hochzeit',
  },
  {
    id: 2,
    src: '/samples/wedding-acoustic.mp3',
    title: 'Unsere Reise',
    genre: 'Akustik',
    mood: 'Emotional',
    occasion: 'hochzeit',
  },
  {
    id: 3,
    src: '/samples/birthday-schlager.mp3',
    title: 'Dein Tag',
    genre: 'Schlager',
    mood: 'Froehlich',
    occasion: 'geburtstag',
  },
  {
    id: 4,
    src: '/samples/birthday-pop.mp3',
    title: 'Alles Gute fuer Dich',
    genre: 'Pop',
    mood: 'Energiegeladen',
    occasion: 'geburtstag',
  },
  {
    id: 5,
    src: '/samples/family-acoustic.mp3',
    title: 'Familienband',
    genre: 'Akustik',
    mood: 'Liebevoll',
    occasion: 'familie',
  },
  {
    id: 6,
    src: '/samples/baby-lullaby.mp3',
    title: 'Unser kleiner Stern',
    genre: 'Kinder-Pop',
    mood: 'Liebevoll',
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
