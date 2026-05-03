# 🚀 QUICK FIX: Payment Not Working

## The Problem
Payment section not working because environment variables are set to `localhost` instead of your actual deployment URLs.

## The Solution (5 minutes)

### 1️⃣ Get Your URLs

**Your Render Backend URL:**
- Go to: https://dashboard.render.com
- Find your backend service
- Copy the URL (looks like: `https://something.onrender.com`)

**Your Vercel Frontend URL:**
- Go to: https://vercel.com/dashboard
- Find your project
- Copy the domain (looks like: `https://something.vercel.app`)

---

### 2️⃣ Update Render (Backend)

Go to: Render Dashboard → Your Backend Service → Environment

**Add/Update these 2 variables:**

```
FRONTEND_URL=https://your-vercel-url.vercel.app
BACKEND_URL=https://your-render-url.onrender.com
```

**Example:**
```
FRONTEND_URL=https://annusrah-foundation.vercel.app
BACKEND_URL=https://annusrah-backend.onrender.com
```

Click "Save Changes" → Render will auto-redeploy

---

### 3️⃣ Update Vercel (Frontend)

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

**Add/Update this variable:**

```
REACT_APP_API_BASE_URL=https://your-render-url.onrender.com/api
```

**Example:**
```
REACT_APP_API_BASE_URL=https://annusrah-backend.onrender.com/api
```

Click "Save" → Go to Deployments → Redeploy (without cache)

---

### 4️⃣ Test

1. Wait for both deployments to complete (2-3 minutes)
2. Open your Vercel site
3. Try to make a donation
4. Should redirect to SSLCommerz sandbox page
5. Use test card: `4111111111111111`, any future date, any CVV
6. Should redirect back to success page

---

## ✅ Checklist

- [ ] Got Render backend URL
- [ ] Got Vercel frontend URL  
- [ ] Updated `FRONTEND_URL` in Render
- [ ] Updated `BACKEND_URL` in Render
- [ ] Updated `REACT_APP_API_BASE_URL` in Vercel
- [ ] Redeployed both services
- [ ] Tested payment flow
- [ ] Payment works! 🎉

---

## 🆘 Still Not Working?

Check the detailed guide: `PAYMENT_TROUBLESHOOTING.md`

Or verify these are already set in Render:
```
SSLCOMMERZ_STORE_ID=emoni69f6727ef01bb
SSLCOMMERZ_STORE_PASSWORD=emoni69f6727ef01bb@ssl
SSLCOMMERZ_IS_LIVE=false
```
