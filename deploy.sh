#!/bin/bash

# Bitcoin Price Tracker - Deployment Script
# This script prepares your application for deployment

echo "🚀 Bitcoin Price Tracker - Deployment Preparation"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your Live Coin Watch API key"
fi

echo ""
echo "✅ Deployment preparation complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env and add your Live Coin Watch API key"
echo "2. Run: npm start"
echo "3. Visit: http://localhost:3000"
echo ""
echo "🌐 For production deployment:"
echo "   - Use Docker: docker build -t bitcoin-tracker . && docker run -p 3000:3000 bitcoin-tracker"
echo "   - Or deploy to Heroku, Railway, Render, or Manus platform"
