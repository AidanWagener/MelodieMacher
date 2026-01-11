'use client';

import { motion } from 'framer-motion';
import { MessageSquareText, Sparkles, Gift } from 'lucide-react';

const steps = [
  {
    icon: MessageSquareText,
    number: '01',
    title: 'Erzaehl uns eure Geschichte',
    description:
      'Fuelle unser kurzes Formular aus. Wer ist der Empfaenger? Was macht eure Beziehung besonders? Welche Erinnerungen sollen verewigt werden?',
  },
  {
    icon: Sparkles,
    number: '02',
    title: 'Wir komponieren deinen Song',
    description:
      'Unser Team verwandelt deine Geschichte in einen einzigartigen Song. Du waehlst den Stil - von Pop bis Schlager, von emotional bis froehlich.',
  },
  {
    icon: Gift,
    number: '03',
    title: 'Gaensehaut-Moment',
    description:
      'Innerhalb von 24 Stunden erhaeltst du deinen fertigen Song. Lade ihn herunter, teile ihn, und erlebe den Moment, wenn Traenen fliessen.',
  },
];

export function HowItWorks() {
  return (
    <section id="so-funktionierts" className="section-padding scroll-mt-20">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
            So einfach geht&apos;s
          </span>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary-900 mb-4">
            In 3 Schritten zum perfekten Song
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Von deiner Geschichte zu deinem Song - schneller und einfacher als du denkst.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent -z-10" />
              )}

              <div className="text-center lg:text-left">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-gold-400 mb-6 shadow-lg shadow-primary-600/20">
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Number */}
                <div className="text-5xl font-display font-bold text-primary-100 mb-2">
                  {step.number}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-primary-900 mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
