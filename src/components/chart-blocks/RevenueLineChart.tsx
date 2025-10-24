'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VChart from '@visactor/vchart';
import { useTheme } from 'next-themes';
import { Skeleton } from '@/components/ui/skeleton';

interface RevenueLineChartProps {
  data: Array<{ date: string; value: number }>;
  loading?: boolean;
  currency?: string;
}

export function RevenueLineChart({ data, loading = false, currency = 'USD' }: RevenueLineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<any>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    // Prepare chart data
    const chartData = data.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: item.value
    }));

    // Chart specification
    const spec = {
      type: 'line',
      data: [
        {
          id: 'revenue',
          values: chartData
        }
      ],
      xField: 'date',
      yField: 'value',
      seriesField: 'type',
      label: { visible: false },
      line: {
        style: {
          stroke: isDark ? '#7dd3fc' : '#0ea5e9',
          lineWidth: 2,
        },
        state: {
          hover: {
            lineWidth: 3,
          },
        },
      },
      point: {
        style: {
          fill: isDark ? '#7dd3fc' : '#0ea5e9',
          stroke: 'none',
        },
        state: {
          hover: {
            fill: isDark ? '#38bdf8' : '#0284c7',
            stroke: 'white',
            lineWidth: 2,
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
        title: { value: 'date' },
        mark: {
          content: [
            {
              key: 'Value',
              value: (datum: any) => `${currency} ${datum?.value?.toLocaleString(undefined, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              }) || '0.00'}`
            }
          ]
        }
      },
      axes: [
        {
          orient: 'bottom',
          type: 'band',
          grid: { visible: false },
          label: {
            style: {
              fill: isDark ? '#94a3b8' : '#64748b',
              fontSize: 12,
            },
          },
        },
        {
          orient: 'left',
          type: 'linear',
          grid: { 
            visible: true, 
            style: { 
              stroke: isDark ? '#334155' : '#e2e8f0' 
            } 
          },
          label: {
            formatMethod: (value: number) => `${currency} ${(value / 1000).toFixed(0)}K`,
            style: {
              fill: isDark ? '#94a3b8' : '#64748b',
              fontSize: 12,
            },
          },
        },
      ],
      crosshair: {
        xField: { visible: true },
        yField: { visible: true },
      },
    };

    // Create chart instance
    const chartInstance = new VChart(spec as any, {
      dom: chartRef.current,
      mode: 'desktop-browser',
      theme: isDark ? 'dark' : 'light',
      autoFit: true,
      animation: true,
    });

    // Render chart
    chartInstance.renderAsync();
    setChart(chartInstance);

    // Cleanup
    return () => {
      if (chartInstance) {
        chartInstance.release();
      }
    };
  }, [data, theme, currency]);

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
        <CardTitle>Revenue Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}
