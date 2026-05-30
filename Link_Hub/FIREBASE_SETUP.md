# Firebase Setup Instructions

## Quick Setup Guide

Follow these steps to set up Firebase for the Link Hub application.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"** or select an existing project
3. Enter project name and click **Create**
4. Wait for project to initialize (may take 1-2 minutes)

## Step 2: Register Web App

1. In Firebase Console, click **"<>"** icon to create a web app
2. Enter app nickname (e.g., "Link Hub Web")
3. Check "Also set up Firebase Hosting for this app" (optional)
4. Click **"Register app"**
5. Copy the Firebase configuration code

## Step 3: Get Firebase Credentials

From the config code or Project Settings:

1. Click the **gear icon** (⚙️) → **Project settings**
2. Scroll to **"Your apps"** section
3. Find your web app
4. Copy these values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
   - `measurementId` (optional)

## Step 4: Update Environment Variables

1. Open `.env.local` in your project root
2. Replace placeholder values with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. Save the file
4. Restart your development server

## Step 5: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **"Get started"**
3. Select **Email/Password** provider
4. Enable it
5. Click **Save**

## Step 6: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create database"**
3. Start in **Test mode** (for development)
4. Select a region (choose closest to you)
5. Click **Create**

### Important: Firestore Security Rules

For development with test mode, add these rules to allow authenticated users to read/write:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /links/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

Click **Publish** to save these rules.

## Step 7: (Optional) Enable Storage

1. In Firebase Console, go to **Storage**
2. Click **"Get started"**
3. Start in **Test mode**
4. Select a region
5. Click **Done**

## Step 8: Test the Connection

1. Save all changes
2. Restart development server: `npm run dev`
3. Open browser console (F12)
4. You should see: `✅ Firebase initialized successfully`
5. Try logging in with test credentials

## Creating Test Users

1. Go to Firebase Console → **Authentication**
2. Click **Users** tab
3. Click **"Add user"**
4. Enter test email and password
5. Click **Create**

**Example Test User:**
- Email: `test@example.com`
- Password: `Test@123456` (at least 6 characters)

## Troubleshooting

### Firebase not initializing?
- Check that all `.env.local` values are filled (not showing `YOUR_` placeholders)
- Verify credentials match your Firebase project
- Check browser console for error messages

### Can't login?
- Verify Email/Password authentication is enabled in Firebase
- Create test user in Firebase Console
- Check Firestore security rules allow authenticated users

### Can't save links?
- Go to Firestore → Rules tab
- Verify rules allow authenticated read/write
- Check that `links` collection exists (it will auto-create on first write)

### Permission denied errors?
- Check Firestore security rules
- Verify user is authenticated (check Auth Context)
- Ensure user ID is being sent with database operations

## Production Considerations

Before deploying to production:

1. **Update Firestore Security Rules** - Don't use test mode rules
2. **Enable HTTPS** - Firebase requires HTTPS
3. **Add authorized domains** - Add your domain to Firebase Console
4. **Review authentication methods** - Consider email verification, password reset, etc.
5. **Set up error monitoring** - Use Firebase Crashlytics
6. **Backup your data** - Enable automatic backups in Firestore

### Example Production Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write their links
    match /links/{linkId} {
      allow read, write: if request.auth != null && 
                           request.resource.data.userId == request.auth.uid;
    }
    
    // Users can only access their own profile
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

## Next Steps

1. ✅ Firebase project created
2. ✅ Web app registered
3. ✅ Credentials added to `.env.local`
4. ✅ Authentication enabled
5. ✅ Firestore database created
6. ✅ Security rules updated

Now you can:
- Test login/signup with test users
- Create, read, update, delete links
- Build additional features using the services

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com)
- [Community Support](https://stackoverflow.com/questions/tagged/firebase)
