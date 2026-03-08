# Paystack Payment Integration Setup Guide

## Overview
FindAMech now includes Paystack payment integration allowing customers to pay for completed mechanic services.

## How It Works

### Customer Flow:
1. Customer books a mechanic service
2. Mechanic confirms/completes the booking
3. Customer sees "Complete & Pay" button on their bookings page
4. Clicking the button opens a Paystack payment modal
5. Customer enters payment details securely through Paystack
6. After successful payment, booking is marked as completed

### Mechanic Flow:
- Can view all bookings assigned to them
- Can accept/decline pending bookings
- Can see payment status of completed bookings

## Setup Instructions

### 1. Get Paystack Credentials
- Go to [Paystack Dashboard](https://dashboard.paystack.com/settings/developer)
- Copy your **Public Key** (for frontend)
- Copy your **Secret Key** (for backend verification - optional for now)

### 2. Configure Frontend Environment
Create a `.env` file in the `frontend` directory (or copy from `.env.example`):

```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
VITE_API_URL=http://localhost:5000
```

Replace `pk_test_your_public_key_here` with your actual Paystack public key.

### 3. Configure Backend Environment (Optional)
Create a `.env` file in the `backend` directory (or copy from `.env.example`):

```env
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
```

This is used for payment verification on the backend (can be implemented later).

### 4. Restart Your Application

**Frontend:**
```bash
cd frontend
npm run dev
```

**Backend:**
```bash
cd backend
node server.js
```

## Vercel Deployment

### Frontend (Vercel)
Set your project root to `frontend` and configure:

```env
VITE_PAYSTACK_PUBLIC_KEY=pk_live_or_test_key
VITE_API_URL=https://your-backend-domain.vercel.app
```

### Backend (Vercel)
Set your project root to `backend`.

This project already includes:
- `api/index.js` (Vercel function entry point)
- `vercel.json` (routes all requests to Express app)

Set backend environment variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PAYSTACK_SECRET_KEY=sk_live_or_test_key
NODE_ENV=production
```

After deployment, use your backend Vercel URL as `VITE_API_URL` in frontend.

## Testing

### With Paystack Test Keys:
You can use these test card details in the Paystack modal:

- **Card Number:** 4084 0343 0343 0343
- **Expiry:** 01/50
- **CVC:** 852
- **Amount:** Any amount (in Naira)

### Payment Flow:
1. Log in as a customer
2. Book a service with a mechanic
3. Wait for the mechanic to confirm the booking
4. Visit `/bookings` page
5. Click "Complete & Pay"
6. Fill in payment details with test card
7. Confirm payment

## Payment Information Storage

Payment details are stored in the Booking model:
- `paymentReference`: Unique reference from Paystack
- `paymentStatus`: `pending`, `completed`, or `failed`
- Booking `status`: Marked as `completed` after successful payment

## Features Included

✅ Secure Paystack payment modal
✅ Automatic booking status update on payment success
✅ Payment reference tracking
✅ Customer and mechanic role-based views
✅ Error handling and user feedback

## Future Enhancements

- Payment verification on backend using Paystack Secret Key
- Webhook handling for payment status updates
- Email notifications on payment completion
- Multiple payment methods
- Refund functionality
- Payment history and invoices

## Troubleshooting

**Issue: "Unable to initialize payment" error**
- Check that `VITE_PAYSTACK_PUBLIC_KEY` is correctly set in `.env`
- Ensure the key is a valid Paystack public key

**Issue: Payment modal doesn't appear**
- Check browser console for errors
- Verify that react-paystack is installed: `npm list react-paystack`
- Ensure your Paystack account is in the correct region

**Issue: Booking doesn't update after payment**
- Check that backend is running (`node server.js`)
- Verify token is valid
- Check browser developer tools Network tab for API errors

## Support
For Paystack support, visit: https://paystack.com/support
