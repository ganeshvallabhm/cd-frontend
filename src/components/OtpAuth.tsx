import { useState, useRef } from 'react';
import { ConfirmationResult, User } from 'firebase/auth';
import { sendOtp, verifyOtp, clearRecaptcha } from '../services/otpService';

/**
 * OtpAuth Component
 * 
 * Production-ready Phone OTP authentication component using Firebase.
 * Uses the otpService for clean separation of concerns.
 */

interface OtpAuthState {
    phoneNumber: string;
    otp: string;
    isOtpSent: boolean;
    loading: boolean;
    error: string;
    user: User | null;
}

export default function OtpAuth() {
    // State management
    const [state, setState] = useState<OtpAuthState>({
        phoneNumber: '',
        otp: '',
        isOtpSent: false,
        loading: false,
        error: '',
        user: null
    });

    // Store confirmation result securely using ref
    const confirmationResultRef = useRef<ConfirmationResult | null>(null);

    /**
     * Handle sending OTP
     */
    const handleSendOtp = async (): Promise<void> => {
        setState(prev => ({ ...prev, error: '', loading: true }));

        try {
            // Call otpService to send OTP
            const confirmationResult = await sendOtp(state.phoneNumber);

            // Store confirmation result
            confirmationResultRef.current = confirmationResult;

            // Update state
            setState(prev => ({
                ...prev,
                isOtpSent: true,
                loading: false,
                error: ''
            }));
        } catch (err) {
            const error = err as Error;
            setState(prev => ({
                ...prev,
                error: error.message,
                loading: false
            }));
        }
    };

    /**
     * Handle verifying OTP
     */
    const handleVerifyOtp = async (): Promise<void> => {
        setState(prev => ({ ...prev, error: '', loading: true }));

        if (!confirmationResultRef.current) {
            setState(prev => ({
                ...prev,
                error: 'Please request OTP first',
                loading: false
            }));
            return;
        }

        try {
            // Call otpService to verify OTP
            const user = await verifyOtp(confirmationResultRef.current, state.otp);

            // Update state with authenticated user
            setState(prev => ({
                ...prev,
                user,
                loading: false,
                error: ''
            }));
        } catch (err) {
            const error = err as Error;
            setState(prev => ({
                ...prev,
                error: error.message,
                loading: false
            }));
        }
    };

    /**
     * Handle phone number input change
     */
    const handlePhoneChange = (value: string): void => {
        setState(prev => ({ ...prev, phoneNumber: value }));
    };

    /**
     * Handle OTP input change (only digits, max 6)
     */
    const handleOtpChange = (value: string): void => {
        const digitsOnly = value.replace(/\D/g, '').slice(0, 6);
        setState(prev => ({ ...prev, otp: digitsOnly }));
    };

    /**
     * Reset to initial state
     */
    const handleReset = (): void => {
        setState({
            phoneNumber: '',
            otp: '',
            isOtpSent: false,
            loading: false,
            error: '',
            user: null
        });

        confirmationResultRef.current = null;
        clearRecaptcha();
    };

    // If user is authenticated, show success state
    if (state.user) {
        return (
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-green-600 mb-4">
                        Authentication Successful!
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-md mb-4 text-left">
                        <p className="text-sm text-gray-600 mb-2">
                            <strong>User ID:</strong> {state.user.uid}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Phone:</strong> {state.user.phoneNumber}
                        </p>
                    </div>
                    <button
                        onClick={handleReset}
                        className="w-full bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors font-medium"
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Phone OTP Authentication
            </h2>

            {/* reCAPTCHA container (invisible) */}
            <div id="recaptcha-container"></div>

            {/* Error message */}
            {state.error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700 text-sm">{state.error}</p>
                </div>
            )}

            {/* Phone number input section */}
            {!state.isOtpSent && (
                <div>
                    <div className="mb-4">
                        <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Phone Number
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            value={state.phoneNumber}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            placeholder="+919876543210"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            disabled={state.loading}
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            Include country code (e.g., +91 for India, +1 for USA)
                        </p>
                    </div>

                    <button
                        onClick={handleSendOtp}
                        disabled={state.loading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {state.loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </div>
            )}

            {/* OTP verification section */}
            {state.isOtpSent && !state.user && (
                <div>
                    <div className="mb-4">
                        <label
                            htmlFor="otp"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Enter OTP
                        </label>
                        <input
                            id="otp"
                            type="text"
                            value={state.otp}
                            onChange={(e) => handleOtpChange(e.target.value)}
                            placeholder="123456"
                            maxLength={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-center text-2xl tracking-widest"
                            disabled={state.loading}
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            Enter the 6-digit code sent to {state.phoneNumber}
                        </p>
                    </div>

                    <button
                        onClick={handleVerifyOtp}
                        disabled={state.loading}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium mb-3"
                    >
                        {state.loading ? 'Verifying...' : 'Verify OTP'}
                    </button>

                    <button
                        onClick={handleReset}
                        disabled={state.loading}
                        className="w-full bg-gray-500 text-white py-3 px-4 rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        Change Phone Number
                    </button>
                </div>
            )}
        </div>
    );
}
