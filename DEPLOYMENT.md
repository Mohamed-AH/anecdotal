# 🚀 Deployment Guide

This guide covers deploying Anecdotal to various free hosting platforms.

## Prerequisites

Before deploying, ensure you have:
- ✅ A MongoDB Atlas account with a cluster set up
- ✅ Your MongoDB connection string ready
- ✅ Your code pushed to a GitHub repository

---

## Option 1: Render.com (Recommended) ⭐

**Why Render?**
- 750 hours/month free tier
- Auto-deploy from GitHub
- Easy environment variable management
- Great performance

### Steps:

1. **Create a Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `anecdotal` repository

3. **Configure the Service**
   ```
   Name: anecdotal (or your preferred name)
   Region: Choose closest to you
   Branch: main (or master)
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**
   - Click "Advanced" → "Add Environment Variable"
   - Add:
     ```
     Key: DB_STRING
     Value: your_mongodb_connection_string
     ```

5. **Deploy!**
   - Click "Create Web Service"
   - Wait 2-3 minutes for the build
   - Your app will be live at `https://your-app-name.onrender.com`

### Auto-Deploy
- Every push to your main branch will automatically trigger a new deployment
- Check the "Events" tab to monitor deployments

---

## Option 2: Railway.app

**Why Railway?**
- $5 free credit/month
- Modern UI and great developer experience
- Built-in metrics and logging

### Steps:

1. **Create a Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your `anecdotal` repository

3. **Add Environment Variables**
   - Go to your project → "Variables" tab
   - Add:
     ```
     DB_STRING=your_mongodb_connection_string
     ```

4. **Generate Domain**
   - Go to "Settings" tab
   - Click "Generate Domain"
   - Your app will be live at the generated URL

---

## Option 3: Fly.io

**Why Fly.io?**
- Free tier available
- Global deployment (choose your region)
- Good for low-latency worldwide

### Steps:

1. **Install Fly CLI**
   ```bash
   # macOS
   brew install flyctl

   # Windows
   pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"

   # Linux
   curl -L https://fly.io/install.sh | sh
   ```

2. **Sign Up / Log In**
   ```bash
   flyctl auth signup
   # or
   flyctl auth login
   ```

3. **Launch Your App**
   ```bash
   cd /path/to/anecdotal
   flyctl launch
   ```

4. **Set Environment Variables**
   ```bash
   flyctl secrets set DB_STRING="your_mongodb_connection_string"
   ```

5. **Deploy**
   ```bash
   flyctl deploy
   ```

---

## Option 4: Cyclic.sh

**Why Cyclic?**
- Unlimited free apps
- Runs on AWS
- Zero configuration needed
- Great for side projects

### Steps:

1. **Create a Cyclic Account**
   - Go to [cyclic.sh](https://www.cyclic.sh)
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "Link Your Own"
   - Select your `anecdotal` repository
   - Click "Connect"

3. **Add Environment Variables**
   - Go to your app dashboard
   - Click "Variables" in the sidebar
   - Add:
     ```
     DB_STRING=your_mongodb_connection_string
     ```

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-app-name.cyclic.app`

---

## MongoDB Atlas Setup

All deployment options require a MongoDB database. Here's how to set one up for free:

### Steps:

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Click "Try Free"
   - Sign up with email or Google

2. **Create a Cluster**
   - Choose "Free" tier (M0)
   - Select cloud provider and region closest to your deployment
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
   - Grant "Read and write to any database"

4. **Whitelist IP Addresses**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is necessary for cloud platforms

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `anecdotes-stories`

   Example:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/anecdotes-stories?retryWrites=true&w=majority
   ```

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] Homepage loads correctly
- [ ] Can navigate to /stories and /write pages
- [ ] Can create a new story
- [ ] Can search and filter stories
- [ ] Can edit a story
- [ ] Can delete a story
- [ ] Responsive design works on mobile
- [ ] No console errors in browser DevTools

---

## Troubleshooting

### App won't start
- Check environment variables are set correctly
- Verify MongoDB connection string is valid
- Check deployment logs for errors

### Database connection errors
- Ensure IP whitelist includes 0.0.0.0/0 in MongoDB Atlas
- Verify connection string includes correct password
- Check database user has proper permissions

### Slow performance
- MongoDB Atlas free tier can be slow initially (cold starts)
- Consider upgrading to paid tier for better performance
- Free hosting platforms may have cold starts (first request slower)

---

## Custom Domain (Optional)

Most platforms support custom domains:

**Render:**
- Go to Settings → Custom Domains → Add Custom Domain

**Railway:**
- Go to Settings → Domains → Add Custom Domain

**Fly.io:**
```bash
flyctl certs add yourdomain.com
```

---

## Environment Variables Reference

```env
DB_STRING=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/anecdotes-stories?retryWrites=true&w=majority
PORT=8000  # Usually not needed (auto-set by platform)
```

---

## Cost Comparison

| Platform | Free Tier | Paid Starting At |
|----------|-----------|------------------|
| Render | 750 hrs/month | $7/month |
| Railway | $5 credit/month | $0.000463/GB-hr |
| Fly.io | 3 shared VMs | $1.94/month per VM |
| Cyclic | Unlimited apps | $1/month for premium |

---

## Support

If you encounter issues:
1. Check the platform's documentation
2. Review deployment logs
3. Verify environment variables
4. Test MongoDB connection separately
5. Open an issue on GitHub

Happy deploying! 🚀
