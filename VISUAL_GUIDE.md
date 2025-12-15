# KampusKart - Visual Setup Guide

## 🎯 Your Journey to a Live Platform

### Step 1: You Are Here 📍
```
┌─────────────────────────────────────┐
│  KampusKart Downloaded ✓            │
│  All 64 files ready                 │
│  Location: c:\Desktop\workbook\     │
└─────────────────────────────────────┘
         ↓
    NEXT STEP ⬇️
```

### Step 2: Setup (5 minutes)
```
┌──────────────────────────────┐
│ Run setup.bat (Windows)      │  ← Choose based on OS
│ OR bash setup.sh (Mac/Linux) │
└──────────────────────────────┘
         ↓
   npm install runs
   Dependencies loaded
         ↓
    NEXT STEP ⬇️
```

### Step 3: Configure (2 minutes)
```
┌──────────────────────────────────┐
│ Edit server/.env file            │
│                                  │
│ Add these 5 values:              │
│ 1. MONGODB_URI       [Atlas]     │
│ 2. JWT_SECRET        [Random]    │
│ 3. CLOUDINARY_NAME   [Cloudinary]│
│ 4. CLOUDINARY_KEY    [Cloudinary]│
│ 5. CLOUDINARY_SECRET [Cloudinary]│
└──────────────────────────────────┘
         ↓
    NEXT STEP ⬇️
```

### Step 4: Start Servers (1 minute)
```
┌─────────────────────────────────────┐
│ Terminal 1: cd server && npm run dev │  →  Port 5000
│ Terminal 2: cd client && npm run dev │  →  Port 3000
└─────────────────────────────────────┘
         ↓
   Wait for "Server running..."
   Wait for "Local: http://localhost:3000"
         ↓
    NEXT STEP ⬇️
```

### Step 5: Test Locally (10 minutes)
```
┌─────────────────────────────┐
│ Visit http://localhost:3000 │
│                             │
│ ✅ Sign up (create account) │
│ ✅ Browse subjects (Year 1) │
│ ✅ Add to cart              │
│ ✅ Checkout                 │
│ ✅ View order               │
│ ✅ Create admin (set in DB) │
│ ✅ Access admin panel       │
└─────────────────────────────┘
         ↓
    NEXT STEP ⬇️
```

### Step 6: Deploy (30 minutes)
```
┌──────────────────────────────┐
│ Backend → Render.com         │  ~10 min
│ Frontend → Vercel            │  ~10 min
│ Database → MongoDB Atlas     │  Already set
│ Files → Cloudinary           │  Already set
└──────────────────────────────┘
         ↓
    CONGRATULATIONS! 🎉
    Platform is LIVE
```

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Your Users                            │
└──────────────┬──────────────────────────────────────────┘
               │
        https (Vercel)
               │
┌──────────────▼──────────────────────────────────────────┐
│              React Frontend (Vercel)                     │
│  ┌─────────────────────────────────────────────┐         │
│  │ Pages: Home, Workbook, Cart, Checkout,     │         │
│  │        Payment, OrderStatus, Admin, etc.   │         │
│  │ Components: Navbar, Cards, Timeline        │         │
│  └─────────────────────────────────────────────┘         │
└──────────────┬──────────────────────────────────────────┘
               │
        https://api.example.com (Render)
               │
┌──────────────▼──────────────────────────────────────────┐
│          Node.js/Express Backend (Render)               │
│  ┌─────────────────────────────────────────────┐         │
│  │ API Endpoints (24):                        │         │
│  │ /auth, /subjects, /cart, /orders, /upload  │         │
│  │ Controllers: Auth, Subject, Cart, Order    │         │
│  │ Middleware: Auth (JWT), File Upload        │         │
│  └─────────────────────────────────────────────┘         │
└──────┬────────────────┬────────────────┬─────────────────┘
       │                │                │
    MongoDB          Cloudinary     Environment
    (Atlas)                         Variables
       │                │                │
    Users            Files            Config
    Orders           Images
    Subjects         PDFs
    Carts           Screenshots
```

---

## 🔄 Data Flow Example: Placing an Order

```
User Browser                   Server                    Database
     │                            │                          │
     │─── 1. Sign Up ──────────────>│                        │
     │                            │─── Create User ────────>│
     │                            │<─── User ID ───────────│
     │<─── JWT Token ─────────────│                        │
     │                            │                        │
     │─── 2. Browse Year 1, Sem 1>│                        │
     │                            │─── Find Subjects ─────>│
     │                            │<─── Subjects ──────────│
     │<─── Subject Cards ─────────│                        │
     │                            │                        │
     │─── 3. Add to Cart ────────>│                        │
     │                            │─── Update Cart ───────>│
     │                            │<─── Cart Updated ─────│
     │<─── Success Message ───────│                        │
     │                            │                        │
     │─── 4. Checkout ───────────>│                        │
     │─── 5. Payment (Screenshot)>│                        │
     │                            │─── Upload to Cloudinary  │
     │                            │<─── Image URL ─────────│
     │                            │─── Create Order ──────>│
     │                            │<─── OrderID (O1234) ──│
     │<─── Order Created ─────────│                        │
     │                            │                        │
     │─── 6. View Status ───────>│                        │
     │                            │─── Get Order Details ─>│
     │                            │<─── Order Info ───────│
     │<─── Timeline View ─────────│ (Sent→Placed→...) |
     │                            │                        │
```

---

## 📱 UI Screens You'll Build

```
Home Page
┌─────────────────────┐
│   KampusKart Logo   │  ← Navbar with Cart + Avatar
├─────────────────────┤
│  Hero Section       │
│ "Everything..."     │  ← Tagline
│  [Get Started Btn]  │
├─────────────────────┤
│  Service Cards      │
│ [Workbook Printing] │  ← Main service
│ [Recycling Soon]    │  ← Coming soon
├─────────────────────┤
│ About + Contacts    │
│ WhatsApp | Telegram │
└─────────────────────┘

Workbook Page
┌──────────────────────┐
│ Year [1▼] Sem [1▼]  │
│ [Show Subjects Btn]  │
├──────────────────────┤
│ Custom PDF Upload    │
│ [Upload] [Price] [+/-]
│ [Add to Cart]        │
├──────────────────────┤
│ Subject: Math        │  ← Subject Cards
│ Price: ₹50 [+/-]     │
│ Sides: [1▼] 2        │
│ [Add to Cart]        │
└──────────────────────┘

Order Status Page
┌──────────────────────┐
│ Order ID: O1234      │
├──────────────────────┤
│ ● ── ● ─── ●  ─ ●   │  ← Timeline
│ Sent Placed Printing │
│        Delivered     │
├──────────────────────┤
│ Items (2)            │
│ [Item 1] ₹100        │
│ [Item 2] ₹50         │
├──────────────────────┤
│ Total: ₹150          │
│ [Cancel Order]       │
│ [WhatsApp Support]   │
└──────────────────────┘

Admin Panel
┌──────────────────────┐
│ [Orders] [Subjects]  │  ← Tabs
├──────────────────────┤
│ Order: O1234         │
│ Student: John (KL001)│
│ Amount: ₹150         │
│ Status: [sent▼]      │  ← Change status
│ [View Screenshot] [X]│
├──────────────────────┤
│ Add Subject:         │
│ [Title] [Code] [₹]   │
│ [Add Subject Btn]    │
└──────────────────────┘
```

---

## 🗂️ File Organization at a Glance

```
KampusKart/
│
├── 📖 START HERE: INDEX.md
│   ├── QUICKSTART.md (5 min)
│   ├── GETTING_STARTED.md (30 min checklist)
│   └── README.md (complete docs)
│
├── 🔧 Setup & Config
│   ├── setup.bat (Windows)
│   ├── setup.sh (Mac/Linux)
│   └── ENV_SETUP.md (credentials guide)
│
├── 📦 Backend (Node.js)
│   └── server/
│       ├── index.js (main server)
│       ├── models/ (database schemas)
│       ├── controllers/ (business logic)
│       ├── routes/ (API endpoints)
│       ├── middleware/ (auth, uploads)
│       ├── config/ (database setup)
│       └── package.json
│
├── ⚛️ Frontend (React)
│   └── client/
│       ├── src/pages/ (11 pages)
│       ├── src/components/ (7 components)
│       ├── src/context/ (Auth, Cart state)
│       ├── src/lib/ (API client)
│       ├── index.html
│       └── package.json
│
└── 📚 Documentation
    ├── DEPLOYMENT.md (go live)
    ├── ROADMAP.md (future features)
    ├── PROJECT_STRUCTURE.md
    ├── FILE_MANIFEST.md
    ├── COMPLETION_REPORT.md
    └── This file!
```

---

## ⏱️ Timeline to Launch

```
Now → 5 min: Setup
     │
     ├→ 2 min: Configure .env
     │
     ├→ 1 min: Start servers
     │
     ├→ 10 min: Test locally
     │
     ├→ 30 min: Deploy to production
     │
     └→ LIVE! 🚀 (Total: ~48 minutes)
```

---

## 🎯 Success Criteria

You'll know it's working when:

✅ `npm run dev` works (both folders)  
✅ http://localhost:3000 loads  
✅ Sign up works  
✅ Can browse subjects  
✅ Can add to cart  
✅ Can checkout and place order  
✅ Admin panel is accessible  
✅ Can change order status as admin  

If all ✅, you're ready to deploy!

---

## 🚀 One Command to Deploy

After local testing:

```bash
# Frontend (Vercel)
vercel deploy

# Backend (Render)
git push to GitHub → Auto-deploys
```

Done! 🎉

---

## 📞 Stuck? Here's the Flowchart

```
Issue?
│
├─ Won't run
│  └─ Check: setup.bat/sh worked?
│     ├─ No → Run it again
│     └─ Yes → Check .env file
│
├─ Can't login
│  └─ Check: User created in MongoDB?
│     ├─ No → Sign up first
│     └─ Yes → Check JWT_SECRET
│
├─ Upload fails
│  └─ Check: Cloudinary credentials correct?
│     ├─ No → Update .env
│     └─ Yes → Check file size
│
├─ API error
│  └─ Check: Backend running on 5000?
│     ├─ No → npm run dev in server/
│     └─ Yes → Check error in terminal
│
└─ Need help
   └─ Read: QUICKSTART.md or INDEX.md
```

---

## 🎓 Learning Progression

```
Hour 1: Get it running (QUICKSTART.md)
Hour 2: Test all features (GETTING_STARTED.md)
Hour 3: Understand architecture (README.md)
Hour 4: Deploy to production (DEPLOYMENT.md)
Hour 5+: Customize & add features
```

---

## 💡 Pro Tips

1. **Start with:** `INDEX.md` or `QUICKSTART.md`
2. **Keep open:** Terminal 1 (backend), Terminal 2 (frontend)
3. **Debug with:** F12 in browser (frontend errors)
4. **Monitor:** Terminal logs (backend errors)
5. **Test with:** Admin account (set isAdmin: true in MongoDB)
6. **Deploy early:** Test production setup before going live

---

## 🎉 You're Ready!

```
┌──────────────────────────────┐
│  KampusKart is 100% ready!   │
│                              │
│  Next step:                  │
│  Read: QUICKSTART.md         │
│  Run: setup.bat (Windows)    │
│  Wait: ~5 minutes            │
│                              │
│  Then you'll have a LIVE     │
│  campus e-commerce platform! │
└──────────────────────────────┘
```

**Let's build something amazing! 🚀**

---

**Questions?** Check the INDEX.md for all documentation links!
