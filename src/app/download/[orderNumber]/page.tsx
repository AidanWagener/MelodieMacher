import { Metadata } from 'next';
import Link from 'next/link';
import {
  Music,
  Download,
  FileAudio,
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  Heart,
  Sparkles,
  Gift,
} from 'lucide-react';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { OCCASION_LABELS } from '@/lib/constants';
import { AudioPlayer } from '@/components/download/AudioPlayer';
import { ShareButtons } from '@/components/download/ShareButtons';
import { StorySection } from '@/components/download/StorySection';

interface Deliverable {
  id: string;
  type: 'mp3' | 'mp4' | 'pdf' | 'png' | 'wav';
  file_url: string;
  file_name: string;
}

interface Order {
  order_number: string;
  recipient_name: string;
  occasion: string;
  customer_name: string;
  genre: string;
  delivered_at: string;
  story?: string;
}

export async function generateMetadata({ params }: { params: { orderNumber: string } }): Promise<Metadata> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.melodiemacher.de';

  try {
    const supabase = getSupabaseAdmin();

    const { data: order } = await supabase
      .from('orders')
      .select('order_number, recipient_name, occasion')
      .eq('order_number', params.orderNumber)
      .eq('status', 'delivered')
      .single();

    if (!order) {
      return {
        title: 'Song nicht gefunden | MelodieMacher',
        description: 'Dieser Song konnte nicht gefunden werden.',
      };
    }

    const occasionText = OCCASION_LABELS[order.occasion] || order.occasion;
    const title = `Song für ${order.recipient_name} | MelodieMacher`;
    const description = `Ein einzigartiger Song zum ${occasionText} - erstellt mit Liebe von MelodieMacher`;
    const ogImageUrl = `${appUrl}/api/og/${params.orderNumber}`;

    return {
      title,
      description,
      openGraph: {
        title: `🎵 Song für ${order.recipient_name}`,
        description,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `Song für ${order.recipient_name}`,
          },
        ],
        type: 'music.song',
        siteName: 'MelodieMacher',
      },
      twitter: {
        card: 'summary_large_image',
        title: `🎵 Song für ${order.recipient_name}`,
        description,
        images: [ogImageUrl],
      },
    };
  } catch {
    return {
      title: 'Dein Song ist fertig! | MelodieMacher',
      description: 'Lade deinen personalisierten Song herunter.',
    };
  }
}

async function getOrderData(orderNumber: string): Promise<{ order: Order | null; deliverables: Deliverable[] }> {
  try {
    const supabase = getSupabaseAdmin();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, order_number, recipient_name, occasion, customer_name, genre, delivered_at, story')
      .eq('order_number', orderNumber)
      .eq('status', 'delivered')
      .single();

    if (orderError || !order) {
      return { order: null, deliverables: [] };
    }

    const { data: deliverables } = await supabase
      .from('deliverables')
      .select('id, type, file_url, file_name')
      .eq('order_id', order.id);

    return { order, deliverables: deliverables || [] };
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return { order: null, deliverables: [] };
  }
}

const deliverableConfig: Record<string, { label: string; icon: typeof FileAudio; color: string }> = {
  mp3: { label: 'MP3 Song', icon: FileAudio, color: 'bg-green-100 text-green-700' },
  mp4: { label: 'Lyric Video', icon: Video, color: 'bg-purple-100 text-purple-700' },
  pdf: { label: 'Songtext PDF', icon: FileText, color: 'bg-blue-100 text-blue-700' },
  png: { label: 'Album Cover', icon: ImageIcon, color: 'bg-pink-100 text-pink-700' },
  wav: { label: 'Instrumental', icon: Mic, color: 'bg-orange-100 text-orange-700' },
};

export default async function DownloadPage({ params }: { params: { orderNumber: string } }) {
  const { order, deliverables } = await getOrderData(params.orderNumber);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.melodiemacher.de';

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <Music className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Download nicht verfügbar</h1>
          <p className="text-gray-600 mb-6">
            Diese Bestellung wurde nicht gefunden oder ist noch nicht bereit.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  const songTitle = `Song für ${order.recipient_name}`;
  const mp3 = deliverables.find(d => d.type === 'mp3');
  const coverImage = deliverables.find(d => d.type === 'png');
  const occasionText = OCCASION_LABELS[order.occasion] || order.occasion;
  const shareUrl = `${appUrl}/download/${order.order_number}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with blurred background */}
      <div className="relative overflow-hidden">
        {/* Blurred background image */}
        {coverImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${coverImage.file_url})`,
              filter: 'blur(40px)',
              transform: 'scale(1.2)',
              opacity: 0.6,
            }}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 via-primary-900/90 to-primary-900" />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <header className="border-b border-white/10">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-display font-bold text-white">
                  MelodieMacher
                </span>
              </Link>
            </div>
          </header>

          {/* Hero content */}
          <div className="max-w-4xl mx-auto px-4 py-12 lg:py-20">
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-gold-400/20 text-gold-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Dein Song ist fertig!
              </div>

              <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4">
                {songTitle}
              </h1>

              <p className="text-xl text-white/80">
                Ein einzigartiger Song zum {occasionText}
              </p>
            </div>

            {/* Album art + Player */}
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Album Cover */}
              <div className="flex justify-center animate-slide-up">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-gold-400 to-primary-400 rounded-3xl opacity-30 blur-xl group-hover:opacity-50 transition-opacity" />
                  <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-2xl shadow-2xl overflow-hidden">
                    {coverImage ? (
                      <img
                        src={coverImage.file_url}
                        alt="Album Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-600 to-gold-400 flex items-center justify-center">
                        <Music className="w-24 h-24 text-white/80" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Audio Player */}
              {mp3 && (
                <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
                  <AudioPlayer
                    src={mp3.file_url}
                    title={songTitle}
                    artist="MelodieMacher"
                    coverUrl={coverImage?.file_url}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Download button */}
        {mp3 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Bereit zum Herunterladen
            </h2>
            <p className="text-gray-600 mb-6">
              Speichere deinen Song und teile ihn mit {order.recipient_name}!
            </p>
            <a
              href={mp3.file_url}
              download={mp3.file_name}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105 active:scale-95"
            >
              <Download className="w-6 h-6" />
              Song herunterladen (MP3)
            </a>
          </div>
        )}

        {/* Story Section */}
        {order.story && (
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <StorySection
              story={order.story}
              recipientName={order.recipient_name}
              occasion={occasionText}
              customerName={order.customer_name}
            />
          </div>
        )}

        {/* All Deliverables */}
        {deliverables.length > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary-600" />
              Alle Dateien in deinem Paket
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {deliverables.map((deliverable) => {
                const config = deliverableConfig[deliverable.type] || deliverableConfig.mp3;
                const Icon = config.icon;

                return (
                  <a
                    key={deliverable.id}
                    href={deliverable.file_url}
                    download={deliverable.file_name}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                  >
                    <div className={`p-3 rounded-lg ${config.color} transition-transform group-hover:scale-110`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{config.label}</p>
                      <p className="text-sm text-gray-500 truncate">{deliverable.file_name}</p>
                    </div>
                    <Download className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="bg-gradient-to-br from-primary-50 to-gold-50 rounded-2xl p-8 border border-primary-100 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Teile die Freude! 🎉
            </h3>
            <p className="text-gray-600">
              Zeige deinen Freunden diesen einzigartigen Song
            </p>
          </div>

          <ShareButtons
            url={shareUrl}
            title={`🎵 ${songTitle} - Ein personalisierter Song von MelodieMacher`}
            description={`Schau dir diesen wunderschönen Song an, der zum ${occasionText} erstellt wurde!`}
          />
        </div>

        {/* Referral CTA */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center animate-fade-in" style={{ animationDelay: '400ms' }}>
          <Gift className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h3 className="text-xl font-bold mb-2">Noch einen Song verschenken?</h3>
          <p className="opacity-90 mb-6">
            Erhalte <span className="font-bold text-gold-300">10€ Rabatt</span> auf deine nächste Bestellung mit dem Code: <span className="font-mono bg-white/20 px-2 py-1 rounded">DANKE10</span>
          </p>
          <Link
            href="/bestellen"
            className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            <Music className="w-5 h-5" />
            Neuen Song bestellen
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm pt-8">
          <p>
            Bei Fragen kontaktiere uns unter{' '}
            <a href="mailto:hallo@melodiemacher.de" className="text-primary-600 hover:underline">
              hallo@melodiemacher.de
            </a>
          </p>
          <p className="mt-2 flex items-center justify-center gap-1">
            <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
            Danke, dass du MelodieMacher gewählt hast!
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Bestellnummer: {order.order_number}
          </p>
        </div>
      </main>

    </div>
  );
}
