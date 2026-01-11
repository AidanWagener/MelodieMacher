'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Star, Clock, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-white -z-10" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-gold-100/30 to-transparent -z-10" />

      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-100 text-gold-700 text-sm font-medium mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <span>Ueber 1.000 glueckliche Kunden</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-primary-900 leading-tight mb-6">
              Schenke einen Song, der{' '}
              <span className="text-gradient">Herzen beruehrt</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8 max-w-xl">
              Dein personalisiertes Lied fuer Hochzeit, Geburtstag oder jeden besonderen Moment.{' '}
              <strong className="text-primary-900">In nur 24 Stunden bei dir.</strong>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button asChild size="xl" className="group">
                <Link href="/bestellen">
                  Jetzt Song erstellen
                  <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <a href="#beispiele">
                  <Play className="mr-2 w-5 h-5" />
                  Beispiele anhoeren
                </a>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-600" />
                <span>24h Express-Lieferung</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-600" />
                <span>Gaensehaut-Garantie</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary-900">Ab 49 Euro</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Audio Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-3xl shadow-2xl shadow-primary-900/10 p-6 sm:p-8">
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-gold-400 to-gold-500 rounded-2xl -z-10 opacity-20" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl -z-10 opacity-10" />

              {/* Audio Preview Card */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-600 to-gold-400 mb-4">
                  <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                </div>
                <h3 className="text-xl font-semibold text-primary-900 mb-2">
                  &quot;Fuer immer Dein&quot;
                </h3>
                <p className="text-gray-500 text-sm">
                  Hochzeitssong von Lisa & Max
                </p>
              </div>

              {/* Waveform Placeholder */}
              <div className="flex items-center justify-center gap-1 h-16 mb-6">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-primary-600 to-gold-400 rounded-full opacity-60"
                    style={{
                      height: `${Math.random() * 100}%`,
                      minHeight: '20%',
                    }}
                  />
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium">
                  Pop
                </span>
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-sm font-medium">
                  Emotional
                </span>
                <span className="px-3 py-1 rounded-full bg-gold-50 text-gold-700 text-sm font-medium">
                  Hochzeit
                </span>
              </div>

              <p className="text-center text-sm text-gray-500 italic">
                &quot;Der schoenste Moment unserer Hochzeit war, als unser Song lief.
                Alle haben geweint!&quot;
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
