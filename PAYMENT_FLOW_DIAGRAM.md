# 🔄 Payment Flow Diagram

## How Payment Works (With Environment Variables)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PAYMENT FLOW                                 │
└─────────────────────────────────────────────────────────────────────┘

1️⃣ USER INITIATES PAYMENT
   ↓
   User fills donation form on:
   https://madinatul-ulum-tahfijul-quran-madra.vercel.app/donate
   ↓
   Clicks "Donate Now"


2️⃣ FRONTEND → BACKEND
   ↓
   Frontend sends POST request to:
   https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com/api/payment/init
   ↓
   Uses: REACT_APP_API_BASE_URL (Vercel env var)
   ↓
   Payload: { type, amount, donorName, projectType, paymentMethod }


3️⃣ BACKEND → SSLCOMMERZ
   ↓
   Backend creates transaction in MongoDB
   ↓
   Backend calls SSLCommerz API with:
   - success_url: BACKEND_URL + /api/payment/success
   - fail_url: BACKEND_URL + /api/payment/fail
   - cancel_url: BACKEND_URL + /api/payment/cancel
   ↓
   Uses: BACKEND_URL (Render env var)
   ↓
   SSLCommerz returns: { GatewayPageURL }


4️⃣ BACKEND → FRONTEND
   ↓
   Backend sends response:
   { success: true, gatewayUrl: "https://sandbox.sslcommerz.com/..." }
   ↓
   Frontend redirects user to gatewayUrl


5️⃣ USER → SSLCOMMERZ
   ↓
   User enters payment details on SSLCommerz page
   ↓
   User completes payment


6️⃣ SSLCOMMERZ → BACKEND
   ↓
   SSLCommerz redirects to:
   https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com/api/payment/success
   ↓
   Uses: BACKEND_URL (that we configured in step 3)
   ↓
   Backend validates payment
   ↓
   Backend creates Donation/Zakat record in MongoDB


7️⃣ BACKEND → FRONTEND
   ↓
   Backend redirects user to:
   https://madinatul-ulum-tahfijul-quran-madra.vercel.app/payment/success
   ↓
   Uses: FRONTEND_URL (Render env var)
   ↓
   User sees success page! 🎉
```

---

## 🔑 Environment Variables Explained

### REACT_APP_API_BASE_URL (Vercel)
**Where:** Frontend (Vercel)  
**Value:** `https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com/api`  
**Used in:** Step 2 - Frontend calling backend API  
**Why needed:** Frontend needs to know where backend is hosted

### BACKEND_URL (Render)
**Where:** Backend (Render)  
**Value:** `https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com`  
**Used in:** Step 3 & 6 - SSLCommerz callbacks  
**Why needed:** SSLCommerz needs to know where to send payment results

### FRONTEND_URL (Render)
**Where:** Backend (Render)  
**Value:** `https://madinatul-ulum-tahfijul-quran-madra.vercel.app`  
**Used in:** Step 7 - Final redirect to user  
**Why needed:** Backend needs to know where to redirect user after payment

---

## ❌ What Happens Without Correct URLs

### If REACT_APP_API_BASE_URL is wrong:
```
Frontend → ❌ Wrong Backend URL → Network Error
User sees: "Failed to fetch" or "Network Error"
```

### If BACKEND_URL is wrong:
```
SSLCommerz → ❌ Wrong Callback URL → 404 Not Found
Payment succeeds but backend never knows about it
Transaction stuck in "Pending" status
```

### If FRONTEND_URL is wrong:
```
Backend → ❌ Wrong Redirect URL → User sees 404
Payment succeeds, transaction created, but user lost
User doesn't see success page
```

---

## ✅ What Happens With Correct URLs

```
Frontend → ✅ Correct Backend
Backend → ✅ Correct SSLCommerz Callbacks
SSLCommerz → ✅ Correct Backend Callback
Backend → ✅ Correct Frontend Redirect
User → ✅ Sees Success Page
Admin → ✅ Sees Transaction in Dashboard
```

---

## 🧪 Testing Each Step

### Test Step 2 (Frontend → Backend):
```bash
# Open browser console on your site
# Try to donate
# Check Network tab for:
POST https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com/api/payment/init
Status: 200 OK
Response: { success: true, gatewayUrl: "..." }
```

### Test Step 3 (Backend → SSLCommerz):
```bash
# Check Render logs for:
"Initializing SSLCommerz with store_id: emoni69f6727ef01bb"
"SSLCommerz response: SUCCESS"
"Gateway URL generated: https://sandbox.sslcommerz.com/..."
```

### Test Step 6 (SSLCommerz → Backend):
```bash
# After payment, check Render logs for:
"Payment success callback: { tran_id: 'TXN...', status: 'VALID' }"
"Transaction created: TXN..."
"Donation created: 6..."
```

### Test Step 7 (Backend → Frontend):
```bash
# User should be redirected to:
https://madinatul-ulum-tahfijul-quran-madra.vercel.app/payment/success?tran_id=TXN...
```

---

## 🎯 Quick Verification

Run these commands to verify URLs are correct:

### Check Backend Health:
```bash
curl https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com/api/health
# Should return: {"status":"OK"}
```

### Check Frontend:
```bash
# Open in browser:
https://madinatul-ulum-tahfijul-quran-madra.vercel.app
# Should load homepage
```

### Check Environment Variables:
```bash
# Render Dashboard → Environment tab
# Should see:
BACKEND_URL=https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com
FRONTEND_URL=https://madinatul-ulum-tahfijul-quran-madra.vercel.app

# Vercel Dashboard → Settings → Environment Variables
# Should see:
REACT_APP_API_BASE_URL=https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com/api
```

---

## 🚀 Summary

**3 URLs to configure:**
1. Frontend → Backend: `REACT_APP_API_BASE_URL` in Vercel
2. SSLCommerz → Backend: `BACKEND_URL` in Render
3. Backend → Frontend: `FRONTEND_URL` in Render

**All 3 must be correct for payment to work end-to-end!**
