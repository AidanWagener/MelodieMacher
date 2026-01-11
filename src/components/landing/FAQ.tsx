'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Wie lange dauert es, bis ich meinen Song bekomme?',
    answer:
      'Bei unserem Plus-Paket bekommst du deinen Song innerhalb von 24 Stunden. Das Basis-Paket liefern wir in 48 Stunden. Mit dem Premium-Paket und Bestellung bis 12 Uhr erhaeltst du deinen Song noch am selben Tag!',
  },
  {
    question: 'Was ist, wenn mir der Song nicht gefaellt?',
    answer:
      'Dann arbeiten wir so lange daran, bis du Gaensehaut bekommst - oder du bekommst dein Geld zurueck. Ohne Wenn und Aber. Das ist unsere Gaensehaut-Garantie. Je nach Paket sind 1-3 Revisionen inklusive.',
  },
  {
    question: 'Klingt der Song wie "echte" Musik?',
    answer:
      'Ja! Unsere Songs sind von professioneller Studioqualitaet. Wir nutzen modernste Technologie, um einzigartige, hochwertige Musik zu erstellen. Die meisten Menschen koennen keinen Unterschied zu handgemachter Musik hoeren.',
  },
  {
    question: 'Welche Musikrichtungen bietet ihr an?',
    answer:
      'Wir bieten eine breite Palette an Genres: Pop, Rock, Schlager, Akustik/Folk, Hip-Hop, Klassik, Kinderlieder und mehr. Du kannst auch die Stimmung waehlen - von emotional und romantisch bis froehlich und energiegeladen.',
  },
  {
    question: 'Kann ich den Song fuer Social Media nutzen?',
    answer:
      'Mit unserem Premium-Paket erhaeltst du volle kommerzielle Nutzungsrechte. Das bedeutet, du kannst den Song ueberall nutzen - auf Social Media, bei Veranstaltungen, oder als Hintergrundmusik fuer Videos.',
  },
  {
    question: 'Wie funktioniert das technisch?',
    answer:
      'Du erzaehlst uns die Geschichte ueber unser einfaches Formular. Dann kuemmern wir uns um den Rest! Du brauchst keinerlei technisches Wissen. Nach der Fertigstellung erhaeltst du einen Link zum Download und eine private Hoerseite zum Teilen.',
  },
  {
    question: 'Kann ich Aenderungen am Song vornehmen lassen?',
    answer:
      'Ja! Je nach Paket sind 1-3 Revisionen inklusive. Du kannst kleine Anpassungen an den Lyrics oder der Stimmung wuenschen. Fuer groessere Aenderungen (z.B. komplett anderes Genre) sprechen wir individuell.',
  },
  {
    question: 'In welchem Format erhalte ich den Song?',
    answer:
      'Du erhaeltst deinen Song als hochwertige MP3-Datei (320 kbps). Im Premium-Paket bekommst du zusaetzlich eine Instrumental-Version und ein Video mit Lyrics (MP4). Alle Pakete beinhalten eine private Hoerseite zum einfachen Teilen.',
  },
  {
    question: 'Wie bezahle ich?',
    answer:
      'Wir akzeptieren alle gaengigen Zahlungsmethoden: PayPal, Klarna (auch Ratenzahlung), Kreditkarte (Visa, Mastercard), SEPA-Lastschrift und mehr. Die Zahlung ist 100% sicher und verschluesselt.',
  },
  {
    question: 'Gibt es einen Kundenservice?',
    answer:
      'Ja! Unser Support-Team ist per E-Mail erreichbar unter hallo@melodiemacher.de. Wir antworten in der Regel innerhalb von 24 Stunden. Premium-Kunden geniessen Prioritaets-Support mit schnellerer Reaktionszeit.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="section-padding scroll-mt-20">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary-900 mb-4">
            Haeufig gestellte Fragen
          </h2>
          <p className="text-lg text-gray-600">
            Alles, was du ueber MelodieMacher wissen musst.
          </p>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            Noch Fragen? Schreib uns an{' '}
            <a
              href="mailto:hallo@melodiemacher.de"
              className="text-primary-600 hover:underline font-medium"
            >
              hallo@melodiemacher.de
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
