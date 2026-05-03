# ✅ PAYMENT FIX CHECKLIST

Print this and check off each step!

---

## 🎯 YOUR URLS (Reference)

```
Frontend: https://madinatul-ulum-tahfijul-quran-madra.vercel.app
Backend:  https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com
```

---

## 📋 STEP-BY-STEP

### □ STEP 1: Open Render Dashboard
- [ ] Go to https://dashboard.render.com
- [ ] Click on your backend service
- [ ] Click "Environment" tab

### □ STEP 2: Add Render Variables
- [ ] Add `FRONTEND_URL` = `https://madinatul-ulum-tahfijul-quran-madra.vercel.app`
- [ ] Add `BACKEND_URL` = `https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com`
- [ ] Click "Save Changes"
- [ ] Wait for "Deploy succeeded" in Events tab

### □ STEP 3: Open Vercel Dashboard
- [ ] Go to https://vercel.com/dashboard
- [ ] Click on your project
- [ ] Click "Settings" → "Environment Variables"

### □ STEP 4: Add Vercel Variable
- [ ] Add `REACT_APP_API_BASE_URL` = `https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com/api`
- [ ] Check all environments (Production, Preview, Development)
- [ ] Click "Save"

### □ STEP 5: Redeploy Vercel
- [ ] Go to "Deployments" tab
- [ ] Click "..." on latest deployment
- [ ] Click "Redeploy"
- [ ] Select "Use existing Build Cache: NO"
- [ ] Wait for "Ready" status

### □ STEP 6: Commit Code Changes
```bash
git add .
git commit -m "fix: Configure payment gateway for production"
git push
```
- [ ] Code committed and pushed

### □ STEP 7: Wait for Deployments
- [ ] Render deployment complete (2-3 min)
- [ ] Vercel deployment complete (2-3 min)

### □ STEP 8: Test Backend Health
- [ ] Open: https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com/api/health
- [ ] Should see: `{"status":"OK"}`

### □ STEP 9: Test Frontend
- [ ] Open: https://madinatul-ulum-tahfijul-quran-madra.vercel.app
- [ ] Site loads without errors

### □ STEP 10: Test Payment Flow
- [ ] Go to Donations page
- [ ] Fill form (Amount: 100, Name: Test, Email: test@test.com)
- [ ] Click "Donate Now"
- [ ] Redirects to SSLCommerz sandbox
- [ ] Enter test card: `4111111111111111`, `12/25`, `123`
- [ ] Click Submit
- [ ] Redirects to success page
- [ ] Transaction appears in admin panel

---

## ✅ SUCCESS CRITERIA

- [x] Backend health check returns OK
- [x] Frontend loads without errors
- [x] Payment form submits successfully
- [x] Redirects to SSLCommerz
- [x] Payment completes
- [x] Redirects to success page
- [x] Transaction in admin panel
- [x] Donation record created

---

## 🆘 IF SOMETHING FAILS

### Network Error:
→ Check Vercel environment variable

### Gateway Unavailable:
→ Check Render SSLCommerz credentials

### No Redirect After Payment:
→ Check Render FRONTEND_URL

### Transaction Not Found:
→ Check Render BACKEND_URL

---

## 📞 NEED HELP?

Read these files in order:
1. ACTION_CHECKLIST.md (detailed steps)
2. PAYMENT_FLOW_DIAGRAM.md (understand flow)
3. PAYMENT_TROUBLESHOOTING.md (fix issues)

---

**Total Time: ~10 minutes**

**Date Completed: _______________**

**Tested By: _______________**

**Status: ⭕ Pending / ✅ Working**
