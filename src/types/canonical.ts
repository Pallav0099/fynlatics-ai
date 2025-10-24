/**
 * Canonical data model for financial transactions in Finanlytics AI
 */

export interface FinancialTransaction {
  /** Unique identifier for the transaction */
  transactionId: string;
  
  /** Date when the invoice was created (ISO 8601 format) */
  invoiceDate: string;
  
  /** Source payment gateway for the transaction */
  paymentGatewaySource: string;
  
  /** Transaction amount */
  amount: number;
  
  /** Currency code (ISO 4217) */
  currency: string;
  
  /** Optional: Vendor or merchant name */
  vendor?: string;
  
  /** Optional: Transaction status */
  status?: 'completed' | 'pending' | 'failed' | 'refunded';
  
  /** Optional: Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Time-based aggregation of financial data
 */
export interface TimeSeriesDataPoint {
  date: string; // ISO date string
  value: number;
}

/**
 * Gateway comparison data point
 */
export interface GatewayComparisonData {
  gateway: string;
  amount: number;
  count: number;
  currency: string;
}

/**
 * KPI metrics for the dashboard
 */
export interface DashboardKPIs {
  totalRevenue: number;
  averageInvoiceValue: number;
  totalTransactions: number;
  topGateway: {
    name: string;
    amount: number;
  };
  currency: string;
}
