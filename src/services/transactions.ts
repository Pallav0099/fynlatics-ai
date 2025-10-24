import { FinancialTransaction, TimeSeriesDataPoint, GatewayComparisonData, DashboardKPIs } from '@/types/canonical';

// Mock data generation functions
const generateMockTransactions = (count: number): FinancialTransaction[] => {
  const gateways = ['UPI', 'Razorpay', 'Paytm', 'PayU', 'CCAvenue', 'Instamojo', 'Cashfree'];
  const statuses = ['completed', 'pending', 'failed', 'refunded'] as const;
  
  const transactions: FinancialTransaction[] = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  for (let i = 0; i < count; i++) {
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const transactionDate = new Date(thirtyDaysAgo);
    transactionDate.setDate(thirtyDaysAgo.getDate() + randomDaysAgo);
    
    const amount = Math.floor(Math.random() * 100000) / 100; // Random amount between 0.00 and 1000.00 INR
    const gateway = gateways[Math.floor(Math.random() * gateways.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    transactions.push({
      transactionId: `tx_${Math.random().toString(36).substr(2, 9)}`,
      invoiceDate: transactionDate.toISOString(),
      paymentGatewaySource: gateway,
amount,
      currency: 'INR',
      status,
      vendor: `Vendor ${Math.floor(Math.random() * 10) + 1}`,
      metadata: {
        reference: `ref_${Math.random().toString(36).substr(2, 6)}`
      }
    });
  }

  return transactions;
};

// In-memory storage for mock data
const mockTransactions = generateMockTransactions(100);

// API Service
const TransactionService = {
  /**
   * Fetch transactions with optional filtering
   */
  async getTransactions(params?: {
    startDate?: string;
    endDate?: string;
    gateway?: string;
    limit?: number;
  }): Promise<FinancialTransaction[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let result = [...mockTransactions];
    
    // Apply filters
    if (params?.startDate) {
      const start = new Date(params.startDate);
      result = result.filter(tx => new Date(tx.invoiceDate) >= start);
    }
    
    if (params?.endDate) {
      const end = new Date(params.endDate);
      result = result.filter(tx => new Date(tx.invoiceDate) <= end);
    }
    
    if (params?.gateway) {
      result = result.filter(tx => 
        tx.paymentGatewaySource.toLowerCase() === params.gateway?.toLowerCase()
      );
    }
    
    if (params?.limit) {
      result = result.slice(0, params.limit);
    }
    
    return result;
  },

  /**
   * Get time series data for revenue
   */
  async getRevenueTimeSeries(params: {
    startDate: string;
    endDate: string;
    interval: 'day' | 'week' | 'month';
  }): Promise<TimeSeriesDataPoint[]> {
    const transactions = await this.getTransactions({
      startDate: params.startDate,
      endDate: params.endDate
    });

    // Group by date
    const dateMap = new Map<string, number>();
    
    transactions.forEach(tx => {
      const date = new Date(tx.invoiceDate);
      let key: string;
      
      if (params.interval === 'day') {
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (params.interval === 'week') {
        const weekStart = new Date(date);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        weekStart.setDate(diff);
        key = weekStart.toISOString().split('T')[0];
      } else { // month
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
      
      const current = dateMap.get(key) || 0;
      dateMap.set(key, current + tx.amount);
    });

    // Convert to array and sort by date
    return Array.from(dateMap.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },

  /**
   * Get gateway comparison data
   */
  async getGatewayComparison(params: {
    startDate: string;
    endDate: string;
  }): Promise<GatewayComparisonData[]> {
    const transactions = await this.getTransactions({
      startDate: params.startDate,
      endDate: params.endDate
    });

    const gatewayMap = new Map<string, { amount: number; count: number; currency: string }>();
    
    transactions.forEach(tx => {
      const gateway = tx.paymentGatewaySource;
      const current = gatewayMap.get(gateway) || { amount: 0, count: 0, currency: tx.currency };
      
      gatewayMap.set(gateway, {
        amount: current.amount + tx.amount,
        count: current.count + 1,
        currency: tx.currency
      });
    });

    return Array.from(gatewayMap.entries()).map(([gateway, data]) => ({
      gateway,
      amount: parseFloat(data.amount.toFixed(2)),
      count: data.count,
      currency: data.currency
    }));
  },

  /**
   * Get dashboard KPIs
   */
  async getDashboardKPIs(params: {
    startDate: string;
    endDate: string;
  }): Promise<DashboardKPIs> {
    const [transactions, gatewayData] = await Promise.all([
      this.getTransactions({
        startDate: params.startDate,
        endDate: params.endDate
      }),
      this.getGatewayComparison(params)
    ]);

    const totalRevenue = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalTransactions = transactions.length;
    const averageInvoiceValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    
    // Find top gateway by amount
    let topGateway = { name: 'N/A', amount: 0 };
    if (gatewayData.length > 0) {
      const maxAmount = Math.max(...gatewayData.map(g => g.amount));
      const top = gatewayData.find(g => g.amount === maxAmount);
      if (top) {
        topGateway = { name: top.gateway, amount: top.amount };
      }
    }

    return {
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      averageInvoiceValue: parseFloat(averageInvoiceValue.toFixed(2)),
      totalTransactions,
      topGateway,
      currency: transactions[0]?.currency || 'USD' // Default to USD if no transactions
    };
  }
};

export default TransactionService;
