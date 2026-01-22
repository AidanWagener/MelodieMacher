import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

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

interface DailyMetric {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

interface PackageBreakdown {
  packageType: string;
  count: number;
  revenue: number;
  percentage: number;
}

interface AnalyticsDashboard {
  period: { start: string; end: string };
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    averageQualityScore: number | null;
    conversionRate: number | null;
  };
  dailyMetrics: DailyMetric[];
  statusDistribution: StatusDistribution[];
  packageBreakdown: PackageBreakdown[];
  priorityDistribution: { priority: string; count: number }[];
  topOccasions: { occasion: string; count: number; revenue: number }[];
  campaignPerformance: {
    totalEnrollments: number;
    totalEmailsSent: number;
    openRate: number | null;
    clickRate: number | null;
  } | null;
}

// GET - Fetch analytics dashboard data
export async function GET(request: Request) {
  if (!isAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);

    // Default to last 30 days
    const days = parseInt(searchParams.get('days') || '30');
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch all orders in period
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    if (ordersError) throw ordersError;

    const orderList = orders || [];

    // Calculate summary metrics
    const totalRevenue = orderList.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const totalOrders = orderList.length;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Calculate average quality score (if column exists)
    let averageQualityScore: number | null = null;
    const scoredOrders = orderList.filter(o => o.quality_score !== null && o.quality_score !== undefined);
    if (scoredOrders.length > 0) {
      averageQualityScore = Math.round(
        scoredOrders.reduce((sum, o) => sum + o.quality_score, 0) / scoredOrders.length
      );
    }

    // Daily metrics
    const dailyMap = new Map<string, { revenue: number; orders: number }>();
    for (const order of orderList) {
      const date = order.created_at.split('T')[0];
      const existing = dailyMap.get(date) || { revenue: 0, orders: 0 };
      dailyMap.set(date, {
        revenue: existing.revenue + (order.total_amount || 0),
        orders: existing.orders + 1,
      });
    }

    const dailyMetrics: DailyMetric[] = Array.from(dailyMap.entries())
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders,
        averageOrderValue: data.orders > 0 ? Math.round(data.revenue / data.orders) : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Status distribution
    const statusMap = new Map<string, number>();
    for (const order of orderList) {
      const status = order.status || 'unknown';
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    }

    const statusDistribution: StatusDistribution[] = Array.from(statusMap.entries())
      .map(([status, count]) => ({
        status,
        count,
        percentage: totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Package breakdown
    const packageMap = new Map<string, { count: number; revenue: number }>();
    for (const order of orderList) {
      const pkg = order.package_type || 'unknown';
      const existing = packageMap.get(pkg) || { count: 0, revenue: 0 };
      packageMap.set(pkg, {
        count: existing.count + 1,
        revenue: existing.revenue + (order.total_amount || 0),
      });
    }

    const packageBreakdown: PackageBreakdown[] = Array.from(packageMap.entries())
      .map(([packageType, data]) => ({
        packageType,
        count: data.count,
        revenue: data.revenue,
        percentage: totalOrders > 0 ? Math.round((data.count / totalOrders) * 100) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Priority distribution
    const priorityMap = new Map<string, number>();
    for (const order of orderList) {
      const priority = order.priority || 'unanalyzed';
      priorityMap.set(priority, (priorityMap.get(priority) || 0) + 1);
    }

    const priorityDistribution = Array.from(priorityMap.entries())
      .map(([priority, count]) => ({ priority, count }))
      .sort((a, b) => {
        const order = { urgent: 0, high: 1, normal: 2, low: 3, unanalyzed: 4 };
        return (order[a.priority as keyof typeof order] || 5) - (order[b.priority as keyof typeof order] || 5);
      });

    // Top occasions
    const occasionMap = new Map<string, { count: number; revenue: number }>();
    for (const order of orderList) {
      const occasion = order.occasion || 'other';
      const existing = occasionMap.get(occasion) || { count: 0, revenue: 0 };
      occasionMap.set(occasion, {
        count: existing.count + 1,
        revenue: existing.revenue + (order.total_amount || 0),
      });
    }

    const topOccasions = Array.from(occasionMap.entries())
      .map(([occasion, data]) => ({
        occasion,
        count: data.count,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Campaign performance (if tables exist)
    let campaignPerformance: AnalyticsDashboard['campaignPerformance'] = null;
    try {
      const { data: enrollments } = await supabase
        .from('campaign_enrollments')
        .select('id')
        .gte('created_at', startDate.toISOString());

      const { data: emailSends } = await supabase
        .from('email_sends')
        .select('id, opened_at, clicked_at')
        .gte('created_at', startDate.toISOString());

      if (enrollments && emailSends) {
        const totalSent = emailSends.length;
        const opened = emailSends.filter(e => e.opened_at).length;
        const clicked = emailSends.filter(e => e.clicked_at).length;

        campaignPerformance = {
          totalEnrollments: enrollments.length,
          totalEmailsSent: totalSent,
          openRate: totalSent > 0 ? Math.round((opened / totalSent) * 100) : null,
          clickRate: totalSent > 0 ? Math.round((clicked / totalSent) * 100) : null,
        };
      }
    } catch {
      // Campaign tables might not exist yet
    }

    // Conversion rate (paid orders / total orders)
    const paidOrders = orderList.filter(o =>
      ['paid', 'in_production', 'quality_review', 'delivered'].includes(o.status)
    ).length;
    const conversionRate = totalOrders > 0 ? Math.round((paidOrders / totalOrders) * 100) : null;

    const dashboard: AnalyticsDashboard = {
      period: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
      },
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        averageQualityScore,
        conversionRate,
      },
      dailyMetrics,
      statusDistribution,
      packageBreakdown,
      priorityDistribution,
      topOccasions,
      campaignPerformance,
    };

    return NextResponse.json(dashboard);

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({
      error: 'Failed to fetch analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Generate analytics report
export async function POST(request: Request) {
  if (!isAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const { type, startDate, endDate } = await request.json();
    const supabase = getSupabaseAdmin();

    if (type === 'revenue-report') {
      // Detailed revenue report
      const { data: orders, error } = await supabase
        .from('orders')
        .select('created_at, total_amount, package_type, occasion, status, bump_karaoke, bump_rush')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .in('status', ['paid', 'in_production', 'quality_review', 'delivered']);

      if (error) throw error;

      const report = {
        period: { start: startDate, end: endDate },
        totalRevenue: orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0,
        orderCount: orders?.length || 0,
        revenueByPackage: {} as Record<string, number>,
        revenueByOccasion: {} as Record<string, number>,
        bumpRevenue: {
          karaoke: orders?.filter(o => o.bump_karaoke).length || 0,
          rush: orders?.filter(o => o.bump_rush).length || 0,
        },
      };

      for (const order of orders || []) {
        const pkg = order.package_type || 'unknown';
        report.revenueByPackage[pkg] = (report.revenueByPackage[pkg] || 0) + (order.total_amount || 0);

        const occ = order.occasion || 'other';
        report.revenueByOccasion[occ] = (report.revenueByOccasion[occ] || 0) + (order.total_amount || 0);
      }

      return NextResponse.json(report);
    }

    if (type === 'quality-report') {
      // Quality metrics report
      const { data: orders, error } = await supabase
        .from('orders')
        .select('quality_score, quality_details, package_type, status')
        .not('quality_score', 'is', null)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw error;

      const scores = orders?.map(o => o.quality_score) || [];
      const report = {
        period: { start: startDate, end: endDate },
        totalScored: scores.length,
        averageScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
        scoreDistribution: {
          excellent: scores.filter(s => s >= 90).length,
          good: scores.filter(s => s >= 75 && s < 90).length,
          fair: scores.filter(s => s >= 60 && s < 75).length,
          poor: scores.filter(s => s < 60).length,
        },
        readyToDeliver: orders?.filter(o => o.quality_details?.readyToDeliver).length || 0,
        commonIssues: {} as Record<string, number>,
      };

      // Aggregate common issues
      for (const order of orders || []) {
        const issues = order.quality_details?.issues || [];
        for (const issue of issues) {
          report.commonIssues[issue] = (report.commonIssues[issue] || 0) + 1;
        }
      }

      return NextResponse.json(report);
    }

    if (type === 'campaign-report') {
      // Drip campaign performance report
      try {
        const { data: campaigns } = await supabase
          .from('drip_campaigns')
          .select('id, name, is_active');

        const { data: enrollments } = await supabase
          .from('campaign_enrollments')
          .select('campaign_id, status, created_at')
          .gte('created_at', startDate)
          .lte('created_at', endDate);

        const { data: sends } = await supabase
          .from('email_sends')
          .select('campaign_id, sent_at, opened_at, clicked_at')
          .gte('created_at', startDate)
          .lte('created_at', endDate);

        const report = {
          period: { start: startDate, end: endDate },
          campaigns: campaigns?.map(c => {
            const campEnrollments = enrollments?.filter(e => e.campaign_id === c.id) || [];
            const campSends = sends?.filter(s => s.campaign_id === c.id) || [];
            const opened = campSends.filter(s => s.opened_at).length;
            const clicked = campSends.filter(s => s.clicked_at).length;

            return {
              id: c.id,
              name: c.name,
              isActive: c.is_active,
              enrollments: campEnrollments.length,
              completed: campEnrollments.filter(e => e.status === 'completed').length,
              emailsSent: campSends.length,
              openRate: campSends.length > 0 ? Math.round((opened / campSends.length) * 100) : null,
              clickRate: campSends.length > 0 ? Math.round((clicked / campSends.length) * 100) : null,
            };
          }) || [],
        };

        return NextResponse.json(report);
      } catch {
        return NextResponse.json({
          error: 'Campaign tables not found. Run migration first.',
        }, { status: 400 });
      }
    }

    return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });

  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json({
      error: 'Failed to generate report',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
