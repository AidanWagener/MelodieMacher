'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Quote, Play, CheckCircle, Volume2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  location: string;
  occasion: string;
  rating: number;
  avatarUrl?: string;
  hasAudioPreview?: boolean;
  featured?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      'Als der Song bei unserer Hochzeit lief, haben alle geweint - sogar mein Schwiegervater, und der weint NIE! Die Gaeste haben tagelang davon gesprochen. Der absolute Hoehepunkt unserer Feier.',
    author: 'Sabine M.',
    location: 'Muenchen',
    occasion: 'Hochzeitssong',
    rating: 5,
    avatarUrl: '/images/avatars/avatar-maria.png',
    hasAudioPreview: true,
    featured: true,
  },
  {
    id: 2,
    quote:
      'Meine Mama hat zum 60. gedacht, ich hab den Song selbst gesungen. Das war das schoenste Kompliment ever!',
    author: 'Thomas K.',
    location: 'Hamburg',
    occasion: 'Geburtstagslied',
    rating: 5,
    avatarUrl: '/images/avatars/avatar-thomas.png',
    hasAudioPreview: true,
  },
  {
    id: 3,
    quote:
      'In 10 Jahren Geschaeftsfuehrung habe ich noch nie so eine Reaktion bei einer Verabschiedung gesehen. Unbezahlbar.',
    author: 'Dr. Kerstin L.',
    location: 'Berlin',
    occasion: 'Firmenjubilaeum',
    rating: 5,
    avatarUrl: '/images/avatars/avatar-lisa.png',
    hasAudioPreview: false,
  },
  {
    id: 4,
    quote:
      'Ich war skeptisch, ob das funktioniert. Jetzt hoeren wir den Song jeden Tag - unsere Tochter liebt ihr Schlaflied!',
    author: 'Julia & Marco',
    location: 'Koeln',
    occasion: 'Schlaflied',
    rating: 5,
    avatarUrl: '/images/avatars/avatar-anna.png',
    hasAudioPreview: true,
  },
  {
    id: 5,
    quote:
      'Schnelle Lieferung, perfekte Qualitaet, und der Support war super freundlich. Wuerde sofort wieder bestellen!',
    author: 'Andreas W.',
    location: 'Frankfurt',
    occasion: 'Hochzeitstag',
    rating: 5,
    avatarUrl: '/images/avatars/avatar-michael.png',
    hasAudioPreview: false,
  },
  {
    id: 6,
    quote:
      'Mein Mann hat geweint. Ich habe geweint. Die Gaeste haben geweint. Der beste Moment unserer Silberhochzeit!',
    author: 'Petra S.',
    location: 'Stuttgart',
    occasion: 'Silberhochzeit',
    rating: 5,
    avatarUrl: '/images/avatars/avatar-klaus.png',
    hasAudioPreview: true,
  },
];

// Avatar fallback component
function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          fill
          className="object-cover"
          onError={(e) => {
            // On error, hide the image and show initials
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : null}
      <span className="text-white font-semibold text-sm">{initials}</span>
    </div>
  );
}

// Audio preview button placeholder
function AudioPreviewButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-xs font-medium hover:bg-primary-100 transition-colors group"
    >
      <Play className="w-3 h-3 group-hover:text-primary-800" />
      <span>Anhoeren</span>
    </button>
  );
}

// Verified badge
function VerifiedBadge() {
  return (
    <div className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
      <CheckCircle className="w-3 h-3" />
      <span>Verifizierter Kauf</span>
    </div>
  );
}

// Featured testimonial card (larger)
function FeaturedTestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const handleAudioPreview = () => {
    // Placeholder for audio preview functionality
    console.log('Playing audio preview for:', testimonial.author);
  };

  return (
    <Card className="p-8 relative bg-gradient-to-br from-white to-primary-50/30 border-2 border-primary-100">
      <Quote className="absolute top-6 right-6 w-12 h-12 text-primary-100" />

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star
            key={i}
            className="w-5 h-5 fill-gold-400 text-gold-400"
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-xl text-primary-900 font-medium mb-6 leading-relaxed">
        &quot;{testimonial.quote}&quot;
      </blockquote>

      {/* Author section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={testimonial.author} avatarUrl={testimonial.avatarUrl} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-primary-900">
                {testimonial.author}
              </span>
              <VerifiedBadge />
            </div>
            <div className="text-sm text-gray-500">
              {testimonial.location}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-gold-50 text-gold-700 text-sm font-medium">
            {testimonial.occasion}
          </span>
          {testimonial.hasAudioPreview && (
            <AudioPreviewButton onClick={handleAudioPreview} />
          )}
        </div>
      </div>
    </Card>
  );
}

// Regular testimonial card
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const handleAudioPreview = () => {
    // Placeholder for audio preview functionality
    console.log('Playing audio preview for:', testimonial.author);
  };

  return (
    <Card className="h-full p-6 relative">
      <Quote className="absolute top-4 right-4 w-8 h-8 text-primary-100" />

      {/* Rating */}
      <div className="flex gap-0.5 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4 fill-gold-400 text-gold-400"
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-gray-700 mb-6 leading-relaxed">
        &quot;{testimonial.quote}&quot;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar name={testimonial.author} avatarUrl={testimonial.avatarUrl} />
        <div>
          <div className="font-semibold text-primary-900">
            {testimonial.author}
          </div>
          <div className="text-sm text-gray-500">
            {testimonial.location}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <VerifiedBadge />
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
            {testimonial.occasion}
          </span>
          {testimonial.hasAudioPreview && (
            <AudioPreviewButton onClick={handleAudioPreview} />
          )}
        </div>
      </div>
    </Card>
  );
}

export function Testimonials() {
  const featuredTestimonial = testimonials.find((t) => t.featured);
  const regularTestimonials = testimonials.filter((t) => !t.featured);

  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-sm font-medium mb-4">
            Kundenstimmen
          </span>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary-900 mb-4">
            Das sagen unsere Kunden
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Echte Geschichten von echten Menschen, die mit MelodieMacher
            unvergessliche Momente geschaffen haben.
          </p>
        </motion.div>

        {/* Featured testimonial */}
        {featuredTestimonial && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <FeaturedTestimonialCard testimonial={featuredTestimonial} />
          </motion.div>
        )}

        {/* Regular testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
