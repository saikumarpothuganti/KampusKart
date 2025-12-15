# Deployment Guide for KampusKart

## Quick Start Deployment

### 1. Backend Deployment (Render)

#### Step 1: Prepare Your Code
```bash
cd server
git init
git add .
git commit -m "Initial commit"
```

#### Step 2: Push to GitHub
1. Create a new GitHub repository
2. Push your code to GitHub

#### Step 3: Deploy on Render
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your GitHub repository
5. Fill in the details:
   - **Name:** kampuskart-backend
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add Environment Variables:
   - Copy all variables from your `.env` file
   - Add each variable in Render dashboard
7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)
9. Copy your Render URL (e.g., `https://kampuskart-backend.onrender.com`)

### 2. Frontend Deployment (Vercel)

#### Step 1: Update API URL
Update `client/src/lib/api.js`:
```javascript
const API = axios.create({
  baseURL: 'https://kampuskart-backend.onrender.com/api', // Use your Render URL
});
```

#### Step 2: Deploy on Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Import Project"
4. Select your GitHub repository (or just the client folder)
5. Fill in the details:
   - **Root Directory:** client (if deploying from monorepo)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Click "Deploy"
7. Wait for deployment (2-5 minutes)

#### Alternative: Direct Upload
```bash
npm install -g vercel
cd client
vercel
# Follow prompts
```

### 3. Database (MongoDB Atlas)

#### Already Setup?
- MongoDB Atlas is already configured in your `.env`
- Free tier provides 5GB storage

#### New Setup?
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account
3. Create a cluster
4. Whitelist IP (Allow 0.0.0.0/0 for simplicity in testing)
5. Get connection string
6. Add to both local `.env` and production environment variables

### 4. File Storage (Cloudinary)

#### Already Setup?
- Cloudinary is already configured in your `.env`
- Free tier provides 25 monthly transformation credits

#### Verify Setup:
1. Go to https://cloudinary.com/console
2. Verify your API credentials
3. Check file storage usage

## Environment Variables Checklist

### Backend (Render)
- [ ] `MONGODB_URI` - Your MongoDB connection string
- [ ] `JWT_SECRET` - Your JWT secret key
- [ ] `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- [ ] `CLOUDINARY_API_KEY` - Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` - Cloudinary API secret
- [ ] `PORT` - 5000 (or leave default)
- [ ] `NODE_ENV` - production

### Frontend (Vercel)
- [ ] Update `api.js` with production backend URL
- [ ] No other environment variables needed for basic setup

## Testing After Deployment

1. **Test Backend:**
   - Visit `https://kampuskart-backend.onrender.com/api/health`
   - Should return `{"status":"OK"}`

2. **Test Frontend:**
   - Visit your Vercel deployment URL
   - Try signing up and creating an order

3. **Test Full Flow:**
   - Sign up → Browse subjects → Add to cart → Checkout → Payment → Order created

## Troubleshooting

### Backend Not Starting
```bash
# Check logs in Render dashboard
# Common issues:
# 1. Missing environment variables
# 2. MongoDB connection string incorrect
# 3. Port already in use
```

### API Connection Error
```javascript
// In frontend, check if API URL is correct
// Open browser console (F12)
// Check Network tab when making API calls
```

### File Upload Not Working
```bash
# Check Cloudinary credentials
# Verify folder permissions in Cloudinary dashboard
# Check file size limits
```

### MongoDB Connection Timeout
```bash
# 1. Verify MongoDB URI is correct
# 2. Check IP whitelist in MongoDB Atlas
# 3. Add 0.0.0.0/0 to allow all IPs (for testing)
```

## Performance Tips

1. **Image Optimization:** Cloudinary automatically optimizes images
2. **API Caching:** Implement caching for subjects list
3. **Database Indexing:** MongoDB Atlas provides basic indexing
4. **CDN:** Vercel includes built-in CDN for frontend

## Security Checklist

- [ ] Use strong JWT_SECRET in production
- [ ] Change MongoDB whitelist from 0.0.0.0/0 to your IP
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Use environment variables for all secrets
- [ ] Enable API rate limiting
- [ ] Validate all user inputs
- [ ] Use CORS whitelist (specify your frontend URL)

## Scaling for Future

1. **More Students:**
   - MongoDB Atlas: Upgrade cluster size
   - Render: Upgrade to Pro plan
   - Vercel: Auto-scales

2. **More Features:**
   - Consider Redis for caching
   - Implement job queues (Bull, RabbitMQ)
   - Add CDN for static assets

3. **Payment Gateway:**
   - Integrate Razorpay or Stripe
   - Follow PCI compliance
   - Use webhooks for payment confirmation

---

**Deployment Time:** ~20-30 minutes  
**Total Cost:** FREE (for reasonable usage)

You're now live! 🎉
