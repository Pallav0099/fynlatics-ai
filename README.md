# Finanlytics AI Dashboard

A comprehensive financial analytics dashboard built with Next.js and VisActor, specifically designed for monitoring and analyzing Indian payment gateway transactions in INR.

## Features

- 📊 **Payment Analytics** - Track transactions across major Indian payment gateways
- 💰 **INR Support** - All monetary values displayed in Indian Rupees (₹)
- 📈 **Revenue Trends** - Visualize revenue growth and transaction patterns over time
- 🔍 **Gateway Comparison** - Compare performance across different payment gateways
- 🌗 **Dark Mode** - Seamless dark/light mode switching with system preference support
- 📱 **Responsive Design** - Fully responsive layout that works on all devices
- ⚡ **Real-time Data** - Fetch and display real-time transaction data

## Supported Payment Gateways

- **UPI** - Unified Payments Interface
- **Razorpay** - Popular payment gateway for businesses
- **Paytm** - Leading digital wallet and payment system
- **PayU** - Comprehensive payment solutions
- **CCAvenue** - One of India's largest payment gateways
- **Instamojo** - Simple payment links and checkout
- **Cashfree** - Complete payment and banking solutions

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [VisActor](https://visactor.io/) - Visualization library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn](https://ui.shadcn.com/) - UI components
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Next-Themes](https://github.com/pacocoursey/next-themes) - Theme management

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/your-username/fynlatics-ai.git
cd fynlatics-ai
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

Create a `.env.local` file and add your API keys:

```env
NEXT_PUBLIC_API_URL=your_api_url
# Add other environment variables as needed
```

4. Run the development server

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Data Format

The dashboard expects transaction data in the following format:

```typescript
interface Transaction {
  transactionId: string;
  invoiceDate: string; // ISO 8601 format
  paymentGatewaySource: string;
  amount: number; // in INR
  currency: 'INR';
  vendor?: string;
  status?: 'completed' | 'pending' | 'failed' | 'refunded';
  metadata?: Record<string, unknown>;
}
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```bash
src/
├── app/ # App router pages
├── components/ # React components
│ ├── chart-blocks/ # Chart components
│ ├── nav/ # Navigation components
│ └── ui/ # UI components
├── config/ # Configuration files
├── data/ # Sample data
├── hooks/ # Custom hooks
├── lib/ # Utility functions
├── style/ # Global style
└── types/ # TypeScript types
```

## Charts

This template includes several chart examples:

- Average Tickets Created (Bar Chart)
- Ticket by Channels (Gauge Chart)
- Conversions (Circle Packing Chart)
- Customer Satisfaction (Linear Progress)
- Metrics Overview

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [VisActor](https://visactor.io/) - For the amazing visualization library
- [Vercel](https://vercel.com) - For the incredible deployment platform
- [Next.js](https://nextjs.org/) - For the awesome React framework
