# Firebase Setup Guide

## The Issue
You're getting a 400 Bad Request error from Firebase because the Firebase configuration is missing. The app is trying to initialize Firebase with undefined environment variables.

## How to Fix This

### Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Follow the setup wizard

### Step 2: Get Your Firebase Configuration
1. In your Firebase project console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Register your app with a nickname (e.g., "News App")
6. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Step 3: Create Environment Variables
1. Create a file called `.env` in your project root (same level as `package.json`)
2. Add the following content, replacing the values with your actual Firebase configuration:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# EmailJS Configuration (optional for now)
REACT_APP_EMAILJS_SERVICE_ID=your_emailjs_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
REACT_APP_EMAILJS_WELCOME_TEMPLATE_ID=your_emailjs_welcome_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# News API Configuration
REACT_APP_NEWS_API_KEY=your_news_api_key_here
REACT_APP_NEWS_API_BASE_URL=https://newsapi.org/v2
```

### Step 4: Enable Authentication
1. In Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

### Step 5: Enable Firestore Database
1. In Firebase Console, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

### Step 6: Restart Your Development Server
```bash
npm start
```

### Step 7: Check the Console
Open your browser's developer console (F12) and look for:
- ✅ Firebase initialized successfully
- ✅ All environment variables are present

If you see any ❌ errors, double-check your environment variables.

## Troubleshooting

### If you still see 400 errors:
1. Make sure your `.env` file is in the correct location (project root)
2. Restart your development server after creating the `.env` file
3. Check that all Firebase environment variables are filled in
4. Verify your Firebase project ID matches exactly

### If authentication doesn't work:
1. Make sure Email/Password authentication is enabled in Firebase Console
2. Check that your Firebase project is on the correct plan (Spark plan is free)

### For Vercel Deployment:
1. Add all the environment variables to your Vercel project settings
2. Go to your Vercel dashboard → Project → Settings → Environment Variables
3. Add each variable from your `.env` file

## Example .env File
Here's what your `.env` file should look like (replace with your actual values):

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyC-example-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

After completing these steps, the 400 error should be resolved and Firebase should work properly! 