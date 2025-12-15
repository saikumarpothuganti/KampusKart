# KampusKart - Production Deployment Configuration

This guide provides step-by-step instructions for deploying KampusKart to production.

## Prerequisites

- Node.js 16+ installed locally
- MongoDB Atlas account (free tier available)
- Cloudinary account (free tier available)
- Vercel account (for frontend)
- Render.com or Railway.app account (for backend)
- Git repository with your code

---

## 1. Backend Deployment (Render.com)

### 1.1 Prepare Your Code

```bash
cd server
npm install
npm run dev  # Test locally first
```

### 1.2 Create Render Service

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Fill in the form:
   - **Name:** `kampuskart-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run dev` or `node index.js`
   - **Region:** Choose closest to your users

### 1.3 Set Environment Variables in Render Dashboard

In the Render dashboard, go to your service → Environment:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/kampuskart
JWT_SECRET=<generate with: node generate-secret.js>
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=production
PORT=5000
HOST=0.0.0.0
CLIENT_URL=https://kampuskart.vercel.app
```

### 1.4 Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Copy the generated URL: `https://kampuskart-backend.onrender.com`
4. Test: Visit `https://kampuskart-backend.onrender.com/api/health`
   - Should return: `{"status":"OK"}`

---

## 2. Frontend Deployment (Vercel)

### 2.1 Prepare Your Code

```bash
cd client
npm install
npm run build  # Test build locally
npm run preview  # Preview production build
```

### 2.2 Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository (KampusKart)
4. Select `client` directory as root
5. Click "Deploy"

### 2.3 Set Environment Variables in Vercel Dashboard

In Vercel dashboard → Settings → Environment Variables:

```env
VITE_API_BASE_URL=https://kampuskart-backend.onrender.com/api
VITE_SOCKET_URL=https://kampuskart-backend.onrender.com
```

### 2.4 Redeploy

1. Go back to Deployments
2. Click "Redeploy" on the latest deployment
3. Wait for deployment to complete
4. Your frontend URL will be displayed (e.g., `https://kampuskart.vercel.app`)

---

## 3. Verify Deployment

### 3.1 Backend Health Check

```bash
curl https://kampuskart-backend.onrender.com/api/health
# Should return: {"status":"OK"}
```

### 3.2 Frontend Access

1. Visit: `https://kampuskart.vercel.app`
2. Sign up with test credentials
3. Browse subjects
4. Place a test order

### 3.3 Check Logs

**Backend (Render):**
- Go to Render dashboard → Service → Logs
- Look for: `[Server] Running on 0.0.0.0:5000`

**Frontend (Vercel):**
- Go to Vercel dashboard → Deployments → Latest → Logs
- Check for build errors

---

## 4. Database Setup (MongoDB Atlas)

### 4.1 Create Cluster

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Click "Create" → "Build a Cluster"
3. Choose **Free** tier
4. Select region closest to your users
5. Wait for cluster to be created

### 4.2 Create Database User

1. Go to Cluster → Security → Database Access
2. Click "Add New Database User"
3. Username: `kampuskart_admin`
4. Password: Generate strong password (save it!)
5. Add user

### 4.3 Whitelist IP Addresses

1. Go to Security → Network Access
2. Click "Add IP Address"
3. For development: Add your IP (or 0.0.0.0/0 for anywhere - less secure)
4. For production: Add Render/Railway IP ranges

### 4.4 Get Connection String

1. Go to Cluster → Connect
2. Choose "Drivers"
3. Copy the connection string: `mongodb+srv://...`
4. Replace `<username>` and `<password>` with your database user credentials
5. Use this as `MONGODB_URI` in your environment variables

---

## 5. Cloudinary Setup

### 5.1 Create Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free
3. Go to Dashboard

### 5.2 Get API Credentials

1. Click on your profile → API Keys (or go directly to settings)
2. Copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (⚠️ keep this secret!)
3. Use these as environment variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

### 5.3 Create Upload Preset (Optional)

1. Go to Settings → Upload
2. Create "Upload Preset" named `kampuskart`
3. Make it "Unsigned" for easier uploads
4. Note: We don't use this in our code, but useful for testing

---

## 6. Configure CORS & SSL

### 6.1 Update Backend CORS

Your backend now automatically detects the `CLIENT_URL` environment variable.
Ensure it's set to your Vercel frontend URL.

### 6.2 Force HTTPS

Render and Vercel automatically provide HTTPS.
No additional configuration needed.

### 6.3 Test Socket.io Connection

1. Open browser DevTools (F12)
2. Go to Console
3. Sign in on the deployed app
4. Place an order
5. Check if `[Socket.io] Client connected` appears in browser console

---

## 7. Production Checklist

- [ ] Backend health endpoint responds: `/api/health`
- [ ] Frontend loads without errors
- [ ] Sign up works
- [ ] Sign in works
- [ ] Can browse subjects
- [ ] Can add to cart
- [ ] Can place order
- [ ] Can upload custom PDF (check Cloudinary)
- [ ] Admin panel accessible (with admin account)
- [ ] Admin can view and set prices for PDFs
- [ ] Socket.io connects (check browser console)
- [ ] Environment variables set in both Render and Vercel
- [ ] Cloudinary credentials working (files upload successfully)
- [ ] Database connection stable (orders persist)
- [ ] CORS allows frontend origin
- [ ] No hardcoded localhost URLs in code
- [ ] No sensitive data in git commits
- [ ] `.env` files are in `.gitignore`

---

## 8. Monitoring & Maintenance

### 8.1 Monitor Backend

- **Render:** Logs → Look for errors
- **Uptime:** Use tools like UptimeRobot to monitor `/api/health`

### 8.2 Monitor Frontend

- **Vercel:** Deployments → Check deployment status
- **Analytics:** Vercel provides basic analytics

### 8.3 Monitor Database

- **MongoDB Atlas:** Cluster → Monitoring
- **Alerts:** Set up alerts for high connection counts or errors

### 8.4 Backups

- **MongoDB:** Atlas provides automatic backups (free tier: 7-day retention)
- **Code:** Use Git for version control
- **Images:** Cloudinary stores permanently; no action needed

---

## 9. Scaling for Production

If you experience high traffic:

1. **Database:**
   - Upgrade from Free to Shared tier
   - Enable auto-scaling
   - Consider read replicas

2. **Backend:**
   - Upgrade Render instance (Free → Standard)
   - Use more resources
   - Implement caching (Redis)

3. **Frontend:**
   - Vercel handles scaling automatically
   - Use Image Optimization

4. **Files:**
   - Cloudinary handles scaling automatically

---

## 10. Troubleshooting

### Cannot reach server

**Symptom:** "Cannot connect to server" error on frontend

**Solutions:**
1. Check `VITE_API_BASE_URL` in Vercel environment
2. Check `CLIENT_URL` in Render environment
3. Test backend: `curl https://backend-url/api/health`
4. Check Render logs for startup errors

### Files not uploading

**Symptom:** Upload fails silently

**Solutions:**
1. Verify Cloudinary credentials in Render environment
2. Check file size limits (Cloudinary default: 100MB)
3. Check browser console for error messages
4. Verify `NODE_ENV=production` is set

### Socket.io not connecting

**Symptom:** Live location doesn't update

**Solutions:**
1. Check `VITE_SOCKET_URL` in Vercel environment
2. Verify it matches backend URL
3. Check browser console for connection errors
4. Ensure backend is running and accessible

### Admin can't see PDFs

**Symptom:** PDF link is broken or shows 404

**Solutions:**
1. Ensure Cloudinary is configured (check logs)
2. Verify uploaded files are in Cloudinary dashboard
3. Check file permissions in Cloudinary
4. Try re-uploading the PDF

---

## 11. Support & Resources

- **Render Docs:** [render.com/docs](https://render.com/docs)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Docs:** [docs.mongodb.com](https://docs.mongodb.com)
- **Cloudinary Docs:** [cloudinary.com/documentation](https://cloudinary.com/documentation)

---

**Last Updated:** December 14, 2025
**Version:** 1.0 (Production Ready)
