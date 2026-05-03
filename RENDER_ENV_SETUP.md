# Render Environment Variables Setup

## Required Environment Variables for Render

Go to: Render Dashboard → Your Backend Service → Environment Tab

Add these variables:

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://MADINATUL_ULUM_TAHFIJUL_QURAN_MADRASAH_Trust_db_user:x4JOPKMeggHCLNbW@cluster0.mdpkeny.mongodb.net/madrasa_portal?retryWrites=true&w=majority
JWT_SECRET=madrasa_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d

SSLCOMMERZ_STORE_ID=emoni69f6727ef01bb
SSLCOMMERZ_STORE_PASSWORD=emoni69f6727ef01bb@ssl
SSLCOMMERZ_IS_LIVE=false
```

## Optional (URLs will auto-detect if not set)

```
FRONTEND_URL=https://madinatul-ulum-tahfijul-quran-madra.vercel.app
BACKEND_URL=https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com
```

## Important Notes

1. **SSLCOMMERZ_STORE_ID** and **SSLCOMMERZ_STORE_PASSWORD** are REQUIRED
2. If these are missing, you'll get a 500 error with message "Payment gateway not configured"
3. URLs are optional - the code will automatically use production URLs when NODE_ENV=production
4. Make sure NODE_ENV=production is set on Render

## After Setting Variables

1. Click "Save Changes"
2. Render will automatically redeploy
3. Wait 2-3 minutes for deployment to complete
4. Test payment at: https://madinatul-ulum-tahfijul-quran-madra.vercel.app/donate
