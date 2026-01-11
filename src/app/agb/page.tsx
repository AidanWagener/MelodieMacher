import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AGB | MelodieMacher',
  description: 'Allgemeine Geschaeftsbedingungen von MelodieMacher',
};

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-narrow py-12 lg:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurueck zur Startseite
        </Link>

        <h1 className="text-3xl lg:text-4xl font-display font-bold text-primary-900 mb-8">
          Allgemeine Geschaeftsbedingungen (AGB)
        </h1>

        <div className="prose prose-gray max-w-none">
          <h2>§ 1 Geltungsbereich</h2>
          <p>
            (1) Diese Allgemeinen Geschaeftsbedingungen (AGB) gelten fuer alle
            Vertraege, die zwischen MelodieMacher (nachfolgend Anbieter)
            und dem Kunden (nachfolgend Kunde) ueber die Website
            melodiemacher.de geschlossen werden.
          </p>
          <p>
            (2) Von diesen AGB abweichende Bedingungen des Kunden werden nicht
            anerkannt, es sei denn, der Anbieter stimmt ihrer Geltung
            ausdruecklich schriftlich zu.
          </p>

          <h2>§ 2 Vertragsgegenstand</h2>
          <p>
            (1) Gegenstand des Vertrages ist die Erstellung eines
            personalisierten Songs auf Basis der vom Kunden uebermittelten
            Informationen.
          </p>
          <p>
            (2) Der Anbieter erstellt den Song unter Verwendung von
            KI-gestuetzter Musikgenerierung. Das Endergebnis ist ein
            individuelles, digitales Musikstueck.
          </p>
          <p>
            (3) Die genauen Leistungen richten sich nach dem vom Kunden
            gewaehlten Paket (Basis, Plus oder Premium).
          </p>

          <h2>§ 3 Vertragsschluss</h2>
          <p>
            (1) Die Darstellung der Produkte auf der Website stellt kein
            rechtlich bindendes Angebot, sondern eine Aufforderung zur
            Bestellung dar.
          </p>
          <p>
            (2) Mit dem Absenden der Bestellung gibt der Kunde ein verbindliches
            Angebot zum Kauf ab. Der Vertrag kommt zustande, wenn der Anbieter
            die Bestellung durch eine Bestellbestaetigung per E-Mail annimmt.
          </p>

          <h2>§ 4 Preise und Zahlung</h2>
          <p>
            (1) Alle angegebenen Preise sind Endpreise inklusive der
            gesetzlichen Mehrwertsteuer von 19%.
          </p>
          <p>
            (2) Die Zahlung erfolgt ueber den Zahlungsdienstleister Stripe. Es
            stehen folgende Zahlungsarten zur Verfuegung: Kreditkarte, PayPal,
            Klarna, SEPA-Lastschrift.
          </p>
          <p>
            (3) Die Zahlungspflicht entsteht mit Vertragsschluss. Die Bearbeitung
            der Bestellung beginnt erst nach erfolgreicher Zahlung.
          </p>

          <h2>§ 5 Lieferung</h2>
          <p>
            (1) Die Lieferung erfolgt digital per E-Mail an die vom Kunden
            angegebene E-Mail-Adresse.
          </p>
          <p>(2) Die Lieferzeiten betragen:</p>
          <ul>
            <li>Basis-Paket: 48 Stunden</li>
            <li>Plus-Paket: 24 Stunden</li>
            <li>Premium-Paket: Gleicher Tag (bei Bestellung bis 12:00 Uhr)</li>
          </ul>
          <p>
            (3) Die angegebenen Lieferzeiten sind unverbindliche Richtwerte. Bei
            hohem Bestellaufkommen kann es zu Verzoegerungen kommen.
          </p>

          <h2>§ 6 Revisionen</h2>
          <p>
            (1) Je nach gewaehltem Paket hat der Kunde Anspruch auf eine
            bestimmte Anzahl von Revisionen:
          </p>
          <ul>
            <li>Basis-Paket: 1 Revision</li>
            <li>Plus-Paket: 2 Revisionen</li>
            <li>Premium-Paket: 3 Revisionen</li>
          </ul>
          <p>
            (2) Revisionen umfassen kleinere Anpassungen an Lyrics oder
            Stilanpassungen. Ein kompletter Neustart oder ein anderes Genre
            zaehlt nicht als Revision und wird separat berechnet.
          </p>

          <h2>§ 7 Nutzungsrechte</h2>
          <p>
            (1) Mit vollstaendiger Bezahlung erhaelt der Kunde die Nutzungsrechte
            am erstellten Song.
          </p>
          <p>
            (2) Bei Basis- und Plus-Paketen erhaelt der Kunde einfache
            Nutzungsrechte fuer den privaten Gebrauch.
          </p>
          <p>
            (3) Bei Premium-Paketen erhaelt der Kunde erweiterte Nutzungsrechte,
            die auch die kommerzielle Nutzung einschliessen.
          </p>
          <p>
            (4) Der Anbieter behaelt das Recht, den Song anonym als
            Referenz/Beispiel zu verwenden, sofern der Kunde nicht widerspricht.
          </p>

          <h2>§ 8 Gaensehaut-Garantie</h2>
          <p>
            (1) Der Anbieter bietet eine Zufriedenheitsgarantie. Ist der Kunde
            mit dem Ergebnis nicht zufrieden, werden weitere Revisionen
            durchgefuehrt, bis der Kunde zufrieden ist.
          </p>
          <p>
            (2) Sollte auch nach zusaetzlichen Revisionen keine Zufriedenheit
            erreicht werden, erstattet der Anbieter den vollen Kaufpreis
            zurueck.
          </p>
          <p>
            (3) Die Garantie kann innerhalb von 14 Tagen nach Lieferung in
            Anspruch genommen werden.
          </p>

          <h2>§ 9 Haftung</h2>
          <p>
            (1) Der Anbieter haftet unbeschraenkt fuer Vorsatz und grobe
            Fahrlaessigkeit sowie fuer Schaeden aus der Verletzung des Lebens,
            des Koerpers oder der Gesundheit.
          </p>
          <p>
            (2) Im Uebrigen ist die Haftung des Anbieters auf den
            vorhersehbaren, vertragstypischen Schaden begrenzt.
          </p>

          <h2>§ 10 Datenschutz</h2>
          <p>
            Die Erhebung und Verarbeitung personenbezogener Daten erfolgt
            gemaess unserer Datenschutzerklaerung.
          </p>

          <h2>§ 11 Schlussbestimmungen</h2>
          <p>
            (1) Es gilt das Recht der Bundesrepublik Deutschland unter
            Ausschluss des UN-Kaufrechts.
          </p>
          <p>
            (2) Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt
            die Wirksamkeit der uebrigen Bestimmungen davon unberuehrt.
          </p>
          <p>
            (3) Aenderungen dieser AGB werden dem Kunden vor Vertragsschluss
            mitgeteilt.
          </p>

          <p className="text-sm text-gray-500 mt-8">Stand: Januar 2025</p>
        </div>
      </div>
    </div>
  );
}
