# Environment Variables for Deployment

## Backend (Render)

Set these environment variables in your Render dashboard:

```
PORT=5000
MONGO_URI=mongodb+srv://MADINATUL_ULUM_TAHFIJUL_QURAN_MADRASAH_Trust_db_user:x4JOPKMeggHCLNbW@cluster0.mdpkeny.mongodb.net/madrasa_portal?retryWrites=true&w=majority
JWT_SECRET=madrasa_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d
NODE_ENV=production

# SSLCommerz Configuration
SSLCOMMERZ_STORE_ID=emoni69f6727ef01bb
SSLCOMMERZ_STORE_PASSWORD=emoni69f6727ef01bb@ssl
SSLCOMMERZ_IS_LIVE=false

# IMPORTANT: Replace with your actual URLs
FRONTEND_URL=https://your-vercel-app.vercel.app
BACKEND_URL=https://your-render-app.onrender.com
```

## Frontend (Vercel)

Set this environment variable in your Vercel dashboard:

```
REACT_APP_API_BASE_URL=https://your-render-app.onrender.com/api
```

## Steps to Configure:

### 1. Render (Backend)
1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add all the variables listed above
5. **IMPORTANT**: Update `FRONTEND_URL` to your Vercel URL (e.g., https://annusrah-foundation.vercel.app)
6. **IMPORTANT**: Update `BACKEND_URL` to your Render URL (e.g., https://annusrah-backend.onrender.com)
7. Click "Save Changes"
8. Render will automatically redeploy

### 2. Vercel (Frontend)
1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add `REACT_APP_API_BASE_URL` with your Render backend URL + /api
5. Click "Save"
6. Go to "Deployments" tab
7. Click "..." on the latest deployment → "Redeploy"

## Common Issues:

### Payment not working:
- ✅ Check that `BACKEND_URL` in Render matches your actual Render URL
- ✅ Check that `FRONTEND_URL` in Render matches your actual Vercel URL
- ✅ Check that `REACT_APP_API_BASE_URL` in Vercel matches your Render URL + /api
- ✅ Make sure all environment variables are saved and services are redeployed

### CORS errors:
- The backend already has CORS configured to accept requests from any origin
- If you still get CORS errors, check that the frontend is using the correct API URL

### SSLCommerz errors:
- Make sure `SSLCOMMERZ_IS_LIVE=false` for sandbox testing
- The sandbox credentials are already configured correctly
- SSLCommerz sandbox may have downtime - check their status page
