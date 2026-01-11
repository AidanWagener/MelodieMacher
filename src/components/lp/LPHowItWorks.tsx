'use client';

import { motion } from 'framer-motion';
import { MessageSquareText, Sparkles, Gift } from 'lucide-react';

interface Step {
  icon: React.ComponentType<{ className?: string }>;
  number: string;
  title: string;
  description: string;
}

interface LPHowItWorksProps {
  title?: string;
  subtitle?: string;
  steps?: Step[];
}

const defaultSteps: Step[] = [
  {
    icon: MessageSquareText,
    number: '01',
    title: 'Erzaehl uns eure Geschichte',
    description:
      'Fuelle unser kurzes Formular aus. Was macht den Anlass besonders? Welche Erinnerungen sollen verewigt werden?',
  },
  {
    icon: Sparkles,
    number: '02',
    title: 'Wir komponieren deinen Song',
    description:
      'Unser Team verwandelt deine Geschichte in einen einzigartigen Song. Du waehlst den Stil - von Pop bis Schlager.',
  },
  {
    icon: Gift,
    number: '03',
    title: 'Gaensehaut-Moment',
    description:
      'In 24 Stunden erhaeltst du deinen Song. Lade ihn herunter und erlebe den Moment, wenn Traenen fliessen.',
  },
];

export function LPHowItWorks({
  title = 'So einfach geht\'s',
  subtitle = 'In 3 Schritten zum perfekten Song',
  steps = defaultSteps,
}: LPHowItWorksProps) {
  return (
    <section className="py-12 lg:py-16">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-3">
            {title}
          </span>
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-primary-900">
            {subtitle}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-gold-400 mb-4 shadow-lg shadow-primary-600/20">
                <step.icon className="w-7 h-7 text-white" />
              </div>

              {/* Number */}
              <div className="text-4xl font-display font-bold text-primary-100 mb-2">
                {step.number}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
