import { Metadata } from 'next';
import Link from 'next/link';
import {
  Music,
  Download,
  Share2,
  Heart,
  FileText,
  Play,
  ExternalLink,
  Video,
  Calendar,
  Gift,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReferralWidget } from '@/components/referral/ReferralWidget';
import { OccasionReminderSignup } from '@/components/song/OccasionReminderSignup';
import { ReactionVideoPrompt } from '@/components/song/ReactionVideoPrompt';
import { SimilarOccasions } from '@/components/song/SimilarOccasions';
import { SocialShareButtons } from '@/components/song/SocialShareButtons';
import { VipBadge } from '@/components/shared/VipBadge';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // In production, fetch song data for dynamic metadata
  const song = await getSongData(params.id);

  return {
    title: `${song.title} | MelodieMacher`,
    description: `Ein personalisierter Song fuer ${song.recipientName}. Hoere und lade deinen einzigartigen Song herunter.`,
    openGraph: {
      title: `Ein persoenlicher Song fuer ${song.recipientName}!`,
      description:
        'Jemand hat dir einen ganz besonderen Song geschenkt. Hoer ihn dir an!',
      images: [song.files.cover || '/images/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Ein persoenlicher Song fuer ${song.recipientName}!`,
      description: 'Ein einzigartiger, personalisierter Song nur fuer dich.',
    },
  };
}

// This would normally fetch from database
async function getSongData(id: string) {
  // Placeholder data - in production this would fetch from Supabase
  return {
    id,
    title: 'Fuer immer Dein',
    recipientName: 'Lisa',
    occasion: 'Hochzeit',
    occasionDate: '2024-06-15',
    genre: 'Pop',
    mood: 'Emotional',
    customerEmail: 'kunde@example.com',
    customerName: 'Max',
    createdAt: new Date().toISOString(),
    orderId: 'ORD-2024-001',
    files: {
      mp3: `/songs/${id}/song.mp3`,
      lyrics: `/songs/${id}/lyrics.pdf`,
      cover: `/songs/${id}/cover.jpg`,
      video: `/songs/${id}/video.mp4`,
    },
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    referralCode: 'FREUND-ABCD',
    isVip: false,
  };
}

export default async function SongDeliveryPage({ params }: Props) {
  const song = await getSongData(params.id);
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://melodiemacher.de'}/song/${song.id}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container-wide py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-gold-400 flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-primary-900">
                MelodieMacher
              </span>
            </Link>
            {song.isVip && <VipBadge />}
          </div>
        </div>
      </header>

      <main className="container-narrow py-12 lg:py-16">
        {/* Song Card */}
        <Card className="p-6 lg:p-8 mb-8">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              {song.occasion}
            </Badge>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-primary-900 mb-2">
              {song.title}
            </h1>
            <p className="text-lg text-gray-600">
              Ein personalisierter Song fuer{' '}
              <span className="font-semibold text-primary-700">
                {song.recipientName}
              </span>
            </p>
          </div>

          {/* Audio Player Placeholder */}
          <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-8 mb-8">
            <div className="flex flex-col items-center text-center">
              {/* Cover Art Placeholder */}
              <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center mb-6 shadow-2xl">
                <Music className="w-16 h-16 text-white" />
              </div>

              {/* Play Button */}
              <button className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-lg hover:scale-105 transition-transform">
                <Play className="w-7 h-7 text-primary-900 ml-1" fill="currentColor" />
              </button>

              {/* Waveform */}
              <div className="flex items-center justify-center gap-1 h-12 w-full max-w-md mb-4">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-white/40 rounded-full"
                    style={{
                      height: `${Math.random() * 100}%`,
                      minHeight: '20%',
                    }}
                  />
                ))}
              </div>

              {/* Tags */}
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                  {song.genre}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                  {song.mood}
                </span>
              </div>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <Button size="lg" className="h-14">
              <Download className="w-5 h-5 mr-2" />
              MP3 herunterladen
            </Button>
            <Button size="lg" variant="outline" className="h-14">
              <FileText className="w-5 h-5 mr-2" />
              Lyrics (PDF)
            </Button>
          </div>

          {/* Video Download (if available) */}
          {song.files.video && (
            <div className="mb-8">
              <Button variant="outline" className="w-full h-12">
                <Video className="w-5 h-5 mr-2" />
                Video mit Lyrics herunterladen
              </Button>
            </div>
          )}

          {/* Enhanced Social Share Section */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-medium text-primary-900 mb-4 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Teile diesen Song
            </h3>
            <SocialShareButtons
              url={shareUrl}
              title={`${song.title} - Ein personalisierter Song fuer ${song.recipientName}`}
              description={`Hoer dir diesen einzigartigen Song an, der speziell fuer ${song.recipientName} erstellt wurde!`}
            />
          </div>
        </Card>

        {/* Reaction Video Prompt */}
        <ReactionVideoPrompt
          recipientName={song.recipientName}
          songTitle={song.title}
          className="mb-8"
        />

        {/* Occasion Reminder Signup */}
        <OccasionReminderSignup
          customerEmail={song.customerEmail}
          customerName={song.customerName}
          recipientName={song.recipientName}
          occasion={song.occasion}
          occasionDate={song.occasionDate}
          orderId={song.orderId}
          className="mb-8"
        />

        {/* Referral Widget */}
        <ReferralWidget
          customerEmail={song.customerEmail}
          referralCode={song.referralCode}
          className="mb-8"
        />

        {/* Similar Occasions - Cross-sell */}
        <SimilarOccasions
          currentOccasion={song.occasion}
          recipientName={song.recipientName}
          className="mb-8"
        />

        {/* Info Box */}
        <Card className="p-6 bg-primary-50 border-primary-100 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium text-primary-900 mb-1">
                Hat dir dein Song gefallen?
              </h3>
              <p className="text-sm text-primary-700 mb-4">
                Wenn du zufrieden bist, wuerde uns eine Bewertung sehr helfen!
                Oder erstelle gleich einen Song fuer jemand anderen.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://trustpilot.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Bewertung schreiben
                  </a>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/bestellen">Weiteren Song erstellen</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Expiry Notice */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Diese Seite ist 30 Tage gueltig. Download deinen Song rechtzeitig!
        </p>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white mt-auto">
        <div className="container-wide py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p> {new Date().getFullYear()} MelodieMacher</p>
            <div className="flex items-center gap-4">
              <Link
                href="/impressum"
                className="hover:text-primary-600 transition-colors"
              >
                Impressum
              </Link>
              <Link
                href="/datenschutz"
                className="hover:text-primary-600 transition-colors"
              >
                Datenschutz
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
