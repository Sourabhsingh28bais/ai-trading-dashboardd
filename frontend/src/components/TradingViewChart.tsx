import React, { useEffect, useRef, useState } from 'react';
import { marketDataService, MarketTick, CandleData } from '../services/MarketDataService';

// CandleData interface is now imported from MarketDataService

interface TradingViewChartProps {
  symbol: string;
  timeframe: string;
  onPriceUpdate?: (price: number) => void;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  symbol, 
  timeframe, 
  onPriceUpdate 
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [changePercent, setChangePercent] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [marketStatus, setMarketStatus] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Generate realistic market data
  const generateMarketData = (symbol: string, days: number = 100): CandleData[] => {
    const data: CandleData[] = [];
    let basePrice = getBasePrice(symbol);
    const now = Date.now();
    
    for (let i = days; i >= 0; i--) {
      const time = now - (i * 24 * 60 * 60 * 1000); // Daily data
      
      // Market volatility simulation
      const volatility = 0.02 + Math.random() * 0.03; // 2-5% volatility
      const trend = (Math.random() - 0.5) * 0.001; // Small trend component
      
      // Generate OHLC data
      const open = basePrice;
      const change = (Math.random() - 0.5) * volatility + trend;
      const close = open * (1 + change);
      
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      
      const volume = Math.floor(Math.random() * 1000000) + 100000;
      
      data.push({
        time,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume
      });
      
      basePrice = close; // Use close as next open
    }
    
    return data;
  };

  const getBasePrice = (symbol: string): number => {
    const prices: { [key: string]: number } = {
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
      'TITAN': 3200
    };
    
    return prices[symbol] || 1000 + Math.random() * 2000;
  };

  // Simulate real-time price updates
  useEffect(() => {
    const data = generateMarketData(symbol);
    setCandleData(data);
    
    if (data.length > 0) {
      const latestCandle = data[data.length - 1];
      setCurrentPrice(latestCandle.close);
      setVolume(latestCandle.volume);
      
      if (data.length > 1) {
        const previousClose = data[data.length - 2].close;
        setPriceChange(latestCandle.close - previousClose);
      }
      
      onPriceUpdate?.(latestCandle.close);
    }
    
    setIsLoading(false);
  }, [symbol, onPriceUpdate]);

  // Real-time price simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (candleData.length === 0) return;
      
      const lastCandle = candleData[candleData.length - 1];
      const volatility = 0.001; // 0.1% per update
      const change = (Math.random() - 0.5) * volatility;
      const newPrice = lastCandle.close * (1 + change);
      
      setCurrentPrice(newPrice);
      setPriceChange(newPrice - lastCandle.close);
      onPriceUpdate?.(newPrice);
      
      // Update the last candle
      const updatedData = [...candleData];
      updatedData[updatedData.length - 1] = {
        ...lastCandle,
        close: newPrice,
        high: Math.max(lastCandle.high, newPrice),
        low: Math.min(lastCandle.low, newPrice)
      };
      setCandleData(updatedData);
    }, 2000); // Update every 2 seconds
    
    return () => clearInterval(interval);
  }, [candleData, onPriceUpdate]);

  // Draw the chart
  useEffect(() => {
    if (!canvasRef.current || candleData.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = rect.width;
    const height = rect.height;
    
    // Clear canvas
    ctx.fillStyle = '#1a1f2e';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate price range
    const prices = candleData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const padding = priceRange * 0.1;
    
    const chartMinPrice = minPrice - padding;
    const chartMaxPrice = maxPrice + padding;
    const chartPriceRange = chartMaxPrice - chartMinPrice;
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines (price levels)
    for (let i = 0; i <= 10; i++) {
      const y = (height * i) / 10;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      
      // Price labels
      const price = chartMaxPrice - (chartPriceRange * i) / 10;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '12px Arial';
      ctx.fillText(price.toFixed(2), width - 60, y + 4);
    }
    
    // Vertical grid lines (time)
    const visibleCandles = Math.min(candleData.length, 50);
    const candleWidth = width / visibleCandles;
    
    for (let i = 0; i < visibleCandles; i += 5) {
      const x = i * candleWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw candlesticks
    const startIndex = Math.max(0, candleData.length - visibleCandles);
    
    for (let i = startIndex; i < candleData.length; i++) {
      const candle = candleData[i];
      const x = (i - startIndex) * candleWidth;
      const centerX = x + candleWidth / 2;
      
      // Calculate Y positions
      const openY = height - ((candle.open - chartMinPrice) / chartPriceRange) * height;
      const closeY = height - ((candle.close - chartMinPrice) / chartPriceRange) * height;
      const highY = height - ((candle.high - chartMinPrice) / chartPriceRange) * height;
      const lowY = height - ((candle.low - chartMinPrice) / chartPriceRange) * height;
      
      const isGreen = candle.close > candle.open;
      const color = isGreen ? '#00d4aa' : '#e74c3c';
      
      // Draw wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, highY);
      ctx.lineTo(centerX, lowY);
      ctx.stroke();
      
      // Draw body
      ctx.fillStyle = color;
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY);
      const bodyWidth = candleWidth * 0.6;
      
      ctx.fillRect(
        centerX - bodyWidth / 2,
        bodyTop,
        bodyWidth,
        Math.max(bodyHeight, 1)
      );
    }
    
    // Draw current price line
    if (currentPrice > 0) {
      const priceY = height - ((currentPrice - chartMinPrice) / chartPriceRange) * height;
      
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, priceY);
      ctx.lineTo(width, priceY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Price label
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(width - 80, priceY - 12, 75, 24);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(currentPrice.toFixed(2), width - 75, priceY + 4);
    }
    
  }, [candleData, currentPrice]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="chart-loading">
        <div className="loading-spinner"></div>
        <p>Loading market data...</p>
      </div>
    );
  }

  return (
    <div className="tradingview-chart" ref={chartContainerRef}>
      <div className="chart-header">
        <div className="symbol-info">
          <h3>{symbol}</h3>
          <span className="timeframe">{timeframe}</span>
        </div>
        <div className="price-info">
          <span className="current-price">{formatCurrency(currentPrice)}</span>
          <span className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} 
            ({((priceChange / currentPrice) * 100).toFixed(2)}%)
          </span>
        </div>
        <div className="volume-info">
          <span>Volume: {volume.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="chart-container">
        <canvas 
          ref={canvasRef}
          className="price-chart"
        />
      </div>
      
      <div className="chart-controls">
        <div className="timeframe-buttons">
          {['1m', '5m', '15m', '1H', '1D', '1W'].map(tf => (
            <button 
              key={tf}
              className={`tf-btn ${timeframe === tf ? 'active' : ''}`}
            >
              {tf}
            </button>
          ))}
        </div>
        
        <div className="chart-tools">
          <button className="tool-btn">📏 Measure</button>
          <button className="tool-btn">📈 Trend Line</button>
          <button className="tool-btn">📊 Indicators</button>
        </div>
      </div>
    </div>
  );
};

export default TradingViewChart;