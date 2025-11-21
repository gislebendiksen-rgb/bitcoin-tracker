# 🚀 Complete Deployment Guide for Gislebendiksen-rgb

This guide will walk you through deploying your Bitcoin tracker permanently in 10 minutes.

## ✅ Step 1: Create a New Repository on GitHub

1. Go to https://github.com/new
2. Fill in the repository details:
   - **Repository name**: `bitcoin-tracker`
   - **Description**: `Real-time Bitcoin price tracker with technical indicators and trading signals`
   - **Public**: Yes (so it's accessible)
   - **Initialize with README**: No (we already have one)
3. Click **"Create repository"**

## ✅ Step 2: Push Your Code to GitHub

Copy and paste these commands in your terminal:

```bash
cd /home/ubuntu/bitcoin_tracker

# Add your GitHub repository
git remote add origin https://github.com/Gislebendiksen-rgb/bitcoin-tracker.git

# Rename branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

**Note**: You'll be asked to authenticate. Use:
- Username: `Gislebendiksen-rgb`
- Password: Use a **Personal Access Token** (see below)

### Creating a Personal Access Token:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token"
3. Select "Generate new token (classic)"
4. Give it a name: `bitcoin-tracker-deployment`
5. Check these scopes:
   - `repo` (full control of private repositories)
   - `workflow` (update GitHub Action workflows)
6. Click "Generate token"
7. **Copy the token** (you'll only see it once!)
8. Use this token as your password when pushing

## ✅ Step 3: Deploy on Railway

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Click **"Deploy from GitHub repo"**
4. **Authorize Railway** with your GitHub account
5. Select your repository:
   - Search for: `bitcoin-tracker`
   - Click to select it
6. Railway will automatically:
   - Detect Node.js
   - Install dependencies
   - Build your app
   - Deploy it!

## ✅ Step 4: Add Environment Variables

1. In Railway dashboard, click on your `bitcoin-tracker` project
2. Go to the **"Variables"** tab
3. Click **"New Variable"**
4. Add:
   - **Key**: `LIVECOINWATCH_API_KEY`
   - **Value**: `29a62b87-7b2b-4328-9f65-41c394f5603a`
5. Click **"Save"**
6. Your app will automatically restart with the new variable

## ✅ Step 5: Get Your Permanent URL

1. In Railway dashboard, look for **"Deployments"**
2. Find your latest deployment (should say "Success")
3. Click on it to see the **public URL**
4. Copy the URL (it will look like: `https://bitcoin-tracker-production-xxxx.railway.app`)
5. **This is your permanent URL!** 🎉

## ✅ Step 6: Test Your Site

1. Open your permanent URL in a browser
2. Verify:
   - ✅ Bitcoin price is displaying
   - ✅ Fear & Greed Index shows
   - ✅ RSI and Moving Averages calculate
   - ✅ Chart displays
   - ✅ Data updates every 60 seconds

## 🎉 Done!

Your Bitcoin tracker is now **permanently deployed** and accessible 24/7!

### Your Permanent URL:
```
https://bitcoin-tracker-production-xxxx.railway.app
```
(Replace xxxx with your actual Railway URL)

---

## 📋 Troubleshooting

### Issue: "Push rejected"
- Make sure you created the repository on GitHub first
- Check that your Personal Access Token is correct
- Try again with the token as password

### Issue: "Deployment failed"
- Check the Railway logs for errors
- Verify environment variables are set correctly
- Make sure your code was pushed successfully

### Issue: "API Key error"
- Verify `LIVECOINWATCH_API_KEY` is set in Railway Variables
- Check the key value is exactly: `29a62b87-7b2b-4328-9f65-41c394f5603a`
- Restart the deployment in Railway

### Issue: "No data displaying"
- Wait 30 seconds for the app to fully start
- Refresh the page
- Check Railway logs for API errors

---

## 🔄 Making Updates

If you want to update your site later:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add -A
   git commit -m "Your update message"
   git push origin main
   ```
3. Railway automatically redeploys!

---

## 💰 Railway Pricing

- **Free tier**: Not available for always-on apps
- **Paid tier**: ~$5/month for always-on hosting
- **Billing**: Pay-as-you-go (you only pay for what you use)

To upgrade to paid:
1. Go to Railway dashboard
2. Click your profile (top right)
3. Go to "Billing"
4. Add a payment method
5. Your app stays running 24/7!

---

## 🎯 Next Steps

1. ✅ Create GitHub repository
2. ✅ Push code to GitHub
3. ✅ Deploy on Railway
4. ✅ Add environment variables
5. ✅ Get permanent URL
6. ✅ Test your site
7. ✅ Share with others!

---

## 📞 Need Help?

If you get stuck:
1. Check the Railway logs (click "Logs" tab)
2. Verify environment variables
3. Make sure your GitHub push was successful
4. Try redeploying from Railway dashboard

---

**Your Bitcoin tracker is ready to go live!** 🚀

Good luck! 🎉
