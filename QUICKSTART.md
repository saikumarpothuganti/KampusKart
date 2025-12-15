# KampusKart - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Setup Environment Variables

#### Backend Setup
```bash
cd server
cp .env.example .env
```

Edit `server/.env` and fill in:
- MongoDB Atlas connection string
- JWT secret
- Cloudinary credentials

See `ENV_SETUP.md` for detailed instructions.

### Step 2: Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend (in new terminal)
cd client
npm install
```

### Step 3: Start the Application

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Backend will run on: `http://localhost:5000`
Frontend will run on: `http://localhost:3000`

### Step 4: Create Test Admin Account

1. Open MongoDB Atlas and create a test user
2. Update that user's `isAdmin` to `true`
3. Now you can login with that email and access `/admin`

## 🧪 Test the Application

### Create Test Subjects (via Admin)

Go to `/admin` and add subjects:
- Title: "Data Structures"
- Code: "CS201"
- Year: 1
- Semester: 1
- Price: 50

### Test User Flow

1. Sign up with test account
2. Go to Workbook page
3. Select Year 1, Semester 1
4. Add subjects to cart
5. Add custom PDF
6. Go to checkout
7. Complete payment
8. View order status

## 📁 Key Files to Understand

### Backend
- `server/index.js` - Main server file
- `server/controllers/` - Business logic
- `server/routes/` - API endpoints
- `server/models/` - Database schemas

### Frontend
- `client/src/App.jsx` - Main app component
- `client/src/context/` - State management
- `client/src/pages/` - Route pages
- `client/src/components/` - Reusable components

## 🔍 Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:** 
- Check MONGODB_URI in .env
- Add your IP to MongoDB Atlas whitelist
- Ensure VPN is off if needed

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** 
- Kill process on port 5000: `lsof -ti:5000 | xargs kill -9`
- Or change PORT in .env

### Cloudinary Upload Error
```
Error: Invalid credentials
```
**Solution:**
- Verify CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET
- Check credentials in Cloudinary dashboard

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Check backend CORS configuration
- Verify frontend is making requests to correct API URL
- In development, frontend proxy handles this automatically

## 📝 Default Admin Credentials

To create an admin user, you need to:

1. Sign up normally with any email
2. Go to MongoDB Atlas → Collections
3. Find your user in `Users` collection
4. Set `isAdmin: true`
5. Login again and access `/admin`

## 🎯 Next Steps

1. ✅ Run the app locally
2. ✅ Test all features
3. ✅ Customize branding (colors, logos)
4. ✅ Add sample subjects to database
5. ✅ Deploy to production (see `DEPLOYMENT.md`)

## 🆘 Need Help?

- Check logs in terminal (backend and frontend)
- Open browser DevTools (F12) for client-side errors
- Check MongoDB Atlas logs for database errors
- Review `README.md` for full documentation

---

**That's it! You have a fully functional campus e-commerce platform! 🎉**

Next: Deploy to production using `DEPLOYMENT.md`
