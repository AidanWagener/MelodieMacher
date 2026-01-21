import Link from 'next/link';
import { Music, Shield, Lock } from 'lucide-react';

function LPHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <nav className="container-wide">
        <div className="flex items-center justify-center h-14 lg:h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-gold-400 flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-primary-900 group-hover:text-primary-600 transition-colors">
              MelodieMacher
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}

function LPFooter() {
  return (
    <footer className="bg-primary-900 text-white py-8">
      <div className="container-wide">
        <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
          <div className="flex items-center gap-2 text-sm text-primary-200">
            <Shield className="w-4 h-4 text-gold-400" />
            <span>100% Gaensehaut-Garantie</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-primary-200">
            <Lock className="w-4 h-4 text-gold-400" />
            <span>SSL-Verschluesselung</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-primary-400">
          <Link href="/impressum" className="hover:text-white transition-colors">
            Impressum
          </Link>
          <span>|</span>
          <Link href="/datenschutz" className="hover:text-white transition-colors">
            Datenschutz
          </Link>
          <span>|</span>
          <Link href="/agb" className="hover:text-white transition-colors">
            AGB
          </Link>
        </div>

        <p className="text-center text-primary-500 text-xs mt-4">
          {new Date().getFullYear()} MelodieMacher. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}

export default function LPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LPHeader />
      <main className="flex-1">{children}</main>
      <LPFooter />
    </>
  );
}
