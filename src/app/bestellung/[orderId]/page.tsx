'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Music,
  CheckCircle,
  Clock,
  Sparkles,
  FileText,
  Download,
  Package,
  Calendar,
  Mic2,
  Gift,
  Zap,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface OrderData {
  order_number: string;
  status: string;
  status_label: string;
  status_description: string;
  progress: number;
  recipient_name: string;
  occasion: string;
  genre: string;
  package_type: string;
  bump_karaoke: boolean;
  bump_rush: boolean;
  bump_gift: boolean;
  has_custom_lyrics: boolean;
  created_at: string;
  delivered_at: string | null;
  estimated_delivery: string;
}

interface Deliverable {
  type: string;
  file_name: string;
  file_url: string;
}

interface OrderResponse {
  order: OrderData;
  deliverables: Deliverable[] | null;
}

const statusSteps = [
  { key: 'paid', label: 'Bezahlt', icon: CheckCircle },
  { key: 'in_production', label: 'In Produktion', icon: Sparkles },
  { key: 'quality_review', label: 'Qualitaetspruefung', icon: FileText },
  { key: 'delivered', label: 'Geliefert', icon: Download },
];

const packageLabels: Record<string, string> = {
  basis: 'Melodie Basis',
  plus: 'Melodie Plus',
  premium: 'Melodie Premium',
};

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OrderResponse | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/order/${orderId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Bestellung nicht gefunden');
        }
        const orderData = await response.json();
        setData(orderData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const getCurrentStepIndex = (status: string) => {
    const index = statusSteps.findIndex((s) => s.key === status);
    return index >= 0 ? index : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Bestellung wird geladen...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="container-wide py-4">
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

        <main className="container-narrow py-12">
          <Card className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-primary-900 mb-2">
              Bestellung nicht gefunden
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/">
              <Button>Zurueck zur Startseite</Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  const order = data?.order;
  const deliverables = data?.deliverables;
  const currentStep = order ? getCurrentStepIndex(order.status) : 0;
  const isDelivered = order?.status === 'delivered';

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container-wide py-4">
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

      <main className="container-narrow py-12">
        {/* Order Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-display font-bold text-primary-900 mb-2">
            Bestellstatus
          </h1>
          <p className="text-gray-600">
            Bestellnummer: <span className="font-mono font-medium">{order?.order_number}</span>
          </p>
        </motion.div>

        {/* Progress Tracker */}
        <Card className="p-6 lg:p-8 mb-8">
          <div className="mb-8">
            {/* Progress Bar */}
            <div className="relative">
              <div className="h-2 bg-gray-200 rounded-full">
                <motion.div
                  className="h-2 bg-gradient-to-r from-primary-500 to-gold-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${order?.progress || 0}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>

              {/* Steps */}
              <div className="flex justify-between mt-4">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isComplete = index <= currentStep;
                  const isCurrent = index === currentStep;

                  return (
                    <div
                      key={step.key}
                      className={`flex flex-col items-center ${
                        isComplete ? 'text-primary-600' : 'text-gray-400'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          isCurrent
                            ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                            : isComplete
                            ? 'bg-primary-100 text-primary-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-center hidden sm:block">
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="text-center py-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Aktueller Status</p>
            <p className="text-xl font-semibold text-primary-900 mb-2">
              {order?.status_label}
            </p>
            <p className="text-gray-600">{order?.status_description}</p>
          </div>

          {/* Estimated Delivery */}
          {order && !isDelivered && (
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-100">
              <Clock className="w-5 h-5 text-gold-500" />
              <div>
                <span className="text-gray-600">Geschaetzte Lieferung: </span>
                <span className="font-medium text-primary-900">
                  {new Date(order.estimated_delivery).toLocaleDateString('de-DE', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Deliverables (if delivered) */}
        {isDelivered && deliverables && deliverables.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 lg:p-8 mb-8 border-green-200 bg-green-50">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-primary-900">
                  Dein Song ist fertig!
                </h2>
              </div>
              <div className="space-y-3">
                {deliverables.map((file, index) => (
                  <a
                    key={index}
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-green-600" />
                      <span className="font-medium">{file.file_name}</span>
                    </div>
                    <span className="text-sm text-gray-500 uppercase">
                      {file.type}
                    </span>
                  </a>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Order Details */}
        <Card className="p-6 lg:p-8">
          <h2 className="text-xl font-semibold text-primary-900 mb-6">
            Bestelldetails
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Gift className="w-5 h-5 text-primary-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Song fuer</p>
                <p className="font-medium text-primary-900">{order?.recipient_name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-primary-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Anlass</p>
                <p className="font-medium text-primary-900 capitalize">{order?.occasion}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Music className="w-5 h-5 text-primary-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Genre</p>
                <p className="font-medium text-primary-900 capitalize">{order?.genre}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Package className="w-5 h-5 text-primary-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Paket</p>
                <p className="font-medium text-primary-900">
                  {order ? packageLabels[order.package_type] || order.package_type : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Extras */}
          {order && (order.bump_karaoke || order.bump_rush || order.bump_gift || order.has_custom_lyrics) && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-3">Extras</p>
              <div className="flex flex-wrap gap-2">
                {order.bump_karaoke && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                    <Mic2 className="w-4 h-4" />
                    Karaoke-Version
                  </span>
                )}
                {order.bump_rush && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold-100 text-gold-700 rounded-full text-sm">
                    <Zap className="w-4 h-4" />
                    Rush-Upgrade
                  </span>
                )}
                {order.bump_gift && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                    <Gift className="w-4 h-4" />
                    Geschenk-Paket
                  </span>
                )}
                {order.has_custom_lyrics && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    <FileText className="w-4 h-4" />
                    Eigene Lyrics
                  </span>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Zurueck zur Startseite
          </Link>
        </div>
      </main>
    </div>
  );
}
