'use client';

import { motion } from 'framer-motion';
import { Shield, RefreshCw, Heart, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

const guaranteePoints = [
  {
    icon: RefreshCw,
    title: 'Unbegrenzte Revisionen',
    description: 'Wir arbeiten an deinem Song, bis du zu 100% zufrieden bist. Kostenlos.',
  },
  {
    icon: Heart,
    title: 'Emotionsgarantie',
    description: 'Sollte der Song keine Gaensehaut ausloesen, bekommst du dein Geld zurueck.',
  },
  {
    icon: CheckCircle,
    title: 'Qualitaetsversprechen',
    description: 'Professionelle Produktion, die hoechsten Anspruechen genuegt.',
  },
];

export function Guarantee() {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-primary-50/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-white to-gold-50 border-2 border-gold-200/50 shadow-2xl shadow-gold-400/10">
            {/* Decorative gradient orbs */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-gold-400/20 to-gold-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-primary-400/10 to-primary-500/5 rounded-full blur-3xl" />

            <div className="relative p-8 lg:p-12">
              {/* Header with shield icon */}
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 shadow-lg shadow-gold-400/30 mb-6"
                >
                  <Shield className="w-10 h-10 text-white" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl lg:text-4xl font-display font-bold text-primary-900 mb-3"
                >
                  Unsere Gaensehaut-Garantie
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-gray-600 max-w-2xl mx-auto"
                >
                  Wir glauben an die Kraft der Musik. Deshalb garantieren wir dir ein Erlebnis,
                  das unter die Haut geht - oder du bekommst dein Geld zurueck.
                </motion.p>
              </div>

              {/* Guarantee points */}
              <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-10">
                {guaranteePoints.map((point, index) => (
                  <motion.div
                    key={point.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 mb-4">
                      <point.icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-semibold text-primary-900 mb-2">
                      {point.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {point.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-600/30">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold text-lg">
                    Kein Risiko. Nur Gaensehaut.
                  </span>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
