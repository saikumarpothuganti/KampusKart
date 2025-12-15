# KampusKart - Full Stack Project

**Tagline:** Everything Students Need in One Place.

A comprehensive campus service platform where students can order printed workbooks, upload custom PDFs, pay via QR codes, and track their orders.

## 🚀 Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management (Auth + Cart)

### Backend
- **Node.js + Express.js**
- **MongoDB Atlas** (Mongoose ORM)
- **JWT Authentication** with bcryptjs
- **Cloudinary** for file uploads (PDFs & images)
- **Multer** for file handling
- **CORS** for cross-origin requests
- **.env** for environment variables

## 📁 Project Structure

```
KampusKart/
├── server/                 # Backend
│   ├── models/            # Database schemas
│   │   ├── User.js
│   │   ├── Subject.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── controllers/       # Route logic
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth, upload handlers
│   ├── config/          # Database & Cloudinary config
│   ├── index.js         # Server entry point
│   ├── package.json
│   └── .env.example
│
└── client/               # Frontend
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/      # Route pages
    │   ├── context/    # Auth & Cart context
    │   ├── lib/       # API client
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🔧 Installation & Setup

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Fill in your environment variables:
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Your JWT secret key
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary credentials
- `PORT`: Server port (default: 5000)

5. Start the server:
```bash
npm run dev  # Development with nodemon
# or
npm start   # Production
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 🌐 API Endpoints

### Auth Routes (`/api/auth`)
- `POST /signup` - Register new user
- `POST /signin` - Login user
- `GET /profile` - Get user profile (auth required)

### Subjects (`/api/subjects`)
- `GET /?year=1&sem=1` - Get subjects by year and semester
- `GET /all` - Get all subjects
- `POST /` - Create subject (auth required)
- `PUT /:id` - Update subject (auth required)
- `DELETE /:id` - Delete subject (auth required)

### Cart (`/api/cart`)
- `GET /` - Get user's cart (auth required)
- `POST /add` - Add item to cart (auth required)
- `PUT /:itemIndex` - Update cart item (auth required)
- `DELETE /:itemIndex` - Remove from cart (auth required)
- `DELETE /` - Clear cart (auth required)

### Orders (`/api/orders`)
- `POST /` - Create order (auth required)
- `GET /my` - Get my orders (auth required)
- `GET /:orderId` - Get order details (auth required)
- `POST /:orderId/cancel` - Cancel order (auth required)
- `GET /admin/all` - Get all orders (admin only)
- `PUT /:orderId/status` - Update order status (admin only)
- `DELETE /:orderId` - Delete order (admin only)

### Uploads (`/api/upload`)
- `POST /pdf` - Upload PDF (auth required)
- `POST /screenshot` - Upload payment screenshot (auth required)

## 🎯 Features

### User Features
1. **Workbook Printing**
   - Browse subjects by year & semester
   - Upload custom PDFs
   - Set custom prices
   - Select printing sides (1-sided or 2-sided)

2. **Shopping Cart**
   - Add/remove items
   - Edit quantity and sides
   - Persistent cart across sessions

3. **Checkout**
   - Enter student details
   - Default pickup location
   - Additional notes

4. **Payment**
   - Display total amount
   - QR code placeholder
   - Upload payment screenshot
   - Automatic order creation

5. **Order Tracking**
   - 4-step timeline (Sent → Placed → Printing → Delivered)
   - View payment screenshot
   - Cancel orders (while status is "Sent")
   - Order history with status badges

6. **Profile**
   - View account details
   - Access order history
   - Quick logout

### Admin Features
- View all orders with details
- Update order status manually
- View payment screenshots
- Delete orders
- Manage subjects (add/edit/delete)
- Change subject prices

## 🔐 Authentication

- JWT-based authentication
- Passwords hashed with bcryptjs
- Admin detection: users marked as admin in DB can access `/admin`
- Token stored in localStorage (client-side)

## 📦 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  passwordHash: String,
  isAdmin: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Subject
```javascript
{
  title: String,
  code: String,
  year: Number,
  sem: Number,
  price: Number,
  coverUrl: String,
  createdAt: Date
}
```

### Cart
```javascript
{
  userId: ObjectId (ref: User),
  items: [
    {
      type: 'subject' | 'custom',
      subjectId: ObjectId,
      title: String,
      code: String,
      pdfUrl: String,
      qty: Number,
      sides: 1 | 2,
      price: Number,
      userPrice: Number
    }
  ],
  createdAt: Date
}
```

### Order
```javascript
{
  userId: ObjectId,
  orderId: String (unique, format: "O1234"),
  items: [...],
  amount: Number,
  status: 'sent' | 'placed' | 'printing' | 'delivered' | 'cancelled',
  canCancel: Boolean,
  payment: {
    screenshotUrl: String
  },
  pickupAddress: String,
  student: {
    name: String,
    collegeId: String,
    phone: String
  },
  notes: String,
  createdAt: Date
}
```

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Color Scheme**: Primary (#3b82f6) and Secondary (#1e40af) blues
- **Navigation**: Navbar with cart icon and user avatar dropdown
- **Status Indicators**: Color-coded badges for order statuses
- **Timeline View**: Visual 4-step order progress
- **Contact Links**: WhatsApp and Telegram support links throughout

## 💾 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy (automatic on push)

### Backend (Render/Heroku)
1. Create account on Render or Heroku
2. Connect GitHub repo
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
- Create free cluster
- Get connection string
- Add to backend `.env`

### File Storage (Cloudinary)
- Sign up for free account
- Get API credentials
- Add to backend `.env`

## 🚀 Upcoming Features

- Book recycling/selling
- Book rental system
- Email notifications
- Order tracking via email
- Payment gateway integration (Razorpay, Stripe)
- Ratings and reviews
- Wishlist
- Bulk ordering for clubs

## 📝 Notes

- Admin access is hidden from UI (no login link visible)
- Admin status must be set manually in MongoDB
- Order IDs are generated as "O" + 4-digit random number
- Cancellation only allowed for "sent" status orders
- All uploads go to Cloudinary (PDFs and images)
- Payment screenshots are stored on Cloudinary
- Cart persists in database per user

## 📞 Support

For questions or issues, contact via:
- WhatsApp: [Link in navbar]
- Telegram: [Link in navbar]

---

**Built with ❤️ for campus students everywhere!**
