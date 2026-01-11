import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Widerrufsbelehrung | MelodieMacher',
  description: 'Widerrufsbelehrung von MelodieMacher',
};

export default function WiderrufPage() {
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
          Widerrufsbelehrung
        </h1>

        <div className="prose prose-gray max-w-none">
          <h2>Widerrufsrecht</h2>
          <p>
            Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gruenden
            diesen Vertrag zu widerrufen.
          </p>
          <p>
            Die Widerrufsfrist betraegt vierzehn Tage ab dem Tag des
            Vertragsschlusses.
          </p>
          <p>
            Um Ihr Widerrufsrecht auszuueben, muessen Sie uns (MelodieMacher,
            [Ihre Adresse], E-Mail: hallo@melodiemacher.de) mittels einer
            eindeutigen Erklaerung (z.B. ein mit der Post versandter Brief oder
            E-Mail) ueber Ihren Entschluss, diesen Vertrag zu widerrufen,
            informieren.
          </p>
          <p>
            Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die
            Mitteilung ueber die Ausuebung des Widerrufsrechts vor Ablauf der
            Widerrufsfrist absenden.
          </p>

          <h2>Folgen des Widerrufs</h2>
          <p>
            Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen,
            die wir von Ihnen erhalten haben, unverzueglich und spaetestens
            binnen vierzehn Tagen ab dem Tag zurueckzuzahlen, an dem die
            Mitteilung ueber Ihren Widerruf dieses Vertrags bei uns eingegangen
            ist. Fuer diese Rueckzahlung verwenden wir dasselbe Zahlungsmittel,
            das Sie bei der urspruenglichen Transaktion eingesetzt haben, es sei
            denn, mit Ihnen wurde ausdruecklich etwas anderes vereinbart; in
            keinem Fall werden Ihnen wegen dieser Rueckzahlung Entgelte
            berechnet.
          </p>

          <h2>Besondere Hinweise</h2>

          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 my-6">
            <h3 className="text-primary-900 font-semibold mb-2">
              Vorzeitiges Erloeschen des Widerrufsrechts
            </h3>
            <p className="text-primary-800 mb-0">
              Das Widerrufsrecht erlischt vorzeitig, wenn wir mit der
              Ausfuehrung des Vertrags erst begonnen haben, nachdem Sie
              ausdruecklich zugestimmt haben, dass wir mit der Ausfuehrung des
              Vertrags vor Ablauf der Widerrufsfrist beginnen, und Sie Ihre
              Kenntnis davon bestaetigt haben, dass Sie durch Ihre Zustimmung
              mit Beginn der Ausfuehrung des Vertrags Ihr Widerrufsrecht
              verlieren.
            </p>
          </div>

          <p>
            Dies bedeutet: Da es sich bei unserem Service um die Erstellung von
            personalisierten digitalen Inhalten handelt, die speziell nach Ihren
            Wuenschen angefertigt werden, erlischt Ihr Widerrufsrecht, sobald
            wir mit der Erstellung Ihres Songs beginnen - sofern Sie dem bei
            der Bestellung zugestimmt haben.
          </p>

          <h2>Muster-Widerrufsformular</h2>
          <p>
            (Wenn Sie den Vertrag widerrufen wollen, dann fuellen Sie bitte
            dieses Formular aus und senden Sie es zurueck.)
          </p>

          <div className="bg-gray-100 rounded-lg p-6 my-6">
            <p className="mb-2">
              An: MelodieMacher, [Ihre Adresse], E-Mail: hallo@melodiemacher.de
            </p>
            <p className="mb-2">
              Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*)
              abgeschlossenen Vertrag ueber den Kauf der folgenden Waren (*)/die
              Erbringung der folgenden Dienstleistung (*)
            </p>
            <p className="mb-2">
              Bestellt am (*)/erhalten am (*)
              ___________________________________
            </p>
            <p className="mb-2">
              Name des/der Verbraucher(s)
              ___________________________________
            </p>
            <p className="mb-2">
              Anschrift des/der Verbraucher(s)
              ___________________________________
            </p>
            <p className="mb-2">
              Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf
              Papier)
            </p>
            <p className="mb-0">Datum ___________________________________</p>
            <p className="text-sm text-gray-500 mt-4">
              (*) Unzutreffendes streichen.
            </p>
          </div>

          <h2>Fragen zum Widerruf?</h2>
          <p>
            Bei Fragen zum Widerrufsrecht kontaktieren Sie uns gerne unter:{' '}
            <a href="mailto:hallo@melodiemacher.de">hallo@melodiemacher.de</a>
          </p>

          <p className="text-sm text-gray-500 mt-8">Stand: Januar 2025</p>
        </div>
      </div>
    </div>
  );
}
