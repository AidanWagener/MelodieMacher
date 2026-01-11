'use client';

import { motion } from 'framer-motion';
import { Heart, Music, Users, Zap } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Stat {
  icon: LucideIcon;
  value: string;
  label: string;
}

interface LPSocialProofProps {
  stats?: Stat[];
}

const defaultStats: Stat[] = [
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

export function LPSocialProof({ stats = defaultStats }: LPSocialProofProps) {
  return (
    <section className="py-8 bg-primary-900">
      <div className="container-wide">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 mb-3">
                <stat.icon className="w-5 h-5 text-gold-400" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-white mb-0.5">
                {stat.value}
              </div>
              <div className="text-primary-300 text-xs lg:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
