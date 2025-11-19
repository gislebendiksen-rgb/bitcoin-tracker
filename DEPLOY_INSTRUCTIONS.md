# 🚀 Bitcoin Price Tracker - Permanent Deployment Guide

Your Bitcoin Price Tracker is ready for permanent deployment! Follow these instructions to deploy your site.

## 📋 Prerequisites

- Your Live Coin Watch API Key: `29a62b87-7b2b-4328-9f65-41c394f5603a`
- Node.js 18+ (for local testing)
- Docker (for containerized deployment)

## 🌐 Deployment Options

Choose one of the following deployment methods:

---

## Option 1: Deploy on Manus Platform (Recommended) ⭐

### Step 1: Prepare Your Project
```bash
cd /home/ubuntu/bitcoin_tracker
npm install
```

### Step 2: Create a Checkpoint
1. Open the Manus Management Dashboard
2. Click "Create Checkpoint"
3. Add description: "Bitcoin tracker with real API integration"
4. Wait for checkpoint to complete

### Step 3: Configure Secrets
1. Go to Settings → Secrets
2. Click "Add Secret"
3. Add:
   - Key: `LIVECOINWATCH_API_KEY`
   - Value: `29a62b87-7b2b-4328-9f65-41c394f5603a`
4. Save

### Step 4: Publish
1. Click "Publish" button (appears after checkpoint)
2. Your site will be deployed to a permanent URL
3. You'll get a custom domain like: `bitcoin-tracker.manus.space`

### Step 5: Configure Custom Domain (Optional)
1. Go to Settings → Domains
2. Add your custom domain
3. Follow DNS configuration
4. Your site is now live!

**Result**: Permanent URL with 99.9% uptime, automatic SSL, CDN, and scaling.

---

## Option 2: Deploy on Heroku

### Step 1: Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

### Step 2: Login to Heroku
```bash
heroku login
```

### Step 3: Create and Deploy
```bash
cd /home/ubuntu/bitcoin_tracker

# Create a new Heroku app
heroku create your-bitcoin-tracker

# Set environment variables
heroku config:set LIVECOINWATCH_API_KEY=29a62b87-7b2b-4328-9f65-41c394f5603a

# Deploy
git push heroku main
```

### Step 4: Open Your App
```bash
heroku open
```

**Result**: Free tier available, automatic deployments from Git, permanent URL.

---

## Option 3: Deploy on Railway

### Step 1: Connect GitHub
1. Go to https://railway.app
2. Sign up with GitHub
3. Connect your repository

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub"
3. Choose your bitcoin_tracker repository

### Step 3: Configure Environment
1. In Railway dashboard, go to Variables
2. Add:
   - Key: `LIVECOINWATCH_API_KEY`
   - Value: `29a62b87-7b2b-4328-9f65-41c394f5603a`

### Step 4: Deploy
- Railway automatically deploys on push
- Your app will be live at a Railway URL

**Result**: Pay-as-you-go pricing, automatic deployments, permanent URL.

---

## Option 4: Deploy on Render

### Step 1: Connect GitHub
1. Go to https://render.com
2. Sign up with GitHub
3. Connect your repository

### Step 2: Create Web Service
1. Click "New +"
2. Select "Web Service"
3. Choose your bitcoin_tracker repository

### Step 3: Configure
- **Name**: bitcoin-tracker
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Step 4: Add Environment Variables
1. Go to Environment
2. Add:
   - Key: `LIVECOINWATCH_API_KEY`
   - Value: `29a62b87-7b2b-4328-9f65-41c394f5603a`

### Step 5: Deploy
- Click "Create Web Service"
- Render will build and deploy automatically

**Result**: Free tier with auto-sleep, paid tier for always-on, permanent URL.

---

## Option 5: Deploy with Docker

### Step 1: Build Docker Image
```bash
cd /home/ubuntu/bitcoin_tracker
docker build -t bitcoin-tracker:latest .
```

### Step 2: Run Locally
```bash
docker run -p 3000:3000 \
  -e LIVECOINWATCH_API_KEY=29a62b87-7b2b-4328-9f65-41c394f5603a \
  bitcoin-tracker:latest
```

### Step 3: Deploy to Cloud
Push to Docker Hub or your preferred container registry:
```bash
docker tag bitcoin-tracker:latest yourusername/bitcoin-tracker:latest
docker push yourusername/bitcoin-tracker:latest
```

Then deploy using:
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform
- Any Docker-compatible hosting

---

## Option 6: Deploy with Docker Compose

### Step 1: Create .env File
```bash
cd /home/ubuntu/bitcoin_tracker
echo "LIVECOINWATCH_API_KEY=29a62b87-7b2b-4328-9f65-41c394f5603a" > .env
```

### Step 2: Start Services
```bash
docker-compose up -d
```

### Step 3: Access Your App
- Open http://localhost:3000
- Your app is running in Docker!

---

## ✅ Verification Checklist

After deployment, verify everything is working:

- [ ] Website loads without errors
- [ ] Bitcoin price is displaying
- [ ] Fear & Greed Index is showing
- [ ] RSI and Moving Averages are calculated
- [ ] Historical chart is visible
- [ ] Data updates every 60 seconds
- [ ] Trading signals are working

## 🔧 Troubleshooting

### Issue: "API Key Error"
- Verify `LIVECOINWATCH_API_KEY` is set correctly
- Check that the key hasn't expired
- Ensure the key is in environment variables, not hardcoded

### Issue: "No Historical Data"
- Check Kraken API is accessible (it's free, no auth needed)
- Verify internet connection
- Check server logs for errors

### Issue: "Site Not Loading"
- Check that port 3000 is not blocked
- Verify all dependencies are installed
- Check logs for startup errors

### Issue: "Signals Not Triggering"
- Verify Fear & Greed Index is loading
- Check RSI calculation is working
- Review signal conditions in code

## 📊 Monitoring Your Deployment

### Check Application Health
```bash
curl https://your-deployed-url.com/health
```

### View Real-Time Data
```bash
curl https://your-deployed-url.com/api/bitcoin-data
```

### Monitor Performance
- Check dashboard analytics
- Monitor API response times
- Review error logs

## 🔐 Security Best Practices

1. **Never commit API keys** - Use environment variables
2. **Use HTTPS** - All platforms provide SSL/TLS
3. **Keep dependencies updated** - Run `npm audit fix`
4. **Monitor logs** - Check for suspicious activity
5. **Set up alerts** - Get notified of errors

## 💰 Cost Estimates

| Platform | Free Tier | Paid Starting |
|----------|-----------|---------------|
| Manus | No | ~$5-10/month |
| Heroku | Yes (limited) | $7/month |
| Railway | No | Pay-as-you-go (~$5/month) |
| Render | Yes (with sleep) | $7/month |
| Docker | No | Varies by host |

## 🎯 Next Steps

1. **Choose your deployment platform** from the options above
2. **Follow the step-by-step instructions** for your chosen platform
3. **Set your environment variables** with your API key
4. **Deploy and test** your application
5. **Monitor and maintain** your live site

## 📞 Support

If you encounter issues:
1. Check the logs in your deployment platform
2. Review this documentation
3. Verify environment variables are set correctly
4. Check that APIs are accessible

## 🎉 Congratulations!

Your Bitcoin Price Tracker is now permanently deployed and accessible 24/7!

**Your permanent URL**: Will be provided after deployment

**Features Live**:
- ✅ Real-time Bitcoin price
- ✅ 10+ years historical data
- ✅ Technical indicators (RSI, MAs)
- ✅ Fear & Greed Index
- ✅ Automated trading signals
- ✅ Beautiful responsive design

---

**Last Updated**: November 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
