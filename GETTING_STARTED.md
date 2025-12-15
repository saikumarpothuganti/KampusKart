# KampusKart - Getting Started Checklist

## ✅ Pre-Flight Check (Before Running)

### System Requirements
- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm 7+ installed (`npm --version`)
- [ ] Git installed (for deployment)
- [ ] Code editor (VS Code recommended)
- [ ] Internet connection (for npm packages)

### Prerequisites Accounts (Free)
- [ ] MongoDB Atlas account (https://mongodb.com/cloud/atlas)
- [ ] Cloudinary account (https://cloudinary.com)
- [ ] GitHub account (for deployment)
- [ ] Vercel account (for frontend deployment)
- [ ] Render.com account (for backend deployment)

---

## 🎯 Phase 1: Local Setup (5-10 minutes)

### Step 1: Extract Project
- [ ] Extract KampusKart folder from archive
- [ ] Navigate to project: `cd KampusKart`

### Step 2: Install Dependencies
- [ ] Windows: Run `setup.bat`
- [ ] Mac/Linux: Run `bash setup.sh`
- OR manually:
  - [ ] `cd server && npm install`
  - [ ] `cd ../client && npm install`

### Step 3: Configure Backend
- [ ] Go to `server/` folder
- [ ] Copy `cp .env.example .env`
- [ ] Open `.env` file in editor
- [ ] Fill in these variables:
  - [ ] `MONGODB_URI` - Get from MongoDB Atlas
  - [ ] `JWT_SECRET` - Create random string (e.g., "MySecret123!@#")
  - [ ] `CLOUDINARY_CLOUD_NAME` - Get from Cloudinary dashboard
  - [ ] `CLOUDINARY_API_KEY` - Get from Cloudinary dashboard
  - [ ] `CLOUDINARY_API_SECRET` - Get from Cloudinary dashboard

---

## 🚀 Phase 2: Start Servers (2 minutes)

### Terminal 1 - Backend
```bash
cd server
npm run dev
```
- [ ] Wait for: "Server running on port 5000"
- [ ] Test: Visit http://localhost:5000/api/health → See {"status":"OK"}

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```
- [ ] Wait for: "Local: http://localhost:3000"
- [ ] Test: Visit http://localhost:3000 → See home page

---

## 🧪 Phase 3: Test Core Features (10-15 minutes)

### 1. User Registration
- [ ] Go to http://localhost:3000
- [ ] Click avatar → "Sign Up"
- [ ] Fill form with test data
- [ ] Click "Sign Up" button
- [ ] Should redirect to home page (now logged in)
- [ ] Avatar should show first letter of name

### 2. Create Admin Account
- [ ] Open MongoDB Atlas → Collections → Users
- [ ] Find your test user
- [ ] Edit document and set `isAdmin: true`
- [ ] Logout from browser
- [ ] Login again

### 3. Add Test Subjects
- [ ] Go to http://localhost:3000/admin
- [ ] You should see Admin Dashboard
- [ ] Fill "Add New Subject" form:
  - [ ] Title: "Data Structures"
  - [ ] Code: "CS201"
  - [ ] Year: 1
  - [ ] Semester: 1
  - [ ] Price: 50
- [ ] Click "Add Subject"
- [ ] Should appear in subjects list below

### 4. Test Shopping Flow
- [ ] Go to http://localhost:3000/workbook
- [ ] Select Year: 1, Semester: 1
- [ ] Click "Show Subjects"
- [ ] Should see "Data Structures" card
- [ ] Adjust quantity (+ button)
- [ ] Change sides to 2-sided
- [ ] Click "Add to Cart"
- [ ] Go to cart (🛒 icon in navbar)
- [ ] See item in cart with total price
- [ ] Click "Place Order"

### 5. Test Checkout
- [ ] Fill form:
  - [ ] Name: John Doe
  - [ ] College ID: KL001
  - [ ] Phone: 9876543210
  - [ ] Notes: Test order
- [ ] Click "Continue to Payment"
- [ ] See order summary on right

### 6. Test Payment (Mock)
- [ ] See QR code placeholder
- [ ] Select screenshot image file
- [ ] Click "Confirm Payment"
- [ ] Should create order and show Order Status page
- [ ] See timeline: Sent → (Placed) → Printing → Delivered
- [ ] See order ID like "O1234"
- [ ] "Cancel Order" button should be visible

### 7. Test Admin Order Management
- [ ] Go to http://localhost:3000/admin
- [ ] Click "Orders" tab
- [ ] Find your test order
- [ ] Change status dropdown from "sent" to "placed"
- [ ] Status should update immediately
- [ ] Try different statuses

### 8. Test Order History
- [ ] Click avatar → "Order History"
- [ ] Should see your test order card
- [ ] Click on order card
- [ ] Should show detailed order status page

---

## 📋 Phase 4: Verify All Pages (5 minutes)

- [ ] Home page loads
- [ ] Workbook page (requires login)
- [ ] Cart page
- [ ] Checkout page
- [ ] Payment page
- [ ] Order Status page
- [ ] Order History page
- [ ] Profile page
- [ ] Admin page
- [ ] Sign In page
- [ ] Sign Up page

---

## 🔍 Phase 5: Troubleshooting (If Issues)

### Backend Won't Start
- [ ] Check MongoDB connection string in .env
- [ ] Try: `npm run dev` (ensure you're in server folder)
- [ ] Check if port 5000 is already in use
- [ ] Read error message in terminal

### Frontend Won't Start
- [ ] Ensure dependencies installed: `npm install`
- [ ] Check if port 3000 is already in use
- [ ] Clear node_modules: `rm -rf node_modules && npm install`

### Can't Login
- [ ] Check .env JWT_SECRET is set
- [ ] Verify user exists in MongoDB
- [ ] Check browser console (F12) for errors

### File Upload Fails
- [ ] Verify Cloudinary credentials in .env
- [ ] Check Cloudinary account has free credits
- [ ] Try uploading to Cloudinary directly

### Database Errors
- [ ] Verify MONGODB_URI is correct
- [ ] Check IP is whitelisted in MongoDB Atlas (use 0.0.0.0/0 for testing)
- [ ] Ensure database name is "kampuskart"

---

## 📱 Phase 6: Test Responsive Design (2 minutes)

### Desktop (1920px)
- [ ] Visit http://localhost:3000
- [ ] Page looks good on wide screen
- [ ] Grid layouts show 3 columns

### Tablet (768px)
- [ ] Press F12 (DevTools)
- [ ] Click device toggle (mobile icon)
- [ ] Select iPad
- [ ] Page shows 2 columns
- [ ] Navigation works

### Mobile (375px)
- [ ] In DevTools, select iPhone
- [ ] Page shows 1 column
- [ ] Navbar is mobile-friendly
- [ ] Buttons are large enough

---

## 🌐 Phase 7: Prepare for Deployment (5 minutes)

### Code Cleanup
- [ ] Remove any console.log() statements
- [ ] Verify .env.example has no real credentials
- [ ] Add .gitignore with:
  - [ ] `node_modules/`
  - [ ] `.env`
  - [ ] `.DS_Store`
  - [ ] `dist/`

### Create GitHub Repo
- [ ] Create new repo on GitHub
- [ ] Initialize git: `git init`
- [ ] Add files: `git add .`
- [ ] Commit: `git commit -m "Initial KampusKart project"`
- [ ] Push to GitHub

---

## 🚀 Phase 8: Deploy to Production (20-30 minutes)

See DEPLOYMENT.md for step-by-step instructions:
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Update frontend API URL to production backend
- [ ] Test production URLs

---

## ✨ Phase 9: Customization (Optional)

- [ ] Change colors in `tailwind.config.js`
- [ ] Update contact links (WhatsApp/Telegram)
- [ ] Add logo/branding
- [ ] Change site title in `index.html`
- [ ] Update meta descriptions

---

## 📊 Phase 10: Final Checks

- [ ] ✅ Home page works
- [ ] ✅ User registration works
- [ ] ✅ User login works
- [ ] ✅ Admin dashboard works
- [ ] ✅ Shopping cart works
- [ ] ✅ Checkout works
- [ ] ✅ Payment works
- [ ] ✅ Order tracking works
- [ ] ✅ Order history works
- [ ] ✅ Mobile responsive
- [ ] ✅ Deployed to production

---

## 🎉 You're Done!

Your KampusKart platform is:
- ✅ Running locally
- ✅ Fully tested
- ✅ Deployed to production
- ✅ Ready for users

---

## 📞 Next Steps

1. **Share with friends**: Send production URL
2. **Add more subjects**: Use admin panel
3. **Customize**: Change colors, branding, features
4. **Scale**: Monitor usage, upgrade as needed
5. **Add features**: Refer to ROADMAP for ideas

---

## 🆘 Getting Help

1. Check QUICKSTART.md (5-min setup guide)
2. Check README.md (full documentation)
3. Check relevant .md file for your issue
4. Read error messages carefully
5. Check browser console (F12 → Console tab)
6. Check server terminal for error logs

---

**Total Time to Production: ~1-2 hours**

You're ready to launch! 🎊
