import { Suspense } from 'react';
import Link from 'next/link';
import { Music, ArrowLeft } from 'lucide-react';
import { OrderForm } from '@/components/order/OrderForm';

export const metadata = {
  title: 'Song bestellen | MelodieMacher',
  description:
    'Erstelle jetzt deinen personalisierten Song. Einfach Geschichte erzaehlen, Genre waehlen und in 24 Stunden deinen Song erhalten.',
};

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white">
      {/* Simple Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container-wide py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-gold-400 flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-primary-900">
                MelodieMacher
              </span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurueck zur Startseite
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-wide py-8 lg:py-12">
        <Suspense
          fallback={
            <div className="max-w-2xl mx-auto animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-8" />
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="space-y-4">
                  <div className="h-12 bg-gray-200 rounded" />
                  <div className="h-12 bg-gray-200 rounded" />
                  <div className="h-32 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          }
        >
          <OrderForm />
        </Suspense>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-gray-100 bg-white mt-auto">
        <div className="container-wide py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p> {new Date().getFullYear()} MelodieMacher</p>
            <div className="flex items-center gap-4">
              <Link href="/impressum" className="hover:text-primary-600 transition-colors">
                Impressum
              </Link>
              <Link href="/datenschutz" className="hover:text-primary-600 transition-colors">
                Datenschutz
              </Link>
              <Link href="/agb" className="hover:text-primary-600 transition-colors">
                AGB
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
