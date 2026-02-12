import { auth } from '../firebase';
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult,
    User,
    AuthError
} from 'firebase/auth';

/**
 * OTP Service
 * 
 * Provides clean, reusable functions for Phone OTP authentication.
 * Uses Firebase Phone Authentication with invisible reCAPTCHA.
 */

// Store reCAPTCHA verifier globally to reuse
let recaptchaVerifier: RecaptchaVerifier | null = null;

/**
 * Initialize invisible reCAPTCHA verifier
 * 
 * @param containerId - ID of the HTML element to attach reCAPTCHA to
 * @returns RecaptchaVerifier instance
 */
export const initializeRecaptcha = (containerId: string = 'recaptcha-container'): RecaptchaVerifier => {
    // Clear existing verifier if any
    if (recaptchaVerifier) {
        recaptchaVerifier.clear();
    }

    // Create new invisible reCAPTCHA verifier
    recaptchaVerifier = new RecaptchaVerifier(
        auth,
        containerId,
        {
            size: 'invisible',
            callback: () => {
                console.log('reCAPTCHA verified successfully');
            },
            'expired-callback': () => {
                throw new Error('reCAPTCHA expired. Please refresh and try again.');
            }
        }
    );

    return recaptchaVerifier;
};

/**
 * Validate phone number format
 * 
 * @param phoneNumber - Phone number to validate
 * @returns Validation result with error message if invalid
 */
export const validatePhoneNumber = (phoneNumber: string): { valid: boolean; error?: string } => {
    if (!phoneNumber || phoneNumber.trim().length === 0) {
        return { valid: false, error: 'Phone number is required' };
    }

    if (!phoneNumber.startsWith('+')) {
        return { valid: false, error: 'Phone number must include country code (e.g., +91 for India)' };
    }

    // Basic validation: country code + at least 10 digits
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
        return { valid: false, error: 'Phone number must be at least 10 digits' };
    }

    return { valid: true };
};

/**
 * Send OTP to phone number
 * 
 * @param phoneNumber - Phone number with country code (e.g., +919876543210)
 * @returns ConfirmationResult to use for OTP verification
 * @throws Error with user-friendly message
 */
export const sendOtp = async (phoneNumber: string): Promise<ConfirmationResult> => {
    // Validate phone number
    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.valid) {
        throw new Error(validation.error);
    }

    try {
        // Initialize reCAPTCHA
        const appVerifier = initializeRecaptcha();

        // Send OTP via Firebase
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);

        console.log('OTP sent successfully to:', phoneNumber);
        return confirmationResult;
    } catch (err) {
        const error = err as AuthError;
        console.error('Error sending OTP:', error);

        // Clear reCAPTCHA on error
        if (recaptchaVerifier) {
            recaptchaVerifier.clear();
            recaptchaVerifier = null;
        }

        // Handle specific Firebase errors with user-friendly messages
        switch (error.code) {
            case 'auth/invalid-phone-number':
                throw new Error('Invalid phone number format. Please use international format (e.g., +919876543210)');
            case 'auth/too-many-requests':
                throw new Error('Too many requests. Please try again later.');
            case 'auth/quota-exceeded':
                throw new Error('SMS quota exceeded. Please contact support.');
            case 'auth/captcha-check-failed':
                throw new Error('reCAPTCHA verification failed. Please refresh and try again.');
            case 'auth/missing-phone-number':
                throw new Error('Phone number is required.');
            case 'auth/api-key-not-valid':
                throw new Error('Firebase API key is invalid. Please check your Firebase configuration.');
            default:
                throw new Error(error.message || 'Failed to send OTP. Please try again.');
        }
    }
};

/**
 * Verify OTP code
 * 
 * @param confirmationResult - Result from sendOtp()
 * @param otp - 6-digit OTP code
 * @returns Authenticated User object
 * @throws Error with user-friendly message
 */
export const verifyOtp = async (
    confirmationResult: ConfirmationResult,
    otp: string
): Promise<User> => {
    // Validate OTP
    if (!otp || otp.length !== 6) {
        throw new Error('Please enter a valid 6-digit OTP');
    }

    if (!confirmationResult) {
        throw new Error('Please request OTP first');
    }

    try {
        // Verify OTP with Firebase
        const result = await confirmationResult.confirm(otp);
        const user = result.user;

        console.log('User authenticated successfully:', user.uid);
        return user;
    } catch (err) {
        const error = err as AuthError;
        console.error('Error verifying OTP:', error);

        // Handle specific Firebase errors with user-friendly messages
        switch (error.code) {
            case 'auth/invalid-verification-code':
                throw new Error('Invalid OTP code. Please check and try again.');
            case 'auth/code-expired':
                throw new Error('OTP has expired. Please request a new one.');
            case 'auth/session-expired':
                throw new Error('Session expired. Please start over.');
            default:
                throw new Error(error.message || 'Failed to verify OTP. Please try again.');
        }
    }
};

/**
 * Clear reCAPTCHA verifier
 * Call this when resetting the authentication flow
 */
export const clearRecaptcha = (): void => {
    if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        recaptchaVerifier = null;
    }
};
