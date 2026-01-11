'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Check, Zap, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const packages = [
  {
    id: 'basis',
    name: 'Melodie Basis',
    price: 49,
    comparePrice: 150,
    savings: null,
    description: 'Perfekt fuer den Einstieg',
    delivery: '48 Stunden',
    features: [
      '1 personalisierter Song (2-3 Min.)',
      'Genre deiner Wahl',
      'Deine Geschichte im Song',
      'MP3 Download',
      '1 Revision inklusive',
    ],
    cta: 'Jetzt bestellen',
    popular: false,
    icon: Star,
  },
  {
    id: 'plus',
    name: 'Melodie Plus',
    price: 79,
    comparePrice: 200,
    savings: 121,
    description: 'Unser Bestseller',
    delivery: '24 Stunden EXPRESS',
    features: [
      'Alles aus Basis, plus:',
      '24h Express-Lieferung',
      'Lyrics als PDF',
      '2 Revisionen inklusive',
      'Private Hoerseite (Link)',
      'Album-Cover Artwork',
    ],
    cta: 'Jetzt bestellen',
    popular: true,
    icon: Zap,
  },
  {
    id: 'premium',
    name: 'Melodie Premium',
    price: 129,
    comparePrice: 350,
    savings: 221,
    description: 'Das Rundum-Sorglos-Paket',
    delivery: 'SAME-DAY (bis 12 Uhr)',
    features: [
      'Alles aus Plus, plus:',
      'Same-Day Lieferung',
      'Video mit Lyrics (MP4)',
      'Instrumental-Version',
      '3 Revisionen inklusive',
      'Kommerzielle Nutzungsrechte',
      'Prioritaets-Support',
    ],
    cta: 'Jetzt bestellen',
    popular: false,
    icon: Crown,
  },
];

// Payment method logos as SVG data (simplified representations)
const PaymentLogos = () => (
  <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6">
    {/* PayPal */}
    <div className="flex items-center justify-center h-8 px-3 py-1 bg-white rounded-md border border-gray-200 shadow-sm">
      <span className="text-[#003087] font-bold text-sm">Pay</span>
      <span className="text-[#009cde] font-bold text-sm">Pal</span>
    </div>

    {/* Klarna */}
    <div className="flex items-center justify-center h-8 px-3 py-1 bg-[#ffb3c7] rounded-md border border-gray-200 shadow-sm">
      <span className="text-black font-bold text-sm">Klarna.</span>
    </div>

    {/* Visa */}
    <div className="flex items-center justify-center h-8 px-3 py-1 bg-white rounded-md border border-gray-200 shadow-sm">
      <span className="text-[#1a1f71] font-bold italic text-sm tracking-tight">VISA</span>
    </div>

    {/* Mastercard */}
    <div className="flex items-center justify-center h-8 px-3 py-1 bg-white rounded-md border border-gray-200 shadow-sm">
      <div className="flex items-center">
        <div className="w-4 h-4 rounded-full bg-[#eb001b]" />
        <div className="w-4 h-4 rounded-full bg-[#f79e1b] -ml-2" />
      </div>
    </div>

    {/* SEPA */}
    <div className="flex items-center justify-center h-8 px-3 py-1 bg-white rounded-md border border-gray-200 shadow-sm">
      <span className="text-[#2566af] font-bold text-xs">SEPA</span>
    </div>

    {/* Apple Pay */}
    <div className="flex items-center justify-center h-8 px-3 py-1 bg-black rounded-md border border-gray-200 shadow-sm">
      <span className="text-white font-medium text-xs">Apple Pay</span>
    </div>
  </div>
);

export function Pricing() {
  return (
    <section id="preise" className="section-padding bg-gray-50 scroll-mt-20">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
            Transparente Preise
          </span>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary-900 mb-4">
            Waehle dein Paket
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Alle Preise inklusive MwSt. Keine versteckten Kosten.
            100% Gaensehaut-Garantie.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                'relative',
                pkg.popular && 'lg:-mt-6 lg:mb-6 lg:scale-105 z-10'
              )}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-gold-400 text-primary-900 shadow-lg">
                    Beliebteste Wahl
                  </Badge>
                </div>
              )}

              {/* Savings badge */}
              {pkg.savings && (
                <div className="absolute -top-3 -right-3 z-10">
                  <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    Spare {pkg.savings} Euro
                  </div>
                </div>
              )}

              <Card
                className={cn(
                  'h-full p-6 lg:p-8 flex flex-col',
                  pkg.popular &&
                    'ring-2 ring-gold-400 shadow-2xl shadow-gold-400/30'
                )}
              >
                <div className="text-center mb-6">
                  <div
                    className={cn(
                      'inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4',
                      pkg.popular
                        ? 'bg-gradient-to-br from-gold-400 to-gold-500'
                        : 'bg-primary-100'
                    )}
                  >
                    <pkg.icon
                      className={cn(
                        'w-7 h-7',
                        pkg.popular ? 'text-white' : 'text-primary-600'
                      )}
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-primary-900 mb-1">
                    {pkg.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{pkg.description}</p>

                  {/* Value anchoring - Compare price */}
                  <div className="mb-1">
                    <span className="text-sm text-gray-400 line-through">
                      Vergleichswert: {pkg.comparePrice} Euro
                    </span>
                  </div>

                  {/* Actual price */}
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold text-primary-900">
                      {pkg.price}
                    </span>
                    <span className="text-gray-500">Euro</span>
                  </div>

                  <div
                    className={cn(
                      'inline-block px-3 py-1 rounded-full text-xs font-medium',
                      pkg.popular
                        ? 'bg-gold-100 text-gold-700'
                        : 'bg-primary-50 text-primary-700'
                    )}
                  >
                    {pkg.delivery}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className={cn(
                          'w-5 h-5 flex-shrink-0 mt-0.5',
                          pkg.popular ? 'text-gold-500' : 'text-primary-600'
                        )}
                      />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={pkg.popular ? 'secondary' : 'default'}
                  size="lg"
                  className="w-full"
                >
                  <Link href={`/bestellen?paket=${pkg.id}`}>{pkg.cta}</Link>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Payment logos section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 lg:mt-16"
        >
          <p className="text-center text-sm text-gray-500 mb-4">
            Sichere Zahlung mit
          </p>
          <PaymentLogos />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-gray-500 text-sm">
            Fragen? Schreib uns an{' '}
            <a
              href="mailto:hallo@melodiemacher.de"
              className="text-primary-600 hover:underline"
            >
              hallo@melodiemacher.de
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
