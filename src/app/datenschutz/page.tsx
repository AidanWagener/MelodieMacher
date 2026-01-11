import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Datenschutzerklaerung | MelodieMacher',
  description: 'Datenschutzerklaerung von MelodieMacher',
};

export default function DatenschutzPage() {
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
          Datenschutzerklaerung
        </h1>

        <div className="prose prose-gray max-w-none">
          <h2>1. Datenschutz auf einen Blick</h2>

          <h3>Allgemeine Hinweise</h3>
          <p>
            Die folgenden Hinweise geben einen einfachen Ueberblick darueber,
            was mit Ihren personenbezogenen Daten passiert, wenn Sie diese
            Website besuchen. Personenbezogene Daten sind alle Daten, mit denen
            Sie persoenlich identifiziert werden koennen.
          </p>

          <h3>Datenerfassung auf dieser Website</h3>
          <p>
            <strong>
              Wer ist verantwortlich fuer die Datenerfassung auf dieser Website?
            </strong>
          </p>
          <p>
            Die Datenverarbeitung auf dieser Website erfolgt durch den
            Websitebetreiber. Dessen Kontaktdaten koennen Sie dem Impressum
            dieser Website entnehmen.
          </p>

          <p>
            <strong>Wie erfassen wir Ihre Daten?</strong>
          </p>
          <p>
            Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese
            mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in
            ein Kontaktformular eingeben.
          </p>
          <p>
            Andere Daten werden automatisch oder nach Ihrer Einwilligung beim
            Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor
            allem technische Daten (z.B. Internetbrowser, Betriebssystem oder
            Uhrzeit des Seitenaufrufs).
          </p>

          <p>
            <strong>Wofuer nutzen wir Ihre Daten?</strong>
          </p>
          <p>
            Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung
            der Website zu gewaehrleisten. Andere Daten koennen zur Analyse
            Ihres Nutzerverhaltens verwendet werden.
          </p>

          <p>
            <strong>Welche Rechte haben Sie bezueglich Ihrer Daten?</strong>
          </p>
          <p>
            Sie haben jederzeit das Recht, unentgeltlich Auskunft ueber
            Herkunft, Empfaenger und Zweck Ihrer gespeicherten personenbezogenen
            Daten zu erhalten. Sie haben ausserdem ein Recht, die Berichtigung
            oder Loeschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung
            zur Datenverarbeitung erteilt haben, koennen Sie diese Einwilligung
            jederzeit fuer die Zukunft widerrufen. Ausserdem haben Sie das
            Recht, unter bestimmten Umstaenden die Einschraenkung der
            Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
          </p>

          <h2>2. Hosting</h2>
          <p>
            Wir hosten die Inhalte unserer Website bei Vercel Inc. (340 S Lemon
            Ave #4133, Walnut, CA 91789, USA). Vercel ist ein
            Cloud-Hosting-Anbieter, der unsere Website auf seinen Servern
            bereitstellt.
          </p>

          <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>

          <h3>Datenschutz</h3>
          <p>
            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persoenlichen
            Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten
            vertraulich und entsprechend den gesetzlichen
            Datenschutzvorschriften sowie dieser Datenschutzerklaerung.
          </p>

          <h3>Hinweis zur verantwortlichen Stelle</h3>
          <p>
            Die verantwortliche Stelle fuer die Datenverarbeitung auf dieser
            Website ist:
          </p>
          <p>
            MelodieMacher
            <br />
            ArchiTech AI UG (haftungsbeschraenkt)
            <br />
            Birkenallee 7
            <br />
            21436 Marschacht
            <br />
            Deutschland
            <br />
            Geschaeftsfuehrer: Aidan Wagener
            <br />
            E-Mail: hallo@melodiemacher.de
          </p>

          <h3>Speicherdauer</h3>
          <p>
            Soweit innerhalb dieser Datenschutzerklaerung keine speziellere
            Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten
            bei uns, bis der Zweck fuer die Datenverarbeitung entfaellt. Wenn
            Sie ein berechtigtes Loeschersuchen geltend machen oder eine
            Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten
            geloescht, sofern wir keine anderen rechtlich zulaessigen Gruende
            fuer die Speicherung Ihrer personenbezogenen Daten haben.
          </p>

          <h2>4. Datenerfassung auf dieser Website</h2>

          <h3>Cookies</h3>
          <p>
            Unsere Internetseiten verwenden so genannte Cookies. Cookies
            sind kleine Datenpakete und richten auf Ihrem Endgeraet keinen
            Schaden an. Sie werden entweder voruebergehend fuer die Dauer einer
            Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf
            Ihrem Endgeraet gespeichert.
          </p>
          <p>
            Sie koennen Ihren Browser so einstellen, dass Sie ueber das Setzen
            von Cookies informiert werden und Cookies nur im Einzelfall
            erlauben, die Annahme von Cookies fuer bestimmte Faelle oder
            generell ausschliessen sowie das automatische Loeschen der Cookies
            beim Schliessen des Browsers aktivieren.
          </p>

          <h3>Kontaktformular und Bestellformular</h3>
          <p>
            Wenn Sie uns per Kontaktformular oder Bestellformular Anfragen
            zukommen lassen, werden Ihre Angaben aus dem Anfrageformular
            inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks
            Bearbeitung der Anfrage und fuer den Fall von Anschlussfragen bei
            uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung
            weiter.
          </p>

          <h2>5. Zahlungsabwicklung</h2>

          <h3>Stripe</h3>
          <p>
            Fuer die Zahlungsabwicklung nutzen wir den Dienst Stripe (Stripe
            Inc., 510 Townsend Street, San Francisco, CA 94103, USA). Stripe ist
            ein Zahlungsdienstleister, der die sichere Abwicklung von
            Online-Zahlungen ermoeglicht.
          </p>
          <p>
            Bei der Zahlung werden Ihre Zahlungsdaten (z.B. Kreditkartendaten)
            direkt an Stripe uebermittelt. Wir haben keinen Zugriff auf diese
            Daten. Die Datenschutzerklaerung von Stripe finden Sie unter:{' '}
            <a
              href="https://stripe.com/de/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://stripe.com/de/privacy
            </a>
          </p>

          <h2>6. E-Mail-Kommunikation</h2>
          <p>
            Fuer den Versand von E-Mails nutzen wir den Dienst Resend. Ihre
            E-Mail-Adresse wird ausschliesslich fuer die Kommunikation im
            Zusammenhang mit Ihrer Bestellung verwendet.
          </p>

          <h2>7. Ihre Rechte</h2>
          <p>Sie haben folgende Rechte:</p>
          <ul>
            <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
            <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
            <li>Recht auf Loeschung (Art. 17 DSGVO)</li>
            <li>Recht auf Einschraenkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Recht auf Datenuebertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
          </ul>
          <p>
            Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen
            das Datenschutzrecht verstoesst, haben Sie das Recht, bei einer
            Aufsichtsbehoerde Beschwerde einzulegen.
          </p>

          <p className="text-sm text-gray-500 mt-8">
            Stand: Januar 2025
          </p>
        </div>
      </div>
    </div>
  );
}
