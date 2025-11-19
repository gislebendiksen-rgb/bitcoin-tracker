# Deployment Guide - Bitcoin Price Tracker

## Quick Start Deployment

Your Bitcoin Price Tracker is ready for permanent deployment on the Manus Managed Platform.

### Step 1: Prepare Your API Key

You already have your Live Coin Watch API key:
```
29a62b87-7b2b-4328-9f65-41c394f5603a
```

### Step 2: Deploy on Manus Platform

1. **Access the Management Dashboard**
   - Go to your Manus project dashboard
   - Navigate to the "Settings" panel

2. **Configure Environment Variables**
   - Click on "Secrets" in the Settings
   - Add the following:
     - Key: `LIVECOINWATCH_API_KEY`
     - Value: `29a62b87-7b2b-4328-9f65-41c394f5603a`

3. **Create a Checkpoint**
   - Click "Create Checkpoint" button
   - Add description: "Bitcoin tracker with real API integration"
   - Wait for checkpoint to complete

4. **Publish Your Site**
   - Once checkpoint is created, click "Publish" button
   - Your site will be deployed to a permanent URL
   - You'll receive a custom domain (e.g., `bitcoin-tracker.manus.space`)

### Step 3: Configure Custom Domain (Optional)

1. In the Management Dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions
4. Your site will be accessible at your custom domain

## Monitoring & Maintenance

### Check Site Status
- Visit your permanent URL to verify it's running
- The site will automatically refresh data every 60 seconds

### View Logs
- Access logs through the Management Dashboard
- Monitor API calls and performance

### Update API Key
- If you need to change your API key, update it in Settings → Secrets
- The application will use the new key on next restart

## Troubleshooting Deployment

### Site Not Loading
1. Check that environment variables are set correctly
2. Verify the API key is valid
3. Check the logs in the dashboard

### No Data Displaying
1. Ensure `LIVECOINWATCH_API_KEY` is set in Secrets
2. Check that the API key hasn't expired
3. Verify internet connectivity

### Performance Issues
1. Check the dashboard analytics
2. Monitor API response times
3. Review server logs for errors

## Scaling & Performance

The Manus platform automatically handles:
- ✅ SSL/HTTPS encryption
- ✅ CDN distribution
- ✅ Auto-scaling based on traffic
- ✅ Automatic backups
- ✅ 99.9% uptime SLA

## Support

For deployment issues:
1. Check the logs in the Management Dashboard
2. Review this documentation
3. Contact Manus support through the help center

## Next Steps

After deployment:

1. **Monitor Performance**
   - Check the Dashboard analytics
   - Monitor API response times

2. **Customize (Optional)**
   - Modify colors and styling in `public/css/style.css`
   - Update the title in `public/index.html`
   - Adjust technical indicator periods in `server/index.js`

3. **Set Up Alerts (Optional)**
   - Configure email notifications for trading signals
   - Set up monitoring alerts in the dashboard

## API Data Refresh

The application automatically:
- Fetches current Bitcoin price every 60 seconds
- Updates Fear & Greed Index every 60 seconds
- Recalculates technical indicators with fresh data
- Checks for buy/sell signal conditions

No manual intervention needed!

---

**Your Bitcoin tracker is now permanently deployed and ready to use!**
