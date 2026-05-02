# SSLCommerz Integration - Quick Start

## Installation

### Step 1: Install Backend Package
```bash
cd madrasa-backend
npm install sslcommerz-lts
```

### Step 2: Verify Environment Variables
Check that `madrasa-backend/.env` contains:
```env
SSLCOMMERZ_STORE_ID=emoni69f6727ef01bb
SSLCOMMERZ_STORE_PASSWORD=emoni69f6727ef01bb@ssl
SSLCOMMERZ_IS_LIVE=false
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

### Step 3: Start Backend
```bash
npm run dev
```

### Step 4: Start Frontend (in new terminal)
```bash
cd madrasa-portal
npm start
```

## Test Payment

1. Open http://localhost:3000/donate/mosque
2. Enter amount: 100
3. Select payment method: **Card**
4. Click "Donate Now"
5. Use test card: **4111 1111 1111 1111**
6. Complete payment on SSLCommerz sandbox
7. You'll be redirected to success page

## What's Integrated

✅ All 4 donation pages support Card payment via SSLCommerz
✅ Zakat calculator supports Card payment via SSLCommerz
✅ Other payment methods (bKash, Nagad, Bank, Cash) work as before
✅ Payment success/fail/cancel pages created
✅ Transaction tracking in database
✅ Automatic donation/zakat record creation after successful payment

## Files Created

**Backend:**
- `src/models/Transaction.js`
- `src/controllers/paymentController.js`
- `src/routes/payment.js`

**Frontend:**
- `src/services/paymentService.js`
- `src/pages/PaymentSuccessPage.jsx`
- `src/pages/PaymentFailPage.jsx`
- `src/pages/PaymentCancelPage.jsx`

**Updated:**
- All donation pages
- Zakat calculator page
- Routes configuration

## Need Help?

See `SSLCOMMERZ_INTEGRATION.md` for detailed documentation.
