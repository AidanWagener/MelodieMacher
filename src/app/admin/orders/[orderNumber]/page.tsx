'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Music,
  Eye,
  RefreshCw,
  Mail,
  User,
  Heart,
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  Gift,
  Zap,
  Copy,
  Check,
  Send,
  Loader2,
  Download,
  Trash2,
  Upload,
  Wand2,
  ExternalLink,
  FileAudio,
  Globe,
  X,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast, ConfirmDialog } from '../../layout';

interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'paid' | 'in_production' | 'quality_review' | 'delivered' | 'refunded';
  customer_email: string;
  customer_name: string;
  recipient_name: string;
  occasion: string;
  relationship: string;
  story: string;
  genre: string;
  mood: number;
  allow_english: boolean;
  package_type: string;
  selected_bundle: string;
  bump_karaoke: boolean;
  bump_rush: boolean;
  bump_gift: boolean;
  has_custom_lyrics: boolean;
  custom_lyrics: string | null;
  base_price: number;
  total_price: number;
  stripe_session_id: string;
  stripe_payment_intent_id: string | null;
  delivery_url: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Deliverable {
  id: string;
  order_id: string;
  type: 'mp3' | 'mp4' | 'pdf' | 'png' | 'wav';
  file_url: string;
  file_name: string;
  created_at: string;
}

const statusConfig = {
  pending: { label: 'Wartend', color: 'bg-gray-100 text-gray-700', icon: Clock },
  paid: { label: 'Bezahlt', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  in_production: { label: 'In Produktion', color: 'bg-blue-100 text-blue-700', icon: Music },
  quality_review: { label: 'QA Review', color: 'bg-purple-100 text-purple-700', icon: Eye },
  delivered: { label: 'Geliefert', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  refunded: { label: 'Erstattet', color: 'bg-red-100 text-red-700', icon: RefreshCw },
};

const genreLabels: Record<string, string> = {
  pop: 'Pop',
  rock: 'Rock',
  schlager: 'Schlager',
  akustik: 'Akustik/Folk',
  hiphop: 'Hip-Hop',
  klassik: 'Klassisch',
  kinder: 'Kinderlied',
  electronic: 'Electronic',
  jazz: 'Jazz',
  volksmusik: 'Volksmusik',
};

const occasionLabels: Record<string, string> = {
  hochzeit: 'Hochzeit',
  geburtstag: 'Geburtstag',
  jubilaeum: 'Jubilaeum',
  firma: 'Firmenfeier',
  taufe: 'Taufe',
  andere: 'Anderer Anlass',
};

const moodLabels = ['Melancholisch', 'Sanft', 'Ausgeglichen', 'Froehlich', 'Energetisch'];

// Lyrics Input Modal Component
function LyricsModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lyrics: string) => void;
  isLoading: boolean;
}) {
  const [lyrics, setLyrics] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Lyrics fuer PDF eingeben</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Gib die Lyrics des Songs ein. Verwende Zeilen wie [Verse], [Chorus], [Bridge] fuer Abschnitte.
        </p>
        <textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none font-mono text-sm"
          placeholder={`[Verse 1]
Hier kommt der erste Vers...

[Chorus]
Der Refrain geht so...

[Verse 2]
Zweiter Vers...`}
        />
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Abbrechen
          </Button>
          <Button onClick={() => onSubmit(lyrics)} disabled={!lyrics.trim() || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generiere PDF...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                PDF generieren
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Video Info Modal Component
function VideoInfoModal({
  isOpen,
  onClose,
  mp3Url,
  coverUrl,
  songTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  mp3Url?: string;
  coverUrl?: string;
  songTitle: string;
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyInfo = async () => {
    const text = `Video fuer: ${songTitle}
MP3: ${mp3Url || 'Nicht verfuegbar'}
Cover: ${coverUrl || 'Nicht verfuegbar'}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Lyric Video erstellen</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Automatische Generierung kommt bald!</p>
              <p>Nutze fuer jetzt Canva oder CapCut um das Video zu erstellen.</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">Song Titel</label>
            <p className="text-sm text-gray-900">{songTitle}</p>
          </div>
          {mp3Url && (
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">MP3 URL</label>
              <a href={mp3Url} target="_blank" className="text-sm text-primary-600 hover:underline block truncate">
                {mp3Url}
              </a>
            </div>
          )}
          {coverUrl && (
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Cover URL</label>
              <a href={coverUrl} target="_blank" className="text-sm text-primary-600 hover:underline block truncate">
                {coverUrl}
              </a>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-2">Schnellanleitung:</h4>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Oeffne canva.com/create/videos</li>
            <li>Waehle "Video" Format (1:1 oder 16:9)</li>
            <li>Lade das Album Cover als Hintergrund hoch</li>
            <li>Fuege die MP3 als Audio hinzu</li>
            <li>Nutze "Auto Captions" fuer Lyrics</li>
            <li>Exportiere als MP4</li>
          </ol>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={copyInfo}>
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Kopiert!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Infos kopieren
              </>
            )}
          </Button>
          <Button onClick={onClose}>Schliessen</Button>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const orderNumber = params.orderNumber as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [copiedStory, setCopiedStory] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [delivering, setDelivering] = useState(false);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Modal states
  const [lyricsModalOpen, setLyricsModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Confirmation dialog states
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: '',
    name: '',
  });
  const [deliverConfirm, setDeliverConfirm] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}`);

      if (response.status === 401) {
        addToast('Sitzung abgelaufen. Bitte neu anmelden.', 'error');
        router.push('/admin');
        return;
      }

      const data = await response.json();

      if (data.order) {
        setOrder(data.order);
        setDeliverables(data.deliverables || []);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
      addToast('Fehler beim Laden der Bestellung', 'error');
    } finally {
      setLoading(false);
    }
  }, [orderNumber, addToast, router]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const updateStatus = async (newStatus: Order['status']) => {
    if (!order) return;
    setUpdating(true);

    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrder({ ...order, status: newStatus });
        addToast(`Status geaendert zu "${statusConfig[newStatus].label}"`, 'success');
      } else {
        addToast('Fehler beim Aktualisieren des Status', 'error');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      addToast('Fehler beim Aktualisieren des Status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const copyStory = async () => {
    if (!order) return;

    const storyText = `SONG FUER: ${order.recipient_name}
ANLASS: ${occasionLabels[order.occasion] || order.occasion}
BEZIEHUNG: ${order.relationship}
GENRE: ${genreLabels[order.genre] || order.genre}
STIMMUNG: ${moodLabels[order.mood - 1]} (${order.mood}/5)
${order.allow_english ? 'SPRACHE: Englisch erlaubt' : 'SPRACHE: Nur Deutsch'}

GESCHICHTE:
${order.story}

${order.has_custom_lyrics && order.custom_lyrics ? `EIGENE LYRICS:
${order.custom_lyrics}` : ''}`;

    await navigator.clipboard.writeText(storyText);
    setCopiedStory(true);
    addToast('Geschichte fuer Suno kopiert', 'success');
    setTimeout(() => setCopiedStory(false), 2000);
  };

  const handleFileUpload = async (type: string, file: File) => {
    if (!order) return;
    setUploadingType(type);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('orderId', order.id);
      formData.append('type', type);

      // Simulate progress for UX (real progress would require XHR)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const data = await response.json();
        setDeliverables([...deliverables, data.deliverable]);
        addToast(`${file.name} erfolgreich hochgeladen`, 'success');
      } else {
        const error = await response.json();
        addToast(error.error || 'Upload fehlgeschlagen', 'error');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      addToast('Upload fehlgeschlagen', 'error');
    } finally {
      setUploadingType(null);
      setUploadProgress(0);
    }
  };

  const generateCover = async () => {
    if (!order) return;
    setGenerating('cover');

    try {
      const response = await fetch('/api/admin/generate/cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, orderNumber: order.order_number }),
      });

      const data = await response.json();

      if (response.ok && data.deliverable) {
        setDeliverables([...deliverables, data.deliverable]);
        addToast('Album Cover erfolgreich generiert', 'success');
      } else {
        addToast(data.error || 'Cover-Generierung fehlgeschlagen', 'error');
      }
    } catch (error) {
      console.error('Cover generation failed:', error);
      addToast('Cover-Generierung fehlgeschlagen', 'error');
    } finally {
      setGenerating(null);
    }
  };

  const generatePDF = async (lyrics: string) => {
    if (!order) return;
    setGenerating('pdf');

    try {
      const response = await fetch('/api/admin/generate/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: order.order_number,
          lyrics
        }),
      });

      const data = await response.json();

      if (response.ok && data.deliverable) {
        setDeliverables([...deliverables, data.deliverable]);
        addToast('Lyrics PDF erfolgreich generiert', 'success');
        setLyricsModalOpen(false);
      } else {
        addToast(data.error || 'PDF-Generierung fehlgeschlagen', 'error');
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
      addToast('PDF-Generierung fehlgeschlagen', 'error');
    } finally {
      setGenerating(null);
    }
  };

  const confirmDelete = (deliverable: Deliverable) => {
    const labels: Record<string, string> = {
      mp3: 'MP3 Song',
      pdf: 'Lyrics PDF',
      png: 'Album Cover',
      mp4: 'Lyric Video',
      wav: 'Instrumental',
    };
    setDeleteConfirm({
      isOpen: true,
      id: deliverable.id,
      name: labels[deliverable.type] || deliverable.type,
    });
  };

  const deleteDeliverable = async () => {
    const deliverableId = deleteConfirm.id;
    setDeleteConfirm({ isOpen: false, id: '', name: '' });

    try {
      const response = await fetch(`/api/admin/deliverables/${deliverableId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDeliverables(deliverables.filter(d => d.id !== deliverableId));
        addToast('Deliverable geloescht', 'success');
      } else {
        addToast('Loeschen fehlgeschlagen', 'error');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      addToast('Loeschen fehlgeschlagen', 'error');
    }
  };

  const confirmDelivery = () => {
    setDeliverConfirm(true);
  };

  const deliverOrder = async () => {
    if (!order) return;
    setDeliverConfirm(false);
    setDelivering(true);

    try {
      const response = await fetch('/api/admin/deliver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: order.order_number }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrder({
          ...order,
          status: 'delivered',
          delivery_url: data.deliveryUrl,
          delivered_at: new Date().toISOString()
        });
        addToast(`Song erfolgreich an ${order.customer_email} geliefert!`, 'success');
      } else {
        addToast(data.error || 'Lieferung fehlgeschlagen', 'error');
      }
    } catch (error) {
      console.error('Delivery failed:', error);
      addToast('Lieferung fehlgeschlagen', 'error');
    } finally {
      setDelivering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Bestellung nicht gefunden</p>
        <Link href="/admin" className="text-primary-600 hover:underline mt-2 inline-block">
          Zurueck zur Uebersicht
        </Link>
      </div>
    );
  }

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  // Determine required deliverables based on package
  const requiredDeliverables = {
    mp3: true,
    pdf: order.package_type !== 'basis',
    png: order.package_type !== 'basis',
    mp4: order.package_type === 'premium',
    wav: order.package_type === 'premium' || order.bump_karaoke,
  };

  const hasDeliverable = (type: string) => deliverables.some(d => d.type === type);
  const getDeliverable = (type: string) => deliverables.find(d => d.type === type);

  const allRequiredDeliverablesMet = Object.entries(requiredDeliverables)
    .filter(([, required]) => required)
    .every(([type]) => hasDeliverable(type));

  const canDeliver = allRequiredDeliverablesMet && order.status !== 'delivered';

  return (
    <div className="space-y-6">
      {/* Modals */}
      <LyricsModal
        isOpen={lyricsModalOpen}
        onClose={() => setLyricsModalOpen(false)}
        onSubmit={generatePDF}
        isLoading={generating === 'pdf'}
      />

      <VideoInfoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        mp3Url={getDeliverable('mp3')?.file_url}
        coverUrl={getDeliverable('png')?.file_url}
        songTitle={`Song fuer ${order.recipient_name}`}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Deliverable loeschen?"
        message={`Moechtest du "${deleteConfirm.name}" wirklich loeschen? Diese Aktion kann nicht rueckgaengig gemacht werden.`}
        confirmText="Loeschen"
        onConfirm={deleteDeliverable}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: '', name: '' })}
        variant="danger"
      />

      <ConfirmDialog
        isOpen={deliverConfirm}
        title="Jetzt liefern?"
        message={`Der Song wird an ${order.customer_email} per E-Mail gesendet. Der Kunde erhaelt einen Download-Link.`}
        confirmText="Liefern"
        onConfirm={deliverOrder}
        onCancel={() => setDeliverConfirm(false)}
        variant="info"
      />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-primary-900 font-mono">
              {order.order_number}
            </h1>
            <span className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
              status.color
            )}>
              <StatusIcon className="w-4 h-4" />
              {status.label}
            </span>
            {order.bump_rush && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                <Zap className="w-3 h-3" />
                Rush
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Erstellt am {new Date(order.created_at).toLocaleDateString('de-DE', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      {/* Status Update Buttons */}
      {order.status !== 'delivered' && order.status !== 'refunded' && (
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Status aendern:</span>
            {(['paid', 'in_production', 'quality_review'] as const)
              .filter(s => s !== order.status)
              .map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  size="sm"
                  onClick={() => updateStatus(s)}
                  disabled={updating}
                >
                  {statusConfig[s].label}
                </Button>
              ))}
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Song Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Bestelldetails
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Kunde</label>
                  <p className="font-medium text-gray-900">{order.customer_name}</p>
                  <a href={`mailto:${order.customer_email}`} className="text-sm text-primary-600 hover:underline">
                    {order.customer_email}
                  </a>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Song fuer</label>
                  <p className="font-medium text-gray-900">{order.recipient_name}</p>
                  <p className="text-sm text-gray-600">{order.relationship}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Anlass</label>
                  <p className="font-medium text-gray-900">{occasionLabels[order.occasion] || order.occasion}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Genre</label>
                  <p className="font-medium text-gray-900">{genreLabels[order.genre] || order.genre}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Stimmung</label>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-4 h-4 rounded-full",
                            i <= order.mood ? "bg-primary-500" : "bg-gray-200"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{moodLabels[order.mood - 1]}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Sprache</label>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {order.allow_english ? 'Deutsch oder Englisch' : 'Nur Deutsch'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Paket & Extras</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {order.package_type === 'premium' ? 'Premium' :
                     order.package_type === 'basis' ? 'Basis' : 'Plus'}
                  </span>
                  {order.bump_karaoke && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1">
                      <Mic className="w-3 h-3" /> Karaoke
                    </span>
                  )}
                  {order.bump_rush && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Rush
                    </span>
                  )}
                  {order.bump_gift && (
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium flex items-center gap-1">
                      <Gift className="w-3 h-3" /> Geschenk
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Story */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Geschichte
              </CardTitle>
              <Button variant="outline" size="sm" onClick={copyStory}>
                {copiedStory ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Kopiert!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Fuer Suno kopieren
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700 leading-relaxed">
                {order.story}
              </div>
              {order.has_custom_lyrics && order.custom_lyrics && (
                <div className="mt-4">
                  <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">
                    Eigene Lyrics vom Kunden
                  </label>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 whitespace-pre-wrap text-gray-700">
                    {order.custom_lyrics}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deliverables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Deliverables
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* MP3 */}
                <DeliverableSlot
                  type="mp3"
                  label="MP3 Song"
                  icon={FileAudio}
                  required={requiredDeliverables.mp3}
                  deliverable={getDeliverable('mp3')}
                  uploading={uploadingType === 'mp3'}
                  uploadProgress={uploadingType === 'mp3' ? uploadProgress : 0}
                  onUpload={(file) => handleFileUpload('mp3', file)}
                  onDelete={confirmDelete}
                />

                {/* Album Cover */}
                <DeliverableSlot
                  type="png"
                  label="Album Cover"
                  icon={ImageIcon}
                  required={requiredDeliverables.png}
                  deliverable={getDeliverable('png')}
                  uploading={uploadingType === 'png'}
                  uploadProgress={uploadingType === 'png' ? uploadProgress : 0}
                  generating={generating === 'cover'}
                  onUpload={(file) => handleFileUpload('png', file)}
                  onDelete={confirmDelete}
                  onGenerate={generateCover}
                  generateLabel="KI Cover"
                />

                {/* Lyrics PDF */}
                <DeliverableSlot
                  type="pdf"
                  label="Lyrics PDF"
                  icon={FileText}
                  required={requiredDeliverables.pdf}
                  deliverable={getDeliverable('pdf')}
                  uploading={uploadingType === 'pdf'}
                  uploadProgress={uploadingType === 'pdf' ? uploadProgress : 0}
                  generating={generating === 'pdf'}
                  onUpload={(file) => handleFileUpload('pdf', file)}
                  onDelete={confirmDelete}
                  onGenerate={() => setLyricsModalOpen(true)}
                  generateLabel="PDF erstellen"
                />

                {/* MP4 Video */}
                <DeliverableSlot
                  type="mp4"
                  label="Lyric Video"
                  icon={Video}
                  required={requiredDeliverables.mp4}
                  deliverable={getDeliverable('mp4')}
                  uploading={uploadingType === 'mp4'}
                  uploadProgress={uploadingType === 'mp4' ? uploadProgress : 0}
                  onUpload={(file) => handleFileUpload('mp4', file)}
                  onDelete={confirmDelete}
                  onGenerate={() => setVideoModalOpen(true)}
                  generateLabel="Anleitung"
                />

                {/* Instrumental/Karaoke */}
                <DeliverableSlot
                  type="wav"
                  label={order.bump_karaoke ? 'Karaoke Version' : 'Instrumental'}
                  icon={Mic}
                  required={requiredDeliverables.wav}
                  deliverable={getDeliverable('wav')}
                  uploading={uploadingType === 'wav'}
                  uploadProgress={uploadingType === 'wav' ? uploadProgress : 0}
                  onUpload={(file) => handleFileUpload('wav', file)}
                  onDelete={confirmDelete}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          {/* Price Summary */}
          <Card className="p-6">
            <h3 className="font-semibold text-primary-900 mb-4">Zusammenfassung</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Basispreis</span>
                <span>{order.base_price} EUR</span>
              </div>
              {order.total_price !== order.base_price && (
                <div className="flex justify-between">
                  <span className="text-gray-600">+ Extras</span>
                  <span>{order.total_price - order.base_price} EUR</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Gesamt</span>
                <span className="text-primary-900">{order.total_price} EUR</span>
              </div>
            </div>
          </Card>

          {/* Delivery Checklist */}
          <Card className="p-6">
            <h3 className="font-semibold text-primary-900 mb-4">Delivery Checklist</h3>
            <div className="space-y-3">
              {Object.entries(requiredDeliverables)
                .filter(([, required]) => required)
                .map(([type]) => {
                  const has = hasDeliverable(type);
                  const labels: Record<string, string> = {
                    mp3: 'MP3 Song',
                    pdf: 'Lyrics PDF',
                    png: 'Album Cover',
                    mp4: 'Lyric Video',
                    wav: order.bump_karaoke ? 'Karaoke Version' : 'Instrumental',
                  };
                  return (
                    <div key={type} className="flex items-center gap-2">
                      {has ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                      <span className={cn(
                        "text-sm",
                        has ? "text-gray-700" : "text-gray-500"
                      )}>
                        {labels[type]}
                      </span>
                    </div>
                  );
                })}
            </div>
          </Card>

          {/* Deliver Button */}
          <Card className={cn(
            "p-6",
            canDeliver ? "bg-green-50 border-green-200" : ""
          )}>
            <Button
              className="w-full"
              size="lg"
              disabled={!canDeliver || delivering}
              onClick={confirmDelivery}
            >
              {delivering ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Wird geliefert...
                </>
              ) : order.status === 'delivered' ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Bereits geliefert
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Jetzt liefern
                </>
              )}
            </Button>
            {!canDeliver && order.status !== 'delivered' && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Alle Deliverables muessen hochgeladen sein
              </p>
            )}
            {order.delivered_at && (
              <p className="text-xs text-green-600 text-center mt-2">
                Geliefert am {new Date(order.delivered_at).toLocaleDateString('de-DE')}
              </p>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold text-primary-900 mb-4">Schnellaktionen</h3>
            <div className="space-y-2">
              <a
                href={`mailto:${order.customer_email}?subject=Ihre Bestellung ${order.order_number}`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Kunde kontaktieren
              </a>
              <a
                href={`https://dashboard.stripe.com/search?query=${order.stripe_session_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                In Stripe oeffnen
              </a>
              {order.delivery_url && (
                <a
                  href={order.delivery_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download-Seite oeffnen
                </a>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Deliverable Slot Component
function DeliverableSlot({
  type,
  label,
  icon: Icon,
  required,
  deliverable,
  uploading,
  uploadProgress,
  generating,
  onUpload,
  onDelete,
  onGenerate,
  generateLabel,
}: {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  required: boolean;
  deliverable?: Deliverable;
  uploading?: boolean;
  uploadProgress?: number;
  generating?: boolean;
  onUpload: (file: File) => void;
  onDelete: (deliverable: Deliverable) => void;
  onGenerate?: () => void;
  generateLabel?: string;
}) {
  if (!required) return null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  if (deliverable) {
    return (
      <div className="border border-green-200 bg-green-50 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Icon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-900">{label}</p>
              <p className="text-xs text-green-600 truncate max-w-[150px]">
                {deliverable.file_name}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <a
              href={deliverable.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-green-100 rounded"
            >
              <Download className="w-4 h-4 text-green-600" />
            </a>
            <button
              onClick={() => onDelete(deliverable)}
              className="p-1.5 hover:bg-red-100 rounded"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <p className="font-medium text-gray-700">{label}</p>
          <p className="text-xs text-gray-400">Erforderlich</p>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (uploadProgress ?? 0) > 0 && (
        <div className="mb-3">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
        </div>
      )}

      <div className="flex gap-2">
        <label className="flex-1">
          <input
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
            accept={type === 'mp3' ? 'audio/*' : type === 'mp4' ? 'video/*' : type === 'png' ? 'image/*' : '*/*'}
          />
          <div className={cn(
            "flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors",
            uploading ? "bg-gray-200 text-gray-500" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}>
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Upload
          </div>
        </label>

        {onGenerate && (
          <button
            onClick={onGenerate}
            disabled={generating}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              "bg-primary-100 text-primary-700 hover:bg-primary-200"
            )}
          >
            {generating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            {generateLabel || 'Generieren'}
          </button>
        )}
      </div>
    </div>
  );
}
