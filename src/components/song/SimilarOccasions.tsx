'use client';

import Link from 'next/link';
import { Gift, Heart, Cake, Calendar, Users, Star, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSimilarOccasions } from '@/lib/reminders';

interface SimilarOccasionsProps {
  currentOccasion: string;
  recipientName: string;
  className?: string;
}

const occasionIcons: Record<string, typeof Heart> = {
  Hochzeit: Heart,
  Jahrestag: Calendar,
  Geburtstag: Cake,
  Muttertag: Heart,
  Vatertag: Heart,
  Weihnachten: Gift,
  Valentinstag: Heart,
  Verlobung: Heart,
  Hochzeitstag: Heart,
  Jubilaeum: Star,
  Abschluss: Star,
  Taufe: Users,
  default: Gift,
};

const occasionDescriptions: Record<string, string> = {
  Hochzeit: 'Der perfekte Song fuer den schoensten Tag',
  Jahrestag: 'Feiere eure gemeinsame Zeit mit Musik',
  Geburtstag: 'Ein unvergessliches Geschenk zum Ehrentag',
  Muttertag: 'Zeig ihr, wie besonders sie ist',
  Vatertag: 'Danke sagen mit einem persoenlichen Song',
  Weihnachten: 'Das Geschenk, das von Herzen kommt',
  Valentinstag: 'Deine Liebe in Musik verwandelt',
  Verlobung: 'Der Song fuer euren besonderen Moment',
  Hochzeitstag: 'Erinnere euch an euer Versprechen',
  Jubilaeum: 'Feiere besondere Meilensteine',
};

export function SimilarOccasions({
  currentOccasion,
  recipientName,
  className = '',
}: SimilarOccasionsProps) {
  const suggestions = getSimilarOccasions(currentOccasion).slice(0, 3);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
          <Gift className="w-5 h-5 text-gold-600" />
        </div>
        <div>
          <h3 className="font-medium text-primary-900">
            Noch jemand Besonderes?
          </h3>
          <p className="text-sm text-gray-600">
            Diese Anlaesse koennten auch passen
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {suggestions.map((occasion) => {
          const IconComponent = occasionIcons[occasion] || occasionIcons.default;
          const description =
            occasionDescriptions[occasion] || 'Ein einzigartiger Song fuer diesen Anlass';

          return (
            <Link
              key={occasion}
              href={`/bestellen?occasion=${encodeURIComponent(occasion)}`}
              className="group"
            >
              <div className="bg-gray-50 hover:bg-primary-50 border border-gray-100 hover:border-primary-200 rounded-xl p-4 transition-all duration-200 h-full">
                <div className="w-10 h-10 rounded-lg bg-white group-hover:bg-primary-100 flex items-center justify-center mb-3 transition-colors">
                  <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
                </div>
                <h4 className="font-medium text-primary-900 mb-1">{occasion}</h4>
                <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Button variant="outline" asChild>
          <Link href="/bestellen">
            Alle Anlaesse entdecken
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}

export default SimilarOccasions;
