// Market Data Service - Simulates real-time market data like TradingView
export interface MarketTick {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

class MarketDataService {
  private subscribers: Map<string, ((data: MarketTick) => void)[]> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private currentPrices: Map<string, number> = new Map();

  // Base prices for different symbols
  private basePrices: { [key: string]: number } = {
    'NIFTY50': 19500,
    'SENSEX': 65000,
    'RELIANCE': 2500,
    'TCS': 3500,
    'INFY': 1400,
    'HDFC': 1650,
    'ICICIBANK': 950,
    'SBIN': 580,
    'BHARTIARTL': 850,
    'ITC': 420,
    'HINDUNILVR': 2600,
    'KOTAKBANK': 1750,
    'LT': 3200,
    'ASIANPAINT': 3100,
    'MARUTI': 10500,
    'HCLTECH': 1200,
    'AXISBANK': 1050,
    'ULTRACEMCO': 8500,
    'SUNPHARMA': 1100,
    'TITAN': 3200,
    'WIPRO': 450,
    'TECHM': 1150,
    'POWERGRID': 220,
    'NTPC': 180,
    'ONGC': 150,
    'COALINDIA': 200,
    'TATAMOTORS': 450,
    'TATASTEEL': 120,
    'JSWSTEEL': 750,
    'HINDALCO': 400
  };

  constructor() {
    // Initialize current prices
    Object.entries(this.basePrices).forEach(([symbol, price]) => {
      this.currentPrices.set(symbol, price);
    });
  }

  // Subscribe to real-time price updates
  subscribe(symbol: string, callback: (data: MarketTick) => void): () => void {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, []);
      this.startPriceUpdates(symbol);
    }

    const callbacks = this.subscribers.get(symbol)!;
    callbacks.push(callback);

    // Send initial price
    const currentPrice = this.currentPrices.get(symbol) || this.basePrices[symbol] || 1000;
    callback({
      symbol,
      price: currentPrice,
      change: 0,
      changePercent: 0,
      volume: Math.floor(Math.random() * 1000000) + 100000,
      timestamp: Date.now()
    });

    // Return unsubscribe function
    return () => {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      
      if (callbacks.length === 0) {
        this.stopPriceUpdates(symbol);
        this.subscribers.delete(symbol);
      }
    };
  }

  private startPriceUpdates(symbol: string) {
    const interval = setInterval(() => {
      this.updatePrice(symbol);
    }, 1000 + Math.random() * 2000); // Random interval between 1-3 seconds

    this.intervals.set(symbol, interval);
  }

  private stopPriceUpdates(symbol: string) {
    const interval = this.intervals.get(symbol);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(symbol);
    }
  }

  private updatePrice(symbol: string) {
    const callbacks = this.subscribers.get(symbol);
    if (!callbacks || callbacks.length === 0) return;

    const currentPrice = this.currentPrices.get(symbol) || this.basePrices[symbol] || 1000;
    const basePrice = this.basePrices[symbol] || 1000;
    
    // Generate realistic price movement
    const volatility = this.getVolatility(symbol);
    const trend = this.getTrend(symbol);
    const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
    
    const priceChange = currentPrice * (volatility * randomFactor + trend) * 0.01;
    const newPrice = Math.max(currentPrice + priceChange, basePrice * 0.5); // Prevent negative prices
    
    const change = newPrice - basePrice;
    const changePercent = (change / basePrice) * 100;
    
    this.currentPrices.set(symbol, newPrice);

    const marketTick: MarketTick = {
      symbol,
      price: parseFloat(newPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 100000,
      timestamp: Date.now()
    };

    callbacks.forEach(callback => callback(marketTick));
  }

  private getVolatility(symbol: string): number {
    // Different volatility for different types of stocks
    const highVolatility = ['TATAMOTORS', 'TATASTEEL', 'JSWSTEEL', 'HINDALCO'];
    const lowVolatility = ['NIFTY50', 'SENSEX', 'ITC', 'HINDUNILVR'];
    
    if (highVolatility.includes(symbol)) return 2.5;
    if (lowVolatility.includes(symbol)) return 0.8;
    return 1.5; // Medium volatility
  }

  private getTrend(symbol: string): number {
    // Simulate market trends (very small bias)
    const hour = new Date().getHours();
    
    // Market opening hours trend simulation
    if (hour >= 9 && hour <= 11) return 0.1; // Morning rally
    if (hour >= 14 && hour <= 15) return -0.05; // Afternoon dip
    
    return (Math.random() - 0.5) * 0.1; // Random small trend
  }

  // Generate historical candlestick data
  generateHistoricalData(symbol: string, days: number = 100): CandleData[] {
    const data: CandleData[] = [];
    const basePrice = this.basePrices[symbol] || 1000;
    let currentPrice = basePrice;
    const now = Date.now();
    
    for (let i = days; i >= 0; i--) {
      const time = now - (i * 24 * 60 * 60 * 1000);
      
      // Generate daily OHLC
      const open = currentPrice;
      const volatility = this.getVolatility(symbol) * 0.01;
      const dailyChange = (Math.random() - 0.5) * volatility;
      
      const close = open * (1 + dailyChange);
      const high = Math.max(open, close) * (1 + Math.random() * 0.02);
      const low = Math.min(open, close) * (1 - Math.random() * 0.02);
      
      data.push({
        time,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: Math.floor(Math.random() * 5000000) + 500000
      });
      
      currentPrice = close;
    }
    
    // Update current price
    this.currentPrices.set(symbol, currentPrice);
    
    return data;
  }

  // Get current price for a symbol
  getCurrentPrice(symbol: string): number {
    return this.currentPrices.get(symbol) || this.basePrices[symbol] || 1000;
  }

  // Simulate market status
  isMarketOpen(): boolean {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    // Market open Monday-Friday, 9:15 AM to 3:30 PM IST
    return day >= 1 && day <= 5 && hour >= 9 && hour <= 15;
  }

  // Get market status text
  getMarketStatus(): string {
    if (this.isMarketOpen()) {
      return 'Market Open';
    } else {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      
      if (day === 0 || day === 6) return 'Weekend - Market Closed';
      if (hour < 9) return 'Pre-Market';
      if (hour > 15) return 'After Hours';
      return 'Market Closed';
    }
  }
}

// Export singleton instance
export const marketDataService = new MarketDataService();
export default MarketDataService;