# Phone OTP Authentication - Implementation Guide

## 📋 Overview

This implementation provides a **production-ready Phone Number OTP Authentication** flow using Firebase v9+ modular SDK with React + TypeScript.

## 🎯 Features

✅ **Clean Architecture**
- Separated `sendOtp()` and `verifyOtp()` functions
- Reusable component design
- Secure state management with React refs

✅ **Security**
- Invisible reCAPTCHA verification
- Secure confirmation result storage
- No sensitive data in component state

✅ **TypeScript**
- Strict typing (no `any` types)
- Proper interfaces for all state and props
- Full type safety with Firebase Auth types

✅ **Error Handling**
- Invalid phone number format
- Wrong OTP code
- Expired OTP
- reCAPTCHA failure
- Rate limiting (too many requests)
- Network errors

✅ **User Experience**
- Loading states
- Clear error messages
- Phone number validation
- OTP input formatting (digits only, max 6)

## 📁 Files Created

### 1. `src/components/OtpAuth.tsx`
The main authentication component with all logic.

### 2. `src/pages/OtpAuthExample.tsx`
Example page demonstrating usage.

## 🚀 Usage

### Basic Usage

```tsx
import OtpAuth from './components/OtpAuth';

function MyPage() {
  return <OtpAuth />;
}
```

### Access the Example Page

Navigate to: **http://localhost:5173/otp-auth**

## 🔧 How It Works

### 1. Send OTP Flow

```typescript
// User enters phone number with country code (e.g., +919876543210)
// Component validates format
// Initializes invisible reCAPTCHA
// Calls Firebase signInWithPhoneNumber()
// Stores ConfirmationResult in ref
// User receives SMS with 6-digit code
```

### 2. Verify OTP Flow

```typescript
// User enters 6-digit OTP
// Component validates OTP format
// Calls confirmationResult.confirm(otp)
// Returns authenticated User object
// User is logged in
```

## 📝 API Reference

### Component State

```typescript
interface OtpAuthState {
  phoneNumber: string;      // Phone number with country code
  otp: string;              // 6-digit OTP code
  isOtpSent: boolean;       // Whether OTP has been sent
  loading: boolean;         // Loading state
  error: string;            // Error message
  user: User | null;        // Authenticated user
}
```

### Key Functions

#### `sendOtp(phoneNumber: string): Promise<void>`
Sends OTP to the provided phone number.

**Parameters:**
- `phoneNumber`: Phone number with country code (e.g., "+919876543210")

**Throws:**
- Invalid phone number format
- reCAPTCHA failure
- Rate limiting errors
- Network errors

#### `verifyOtp(otp: string): Promise<User | null>`
Verifies the OTP code and authenticates the user.

**Parameters:**
- `otp`: 6-digit OTP code

**Returns:**
- `User` object on success
- `null` on failure

**Throws:**
- Invalid OTP code
- Expired OTP
- Session expired

## ⚙️ Firebase Configuration

### Prerequisites

1. **Enable Phone Authentication** in Firebase Console:
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable "Phone" provider

2. **Add Test Phone Numbers** (for development):
   - Firebase Console → Authentication → Sign-in method → Phone
   - Scroll to "Phone numbers for testing"
   - Add test numbers with verification codes

3. **Configure reCAPTCHA** (production):
   - Add your domain to authorized domains
   - Configure reCAPTCHA v2 in Firebase Console

### Environment Variables

The component uses the existing Firebase configuration from `src/firebase.ts`:

```typescript
import { auth } from '../firebase';
```

Make sure your `.env` file has:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 🧪 Testing

### Test Phone Numbers (Development)

Add test phone numbers in Firebase Console for development:

| Phone Number | Verification Code |
|--------------|-------------------|
| +1234567890  | 123456           |
| +9876543210  | 654321           |

### Manual Testing Steps

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to:** http://localhost:5173/otp-auth

3. **Test OTP Send:**
   - Enter: `+1234567890` (test number)
   - Click "Send OTP"
   - Verify reCAPTCHA works
   - Check for success state

4. **Test OTP Verify:**
   - Enter: `123456` (test code)
   - Click "Verify OTP"
   - Verify authentication success
   - Check user data displayed

5. **Test Error Cases:**
   - Invalid phone: `1234567890` (no country code)
   - Wrong OTP: `000000`
   - Empty fields

## 🎨 Styling

The component uses **Tailwind CSS** classes. You can customize:

- Colors: `bg-blue-600`, `text-green-600`, etc.
- Spacing: `p-6`, `mb-4`, etc.
- Borders: `rounded-md`, `border`, etc.

## 🔒 Security Best Practices

✅ **Implemented:**
- Invisible reCAPTCHA to prevent bots
- Secure confirmation result storage (refs, not state)
- Input validation and sanitization
- Error message sanitization
- No sensitive data in console (production)

⚠️ **Additional Recommendations:**
- Implement rate limiting on backend
- Monitor for abuse patterns
- Use Firebase App Check for additional security
- Implement session timeout
- Add multi-factor authentication for sensitive operations

## 🐛 Common Issues

### Issue: "auth/api-key-not-valid"
**Solution:** Check your Firebase API key in `.env` file

### Issue: "reCAPTCHA expired"
**Solution:** Refresh the page and try again

### Issue: "Too many requests"
**Solution:** Wait a few minutes before trying again

### Issue: OTP not received
**Solution:** 
- Check phone number format (must include country code)
- Verify Firebase Phone Auth is enabled
- Check Firebase quota limits
- Use test phone numbers for development

## 📚 Additional Resources

- [Firebase Phone Auth Documentation](https://firebase.google.com/docs/auth/web/phone-auth)
- [reCAPTCHA Documentation](https://developers.google.com/recaptcha)
- [Firebase v9 Migration Guide](https://firebase.google.com/docs/web/modular-upgrade)

## 🤝 Support

For issues or questions:
1. Check Firebase Console for errors
2. Review browser console for detailed error messages
3. Verify Firebase configuration
4. Check network tab for API calls

---

**Created:** February 2, 2026  
**Firebase SDK:** v9+ (modular)  
**Framework:** React 18 + TypeScript + Vite
