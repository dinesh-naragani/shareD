# ShareDrop Vercel + Render.com Deployment Guide

## 🎯 Deployment Strategy

- ✅ **Frontend**: Vercel (free, fast, global CDN)
- ✅ **Backend**: Render.com (free tier, 750 hours/month)
- ✅ **Fixed expiration**: 5 minutes
- ✅ **Unlimited downloads** until expiration

## 🚀 Quick Deploy

### 1. **Push to GitHub**
```bash
git add .
git commit -m "Initial ShareDrop commit"
git push origin main
```

### 2. **Deploy Backend on Render.com**
- Go to [render.com](https://render.com)
- Sign up/Login with GitHub
- Click "New +" → "Web Service"
- Connect your GitHub repo
- Configure:
  - **Name**: `sharedrop-backend`
  - **Environment**: `Node`
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
  - **Plan**: Free

### 3. **Deploy Frontend on Vercel**
- Go to [vercel.com](https://vercel.com)
- Sign up/Login with GitHub
- Click "New Project"
- Import your GitHub repo
- Configure:
  - **Framework Preset**: Create React App
  - **Root Directory**: `client`
  - **Build Command**: `npm run build`
  - **Output Directory**: `build`

## ⚙️ Environment Variables

### Backend (Render.com)
```env
NODE_ENV=production
PORT=10000
```

### Frontend (Vercel)
```env
REACT_APP_API_URL=https://your-backend-name.onrender.com
```

## 🔧 Update API Configuration

In `client/src/config/api.js`:
```javascript
const API_CONFIG = {
  development: 'http://localhost:5000',
  production: process.env.REACT_APP_API_URL || 'https://your-backend-name.onrender.com'
};
```

## 📱 App Features

- **File Upload**: Drag & drop, multiple files
- **4-Digit Codes**: Easy to share and remember
- **5-Minute Expiry**: Automatic cleanup
- **QR Codes**: Mobile-friendly sharing
- **Individual Downloads**: Choose specific files
- **ZIP Downloads**: Download all files at once

## 💰 Cost Breakdown

- **Vercel**: Free tier (unlimited)
- **Render.com**: Free tier (750 hours/month)
- **Total**: $0/month

## ⚠️ Important Notes

- **Free Tier Limits**: Render.com sleeps after 15 minutes of inactivity
- **Cold Start**: First request after sleep may take 30-60 seconds
- **Storage**: 1GB total storage limit
- **File Limits**: 100MB per file, 10 files per upload

## 🔄 Update Process

1. **Make changes** to your code
2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update description"
   git push origin main
   ```
3. **Automatic deployment** on both platforms

## 🐛 Troubleshooting

### Backend Issues
- Check Render.com logs
- Verify environment variables
- Ensure `package.json` has correct start script

### Frontend Issues
- Check Vercel build logs
- Verify API URL configuration
- Clear browser cache

### Common Problems
- **CORS errors**: Check backend CORS configuration
- **API timeouts**: Render.com free tier has 30s timeout
- **Build failures**: Check dependency versions

## 🌐 Custom Domain (Optional)

### Backend Domain
- Upgrade to Render.com paid plan
- Add custom domain in dashboard
- Configure DNS records

### Frontend Domain
- Add custom domain in Vercel dashboard
- Configure DNS records
- SSL certificate automatically provided

## 📊 Monitoring

### Render.com Dashboard
- View request logs
- Monitor response times
- Check error rates

### Vercel Analytics
- Page view analytics
- Performance metrics
- Error tracking

---

Deploy and enjoy your free file-sharing app! 🚀
