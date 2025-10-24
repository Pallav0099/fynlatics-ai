'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { RevenueLineChart } from '@/components/chart-blocks/RevenueLineChart';
import { GatewayComparisonChart } from '@/components/chart-blocks/GatewayComparisonChart';
import { KPICards } from '@/components/chart-blocks/KPICards';
import { 
  fetchDashboardKPIs, 
  fetchGatewayComparison, 
  fetchRevenueTimeSeries, 
  exportToCSV 
} from '@/lib/api';
import { TimeSeriesDataPoint, GatewayComparisonData, DashboardKPIs } from '@/types/canonical';

export default function Dashboard() {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesDataPoint[]>([]);
  const [gatewayData, setGatewayData] = useState<GatewayComparisonData[]>([]);
  const [kpis, setKpis] = useState<DashboardKPIs>({
    totalRevenue: 0,
    averageInvoiceValue: 0,
    totalTransactions: 0,
    topGateway: { name: 'N/A', amount: 0 },
    currency: 'USD'
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    end: new Date().toISOString().split('T')[0] // today
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [kpisData, timeSeries, gateways] = await Promise.all([
        fetchDashboardKPIs(dateRange.start, dateRange.end),
        fetchRevenueTimeSeries(dateRange.start, dateRange.end, 'day'),
        fetchGatewayComparison(dateRange.start, dateRange.end)
      ]);
      
      setKpis(kpisData);
      setTimeSeriesData(timeSeries);
      setGatewayData(gateways);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const handleExportData = async () => {
    try {
      // For demo purposes, we'll just export the time series data
      // In a real app, you might want to export the full transaction data
      exportToCSV(timeSeriesData, 'revenue_data');
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Finanlytics AI</h1>
          <p className="text-muted-foreground">
            {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportData} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <KPICards 
        totalRevenue={kpis.totalRevenue}
        averageInvoiceValue={kpis.averageInvoiceValue}
        totalTransactions={kpis.totalTransactions}
        topGateway={kpis.topGateway}
        currency={kpis.currency}
        loading={loading}
      />

      {/* Charts */}
      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <RevenueLineChart 
            data={timeSeriesData} 
            loading={loading} 
            currency={kpis.currency}
          />
          <GatewayComparisonChart 
            data={gatewayData} 
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
