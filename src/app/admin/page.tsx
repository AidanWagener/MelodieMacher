'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Music,
  Zap,
  Gift,
  Mic,
  ChevronRight,
  TrendingUp,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'paid' | 'in_production' | 'quality_review' | 'delivered' | 'refunded';
  customer_email: string;
  customer_name: string;
  recipient_name: string;
  occasion: string;
  genre: string;
  package_type: string;
  total_price: number;
  bump_rush: boolean;
  bump_karaoke: boolean;
  bump_gift: boolean;
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  pending: { label: 'Wartend', color: 'bg-gray-100 text-gray-700', icon: Clock },
  paid: { label: 'Bezahlt', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  in_production: { label: 'In Produktion', color: 'bg-blue-100 text-blue-700', icon: Music },
  quality_review: { label: 'QA Review', color: 'bg-purple-100 text-purple-700', icon: Eye },
  delivered: { label: 'Geliefert', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  refunded: { label: 'Erstattet', color: 'bg-red-100 text-red-700', icon: RefreshCw },
};

const packageConfig = {
  basis: { label: 'Basis', color: 'bg-gray-100 text-gray-700', deadline: 48 },
  plus: { label: 'Plus', color: 'bg-blue-100 text-blue-700', deadline: 24 },
  premium: { label: 'Premium', color: 'bg-gold-100 text-gold-700', deadline: 12 },
};

function getTimeRemaining(createdAt: string, deadlineHours: number): { text: string; urgent: boolean; overdue: boolean } {
  const created = new Date(createdAt);
  const deadline = new Date(created.getTime() + deadlineHours * 60 * 60 * 1000);
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) {
    const overduHours = Math.abs(Math.floor(diff / (1000 * 60 * 60)));
    return { text: `${overduHours}h ueberfaellig`, urgent: true, overdue: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours < 4) {
    return { text: `${hours}h ${minutes}m`, urgent: true, overdue: false };
  }

  return { text: `${hours}h`, urgent: false, overdue: false };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    delivered: 0,
    revenue: 0,
  });

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();

      if (data.orders) {
        setOrders(data.orders);

        // Calculate stats
        const total = data.orders.length;
        const pending = data.orders.filter((o: Order) => o.status === 'paid').length;
        const inProgress = data.orders.filter((o: Order) =>
          ['in_production', 'quality_review'].includes(o.status)
        ).length;
        const delivered = data.orders.filter((o: Order) => o.status === 'delivered').length;
        const revenue = data.orders
          .filter((o: Order) => o.status !== 'refunded')
          .reduce((sum: number, o: Order) => sum + o.total_price, 0);

        setStats({ total, pending, inProgress, delivered, revenue });
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (filter !== 'all') {
      if (filter === 'active') {
        if (!['paid', 'in_production', 'quality_review'].includes(order.status)) return false;
      } else if (order.status !== filter) {
        return false;
      }
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        order.order_number.toLowerCase().includes(searchLower) ||
        order.customer_name.toLowerCase().includes(searchLower) ||
        order.customer_email.toLowerCase().includes(searchLower) ||
        order.recipient_name.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Bestellungen</h1>
          <p className="text-gray-600 mt-1">Verwalte alle eingehenden Bestellungen</p>
        </div>
        <Button onClick={fetchOrders} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Aktualisieren
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Package className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Gesamt</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs text-gray-500">Wartend</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Music className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              <p className="text-xs text-gray-500">In Arbeit</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              <p className="text-xs text-gray-500">Geliefert</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-900">{stats.revenue} EUR</p>
              <p className="text-xs text-gray-500">Umsatz</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Suche nach Bestellnr., Name, Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {[
            { value: 'all', label: 'Alle' },
            { value: 'active', label: 'Aktiv' },
            { value: 'paid', label: 'Bezahlt' },
            { value: 'in_production', label: 'Produktion' },
            { value: 'quality_review', label: 'QA' },
            { value: 'delivered', label: 'Geliefert' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                filter === f.value
                  ? "bg-primary-600 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Bestellung
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Kunde
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Paket
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Betrag
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    Keine Bestellungen gefunden
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const status = statusConfig[order.status];
                  const pkg = packageConfig[order.package_type as keyof typeof packageConfig] || packageConfig.plus;
                  const deadline = order.bump_rush ? pkg.deadline / 2 : pkg.deadline;
                  const timeRemaining = getTimeRemaining(order.created_at, deadline);
                  const StatusIcon = status.icon;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-mono font-medium text-primary-900">
                            {order.order_number}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(order.created_at).toLocaleDateString('de-DE', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.customer_name}</p>
                          <p className="text-sm text-gray-500">
                            Fuer: {order.recipient_name} ({order.occasion})
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2 py-1 rounded-md text-xs font-medium",
                            pkg.color
                          )}>
                            {pkg.label}
                          </span>
                          <div className="flex gap-1">
                            {order.bump_rush && (
                              <span className="p-1 bg-orange-100 rounded" title="Rush">
                                <Zap className="w-3 h-3 text-orange-600" />
                              </span>
                            )}
                            {order.bump_karaoke && (
                              <span className="p-1 bg-purple-100 rounded" title="Karaoke">
                                <Mic className="w-3 h-3 text-purple-600" />
                              </span>
                            )}
                            {order.bump_gift && (
                              <span className="p-1 bg-pink-100 rounded" title="Gift">
                                <Gift className="w-3 h-3 text-pink-600" />
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                          status.color
                        )}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {['delivered', 'refunded'].includes(order.status) ? (
                          <span className="text-gray-400">-</span>
                        ) : (
                          <span className={cn(
                            "text-sm font-medium",
                            timeRemaining.overdue ? "text-red-600" :
                            timeRemaining.urgent ? "text-orange-600" : "text-gray-600"
                          )}>
                            {timeRemaining.text}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-semibold text-primary-900">
                          {order.total_price} EUR
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/admin/orders/${order.order_number}`}
                          className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm"
                        >
                          Oeffnen
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
