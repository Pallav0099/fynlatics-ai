'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar } from '@visactor/react-vchart';
import * as VChart from '@visactor/vchart';
import { useTheme } from 'next-themes';
import { Skeleton } from '@/components/ui/skeleton';

interface GatewayComparisonChartProps {
  data: Array<{ gateway: string; amount: number; count: number; currency: string }>;
  loading?: boolean;
}

export function GatewayComparisonChart({ data, loading = false }: GatewayComparisonChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<any>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    const isDark = theme === 'dark';
    const colors = [
      '#3b82f6', // blue-500
      '#8b5cf6', // violet-500
      '#ec4899', // pink-500
      '#10b981', // emerald-500
      '#f59e0b', // amber-500
      '#ef4444', // red-500
    ];

    // Define chart specification with proper TypeScript types
    const chartSpec: any = {
      type: 'bar',
      data: [
        {
          id: 'gateways',
          values: data.map((item, index) => ({
            gateway: item.gateway,
            amount: item.amount,
            count: item.count,
            color: colors[index % colors.length],
          })),
        },
      ],
      xField: 'gateway',
      yField: 'amount',
      seriesField: 'gateway',
      bar: {
        style: (datum: any) => ({
          fill: datum.color,
          fillOpacity: 0.8,
        }),
        state: {
          hover: {
            fillOpacity: 1,
          },
        },
      },
      tooltip: {
        className: 'vchart-tooltip',
        style: {
          padding: '0.5rem',
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
        },
        mark: {
          title: (datum: any) => datum.gateway,
          content: [
            {
              key: 'Amount',
              value: (datum: any) => `${data[0]?.currency || 'USD'} ${datum.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            },
            {
              key: 'Transactions',
              value: (datum: any) => `${datum.count}`
            }
          ]
        }
      },
      axes: [
        {
          orient: 'left',
          type: 'linear' as const,
          grid: { visible: true, style: { stroke: isDark ? '#334155' : '#e2e8f0' } },
          label: {
            formatMethod: (value: any) => {
              const numValue = Number(value);
              if (isNaN(numValue)) return '$0';
              
              if (numValue >= 1000000) {
                return `$${(numValue / 1000000).toFixed(1)}M`;
              } else if (numValue >= 1000) {
                return `$${(numValue / 1000).toFixed(0)}K`;
              }
              return `$${Math.round(numValue)}`;
            },
            style: {
              fill: isDark ? '#94a3b8' : '#64748b',
              fontSize: 12,
            },
          },
        },
        {
          orient: 'bottom',
          type: 'band' as const,
          grid: { visible: false },
          label: {
            style: {
              fill: isDark ? '#94a3b8' : '#64748b',
              fontSize: 12,
            },
          },
        },
      ],
      crosshair: {
        yField: { visible: true },
      },
    };

    if (chartRef.current) {
      // Clear previous chart if it exists
      if (chart) {
        chart.release();
      }

      // Create chart instance with proper initialization
      const chartInstance = new VChart.default(chartSpec, {
        dom: chartRef.current,
        mode: 'desktop-browser',
        theme: isDark ? 'dark' : 'light',
        autoFit: true,
        animation: true,
      });

      // Render the chart asynchronously
      chartInstance.renderAsync();
      setChart(chartInstance);

      // Cleanup function
      return () => {
        if (chartInstance) {
          chartInstance.release();
        }
      };
    }
  }, [data, theme]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Payment Gateway</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}
