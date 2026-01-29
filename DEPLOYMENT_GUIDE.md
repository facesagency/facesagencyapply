# 🚀 Deployment Guide - Faces Agency Application

## Overview

Your application now uses a **separate backend server** for HubSpot integration instead of Vercel serverless functions. This makes deployment simple and reliable.

**Architecture:**
```
Frontend (Vercel) → Backend API (Railway/Render) → HubSpot
```

---

## ✅ Step 1: Deploy Backend to Railway (Recommended - Easiest)

### Option A: Deploy from GitHub (Recommended)

1. **Go to Railway.app**
   - Visit: https://railway.app
   - Sign up/Login with GitHub

2. **Create New Project**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose: `facesagency/facesagencyapply`

3. **Configure Root Directory**
   - Railway will auto-detect the project
   - Click **"Settings"** → **"Service"**
   - Set **Root Directory**: `backend`
   - Railway will automatically detect `package.json` and run `npm install` then `npm start`

4. **Add Environment Variable**
   - Go to **"Variables"** tab
   - Click **"+ New Variable"**
   - Add: `HUBSPOT_ACCESS_TOKEN` = `your_hubspot_token_here`
   - Click **"Deploy"**

5. **Get Your Backend URL**
   - Go to **"Settings"** → **"Networking"**
   - Click **"Generate Domain"**
   - Copy the URL (e.g., `https://your-backend.railway.app`)

---

### Option B: Deploy from Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to backend folder
cd backend

# Initialize
railway init

# Add environment variable
railway variables set HUBSPOT_ACCESS_TOKEN=your_token_here

# Deploy
railway up
```

---

## 🎯 Step 2: Update Frontend Environment

1. **Update Frontend .env**
   ```env
   VITE_API_URL=https://your-backend.railway.app
   ```

2. **Commit and Push**
   ```bash
   git add .env
   git commit -m "Update backend API URL"
   git push
   ```

3. **Vercel Auto-Deploys**
   - Vercel will automatically redeploy your frontend
   - The form will now submit to your Railway backend

---

## 🧪 Step 3: Test Everything

1. **Test Backend Health**
   ```bash
   curl https://your-backend.railway.app/
   # Should return: {"status":"ok","message":"Faces Agency API Server"}
   ```

2. **Test HubSpot Endpoint**
   ```bash
   curl -X POST https://your-backend.railway.app/api/hubspot \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","firstName":"Test","lastName":"User","mobile":"+961 70123456"}'

   # Should return: {"success":true,"action":"created","contactId":"..."}
   ```

3. **Test Form Submission**
   - Go to: https://www.facesagencyapply.com
   - Fill out the form
   - Submit
   - Check:
     - ✅ Thank you page appears
     - ✅ Browser console shows success
     - ✅ Contact appears in HubSpot

---

## 🔄 Alternative: Deploy to Render

If you prefer Render over Railway:

1. **Go to Render.com**
   - Visit: https://render.com
   - Sign up/Login

2. **Create New Web Service**
   - Click **"New +"** → **"Web Service"**
   - Connect GitHub repository: `facesagency/facesagencyapply`

3. **Configure Service**
   - **Name**: `facesagency-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. **Add Environment Variable**
   - Scroll to **"Environment Variables"**
   - Add: `HUBSPOT_ACCESS_TOKEN` = `your_token_here`
   - Click **"Create Web Service"**

5. **Copy Backend URL**
   - Once deployed, copy the URL (e.g., `https://facesagency-backend.onrender.com`)
   - Update frontend `.env` with this URL

---

## 📋 Environment Variables Checklist

### Backend (.env in /backend folder - LOCAL ONLY)
```env
HUBSPOT_ACCESS_TOKEN=your_hubspot_token_here
PORT=3001
```

**For Production (Railway/Render Dashboard):**
- `HUBSPOT_ACCESS_TOKEN` - Your HubSpot private app token

### Frontend (.env in root folder)
```env
# Local development (backend running on localhost:3001)
VITE_API_URL=

# Production (after deploying backend)
VITE_API_URL=https://your-backend.railway.app

# Supabase (for admin dashboard)
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_key
VITE_SUPABASE_URL=https://your-project.supabase.co
```

---

## 🧑‍💻 Local Development

### Run Backend Locally

```bash
cd backend

# Create .env file
cp .env.example .env
# Edit .env and add your HUBSPOT_ACCESS_TOKEN

# Install dependencies
npm install

# Start backend server
npm start
```

Backend runs on: `http://localhost:3001`

### Run Frontend Locally

```bash
# In the root folder
npm run dev
```

Frontend runs on: `http://localhost:8080`

The frontend will automatically use `http://localhost:3001` for the API when `VITE_API_URL` is empty.

---

## ❓ Troubleshooting

### Backend not responding
- Check Railway/Render logs
- Verify `HUBSPOT_ACCESS_TOKEN` is set
- Test health endpoint: `curl https://your-backend.railway.app/`

### CORS errors
- Make sure backend is deployed and running
- Check that `VITE_API_URL` in frontend .env points to correct backend URL

### HubSpot errors
- Verify token is valid
- Check token has correct scopes: `crm.objects.contacts.write` and `crm.objects.contacts.read`
- View backend logs in Railway/Render dashboard

### Form submission fails
- Open browser console (F12)
- Check for errors
- Verify `VITE_API_URL` is set correctly
- Test backend endpoint directly with curl

---

## 📊 Monitoring

### Railway Monitoring
- **Logs**: Dashboard → "Deployments" → Click deployment → "View Logs"
- **Metrics**: Dashboard → "Metrics" tab
- **Health**: Visit `https://your-backend.railway.app/` - should return `{"status":"ok"}`

### Render Monitoring
- **Logs**: Dashboard → Your service → "Logs" tab
- **Health**: Events tab shows deployment status

---

## 🎉 Success Checklist

- [ ] Backend deployed to Railway/Render
- [ ] Backend health endpoint responds
- [ ] HubSpot token configured in backend
- [ ] Frontend `.env` updated with backend URL
- [ ] Frontend redeployed on Vercel
- [ ] Test form submission works end-to-end
- [ ] Contact appears in HubSpot

---

## 📞 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **HubSpot API Docs**: https://developers.hubspot.com/docs/api/crm/contacts

**All code is in GitHub**: https://github.com/facesagency/facesagencyapply
