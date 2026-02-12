import React, { useState } from 'react';
import { auth } from './firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const LoginWithOtp = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: phone input, 2: otp input
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Initialize reCAPTCHA verifier
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
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

    // Validate phone number (10 digits for India)
    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };

    // Send OTP to phone number
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate phone number
        if (!validatePhoneNumber(phoneNumber)) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);

        try {
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;
            const formattedPhoneNumber = `+91${phoneNumber}`; // India country code

            const confirmation = await signInWithPhoneNumber(
                auth,
                formattedPhoneNumber,
                appVerifier
            );

            setConfirmationResult(confirmation);
            setStep(2);
            setSuccess('OTP sent successfully!');
        } catch (err) {
            console.error('Error sending OTP:', err);
            setError(err.message || 'Failed to send OTP. Please try again.');

            // Reset reCAPTCHA on error
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate OTP input
        if (!otp || otp.trim() === '') {
            setError('Please enter the OTP');
            return;
        }

        if (otp.length !== 6) {
            setError('OTP must be 6 digits');
            return;
        }

        setLoading(true);

        try {
            const result = await confirmationResult.confirm(otp);
            const user = result.user;

            setSuccess('Phone number verified successfully! Welcome!');
            setError('');

            // Clear form after successful verification
            setTimeout(() => {
                setPhoneNumber('');
                setOtp('');
                setStep(1);
                setConfirmationResult(null);
            }, 2000);

            console.log('User signed in:', user.uid);
        } catch (err) {
            console.error('Error verifying OTP:', err);
            setError('Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Reset to phone number step
    const handleBackToPhone = () => {
        setStep(1);
        setOtp('');
        setError('');
        setSuccess('');
        setConfirmationResult(null);

        // Clear reCAPTCHA
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Login with Phone</h2>

                {/* Error Message */}
                {error && (
                    <div className="message error-message">
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="message success-message">
                        {success}
                    </div>
                )}

                {/* Step 1: Phone Number Input */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="login-form">
                        <div className="form-group">
                            <label htmlFor="phoneNumber" className="form-label">
                                Phone Number
                            </label>
                            <div className="phone-input-wrapper">
                                <span className="country-code">+91</span>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    className="form-input"
                                    placeholder="Enter 10-digit phone number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    maxLength="10"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP Input */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="login-form">
                        <div className="form-group">
                            <label htmlFor="otp" className="form-label">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                id="otp"
                                className="form-input"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength="6"
                                disabled={loading}
                                required
                            />
                            <p className="helper-text">
                                OTP sent to +91{phoneNumber}
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>

                        <button
                            type="button"
                            className="back-button"
                            onClick={handleBackToPhone}
                            disabled={loading}
                        >
                            Change Phone Number
                        </button>
                    </form>
                )}

                {/* reCAPTCHA container (invisible) */}
                <div id="recaptcha-container"></div>
            </div>

            <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .login-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 40px;
          width: 100%;
          max-width: 420px;
        }

        .login-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 24px 0;
          text-align: center;
        }

        .message {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .error-message {
          background-color: #fee;
          color: #c33;
          border: 1px solid #fcc;
        }

        .success-message {
          background-color: #efe;
          color: #3c3;
          border: 1px solid #cfc;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #4a5568;
        }

        .phone-input-wrapper {
          display: flex;
          align-items: center;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .phone-input-wrapper:focus-within {
          border-color: #667eea;
        }

        .country-code {
          padding: 12px 12px 12px 16px;
          background-color: #f7fafc;
          color: #4a5568;
          font-weight: 600;
          border-right: 2px solid #e2e8f0;
        }

        .form-input {
          flex: 1;
          padding: 12px 16px;
          font-size: 16px;
          border: none;
          outline: none;
          color: #2d3748;
        }

        .form-group > .form-input {
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          transition: border-color 0.2s;
        }

        .form-group > .form-input:focus {
          border-color: #667eea;
        }

        .form-input:disabled {
          background-color: #f7fafc;
          cursor: not-allowed;
        }

        .helper-text {
          font-size: 13px;
          color: #718096;
          margin: 0;
        }

        .submit-button {
          padding: 14px 24px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          margin-top: 8px;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .back-button {
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          color: #667eea;
          background: transparent;
          border: 2px solid #667eea;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-button:hover:not(:disabled) {
          background-color: #f7fafc;
        }

        .back-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 30px 24px;
          }

          .login-title {
            font-size: 24px;
          }
        }
      `}</style>
        </div>
    );
};

export default LoginWithOtp;
