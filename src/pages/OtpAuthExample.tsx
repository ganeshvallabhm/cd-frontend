import OtpAuth from '../components/OtpAuth';

/**
 * Example page demonstrating how to use the OtpAuth component
 * 
 * Usage:
 * 1. Import the OtpAuth component
 * 2. Render it in your page/component
 * 3. The component handles all authentication logic internally
 * 4. User will be authenticated via Firebase Phone Auth
 */
export default function OtpAuthExample() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Phone OTP Authentication
                    </h1>
                    <p className="text-gray-600">
                        Secure login using Firebase Phone Authentication
                    </p>
                </div>

                {/* OTP Auth Component */}
                <OtpAuth />

                {/* Instructions */}
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        How to Use:
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>Enter your phone number with country code (e.g., +919876543210)</li>
                        <li>Click "Send OTP" to receive a verification code via SMS</li>
                        <li>Enter the 6-digit OTP code you received</li>
                        <li>Click "Verify OTP" to complete authentication</li>
                    </ol>

                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> Make sure Firebase Phone Authentication is enabled in your Firebase Console.
                            For testing, you can add test phone numbers in Firebase Console → Authentication → Sign-in method → Phone.
                        </p>
                    </div>
                </div>

                {/* Technical Details */}
                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Technical Details:
                    </h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                        <li>✅ Firebase v9+ modular SDK</li>
                        <li>✅ Invisible reCAPTCHA verification</li>
                        <li>✅ Strict TypeScript typing (no <code className="bg-gray-100 px-1 rounded">any</code>)</li>
                        <li>✅ Comprehensive error handling</li>
                        <li>✅ Secure state management with React refs</li>
                        <li>✅ Production-ready code</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
