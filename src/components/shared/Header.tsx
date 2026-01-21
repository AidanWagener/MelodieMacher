'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <nav className="container-wide">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-gold-400 flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-primary-900 group-hover:text-primary-600 transition-colors">
              MelodieMacher
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#so-funktionierts"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              So funktioniert&apos;s
            </Link>
            <Link
              href="/echte-geschichten"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              Echte Geschichten
            </Link>
            <Link
              href="#preise"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              Preise
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              FAQ
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button asChild>
              <Link href="/bestellen">Jetzt Song erstellen</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300',
            mobileMenuOpen ? 'max-h-80 pb-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-4 pt-4">
            <Link
              href="#so-funktionierts"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              So funktioniert&apos;s
            </Link>
            <Link
              href="/echte-geschichten"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Echte Geschichten
            </Link>
            <Link
              href="#preise"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Preise
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Button asChild className="mt-2">
              <Link href="/bestellen">Jetzt Song erstellen</Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
