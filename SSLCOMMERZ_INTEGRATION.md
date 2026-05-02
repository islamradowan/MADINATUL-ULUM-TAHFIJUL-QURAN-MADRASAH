# SSLCommerz Payment Gateway Integration Guide

## Overview
SSLCommerz payment gateway has been integrated into the An-Nusrah Foundation portal for secure online donations and zakat payments.

## Credentials (Sandbox)
- **Store ID**: `emoni69f6727ef01bb`
- **Store Password**: `emoni69f6727ef01bb@ssl`
- **Environment**: Sandbox (Testing)
- **Merchant Panel**: https://sandbox.sslcommerz.com/manage/

## Installation Steps

### 1. Backend Setup

#### Install Dependencies
```bash
cd madrasa-backend
npm install sslcommerz-lts
```

#### Environment Variables
Already configured in `.env`:
```env
SSLCOMMERZ_STORE_ID=emoni69f6727ef01bb
SSLCOMMERZ_STORE_PASSWORD=emoni69f6727ef01bb@ssl
SSLCOMMERZ_IS_LIVE=false
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

#### Start Backend
```bash
npm run dev
```

### 2. Frontend Setup

#### Start Frontend
```bash
cd madrasa-portal
npm start
```

## How It Works

### Payment Flow

1. **User initiates payment** on any donation/zakat page
2. **Selects "Card" payment method**
3. **Frontend calls** `/api/payment/init` with payment details
4. **Backend creates** transaction record and initializes SSLCommerz session
5. **User redirects** to SSLCommerz payment gateway
6. **User completes** payment on SSLCommerz
7. **SSLCommerz redirects** back to success/fail/cancel page
8. **Frontend validates** payment with backend
9. **Backend verifies** with SSLCommerz and creates donation/zakat record
10. **User sees** confirmation page

### Integrated Pages

✅ **Donation Pages:**
- Masjid and Madrasha Complex (`/donate/mosque`)
- An Nusrah Skill Development (`/donate/madrasa`)
- Poor Student Support (`/donate/student-support`)
- Ifter Fund (`/donate/ifter-fund`)

✅ **Zakat Page:**
- Zakat Calculator (`/zakat`)

### Payment Methods

- **Card** → SSLCommerz gateway (online payment)
- **bKash, Nagad, Bank, Cash** → Direct recording (manual payment)

## API Endpoints

### POST `/api/payment/init`
Initialize payment session
```json
{
  "type": "donation",
  "amount": 500,
  "donorName": "John Doe",
  "donorEmail": "john@example.com",
  "donorPhone": "01700000000",
  "projectType": "Masjid and Madrasha Complex"
}
```

### POST `/api/payment/validate`
Validate payment after redirect
```json
{
  "tran_id": "TXN1234567890",
  "val_id": "2401011234567890"
}
```

### GET `/api/payment/transaction/:id`
Get transaction details
```
GET /api/payment/transaction/TXN1234567890
```

### POST `/api/payment/ipn`
SSLCommerz webhook (automatic)

## Testing

### Test Cards (Sandbox)
Use these test cards on SSLCommerz sandbox:

**Visa:**
- Card: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits

**MasterCard:**
- Card: `5555 5555 5555 4444`
- Expiry: Any future date
- CVV: Any 3 digits

### Test Flow
1. Go to any donation page
2. Enter amount and name
3. Select "Card" payment method
4. Click "Donate Now"
5. You'll be redirected to SSLCommerz sandbox
6. Use test card details
7. Complete payment
8. You'll be redirected back to success page

## Database Schema

### Transaction Model
```javascript
{
  transactionId: String (unique),
  type: 'donation' | 'zakat',
  amount: Number,
  status: 'Pending' | 'Success' | 'Failed' | 'Cancelled',
  donorName: String,
  projectType: String (for donations),
  allocationType: String (for zakat),
  donationId: ObjectId (ref to Donation),
  zakatId: ObjectId (ref to Zakat),
  // SSLCommerz fields
  sessionKey: String,
  gatewayPageURL: String,
  valId: String,
  cardType: String,
  bankTranId: String
}
```

## Production Deployment

### 1. Get Live Credentials
- Apply for live merchant account at https://sslcommerz.com
- Get live Store ID and Password

### 2. Update Environment Variables
```env
SSLCOMMERZ_STORE_ID=your_live_store_id
SSLCOMMERZ_STORE_PASSWORD=your_live_password
SSLCOMMERZ_IS_LIVE=true
FRONTEND_URL=https://madinatul-ulum-tahfijul-quran-madra.vercel.app
BACKEND_URL=https://your-backend-domain.com
```

### 3. Configure Webhook URL
In SSLCommerz merchant panel, set IPN URL to:
```
https://your-backend-domain.com/api/payment/ipn
```

### 4. SSL Certificate
Ensure your backend has valid SSL certificate (required by SSLCommerz)

## Troubleshooting

### Payment initialization fails
- Check Store ID and Password in `.env`
- Verify backend is running
- Check network connectivity

### Redirect not working
- Verify `FRONTEND_URL` in backend `.env`
- Check CORS settings in `server.js`

### Payment validation fails
- Check transaction ID in URL
- Verify SSLCommerz credentials
- Check backend logs for errors

### IPN not receiving
- Verify `BACKEND_URL` is publicly accessible
- Check IPN URL in SSLCommerz panel
- Ensure `/api/payment/ipn` endpoint is working

## Support

For SSLCommerz support:
- Email: integration@sslcommerz.com
- Phone: +880 1844-517474
- Documentation: https://developer.sslcommerz.com/

## Security Notes

⚠️ **Important:**
- Never expose Store Password in frontend code
- Always validate payments on backend
- Use HTTPS in production
- Implement rate limiting on payment endpoints
- Log all transactions for audit trail
- Keep SSLCommerz SDK updated

## Files Modified/Created

### Backend
- ✅ `src/models/Transaction.js` (new)
- ✅ `src/controllers/paymentController.js` (new)
- ✅ `src/routes/payment.js` (new)
- ✅ `server.js` (updated)
- ✅ `.env` (updated)

### Frontend
- ✅ `src/services/paymentService.js` (new)
- ✅ `src/services/index.js` (updated)
- ✅ `src/pages/PaymentSuccessPage.jsx` (new)
- ✅ `src/pages/PaymentFailPage.jsx` (new)
- ✅ `src/pages/PaymentCancelPage.jsx` (new)
- ✅ `src/pages/MosqueDonationPage.jsx` (updated)
- ✅ `src/pages/MadrasaDonationPage.jsx` (updated)
- ✅ `src/pages/StudentSupportDonationPage.jsx` (updated)
- ✅ `src/pages/IfterFundDonationPage.jsx` (updated)
- ✅ `src/pages/ZakatCalculatorPage.jsx` (updated)
- ✅ `src/routes/paths.js` (updated)
- ✅ `src/routes/lazyPages.js` (updated)
- ✅ `src/routes/publicRoutes.jsx` (updated)

## Next Steps

1. ✅ Install `sslcommerz-lts` package
2. ✅ Test payment flow in sandbox
3. ⏳ Apply for live merchant account
4. ⏳ Update to live credentials
5. ⏳ Deploy to production
6. ⏳ Configure production webhook URL
7. ⏳ Test live payments with small amounts
8. ⏳ Monitor transaction logs

---

**Integration completed successfully! 🎉**

All donation and zakat pages now support SSLCommerz card payments.
