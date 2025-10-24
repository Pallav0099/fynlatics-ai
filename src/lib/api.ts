import { TimeSeriesDataPoint, GatewayComparisonData, DashboardKPIs } from '@/types/canonical';

const API_BASE_URL = '/api';

// Helper function to handle API requests
async function fetchFromApi<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
  const response = await fetch(`${API_BASE_URL}${endpoint}${queryString}`);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch time series data for revenue
export async function fetchRevenueTimeSeries(
  startDate: string, 
  endDate: string,
  interval: 'day' | 'week' | 'month' = 'day'
): Promise<TimeSeriesDataPoint[]> {
  return fetchFromApi<TimeSeriesDataPoint[]>('/transactions/timeseries', {
    startDate,
    endDate,
    interval,
  });
}

// Fetch gateway comparison data
export async function fetchGatewayComparison(
  startDate: string, 
  endDate: string
): Promise<GatewayComparisonData[]> {
  return fetchFromApi<GatewayComparisonData[]>('/transactions/gateways', {
    startDate,
    endDate,
  });
}

// Fetch dashboard KPIs
export async function fetchDashboardKPIs(
  startDate: string, 
  endDate: string
): Promise<DashboardKPIs> {
  return fetchFromApi<DashboardKPIs>('/transactions/kpis', {
    startDate,
    endDate,
  });
}

// Export data to CSV
export function exportToCSV(data: Record<string, any>[], filename: string) {
  if (!data || data.length === 0) return;

  // Extract headers
  const headers = Object.keys(data[0]);
  
  // Convert data to CSV rows
  const csvRows = [
    headers.join(','), // header row
    ...data.map(row => 
      headers.map(fieldName => 
        JSON.stringify(row[fieldName] ?? '', (key, value) => 
          value === null ? '' : value
        )
      ).join(',')
    )
  ];

  // Create a Blob and download link
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
