import { NextResponse } from 'next/server';
import TransactionService from '@/services/transactions';

type IntervalType = 'day' | 'week' | 'month';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  try {
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const interval = (searchParams.get('interval') || 'day') as IntervalType;

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }

    const timeSeriesData = await TransactionService.getRevenueTimeSeries({
      startDate,
      endDate,
      interval
    });

    return NextResponse.json(timeSeriesData);
  } catch (error) {
    console.error('Error fetching time series data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch time series data' },
      { status: 500 }
    );
  }
}
