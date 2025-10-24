import { NextResponse } from 'next/server';
import TransactionService from '@/services/transactions';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  try {
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const gateway = searchParams.get('gateway') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string, 10) : undefined;

    const transactions = await TransactionService.getTransactions({
      startDate,
      endDate,
      gateway,
      limit
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
