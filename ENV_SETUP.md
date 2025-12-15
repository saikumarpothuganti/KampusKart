# Environment Variables Setup Guide

## Backend (.env)

Create a `.env` file in the `server` directory with the following variables:

```
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/kampuskart?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Cloudinary (File Uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Getting Credentials

### MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Go to "Database" → "Connect"
5. Select "Connect your application"
6. Copy the connection string and replace `<password>` with your password
7. Paste as `MONGODB_URI`

### Cloudinary
1. Go to https://cloudinary.com
2. Sign up for free (up to 25 credits/month)
3. Go to Dashboard
4. Copy your Cloud Name, API Key, and API Secret
5. Paste into the respective `.env` variables

### JWT Secret
- Generate any random string (at least 32 characters for production)
- Example: `your-super-secret-jwt-key-change-this-in-production`

## Frontend Environment Variables (Optional)

Create `.env` file in `client` directory if needed:

```
VITE_API_URL=http://localhost:5000/api
```

This is already configured in `vite.config.js` with a proxy, so optional.

---

**⚠️ IMPORTANT:** Never commit `.env` file to version control. Use `.env.example` for reference.
