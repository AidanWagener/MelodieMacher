'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  location: string;
  occasion: string;
  rating: number;
}

// Master testimonials data - can be filtered by occasion
export const allTestimonials: Testimonial[] = [
  // Wedding testimonials
  {
    id: 1,
    quote:
      'Als der Song bei unserer Hochzeit lief, haben alle geweint - sogar mein Schwiegervater, und der weint NIE!',
    author: 'Sabine M.',
    location: 'Muenchen',
    occasion: 'hochzeit',
    rating: 5,
  },
  {
    id: 5,
    quote:
      'Schnelle Lieferung, perfekte Qualitaet, und der Support war super freundlich. Der perfekte Hochzeitssong!',
    author: 'Andreas W.',
    location: 'Frankfurt',
    occasion: 'hochzeit',
    rating: 5,
  },
  {
    id: 6,
    quote:
      'Mein Mann hat geweint. Ich habe geweint. Die Gaeste haben geweint. Der beste Moment unserer Silberhochzeit!',
    author: 'Petra S.',
    location: 'Stuttgart',
    occasion: 'hochzeit',
    rating: 5,
  },
  {
    id: 10,
    quote:
      'Unser Hochzeitssong war das emotionale Highlight des Abends. Selbst der DJ war begeistert!',
    author: 'Lisa & Markus',
    location: 'Duesseldorf',
    occasion: 'hochzeit',
    rating: 5,
  },
  // Birthday testimonials
  {
    id: 2,
    quote:
      'Meine Mama hat zum 60. gedacht, ich hab den Song selbst gesungen. Das war das schoenste Kompliment ever!',
    author: 'Thomas K.',
    location: 'Hamburg',
    occasion: 'geburtstag',
    rating: 5,
  },
  {
    id: 7,
    quote:
      'Mein Vater ist zum 70. Geburtstag in Traenen ausgebrochen - er sammelt sonst nur Briefmarken, keine Emotionen!',
    author: 'Martina H.',
    location: 'Bremen',
    occasion: 'geburtstag',
    rating: 5,
  },
  {
    id: 8,
    quote:
      'Das beste Geschenk, das ich je gemacht habe. Meine beste Freundin hoert den Song immer noch jeden Tag!',
    author: 'Jennifer L.',
    location: 'Leipzig',
    occasion: 'geburtstag',
    rating: 5,
  },
  {
    id: 11,
    quote:
      'Zum 18. meiner Tochter - sie hat erstmal 10 Minuten geweint vor Freude. Unbezahlbar!',
    author: 'Sandra K.',
    location: 'Hannover',
    occasion: 'geburtstag',
    rating: 5,
  },
  // Family/Baby testimonials
  {
    id: 4,
    quote:
      'Ich war skeptisch, ob das funktioniert. Jetzt hoeren wir den Song jeden Tag - unsere Tochter liebt ihr Schlaflied!',
    author: 'Julia & Marco',
    location: 'Koeln',
    occasion: 'familie',
    rating: 5,
  },
  {
    id: 9,
    quote:
      'Zur Taufe unseres Sohnes - Oma und Opa haben beide geweint. Ein Geschenk fuer Generationen!',
    author: 'Carolin M.',
    location: 'Nuernberg',
    occasion: 'familie',
    rating: 5,
  },
  {
    id: 12,
    quote:
      'Fuer meine Eltern zum 40. Hochzeitstag - Papa hat zum ersten Mal geweint, seit ich denken kann.',
    author: 'Michael R.',
    location: 'Dresden',
    occasion: 'familie',
    rating: 5,
  },
  {
    id: 13,
    quote:
      'Ein Song fuer unsere Grosseltern zur goldenen Hochzeit. Die ganze Familie war geruehrt!',
    author: 'Familie Weber',
    location: 'Mannheim',
    occasion: 'familie',
    rating: 5,
  },
  // Business testimonials
  {
    id: 3,
    quote:
      'In 10 Jahren Geschaeftsfuehrung habe ich noch nie so eine Reaktion bei einer Verabschiedung gesehen. Unbezahlbar.',
    author: 'Dr. Kerstin L.',
    location: 'Berlin',
    occasion: 'firma',
    rating: 5,
  },
];

// Filter functions
export function getTestimonialsByOccasion(occasion: string): Testimonial[] {
  return allTestimonials.filter((t) => t.occasion === occasion);
}

export function getWeddingTestimonials(): Testimonial[] {
  return getTestimonialsByOccasion('hochzeit');
}

export function getBirthdayTestimonials(): Testimonial[] {
  return getTestimonialsByOccasion('geburtstag');
}

export function getFamilyTestimonials(): Testimonial[] {
  return getTestimonialsByOccasion('familie');
}

interface LPTestimonialsProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
  badgeText?: string;
  maxDisplay?: number;
}

export function LPTestimonials({
  testimonials,
  title = 'Das sagen unsere Kunden',
  subtitle = 'Echte Geschichten von echten Menschen.',
  badgeText = 'Kundenstimmen',
  maxDisplay = 3,
}: LPTestimonialsProps) {
  const displayTestimonials = testimonials.slice(0, maxDisplay);

  return (
    <section className="py-12 lg:py-16">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-sm font-medium mb-3">
            {badgeText}
          </span>
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-primary-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">{subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto">
          {displayTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full p-5 relative">
                <Quote className="absolute top-3 right-3 w-6 h-6 text-primary-100" />

                {/* Rating */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-gold-400 text-gold-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 mb-4 text-sm leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </blockquote>

                {/* Author */}
                <div>
                  <div className="font-semibold text-primary-900 text-sm">
                    {testimonial.author}
                  </div>
                  <div className="text-xs text-gray-500">
                    {testimonial.location}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
