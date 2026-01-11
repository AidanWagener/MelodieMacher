'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Star, Clock, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface LPHeroProps {
  headline: string;
  highlightedText: string;
  subheadline: string;
  urgencyText?: string;
  ctaText: string;
  ctaLink: string;
  secondaryCta?: {
    text: string;
    href: string;
  };
  trustBadgeText: string;
  heroImage?: string;
  audioPreview?: {
    title: string;
    subtitle: string;
    quote: string;
    tags: string[];
  };
  showPrice?: boolean;
  priceText?: string;
}

export function LPHero({
  headline,
  highlightedText,
  subheadline,
  urgencyText,
  ctaText,
  ctaLink,
  secondaryCta,
  trustBadgeText,
  heroImage,
  audioPreview,
  showPrice = true,
  priceText = 'Ab 79 Euro',
}: LPHeroProps) {
  return (
    <section className="relative pt-20 lg:pt-24 pb-12 lg:pb-16 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-white -z-10" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-gold-100/30 to-transparent -z-10" />

      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-100 text-gold-700 text-sm font-medium mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <span>{trustBadgeText}</span>
            </div>

            {/* Urgency Banner */}
            {urgencyText && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-100 text-rose-700 text-sm font-medium mb-4 ml-2"
              >
                <Clock className="w-4 h-4" />
                <span>{urgencyText}</span>
              </motion.div>
            )}

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary-900 leading-tight mb-4">
              {headline}{' '}
              <span className="text-gradient">{highlightedText}</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-gray-600 leading-relaxed mb-6 max-w-xl">
              {subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button asChild size="xl" className="group">
                <Link href={ctaLink}>
                  {ctaText}
                  <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              {secondaryCta && (
                <Button asChild variant="outline" size="lg">
                  <a href={secondaryCta.href}>
                    <Play className="mr-2 w-5 h-5" />
                    {secondaryCta.text}
                  </a>
                </Button>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-600" />
                <span>24h Express-Lieferung</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-600" />
                <span>Gaensehaut-Garantie</span>
              </div>
              {showPrice && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary-900">{priceText}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Content - Hero Image or Audio Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {heroImage ? (
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-primary-900/10">
                <Image
                  src={heroImage}
                  alt="Hero Image"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent" />
                {/* Text overlay */}
                {audioPreview && (
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-sm font-medium opacity-90">{audioPreview.subtitle}</p>
                    <p className="text-lg font-semibold">{audioPreview.title}</p>
                  </div>
                )}
              </div>
            ) : audioPreview ? (
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-primary-900/10 p-6 sm:p-8">
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-gold-400 to-gold-500 rounded-2xl -z-10 opacity-20" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl -z-10 opacity-10" />

                {/* Audio Preview Card */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-gold-400 mb-4">
                    <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-1">
                    {audioPreview.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{audioPreview.subtitle}</p>
                </div>

                {/* Waveform Placeholder */}
                <div className="flex items-center justify-center gap-1 h-12 mb-4">
                  {[...Array(30)].map((_, i) => (
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
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {audioPreview.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-center text-sm text-gray-500 italic">
                  &quot;{audioPreview.quote}&quot;
                </p>
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
