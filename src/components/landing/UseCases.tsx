'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Gift, Briefcase, Baby, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

const useCases = [
  {
    icon: Heart,
    title: 'Hochzeit',
    description:
      'Euer Hochzeitstanz verdient mehr als einen 0815-Song. Erzaehl uns eure Liebesgeschichte.',
    examples: [
      'Euer Kennenlern-Moment als Refrain',
      'Insider-Witze, die nur ihr versteht',
      'Der Heiratsantrag, musikalisch verewigt',
    ],
    color: 'rose',
    href: '/bestellen?anlass=hochzeit',
  },
  {
    icon: Gift,
    title: 'Geburtstag',
    description:
      'Vergiss Gutscheine und Socken. Schenk einen Song, der die schoensten Erinnerungen feiert.',
    examples: [
      '30 Jahre in 3 Minuten: Die Highlights',
      'Persoenliche Insider-Geschichten',
      'Happy Birthday war gestern',
    ],
    color: 'gold',
    href: '/bestellen?anlass=geburtstag',
  },
  {
    icon: Briefcase,
    title: 'Firmenfeiern',
    description:
      'Mitarbeiter-Jubilaeen, Verabschiedungen - mit einem personalisierten Song zeigen Sie echte Wertschaetzung.',
    examples: [
      '25-jaehriges Firmenjubilaeum',
      'Verabschiedung in den Ruhestand',
      'Team-Hymne fuer die Motivation',
    ],
    color: 'primary',
    href: '/bestellen?anlass=firma',
  },
  {
    icon: Baby,
    title: 'Familie',
    description:
      'Von der Taufe bis zum runden Geburtstag - fuer jeden Familienmoment der richtige Song.',
    examples: [
      'Personalisiertes Schlaflied',
      'Tauflied mit dem Namen des Kindes',
      'Goldene Hochzeit der Grosseltern',
    ],
    color: 'primary',
    href: '/bestellen?anlass=familie',
  },
];

const colorClasses = {
  rose: {
    bg: 'bg-rose-50',
    icon: 'bg-rose-100 text-rose-600',
    text: 'text-rose-600',
  },
  gold: {
    bg: 'bg-gold-50',
    icon: 'bg-gold-100 text-gold-600',
    text: 'text-gold-600',
  },
  primary: {
    bg: 'bg-primary-50',
    icon: 'bg-primary-100 text-primary-600',
    text: 'text-primary-600',
  },
};

export function UseCases() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary-900 mb-4">
            Fuer jeden besonderen Anlass
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ob Hochzeit, Geburtstag oder Firmenevent - wir komponieren den perfekten Song
            fuer deinen Moment.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => {
            const colors = colorClasses[useCase.color as keyof typeof colorClasses];
            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors.icon} mb-4`}
                  >
                    <useCase.icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-semibold text-primary-900 mb-2">
                    {useCase.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4">{useCase.description}</p>

                  <ul className="space-y-2 mb-6">
                    {useCase.examples.map((example) => (
                      <li
                        key={example}
                        className="flex items-start gap-2 text-sm text-gray-500"
                      >
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${colors.icon.split(' ')[0]}`} />
                        {example}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={useCase.href}
                    className={`inline-flex items-center text-sm font-medium ${colors.text} group-hover:underline`}
                  >
                    Song erstellen
                    <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
