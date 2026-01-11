import Link from 'next/link';
import { Music, Mail, Shield, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="container-wide section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-gold-400 flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold">
                MelodieMacher
              </span>
            </Link>
            <p className="text-primary-200 text-sm leading-relaxed">
              Personalisierte Songs fuer jeden besonderen Moment.
              Schnell, einzigartig, unvergesslich.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-xs text-primary-300">
                <Shield className="w-4 h-4" />
                <span>SSL gesichert</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-primary-300">
                <Lock className="w-4 h-4" />
                <span>DSGVO konform</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Schnellzugriff</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#so-funktionierts"
                  className="text-primary-200 hover:text-white text-sm transition-colors"
                >
                  So funktioniert&apos;s
                </Link>
              </li>
              <li>
                <Link
                  href="#beispiele"
                  className="text-primary-200 hover:text-white text-sm transition-colors"
                >
                  Beispiele anhoeren
                </Link>
              </li>
              <li>
                <Link
                  href="#preise"
                  className="text-primary-200 hover:text-white text-sm transition-colors"
                >
                  Preise
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-primary-200 hover:text-white text-sm transition-colors"
                >
                  Haeufige Fragen
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Rechtliches</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/impressum"
                  className="text-primary-200 hover:text-white text-sm transition-colors"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="text-primary-200 hover:text-white text-sm transition-colors"
                >
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link
                  href="/agb"
                  className="text-primary-200 hover:text-white text-sm transition-colors"
                >
                  AGB
                </Link>
              </li>
              <li>
                <Link
                  href="/widerruf"
                  className="text-primary-200 hover:text-white text-sm transition-colors"
                >
                  Widerrufsbelehrung
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Kontakt</h3>
            <div className="space-y-3">
              <a
                href="mailto:hallo@melodiemacher.de"
                className="flex items-center gap-2 text-primary-200 hover:text-white text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                hallo@melodiemacher.de
              </a>
              <p className="text-primary-300 text-sm">
                Antwort innerhalb von 24 Stunden
              </p>
            </div>

            {/* Payment Methods */}
            <div className="mt-6">
              <p className="text-xs text-primary-400 mb-3">Zahlungsarten</p>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-white/10 rounded text-xs font-medium">
                  PayPal
                </div>
                <div className="px-3 py-1.5 bg-white/10 rounded text-xs font-medium">
                  Klarna
                </div>
                <div className="px-3 py-1.5 bg-white/10 rounded text-xs font-medium">
                  Karte
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-primary-400 text-sm">
              {new Date().getFullYear()} MelodieMacher. Alle Rechte vorbehalten.
            </p>
            <p className="text-primary-400 text-sm">
              Made with love in Deutschland
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
