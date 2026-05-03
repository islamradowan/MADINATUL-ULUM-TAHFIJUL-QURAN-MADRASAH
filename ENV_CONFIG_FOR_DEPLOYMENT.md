# 🔧 Environment Variables Configuration

## Your Deployment URLs
- **Frontend (Vercel):** https://madinatul-ulum-tahfijul-quran-madra.vercel.app
- **Backend (Render):** https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com

---

## 1️⃣ Render Backend Configuration

Go to: https://dashboard.render.com → Your Backend Service → **Environment** tab

### Add/Update these environment variables:

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://MADINATUL_ULUM_TAHFIJUL_QURAN_MADRASAH_Trust_db_user:x4JOPKMeggHCLNbW@cluster0.mdpkeny.mongodb.net/madrasa_portal?retryWrites=true&w=majority
JWT_SECRET=madrasa_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d

SSLCOMMERZ_STORE_ID=emoni69f6727ef01bb
SSLCOMMERZ_STORE_PASSWORD=emoni69f6727ef01bb@ssl
SSLCOMMERZ_IS_LIVE=false

FRONTEND_URL=https://madinatul-ulum-tahfijul-quran-madra.vercel.app
BACKEND_URL=https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com
```

### ⚠️ CRITICAL Variables for Payment:
- `FRONTEND_URL` - Where SSLCommerz redirects users after payment
- `BACKEND_URL` - Where SSLCommerz sends payment callbacks

Click **"Save Changes"** → Render will automatically redeploy (takes 2-3 minutes)

---

## 2️⃣ Vercel Frontend Configuration

Go to: https://vercel.com/dashboard → Your Project → **Settings** → **Environment Variables**

### Add/Update this variable:

**Key:** `REACT_APP_API_BASE_URL`  
**Value:** `https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com/api`

**Apply to:** All environments (Production, Preview, Development)

Click **"Save"**

Then go to **Deployments** tab → Click **"..."** on latest deployment → **"Redeploy"** → Select **"Use existing Build Cache: NO"**

---

## 3️⃣ Verification Steps

### Step 1: Check Backend Health
Open in browser: https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com/api/health

Should return: `{"status":"OK"}`

### Step 2: Check Frontend
Open: https://madinatul-ulum-tahfijul-quran-madra.vercel.app

### Step 3: Test Payment Flow
1. Go to Donations page
2. Fill out donation form
3. Click "Donate Now"
4. Should redirect to SSLCommerz sandbox page
5. Use test card: `4111111111111111`, expiry: `12/25`, CVV: `123`
6. Complete payment
7. Should redirect back to: https://madinatul-ulum-tahfijul-quran-madra.vercel.app/payment/success

---

## 📋 Copy-Paste Ready

### For Render (Backend):
```
FRONTEND_URL=https://madinatul-ulum-tahfijul-quran-madra.vercel.app
BACKEND_URL=https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com
```

### For Vercel (Frontend):
```
REACT_APP_API_BASE_URL=https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com/api
```

---

## ✅ Checklist

- [ ] Updated `FRONTEND_URL` in Render
- [ ] Updated `BACKEND_URL` in Render  
- [ ] Saved changes in Render (auto-redeploys)
- [ ] Updated `REACT_APP_API_BASE_URL` in Vercel
- [ ] Redeployed Vercel (without cache)
- [ ] Waited 2-3 minutes for both deployments
- [ ] Tested backend health endpoint
- [ ] Tested payment flow
- [ ] Payment works! 🎉

---

## 🐛 Debugging

If payment still doesn't work after configuration:

1. **Check Render Logs:**
   - Go to Render Dashboard → Your Service → Logs
   - Look for errors during payment initialization

2. **Check Browser Console:**
   - Open your site → Press F12
   - Go to Console tab
   - Try payment and check for errors

3. **Verify Environment Variables:**
   - Render: Check all variables are saved correctly
   - Vercel: Check variable is applied to Production

4. **Force Fresh Deploy:**
   - Render: Manual Deploy → Deploy latest commit
   - Vercel: Redeploy without cache
