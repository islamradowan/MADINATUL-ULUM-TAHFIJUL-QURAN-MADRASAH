# ✅ FINAL ACTION CHECKLIST - Fix Payment Now!

## 🎯 Your URLs
- Frontend: https://madinatul-ulum-tahfijul-quran-madra.vercel.app
- Backend: https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com

---

## 📝 Step-by-Step Instructions

### STEP 1: Update Render (2 minutes)

1. Go to: https://dashboard.render.com
2. Click on your backend service
3. Click **"Environment"** tab on the left
4. Find or add these TWO variables:

   **Variable 1:**
   - Key: `FRONTEND_URL`
   - Value: `https://madinatul-ulum-tahfijul-quran-madra.vercel.app`

   **Variable 2:**
   - Key: `BACKEND_URL`
   - Value: `https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com`

5. Click **"Save Changes"**
6. Wait for auto-redeploy to complete (watch the "Events" tab)

---

### STEP 2: Update Vercel (2 minutes)

1. Go to: https://vercel.com/dashboard
2. Click on your project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in the left sidebar
5. Find or add this variable:

   - Key: `REACT_APP_API_BASE_URL`
   - Value: `https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com/api`
   - Environments: Check all (Production, Preview, Development)

6. Click **"Save"**
7. Go to **"Deployments"** tab
8. Click the **"..."** menu on the latest deployment
9. Click **"Redeploy"**
10. When asked about cache, select **"NO"** (force fresh build)

---

### STEP 3: Commit & Push Code Changes (1 minute)

I've updated the axios timeout configuration. Commit and push:

```bash
git add .
git commit -m "fix: Update axios timeout and environment configuration for payment gateway"
git push
```

This will trigger automatic redeployment on Vercel.

---

### STEP 4: Wait & Verify (3 minutes)

**Wait for deployments:**
- Render: Check "Events" tab - wait for "Deploy succeeded"
- Vercel: Check "Deployments" tab - wait for "Ready"

**Test backend health:**
Open: https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com/api/health

Should see: `{"status":"OK"}`

**Test frontend:**
Open: https://madinatul-ulum-tahfijul-quran-madra.vercel.app

---

### STEP 5: Test Payment (2 minutes)

1. Go to: https://madinatul-ulum-tahfijul-quran-madra.vercel.app/donate
2. Click on any campaign (e.g., "Masjid Complex")
3. Fill donation form:
   - Amount: 100
   - Name: Test Donor
   - Email: test@example.com
   - Phone: 01700000000
   - Payment Method: Card
4. Click **"Donate Now"**
5. Should redirect to SSLCommerz sandbox page
6. Use test card:
   - Card: `4111111111111111`
   - Expiry: `12/25`
   - CVV: `123`
   - Name: Test
7. Click "Submit"
8. Should redirect back to success page

---

## 🎉 Success Indicators

✅ Backend health check returns OK  
✅ Frontend loads without errors  
✅ Donation form submits successfully  
✅ Redirects to SSLCommerz sandbox  
✅ Payment completes successfully  
✅ Redirects to success page  
✅ Transaction appears in admin panel  

---

## 🆘 If It Still Doesn't Work

### Check Render Logs:
1. Render Dashboard → Your Service → **"Logs"** tab
2. Look for errors like:
   - "SSLCommerz API Error"
   - "Payment init error"
   - "MongoDB connection error"

### Check Browser Console:
1. Open your site
2. Press **F12** (DevTools)
3. Go to **"Console"** tab
4. Try payment
5. Look for red error messages

### Common Issues:

**"Network Error"**
- Vercel environment variable not saved correctly
- Try redeploying Vercel again

**"Payment gateway unavailable"**
- SSLCommerz sandbox might be down
- Wait 5 minutes and try again
- Check Render logs for SSLCommerz errors

**"Transaction not found"**
- BACKEND_URL in Render is wrong
- Double-check the URL has no trailing slash
- Redeploy Render

---

## 📞 Need Help?

Check these files for detailed troubleshooting:
- `ENV_CONFIG_FOR_DEPLOYMENT.md` - Full configuration guide
- `PAYMENT_TROUBLESHOOTING.md` - Detailed troubleshooting
- `DEPLOYMENT_ENV_SETUP.md` - Environment setup reference

---

## ⏱️ Total Time: ~10 minutes

- Step 1 (Render): 2 min
- Step 2 (Vercel): 2 min  
- Step 3 (Git): 1 min
- Step 4 (Wait): 3 min
- Step 5 (Test): 2 min

**You're almost there! Follow these steps and payment will work! 🚀**
