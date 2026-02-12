import { useState } from 'react';
import { auth } from '../firebase';
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult
} from 'firebase/auth';

export default function PhoneOtpLogin() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Initialize reCAPTCHA verifier
    const setupRecaptcha = () => {
        if (!(window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier = new RecaptchaVerifier(
                auth,
                'recaptcha-container',
                {
                    size: 'invisible',
                    callback: () => {
                        // reCAPTCHA solved
                    },
                    'expired-callback': () => {
                        setError('reCAPTCHA expired. Please try again.');
                    }
                }
            );
        }
    };

    // Send OTP to phone number
    const handleSendOtp = async () => {
        setError('');
        setLoading(true);

        // Validate phone number format
        if (!phoneNumber || phoneNumber.length < 10) {
            setError('Please enter a valid phone number with country code (e.g., +919876543210)');
            setLoading(false);
            return;
        }

        if (!phoneNumber.startsWith('+')) {
            setError('Phone number must include country code (e.g., +91 for India)');
            setLoading(false);
            return;
        }

        try {
            setupRecaptcha();
            const appVerifier = (window as any).recaptchaVerifier;

            const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setConfirmationResult(result);
            setIsOtpSent(true);
            setError('');
            console.log('OTP sent successfully');
        } catch (err: any) {
            console.error('Error sending OTP:', err);

            // Handle common Firebase errors
            if (err.code === 'auth/invalid-phone-number') {
                setError('Invalid phone number format. Use format: +919876543210');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many requests. Please try again later.');
            } else if (err.code === 'auth/quota-exceeded') {
                setError('SMS quota exceeded. Please try again later.');
            } else {
                setError(`Error: ${err.message}`);
            }

            // Reset reCAPTCHA on error
            if ((window as any).recaptchaVerifier) {
                (window as any).recaptchaVerifier.clear();
                (window as any).recaptchaVerifier = null;
            }
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP
    const handleVerifyOtp = async () => {
        setError('');
        setLoading(true);

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            setLoading(false);
            return;
        }

        if (!confirmationResult) {
            setError('Please request OTP first');
            setLoading(false);
            return;
        }

        try {
            const result = await confirmationResult.confirm(otp);
            console.log('User signed in successfully:', result.user);
            setIsLoggedIn(true);
            setError('');
        } catch (err: any) {
            console.error('Error verifying OTP:', err);

            // Handle common Firebase errors
            if (err.code === 'auth/invalid-verification-code') {
                setError('Invalid OTP. Please check and try again.');
            } else if (err.code === 'auth/code-expired') {
                setError('OTP expired. Please request a new one.');
            } else {
                setError(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // Reset to initial state
    const handleReset = () => {
        setPhoneNumber('');
        setOtp('');
        setConfirmationResult(null);
        setIsOtpSent(false);
        setIsLoggedIn(false);
        setError('');
        setLoading(false);

        // Clear reCAPTCHA
        if ((window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier.clear();
            (window as any).recaptchaVerifier = null;
        }
    };

    // If logged in, show success state
    if (isLoggedIn) {
        return (
            <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
                <h2>✅ Login Successful!</h2>
                <p>You have been authenticated with Firebase.</p>
                <p>User ID: {auth.currentUser?.uid}</p>
                <p>Phone: {auth.currentUser?.phoneNumber}</p>
                <button onClick={handleReset} style={{ marginTop: '20px', padding: '10px 20px' }}>
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Phone OTP Login</h2>

            {/* reCAPTCHA container (invisible) */}
            <div id="recaptcha-container"></div>

            {/* Error message */}
            {error && (
                <div style={{
                    color: 'red',
                    padding: '10px',
                    marginBottom: '10px',
                    border: '1px solid red',
                    borderRadius: '4px',
                    backgroundColor: '#fee'
                }}>
                    {error}
                </div>
            )}

            {/* Phone number input section */}
            {!isOtpSent && (
                <div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px' }}>
                            Phone Number (with country code)
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+919876543210"
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                            disabled={loading}
                        />
                        <small style={{ color: '#666', fontSize: '12px' }}>
                            Example: +91 for India, +1 for USA
                        </small>
                    </div>

                    <button
                        onClick={handleSendOtp}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '16px',
                            backgroundColor: loading ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </div>
            )}

            {/* OTP verification section */}
            {isOtpSent && !isLoggedIn && (
                <div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="otp" style={{ display: 'block', marginBottom: '5px' }}>
                            Enter OTP
                        </label>
                        <input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="123456"
                            maxLength={6}
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                letterSpacing: '4px',
                                textAlign: 'center'
                            }}
                            disabled={loading}
                        />
                        <small style={{ color: '#666', fontSize: '12px' }}>
                            Enter the 6-digit code sent to {phoneNumber}
                        </small>
                    </div>

                    <button
                        onClick={handleVerifyOtp}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '16px',
                            backgroundColor: loading ? '#ccc' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginBottom: '10px'
                        }}
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>

                    <button
                        onClick={handleReset}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '16px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Change Phone Number
                    </button>
                </div>
            )}
        </div>
    );
}
