// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// TODO: Replace these placeholder values with your actual Firebase project credentials
// You can find these values in your Firebase Console:
// 1. Go to https://console.firebase.google.com/
// 2. Select your project
// 3. Go to Project Settings > General
// 4. Scroll down to "Your apps" section
// 5. Click on the web app icon or create a new web app
// 6. Copy the configuration values

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;
