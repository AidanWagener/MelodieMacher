'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  Copy,
  Check,
  Share2,
  MessageCircle,
  Mail,
  Facebook,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  getReferralLink,
  REFERRAL_CONFIG,
  getReferralStats,
} from '@/lib/referral';

interface ReferralWidgetProps {
  customerEmail?: string;
  referralCode?: string;
  variant?: 'full' | 'compact';
  className?: string;
}

export function ReferralWidget({
  customerEmail,
  referralCode: initialCode,
  variant = 'full',
  className = '',
}: ReferralWidgetProps) {
  const [referralCode, setReferralCode] = useState(initialCode || '');
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<{
    totalReferrals: number;
    totalEarned: number;
    availableCredits: number;
  } | null>(null);

  useEffect(() => {
    if (referralCode) {
      setReferralLink(getReferralLink(referralCode));
    } else if (customerEmail) {
      // In production, fetch or create the customer's referral code
      // const code = await getOrCreateReferralCode(customerEmail);
      const mockCode = `FREUND-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setReferralCode(mockCode);
      setReferralLink(getReferralLink(mockCode));
    }
  }, [referralCode, customerEmail]);

  useEffect(() => {
    if (customerEmail && showStats) {
      // Fetch referral stats
      getReferralStats(customerEmail).then(setStats);
    }
  }, [customerEmail, showStats]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareMessage = `Ich habe einen wunderschoenen personalisierten Song bei MelodieMacher bestellt! Mit meinem Code ${referralCode} bekommst du ${REFERRAL_CONFIG.DISCOUNT_AMOUNT / 100} Euro Rabatt auf deinen eigenen Song.`;

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareMessage + '\n\n' + referralLink)}`;
    window.open(url, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('Ein besonderes Geschenk fuer dich - 10 Euro Rabatt!');
    const body = encodeURIComponent(
      `Hallo!\n\n${shareMessage}\n\nKlicke hier, um deinen Rabatt einzuloesen:\n${referralLink}\n\nLiebe Gruesse`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  if (variant === 'compact') {
    return (
      <Card className={`p-4 bg-gradient-to-r from-gold-50 to-white border-gold-200 ${className}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
              <Gift className="w-5 h-5 text-gold-600" />
            </div>
            <div>
              <p className="font-medium text-primary-900 text-sm">Teile die Freude!</p>
              <p className="text-xs text-gray-600">
                Gib {REFERRAL_CONFIG.DISCOUNT_AMOUNT / 100} Euro, bekomme {REFERRAL_CONFIG.REWARD_AMOUNT / 100} Euro
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyLink}
              className="text-xs"
            >
              {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
              Link
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleWhatsAppShare}
              className="text-xs bg-green-50 hover:bg-green-100 border-green-200"
            >
              <MessageCircle className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-gold-400 to-gold-500 p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
          <Gift className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-display font-bold text-white mb-2">
          Teile die Freude!
        </h3>
        <p className="text-gold-100">
          Gib {REFERRAL_CONFIG.DISCOUNT_AMOUNT / 100} Euro Rabatt, bekomme {REFERRAL_CONFIG.REWARD_AMOUNT / 100} Euro Guthaben
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Referral Code Display */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Dein persoenlicher Empfehlungscode
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-mono text-lg font-bold text-primary-900 text-center">
              {referralCode || 'FREUND-XXXX'}
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={handleCopyCode}
              className="shrink-0"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Referral Link */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Oder teile diesen Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 truncate"
            />
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Kopiert!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Kopieren
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-3">
            Direkt teilen
          </label>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={handleWhatsAppShare}
              className="flex-1 min-w-[120px] bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={handleEmailShare}
              className="flex-1 min-w-[120px]"
            >
              <Mail className="w-4 h-4 mr-2" />
              E-Mail
            </Button>
            <Button
              variant="outline"
              onClick={handleFacebookShare}
              className="flex-1 min-w-[120px] bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-primary-900 mb-3 flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            So funktioniert's
          </h4>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <span>Teile deinen Code mit Freunden und Familie</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <span>Sie bekommen {REFERRAL_CONFIG.DISCOUNT_AMOUNT / 100} Euro Rabatt auf ihren ersten Song</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <span>Du erhaeltst {REFERRAL_CONFIG.REWARD_AMOUNT / 100} Euro Guthaben fuer deinen naechsten Song</span>
            </li>
          </ol>
        </div>

        {/* Stats Toggle */}
        {customerEmail && (
          <button
            onClick={() => setShowStats(!showStats)}
            className="w-full flex items-center justify-between py-2 text-sm text-primary-600 hover:text-primary-700"
          >
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Deine Empfehlungen & Guthaben
            </span>
            {showStats ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Stats Panel */}
        <AnimatePresence>
          {showStats && stats && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 mt-2">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-900">
                    {stats.totalReferrals}
                  </p>
                  <p className="text-xs text-gray-500">Empfehlungen</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gold-600">
                    {stats.availableCredits / 100} Euro
                  </p>
                  <p className="text-xs text-gray-500">Guthaben</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {stats.totalEarned / 100} Euro
                  </p>
                  <p className="text-xs text-gray-500">Gesamt verdient</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

export default ReferralWidget;
