'use client';

import { motion } from 'framer-motion';
import { AudioPlayer } from '@/components/shared/AudioPlayer';

// Note: These would be replaced with actual audio files
const samples = [
  {
    id: 1,
    src: '/samples/wedding-pop.mp3',
    title: 'Fuer immer Dein',
    genre: 'Pop',
    mood: 'Romantisch',
    occasion: 'Hochzeit',
  },
  {
    id: 2,
    src: '/samples/birthday-schlager.mp3',
    title: 'Dein Tag',
    genre: 'Schlager',
    mood: 'Froehlich',
    occasion: 'Geburtstag',
  },
  {
    id: 3,
    src: '/samples/anniversary-acoustic.mp3',
    title: 'Durch alle Zeiten',
    genre: 'Akustik',
    mood: 'Emotional',
    occasion: 'Jubilaeum',
  },
  {
    id: 4,
    src: '/samples/kids-pop.mp3',
    title: 'Unser kleiner Stern',
    genre: 'Kinder-Pop',
    mood: 'Liebevoll',
    occasion: 'Taufe',
  },
];

export function AudioSamples() {
  return (
    <section id="beispiele" className="section-padding bg-gray-50 scroll-mt-20">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold-100 text-gold-700 text-sm font-medium mb-4">
            Hoer selbst
          </span>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary-900 mb-4">
            Beispiele unserer Songs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            So koennten auch deine personalisierten Songs klingen.
            Jeder Song wird individuell fuer dich erstellt.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {samples.map((sample, index) => (
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
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm">
            * Dies sind Beispiele. Dein Song wird 100% individuell fuer dich erstellt.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
