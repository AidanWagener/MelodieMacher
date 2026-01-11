'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, Shield, Clock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCTA() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-400 rounded-full blur-3xl" />
      </div>

      <div className="container-narrow relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-6">
            Bereit, Gaensehaut zu verschenken?
          </h2>
          <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
            Erstelle jetzt deinen personalisierten Song und erlebe den Moment,
            wenn Traenen der Freude fliessen.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              asChild
              size="xl"
              variant="secondary"
              className="group min-w-[250px]"
            >
              <Link href="/bestellen">
                Jetzt Song erstellen
                <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-primary-200">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold-400" />
              <span className="text-sm">Gaensehaut-Garantie</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gold-400" />
              <span className="text-sm">24h Express-Lieferung</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-gold-400" />
              <span className="text-sm">1.000+ zufriedene Kunden</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
