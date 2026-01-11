import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Impressum | MelodieMacher',
  description: 'Impressum und Anbieterkennzeichnung von MelodieMacher',
};

export default function ImpressumPage() {
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
          Impressum
        </h1>

        <div className="prose prose-gray max-w-none">
          <h2>Angaben gemaess § 5 TMG</h2>

          <p>
            <strong>MelodieMacher</strong>
            <br />
            Ein Service der ArchiTech AI UG (haftungsbeschraenkt)
            <br />
            Birkenallee 7
            <br />
            21436 Marschacht
            <br />
            Deutschland
          </p>

          <h2>Vertreten durch</h2>
          <p>
            Geschaeftsfuehrer: Aidan Wagener
          </p>

          <h2>Kontakt</h2>
          <p>
            E-Mail: hallo@melodiemacher.de
          </p>

          <h2>Umsatzsteuer-ID</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemaess § 27 a Umsatzsteuergesetz:
            <br />
            <em>(Die Gesellschaft befindet sich in Gruendung. Die USt-ID wird nach Eintragung ergaenzt.)</em>
          </p>

          <h2>Registereintrag</h2>
          <p>
            <em>(Die Gesellschaft befindet sich in Gruendung. Der Registereintrag wird nach Eintragung im Handelsregister ergaenzt.)</em>
          </p>

          <h2>EU-Streitschlichtung</h2>
          <p>
            Die Europaeische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{' '}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            <br />
            Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>

          <h2>Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>

          <h2>Verantwortlich fuer den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p>
            Aidan Wagener
            <br />
            Birkenallee 7
            <br />
            21436 Marschacht
          </p>

          <h2>Haftung fuer Inhalte</h2>
          <p>
            Als Diensteanbieter sind wir gemaess § 7 Abs.1 TMG fuer eigene
            Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
            verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
            jedoch nicht verpflichtet, uebermittelte oder gespeicherte fremde
            Informationen zu ueberwachen oder nach Umstaenden zu forschen, die
            auf eine rechtswidrige Taetigkeit hinweisen.
          </p>
          <p>
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
            Informationen nach den allgemeinen Gesetzen bleiben hiervon
            unberuehrt. Eine diesbezuegliche Haftung ist jedoch erst ab dem
            Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung moeglich.
            Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir
            diese Inhalte umgehend entfernen.
          </p>

          <h2>Haftung fuer Links</h2>
          <p>
            Unser Angebot enthaelt Links zu externen Websites Dritter, auf deren
            Inhalte wir keinen Einfluss haben. Deshalb koennen wir fuer diese
            fremden Inhalte auch keine Gewaehr uebernehmen. Fuer die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
            der Seiten verantwortlich. Die verlinkten Seiten wurden zum
            Zeitpunkt der Verlinkung auf moegliche Rechtsverstoesse ueberprueft.
            Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht
            erkennbar.
          </p>

          <h2>Urheberrecht</h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
            diesen Seiten unterliegen dem deutschen Urheberrecht. Die
            Vervielfaeltigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung ausserhalb der Grenzen des Urheberrechtes beduerfen der
            schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            Downloads und Kopien dieser Seite sind nur fuer den privaten, nicht
            kommerziellen Gebrauch gestattet.
          </p>
          <p>
            Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
            wurden, werden die Urheberrechte Dritter beachtet. Insbesondere
            werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie
            trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten
            wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
            Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
          </p>
        </div>
      </div>
    </div>
  );
}
