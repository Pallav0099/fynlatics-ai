'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingDown, TrendingUp, DollarSign, CreditCard, Activity } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  description: string;
  trend: number; // percentage
  icon: React.ReactNode;
  loading?: boolean;
}

const KPICard = ({ title, value, description, trend, icon, loading = false }: KPICardProps) => {
  const isPositive = trend >= 0;
  const trendColor = isPositive ? 'text-green-500' : 'text-red-500';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-36" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-6 w-6 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center">
          <TrendIcon className={`h-3 w-3 mr-1 ${trendColor}`} />
          <span className={trendColor}>
            {Math.abs(trend)}% {isPositive ? 'increase' : 'decrease'} from last period
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

interface KPICardsProps {
  totalRevenue?: number;
  averageInvoiceValue?: number;
  totalTransactions?: number;
  topGateway?: { name: string; amount: number };
  currency?: string;
  loading?: boolean;
}

export function KPICards({
  totalRevenue = 0,
  averageInvoiceValue = 0,
  totalTransactions = 0,
  topGateway = { name: 'N/A', amount: 0 },
  currency = 'USD',
  loading = false,
}: KPICardsProps) {
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Mock trend data (in a real app, this would come from your data)
  const trends = {
    revenue: 12.5, // %
    avgInvoice: 2.3, // %
    transactions: 5.7, // %
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Total Revenue"
        value={formatCurrency(totalRevenue)}
        description="Total revenue across all gateways"
        trend={trends.revenue}
        icon={<DollarSign className="h-4 w-4" />}
        loading={loading}
      />
      <KPICard
        title="Avg. Invoice Value"
        value={formatCurrency(averageInvoiceValue)}
        description="Average value per invoice"
        trend={trends.avgInvoice}
        icon={<CreditCard className="h-4 w-4" />}
        loading={loading}
      />
      <KPICard
        title="Total Transactions"
        value={totalTransactions.toLocaleString()}
        description="Number of transactions processed"
        trend={trends.transactions}
        icon={<Activity className="h-4 w-4" />}
        loading={loading}
      />
      <KPICard
        title="Top Gateway"
        value={topGateway.name}
        description={`${formatCurrency(topGateway.amount)} processed`}
        trend={8.1} // Hardcoded for now
        icon={<div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
          <span className="text-white text-xs font-bold">{topGateway.name.charAt(0)}</span>
        </div>}
        loading={loading}
      />
    </div>
  );
}
