'use client';

import { motion } from 'framer-motion';
import { Heart, Music, Users, Zap } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '1.000+',
    label: 'Glueckliche Kunden',
  },
  {
    icon: Music,
    value: '2.500+',
    label: 'Songs erstellt',
  },
  {
    icon: Heart,
    value: '99%',
    label: 'Zufriedenheit',
  },
  {
    icon: Zap,
    value: '24h',
    label: 'Express-Lieferung',
  },
];

export function SocialProof() {
  return (
    <section className="py-12 bg-primary-900">
      <div className="container-wide">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 mb-4">
                <stat.icon className="w-6 h-6 text-gold-400" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-primary-300 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
