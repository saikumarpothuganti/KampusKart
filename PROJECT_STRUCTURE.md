# KampusKart Project - File Structure Overview

## Complete Directory Tree

```
KampusKart/
│
├── README.md                          # Main project documentation
├── QUICKSTART.md                      # Quick start guide
├── ENV_SETUP.md                       # Environment variables guide
├── DEPLOYMENT.md                      # Deployment instructions
├── setup.sh                           # Unix/Linux/Mac setup script
├── setup.bat                          # Windows setup script
│
├── server/                            # Backend (Node.js + Express)
│   ├── index.js                       # Entry point, server configuration
│   ├── package.json                   # Dependencies and scripts
│   ├── .env.example                   # Environment variables template
│   │
│   ├── config/
│   │   ├── db.js                      # MongoDB connection
│   │   └── cloudinary.js              # Cloudinary configuration
│   │
│   ├── middleware/
│   │   ├── auth.js                    # JWT authentication middleware
│   │   └── upload.js                  # Multer file upload configuration
│   │
│   ├── models/
│   │   ├── User.js                    # User schema (name, email, passwordHash, isAdmin)
│   │   ├── Subject.js                 # Subject schema (title, code, year, sem, price)
│   │   ├── Cart.js                    # Cart schema (userId, items)
│   │   └── Order.js                   # Order schema (orderId, items, status, payment)
│   │
│   ├── controllers/
│   │   ├── authController.js          # Signup, signin, profile
│   │   ├── subjectController.js       # Subject CRUD operations
│   │   ├── cartController.js          # Cart operations (add, update, remove)
│   │   ├── orderController.js         # Order creation, status updates, cancellation
│   │   └── uploadController.js        # PDF and screenshot uploads
│   │
│   └── routes/
│       ├── authRoutes.js              # /api/auth routes
│       ├── subjectRoutes.js           # /api/subjects routes
│       ├── cartRoutes.js              # /api/cart routes
│       ├── orderRoutes.js             # /api/orders routes
│       └── uploadRoutes.js            # /api/upload routes
│
└── client/                            # Frontend (React + Vite)
    ├── index.html                     # HTML entry point
    ├── package.json                   # Dependencies and scripts
    ├── vite.config.js                 # Vite configuration
    ├── tailwind.config.js             # Tailwind CSS configuration
    ├── postcss.config.js              # PostCSS configuration
    │
    ├── public/                        # Static assets
    │
    └── src/
        ├── main.jsx                   # React entry point
        ├── App.jsx                    # Main app component with routing
        ├── index.css                  # Global styles
        │
        ├── lib/
        │   └── api.js                 # Axios API client with auth interceptor
        │
        ├── context/
        │   ├── AuthContext.jsx        # User authentication state (signup, signin, logout)
        │   └── CartContext.jsx        # Shopping cart state management
        │
        ├── components/                # Reusable UI components
        │   ├── Navbar.jsx             # Navigation bar with user dropdown
        │   ├── SubjectCard.jsx        # Subject workbook card
        │   ├── CustomBookCard.jsx     # Custom PDF upload card
        │   ├── CartItem.jsx           # Cart item display with qty/sides controls
        │   ├── OrderCard.jsx          # Order history card
        │   ├── OrderStatusTimeline.jsx # 4-step order progress timeline
        │   └── ContactLinks.jsx       # WhatsApp/Telegram links
        │
        └── pages/                     # Route pages
            ├── Home.jsx               # Landing page with service cards
            ├── Workbook.jsx           # Subject browsing and custom PDF upload
            ├── Cart.jsx               # Shopping cart display
            ├── Checkout.jsx           # Student details form
            ├── Payment.jsx            # QR code and screenshot upload
            ├── OrderStatus.jsx        # Order tracking with timeline
            ├── OrderHistory.jsx       # List of all user orders
            ├── Profile.jsx            # User profile and account settings
            ├── SignIn.jsx             # Login page
            ├── SignUp.jsx             # Registration page
            └── Admin.jsx              # Admin dashboard (orders + subjects)
```

## Key Files Explained

### Backend
- **index.js**: Initializes Express server, connects to MongoDB, sets up routes
- **models/**: Define database schemas for all entities
- **controllers/**: Business logic separated from routes
- **routes/**: Define API endpoints and connect to controllers
- **middleware/**: Auth verification and file upload handling

### Frontend
- **App.jsx**: React Router setup with all routes
- **context/**: Global state using Context API (no Redux needed)
- **lib/api.js**: Centralized API client with automatic token injection
- **pages/**: Each route has its own page component
- **components/**: Small, reusable UI pieces

## API Endpoints Summary

### Authentication
```
POST   /api/auth/signup
POST   /api/auth/signin
GET    /api/auth/profile
```

### Subjects
```
GET    /api/subjects?year=1&sem=1
GET    /api/subjects/all
POST   /api/subjects
PUT    /api/subjects/:id
DELETE /api/subjects/:id
```

### Cart
```
GET    /api/cart
POST   /api/cart/add
PUT    /api/cart/:itemIndex
DELETE /api/cart/:itemIndex
DELETE /api/cart
```

### Orders
```
POST   /api/orders
GET    /api/orders/my
GET    /api/orders/:orderId
POST   /api/orders/:orderId/cancel
GET    /api/orders/admin/all
PUT    /api/orders/:orderId/status
DELETE /api/orders/:orderId
```

### Uploads
```
POST   /api/upload/pdf
POST   /api/upload/screenshot
```

## Database Collections

- **users**: User accounts with auth info
- **subjects**: Workbooks available for purchase
- **carts**: Shopping carts per user
- **orders**: Order history with status tracking

## Environment Variables Required

```
# Backend only
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PORT=5000
NODE_ENV=development
```

## Scripts Available

### Backend
```bash
npm run dev      # Development server with hot reload
npm start        # Production server
```

### Frontend
```bash
npm run dev      # Development server (http://localhost:3000)
npm run build    # Build for production
npm run preview  # Preview production build
```

---

This structure is designed to be:
- **Modular**: Easy to add new features
- **Scalable**: Ready for growth
- **Maintainable**: Clear separation of concerns
- **Modern**: Using latest tools (React 18, Vite, Tailwind)
