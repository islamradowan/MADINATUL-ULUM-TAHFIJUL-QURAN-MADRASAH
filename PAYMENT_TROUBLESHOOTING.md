# Payment Integration Troubleshooting Guide

## Issue: Payment not working on Render and Vercel

### Root Cause
The payment system requires proper environment variable configuration for both frontend and backend to communicate correctly with SSLCommerz payment gateway.

---

## Quick Fix Checklist

### ✅ Step 1: Configure Render (Backend) Environment Variables

Go to Render Dashboard → Your Service → Environment Tab

Add these variables (replace URLs with your actual deployment URLs):

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://MADINATUL_ULUM_TAHFIJUL_QURAN_MADRASAH_Trust_db_user:x4JOPKMeggHCLNbW@cluster0.mdpkeny.mongodb.net/madrasa_portal?retryWrites=true&w=majority
JWT_SECRET=madrasa_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d

# SSLCommerz Sandbox
SSLCOMMERZ_STORE_ID=emoni69f6727ef01bb
SSLCOMMERZ_STORE_PASSWORD=emoni69f6727ef01bb@ssl
SSLCOMMERZ_IS_LIVE=false

# CRITICAL: Update these with your actual URLs
FRONTEND_URL=https://your-app-name.vercel.app
BACKEND_URL=https://your-backend-name.onrender.com
```

**Example:**
```env
FRONTEND_URL=https://annusrah-foundation.vercel.app
BACKEND_URL=https://annusrah-backend.onrender.com
```

### ✅ Step 2: Configure Vercel (Frontend) Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add this variable:

```env
REACT_APP_API_BASE_URL=https://your-backend-name.onrender.com/api
```

**Example:**
```env
REACT_APP_API_BASE_URL=https://annusrah-backend.onrender.com/api
```

### ✅ Step 3: Redeploy Both Services

**Render:**
- After saving environment variables, Render will auto-redeploy
- Wait for deployment to complete (check logs)

**Vercel:**
- Go to Deployments tab
- Click "..." menu on latest deployment
- Click "Redeploy"
- Select "Use existing Build Cache" → NO (force fresh build)

---

## How to Find Your Deployment URLs

### Render Backend URL:
1. Go to Render Dashboard
2. Click on your backend service
3. Look for the URL at the top (e.g., `https://your-app.onrender.com`)
4. Copy this URL (without `/api` at the end)

### Vercel Frontend URL:
1. Go to Vercel Dashboard
2. Click on your project
3. Look for "Domains" section
4. Copy the primary domain (e.g., `https://your-app.vercel.app`)

---

## Testing the Payment Flow

### 1. Test Backend Health
Open in browser: `https://your-backend-name.onrender.com/api/health`

Should return: `{"status":"OK"}`

### 2. Test Frontend API Connection
1. Open your Vercel site
2. Open browser DevTools (F12)
3. Go to Console tab
4. Try to donate
5. Check Network tab for API calls
6. Look for `/api/payment/init` request
7. Check if it's calling the correct backend URL

### 3. Test Payment Initialization
1. Fill out donation form
2. Click "Donate Now"
3. Should redirect to SSLCommerz sandbox page
4. If it doesn't redirect, check browser console for errors

### 4. SSLCommerz Sandbox Test Cards
Use these test credentials on SSLCommerz sandbox:

**Test Card:**
- Card Number: `4111111111111111`
- Expiry: Any future date (e.g., `12/25`)
- CVV: Any 3 digits (e.g., `123`)

**Test bKash:**
- Number: `01711111111`
- OTP: `123456`

---

## Common Errors and Solutions

### Error: "Payment gateway temporarily unavailable"
**Cause:** Backend can't reach SSLCommerz or wrong credentials
**Solution:**
- Check `SSLCOMMERZ_STORE_ID` and `SSLCOMMERZ_STORE_PASSWORD` are correct
- Verify `SSLCOMMERZ_IS_LIVE=false` for sandbox
- Check Render logs for SSLCommerz API errors

### Error: "Network Error" or "Failed to fetch"
**Cause:** Frontend can't reach backend
**Solution:**
- Verify `REACT_APP_API_BASE_URL` in Vercel is correct
- Check backend is running (visit health endpoint)
- Check Render logs for errors

### Error: Payment succeeds but redirects to wrong page
**Cause:** `FRONTEND_URL` in backend is incorrect
**Solution:**
- Update `FRONTEND_URL` in Render to match your Vercel URL
- Redeploy backend

### Error: CORS error in browser console
**Cause:** Backend CORS not configured for your frontend domain
**Solution:**
- Backend already allows all origins, but check `server.js` CORS config
- Make sure you're using HTTPS URLs (not HTTP)

### Error: "Transaction not found" after payment
**Cause:** `BACKEND_URL` in Render is incorrect
**Solution:**
- Update `BACKEND_URL` in Render to match your actual Render URL
- SSLCommerz needs this URL to send callbacks
- Redeploy backend

---

## Verification Steps

After configuring everything:

1. ✅ Backend health check returns OK
2. ✅ Frontend loads without console errors
3. ✅ Donation form submits successfully
4. ✅ Redirects to SSLCommerz sandbox page
5. ✅ After payment, redirects back to success page
6. ✅ Transaction appears in admin panel
7. ✅ Donation/Zakat record is created

---

## Debug Mode

To see detailed logs:

### Backend (Render):
1. Go to Render Dashboard → Your Service
2. Click "Logs" tab
3. Watch logs while testing payment
4. Look for:
   - "Payment init request"
   - "Transaction created"
   - "SSLCommerz response"
   - "Payment success callback"

### Frontend (Browser):
1. Open DevTools (F12)
2. Go to Console tab
3. Go to Network tab
4. Filter by "XHR" or "Fetch"
5. Try payment flow
6. Check each API request/response

---

## Still Not Working?

1. **Clear all caches:**
   - Vercel: Redeploy without cache
   - Browser: Hard refresh (Ctrl+Shift+R)
   - Render: Manual deploy

2. **Check SSLCommerz status:**
   - Sandbox may have downtime
   - Try again after a few minutes

3. **Verify MongoDB connection:**
   - Check Render logs for MongoDB errors
   - Verify `MONGO_URI` is correct

4. **Test locally first:**
   - Set environment variables in local `.env`
   - Test payment flow locally
   - If it works locally, issue is with deployment config

---

## Environment Variable Summary

| Variable | Where | Example Value |
|----------|-------|---------------|
| `BACKEND_URL` | Render | `https://annusrah-backend.onrender.com` |
| `FRONTEND_URL` | Render | `https://annusrah-foundation.vercel.app` |
| `REACT_APP_API_BASE_URL` | Vercel | `https://annusrah-backend.onrender.com/api` |
| `SSLCOMMERZ_STORE_ID` | Render | `emoni69f6727ef01bb` |
| `SSLCOMMERZ_STORE_PASSWORD` | Render | `emoni69f6727ef01bb@ssl` |
| `SSLCOMMERZ_IS_LIVE` | Render | `false` |

**CRITICAL:** All three URL variables must match your actual deployment URLs!
