import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
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
  Share2,
  CheckCircle,
  Gift,
} from 'lucide-react';

// Server-side Supabase client
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase not configured');
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

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
}

export async function generateMetadata({ params }: { params: { orderNumber: string } }): Promise<Metadata> {
  return {
    title: `Dein Song ist fertig! | MelodieMacher`,
    description: 'Lade deinen personalisierten Song herunter.',
  };
}

async function getOrderData(orderNumber: string): Promise<{ order: Order | null; deliverables: Deliverable[] }> {
  try {
    const supabase = getSupabaseAdmin();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('order_number, recipient_name, occasion, customer_name, genre, delivered_at')
      .eq('order_number', orderNumber)
      .eq('status', 'delivered')
      .single();

    if (orderError || !order) {
      return { order: null, deliverables: [] };
    }

    const { data: fullOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('order_number', orderNumber)
      .single();

    if (!fullOrder) {
      return { order: null, deliverables: [] };
    }

    const { data: deliverables } = await supabase
      .from('deliverables')
      .select('id, type, file_url, file_name')
      .eq('order_id', fullOrder.id);

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

const occasionLabels: Record<string, string> = {
  hochzeit: 'Hochzeit',
  geburtstag: 'Geburtstag',
  jubilaeum: 'Jubilaeum',
  firma: 'Firmenfeier',
  taufe: 'Taufe',
  andere: 'Besonderer Anlass',
};

export default async function DownloadPage({ params }: { params: { orderNumber: string } }) {
  const { order, deliverables } = await getOrderData(params.orderNumber);

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <Music className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Download nicht verfuegbar</h1>
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

  const songTitle = `Song fuer ${order.recipient_name}`;
  const mp3 = deliverables.find(d => d.type === 'mp3');

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-gold-400 flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-primary-900">
              MelodieMacher
            </span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-primary-900 mb-4">
            Dein Song ist fertig!
          </h1>
          <p className="text-lg text-gray-600">
            {songTitle} - {occasionLabels[order.occasion] || order.occasion}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Bestellnummer: {order.order_number}
          </p>
        </div>

        {/* Main Download Card */}
        {mp3 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Album Art Placeholder */}
              <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-primary-600 to-gold-400 flex items-center justify-center shadow-lg">
                {deliverables.find(d => d.type === 'png') ? (
                  <img
                    src={deliverables.find(d => d.type === 'png')?.file_url}
                    alt="Album Cover"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <Music className="w-20 h-20 text-white" />
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-primary-900 mb-2">{songTitle}</h2>
                <p className="text-gray-600 mb-6">
                  Ein einzigartiger Song, erstellt mit Liebe fuer {order.recipient_name}
                </p>

                <a
                  href={mp3.file_url}
                  download={mp3.file_name}
                  className="inline-flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-600/25"
                >
                  <Download className="w-6 h-6" />
                  Song herunterladen
                </a>
              </div>
            </div>
          </div>
        )}

        {/* All Deliverables */}
        {deliverables.length > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">
              Alle Dateien
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
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                  >
                    <div className={`p-3 rounded-lg ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{config.label}</p>
                      <p className="text-sm text-gray-500 truncate">{deliverable.file_name}</p>
                    </div>
                    <Download className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center">
          <Gift className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h3 className="text-xl font-bold mb-2">Teile die Freude!</h3>
          <p className="opacity-90 mb-6">
            Hat dir dein Song gefallen? Empfehle uns weiter und erhalte 10 EUR Rabatt auf deine naechste Bestellung!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`https://wa.me/?text=Ich%20habe%20einen%20personalisierten%20Song%20bei%20MelodieMacher%20bestellt%20-%20schau%20dir%20das%20an!%20https://melodiemacher.de`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=https://melodiemacher.de`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Facebook
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>
            Bei Fragen kontaktiere uns unter{' '}
            <a href="mailto:hallo@melodiemacher.de" className="text-primary-600 hover:underline">
              hallo@melodiemacher.de
            </a>
          </p>
          <p className="mt-2">
            <Heart className="w-4 h-4 inline text-red-500" /> Danke, dass du MelodieMacher gewaehlt hast!
          </p>
        </div>
      </main>
    </div>
  );
}
