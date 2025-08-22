# 🚀 Share'D Deployment Guide

## 📋 Prerequisites
- GitHub repository: `dinesh-naragani/shareD`
- Vercel account (free)
- Render.com account (free)

---

## 🎨 **Frontend Deployment (Vercel)**

### Step 1: Deploy to Vercel
1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Import your repository**: `dinesh-naragani/shareD`
5. **Configure settings:**
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `client` ⚠️ **IMPORTANT**
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)
6. **Click "Deploy"**

### Step 2: Get Your Frontend URL
- Vercel will give you a URL like: `https://your-project.vercel.app`
- **Save this URL** - you'll need it for the backend

---

## ⚙️ **Backend Deployment (Render.com)**

### Step 1: Deploy to Render
1. **Go to [render.com](https://render.com)**
2. **Sign in with GitHub**
3. **Click "New +" → "Web Service"**
4. **Connect your repository**: `dinesh-naragani/shareD`
5. **Configure settings:**
   - **Name**: `shared-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### Step 2: Environment Variables
Add these environment variables in Render:
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render free tier requirement)

### Step 3: Get Your Backend URL
- Render will give you a URL like: `https://your-backend.onrender.com`
- **Save this URL** - you'll need it for the frontend

---

## 🔗 **Connect Frontend to Backend**

### Step 1: Update Frontend API
1. **Go to your Vercel project dashboard**
2. **Go to Settings → Environment Variables**
3. **Add new variable:**
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend.onrender.com` (your actual backend URL)
4. **Redeploy** your frontend

### Step 2: Test the Connection
1. **Visit your Vercel frontend URL**
2. **Try uploading a file**
3. **Check if it connects to your Render backend**

---

## 📁 **File Structure for Deployment**

```
shareD/
├── client/                 # Frontend (deploy to Vercel)
│   ├── build/             # Built files (auto-generated)
│   ├── src/
│   └── package.json
├── server.js              # Backend (deploy to Render)
├── package.json           # Backend dependencies
├── render.yaml            # Render.com config
└── .gitignore
```

---

## 🚨 **Important Notes**

### Vercel (Frontend)
- ✅ **Root directory must be `client`**
- ✅ **Build command**: `npm run build`
- ✅ **Output directory**: `build`

### Render.com (Backend)
- ✅ **Free tier**: 750 hours/month
- ✅ **Auto-sleeps** after 15 minutes of inactivity
- ✅ **First request** after sleep may take 30-60 seconds
- ✅ **File storage**: Ephemeral (files are lost on restart)

### File Storage Limitation
⚠️ **Important**: Render.com free tier doesn't persist files between restarts. Files uploaded to your backend will be lost when the service restarts.

**Solutions:**
1. **Upgrade to Render paid plan** (persistent storage)
2. **Use external storage** (AWS S3, Google Cloud Storage)
3. **Accept the limitation** for demo/testing purposes

---

## 🔄 **Redeployment**

### Frontend Changes
- **Automatic**: Vercel auto-deploys on Git push
- **Manual**: Go to Vercel dashboard → Deployments → Redeploy

### Backend Changes
- **Automatic**: Render auto-deploys on Git push
- **Manual**: Go to Render dashboard → Manual Deploy

---

## 🧪 **Testing Your Deployment**

1. **Frontend**: Visit your Vercel URL
2. **Upload files**: Test file upload functionality
3. **Share codes**: Generate and test share codes
4. **Downloads**: Test file downloads
5. **Backend health**: Visit `https://your-backend.onrender.com/api/health`

---

## 📞 **Support**

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Render**: [render.com/docs](https://render.com/docs)
- **GitHub**: Your repository issues

---

**🎉 Congratulations! Your Share'D app is now deployed!**
