# Bitcoin Price Tracker - Live Edition

A real-time Bitcoin price tracker with technical indicators, Fear & Greed Index integration, and automated trading signals.

## Features

✅ **Real-Time Bitcoin Price** - Live price data from Live Coin Watch API  
✅ **Historical Data** - 10+ years of daily closing prices from Kraken API  
✅ **Technical Indicators**:
   - RSI (Relative Strength Index) - 14 period
   - 50-Day Moving Average
   - 200-Day Moving Average

✅ **Fear & Greed Index** - Real-time sentiment data from Alternative.me  
✅ **Automated Trading Signals**:
   - **BUY Signal**: When Fear & Greed < 20 AND RSI < 30
   - **SELL Signal**: When Fear & Greed > 80 AND RSI > 70

✅ **Interactive Charts** - Beautiful price visualization  
✅ **Responsive Design** - Works on desktop and mobile

## Technology Stack

- **Backend**: Node.js + Express.js
- **Frontend**: HTML5, CSS3, JavaScript (Chart.js for visualization)
- **APIs**:
  - Kraken API (historical data, no auth required)
  - Live Coin Watch API (current price, requires API key)
  - Alternative.me API (Fear & Greed Index, no auth required)

## Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Live Coin Watch API key (free signup at https://www.livecoinwatch.com/)

### Local Development

1. Clone the repository
```bash
git clone <repository-url>
cd bitcoin_tracker
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env and add your Live Coin Watch API key
```

4. Start the development server
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Deployment

### Docker Deployment

1. Build the Docker image
```bash
docker build -t bitcoin-tracker .
```

2. Run the container
```bash
docker run -p 3000:3000 \
  -e LIVECOINWATCH_API_KEY=your_api_key_here \
  bitcoin-tracker
```

### Deployment to Manus Platform

1. Create a checkpoint of your project
2. Click the "Publish" button in the Management UI
3. Your site will be deployed to a permanent URL

### Deployment to Other Platforms

#### Heroku
```bash
heroku login
heroku create your-app-name
heroku config:set LIVECOINWATCH_API_KEY=your_api_key_here
git push heroku main
```

#### Railway
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

#### Render
1. Connect your GitHub repository
2. Set environment variables
3. Deploy and get a permanent URL

## API Endpoints

### GET `/api/bitcoin-data`
Returns all Bitcoin data including price, indicators, and signals.

**Response:**
```json
{
  "currentPrice": 94238.36,
  "fearGreedIndex": {
    "value": 10,
    "classification": "Extreme Fear",
    "timestamp": 1763251200
  },
  "rsi": "30.85",
  "ma50": "110303.45",
  "ma200": "110468.67",
  "buySignal": false,
  "sellSignal": false,
  "historicalData": [
    {
      "date": "2024-11-17",
      "price": 89850
    },
    ...
  ]
}
```

### GET `/health`
Health check endpoint for monitoring.

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `LIVECOINWATCH_API_KEY` | Your Live Coin Watch API key | Yes |
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment (production/development) | No |

## Data Sources

- **Current Bitcoin Price**: Live Coin Watch API
- **Historical Data**: Kraken Public API (free, no auth)
- **Fear & Greed Index**: Alternative.me API (free, no auth)

## Trading Signals

The application automatically generates trading signals based on technical analysis:

### Buy Signal Conditions
- Fear & Greed Index < 20 (Extreme Fear)
- AND RSI (14) < 30 (Oversold)

### Sell Signal Conditions
- Fear & Greed Index > 80 (Extreme Greed)
- AND RSI (14) > 70 (Overbought)

**Note**: These signals are for informational purposes only. Always conduct your own research before making trading decisions.

## Performance

- Data updates every 60 seconds
- Historical data cached and updated daily
- Optimized for fast load times
- Mobile-responsive design

## Troubleshooting

### API Key Issues
- Ensure your Live Coin Watch API key is correct
- Check that the key has not expired
- Verify the key is set in environment variables

### No Historical Data
- Check that Kraken API is accessible
- Verify internet connection
- Check server logs for errors

### Signals Not Triggering
- Ensure all data is loading correctly
- Check the Fear & Greed Index and RSI values
- Review signal conditions in the code

## License

ISC

## Support

For issues or questions, please check the logs or contact support.

## Disclaimer

This tool is for informational and educational purposes only. It is not financial advice. Always conduct your own research and consult with a financial advisor before making investment decisions.
