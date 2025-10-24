import { NextResponse } from 'next/server';
import TransactionService from '@/services/transactions';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  try {
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    const gatewayData = await TransactionService.getGatewayComparison({
      startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: endDate || new Date().toISOString().split('T')[0]
    });

    return NextResponse.json(gatewayData);
  } catch (error) {
    console.error('Error fetching gateway comparison data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gateway comparison data' },
      { status: 500 }
    );
  }
}
