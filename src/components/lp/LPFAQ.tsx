'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export interface FAQItem {
  question: string;
  answer: string;
}

// Occasion-specific FAQs
export const weddingFAQs: FAQItem[] = [
  {
    question: 'Wie schnell bekomme ich meinen Hochzeitssong?',
    answer:
      'Mit unserem Plus-Paket erhaeltst du deinen Hochzeitssong innerhalb von 24 Stunden. Perfekt, wenn die Hochzeit naht! Bei Bestellung des Premium-Pakets bis 12 Uhr liefern wir sogar am selben Tag.',
  },
  {
    question: 'Was passiert, wenn mir der Song nicht gefaellt?',
    answer:
      'Dann arbeiten wir daran, bis du Gaensehaut bekommst - oder du bekommst dein Geld zurueck. Je nach Paket sind 1-3 Revisionen inklusive. Bei Hochzeitssongs nehmen wir uns besonders viel Zeit, um jeden Wunsch perfekt umzusetzen.',
  },
  {
    question: 'Kann ich den Song bei der Hochzeitsfeier abspielen?',
    answer:
      'Ja, absolut! Du erhaeltst den Song als hochwertige MP3-Datei, die du ueberall abspielen kannst - bei der Zeremonie, beim Eroeffnungstanz oder als Ueberraschung. Mit dem Premium-Paket bekommst du sogar ein Video fuer die Leinwand!',
  },
  {
    question: 'Welche Informationen braucht ihr fuer den Hochzeitssong?',
    answer:
      'Erzaehl uns eure Liebesgeschichte! Wie habt ihr euch kennengelernt? Was macht eure Beziehung besonders? Welche gemeinsamen Erinnerungen sollen verewigt werden? Je mehr Details, desto persoenlicher wird euer Song.',
  },
];

export const birthdayFAQs: FAQItem[] = [
  {
    question: 'Ist der Song rechtzeitig zum Geburtstag fertig?',
    answer:
      'Mit dem Plus-Paket garantieren wir dir Lieferung innerhalb von 24 Stunden. Selbst wenn der Geburtstag morgen ist - wir schaffen das! Premium-Kunden erhalten ihren Song sogar am selben Tag (Bestellung bis 12 Uhr).',
  },
  {
    question: 'Kann ich den Song als Geschenk verpacken lassen?',
    answer:
      'Ja! Mit unserem Geschenk-Paket Bump (+ 15 Euro) erhaeltst du eine digitale Geschenkkarte und eine Ueberraschungs-Reveal-Seite. Perfekt fuer eine emotionale Ueberraschung!',
  },
  {
    question: 'Was ist, wenn das Geburtstagskind den Song nicht mag?',
    answer:
      'In ueber 1.000 Songs ist das noch nie passiert! Aber falls doch: Wir haben eine 100% Gaensehaut-Garantie. Wir arbeiten so lange daran, bis alle gluecklich sind - oder Geld zurueck.',
  },
  {
    question: 'Fuer welche Geburtstage eignet sich ein personalisierter Song?',
    answer:
      'Fuer jeden Geburtstag - vom 1. bis zum 100.! Besonders beliebt sind runde Geburtstage (18., 30., 50., 60., ...). Aber auch als jaehrliche Tradition eignet sich ein Song perfekt.',
  },
];

export const familyFAQs: FAQItem[] = [
  {
    question: 'Fuer welche Familienanlaesse eignet sich ein Song?',
    answer:
      'Fuer alle besonderen Momente: Taufe, Konfirmation, Kommunion, Hochzeitstage der Eltern/Grosseltern, Familienjubilaeen, Weihnachten oder einfach als Liebeserklaerung an die Familie. Jeder Anlass ist willkommen!',
  },
  {
    question: 'Koennen mehrere Familienmitglieder im Song erwaehnt werden?',
    answer:
      'Ja! Erzaehl uns von allen Personen, die im Song vorkommen sollen. Wir verweben eure gemeinsamen Geschichten zu einem einzigartigen Familienlied, das Generationen verbindet.',
  },
  {
    question: 'Ist der Song auch fuer Kinder/Babys geeignet?',
    answer:
      'Absolut! Wir bieten spezielle Kinderlieder-Genres an - verspielt, liebevoll und altersgerecht. Ob Schlaflied fuer das Baby oder ein froehliches Lied fuer groessere Kinder - wir passen den Song perfekt an.',
  },
  {
    question: 'Kann ich den Song auf einer Familienfeier abspielen?',
    answer:
      'Ja, natuerlich! Der Song gehoert dir. Mit dem Premium-Paket erhaeltst du sogar ein Video mit Lyrics, das du auf einem Bildschirm oder Beamer zeigen kannst - so kann die ganze Familie mitsingen!',
  },
];

interface LPFAQProps {
  faqs: FAQItem[];
  title?: string;
  subtitle?: string;
}

export function LPFAQ({
  faqs,
  title = 'Haeufig gestellte Fragen',
  subtitle = 'Schnelle Antworten auf deine Fragen.',
}: LPFAQProps) {
  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-3">
            FAQ
          </span>
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-primary-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600">{subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
