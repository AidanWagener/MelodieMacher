'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, Shield, Clock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LPCTAProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  urgencyText?: string;
}

export function LPCTA({
  headline,
  subheadline,
  ctaText,
  ctaLink,
  urgencyText,
}: LPCTAProps) {
  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-400 rounded-full blur-3xl" />
      </div>

      <div className="container-narrow relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {urgencyText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 text-rose-200 text-sm font-medium mb-4"
            >
              <Clock className="w-4 h-4" />
              <span>{urgencyText}</span>
            </motion.div>
          )}

          <h2 className="text-2xl lg:text-4xl font-display font-bold text-white mb-4">
            {headline}
          </h2>
          <p className="text-lg text-primary-200 mb-6 max-w-xl mx-auto">
            {subheadline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button
              asChild
              size="xl"
              variant="secondary"
              className="group min-w-[250px]"
            >
              <Link href={ctaLink}>
                {ctaText}
                <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-primary-200">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold-400" />
              <span className="text-sm">Gaensehaut-Garantie</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gold-400" />
              <span className="text-sm">24h Express</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-gold-400" />
              <span className="text-sm">1.000+ Kunden</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
