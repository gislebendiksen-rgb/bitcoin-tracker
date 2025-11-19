const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const LCW_API_KEY = '29a62b87-7b2b-4328-9f65-41c394f5603a'; // Live Coin Watch API Key

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Helper function to calculate RSI
function calculateRSI(prices, period = 14) {
  if (prices.length < period + 1) return null;

  let gains = 0;
  let losses = 0;

  // Calculate initial average gain and loss
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Calculate RSI values
  const rsiValues = [];
  for (let i = period; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) {
      avgGain = (avgGain * (period - 1) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period;
    }

    const rs = avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);
    rsiValues.push(rsi);
  }

  return rsiValues[rsiValues.length - 1];
}

// Helper function to calculate Moving Average
function calculateMovingAverage(prices, period) {
  if (prices.length < period) return null;
  const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
}

// Fetch Bitcoin historical data from Kraken (free, no auth required)
async function getBitcoinHistoricalData() {
  try {
    console.log('Fetching Bitcoin historical data from Kraken...');
    
    const response = await axios.get(
      'https://api.kraken.com/0/public/OHLC',
      {
        params: {
          pair: 'XBTUSD',
          interval: 1440, // Daily
          since: 0 // Get all available data
        },
        timeout: 30000
      }
    );

    if (response.data.error && response.data.error.length > 0) {
      throw new Error(response.data.error[0]);
    }

    const ohlcData = response.data.result.XXBTZUSD;
    const prices = ohlcData.map(candle => ({
      date: new Date(candle[0] * 1000).toISOString().split('T')[0],
      price: parseFloat(candle[4]) // Close price
    }));

    console.log(`Fetched ${prices.length} historical data points`);
    return prices;
  } catch (error) {
    console.error('Error fetching Bitcoin historical data:', error.message);
    throw error;
  }
}

// Fetch current Bitcoin price from Live Coin Watch
async function getCurrentBitcoinPrice() {
  try {
    console.log('Fetching current Bitcoin price from Live Coin Watch...');
    
    const response = await axios.post(
      'https://api.livecoinwatch.com/coins/single',
      {
        currency: 'USD',
        code: 'BTC',
        meta: true
      },
      {
        headers: {
          'x-api-key': LCW_API_KEY,
          'content-type': 'application/json'
        },
        timeout: 10000
      }
    );

    const price = response.data.rate;
    console.log(`Current Bitcoin price: $${price.toFixed(2)}`);
    return price;
  } catch (error) {
    console.error('Error fetching current Bitcoin price:', error.message);
    throw error;
  }
}

// Fetch Fear & Greed Index
async function getFearGreedIndex() {
  try {
    console.log('Fetching Fear & Greed Index...');
    
    const response = await axios.get('https://api.alternative.me/fng/?limit=1', {
      timeout: 10000
    });
    
    const data = response.data.data[0];
    const result = {
      value: parseInt(data.value),
      classification: data.value_classification,
      timestamp: parseInt(data.timestamp)
    };
    
    console.log(`Fear & Greed Index: ${result.value} (${result.classification})`);
    return result;
  } catch (error) {
    console.error('Error fetching Fear & Greed Index:', error.message);
    throw error;
  }
}

// API endpoint to get all data
app.get('/api/bitcoin-data', async (req, res) => {
  try {
    console.log('=== Fetching Bitcoin data ===');
    
    const [historicalData, currentPrice, fearGreedIndex] = await Promise.all([
      getBitcoinHistoricalData(),
      getCurrentBitcoinPrice(),
      getFearGreedIndex()
    ]);

    // Extract closing prices for calculations
    const closingPrices = historicalData.map(d => d.price);

    // Calculate technical indicators
    const rsi = calculateRSI(closingPrices, 14);
    const ma50 = calculateMovingAverage(closingPrices, 50);
    const ma200 = calculateMovingAverage(closingPrices, 200);

    console.log(`RSI: ${rsi ? rsi.toFixed(2) : 'N/A'}`);
    console.log(`50-Day MA: ${ma50 ? ma50.toFixed(2) : 'N/A'}`);
    console.log(`200-Day MA: ${ma200 ? ma200.toFixed(2) : 'N/A'}`);

    // Determine signals
    let buySignal = false;
    let sellSignal = false;

    if (fearGreedIndex.value < 20 && rsi < 30) {
      buySignal = true;
      console.log('🟢 BUY SIGNAL TRIGGERED!');
    }

    if (fearGreedIndex.value > 80 && rsi > 70) {
      sellSignal = true;
      console.log('🔴 SELL SIGNAL TRIGGERED!');
    }

    const responseData = {
      currentPrice,
      fearGreedIndex,
      rsi: rsi ? rsi.toFixed(2) : null,
      ma50: ma50 ? ma50.toFixed(2) : null,
      ma200: ma200 ? ma200.toFixed(2) : null,
      buySignal,
      sellSignal,
      historicalData: historicalData.slice(-365) // Last year for charting
    };

    console.log('Sending response...');
    res.json(responseData);
  } catch (error) {
    console.error('Error in /api/bitcoin-data:', error.message);
    res.status(500).json({ error: 'Failed to fetch Bitcoin data', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Bitcoin Tracker server running on http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see the website`);
});
