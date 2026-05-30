# Link Hub - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and add your Firebase credentials
# Get credentials from: https://console.firebase.google.com
```

### 3. Start Development Server
```bash
npm run dev
```

Your app will open at `http://localhost:3000`

## 📝 Available Commands

```bash
# Development
npm run dev          # Start dev server with hot reload

# Build
npm run build        # Build for production (creates dist folder)

# Preview
npm run preview      # Preview production build locally

# Linting
npm run lint         # Run ESLint to check code quality
```

## 🔑 Firebase Setup Instructions

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Follow the setup wizard

### Step 2: Get Credentials
1. In Firebase Console, go to Project Settings
2. Scroll to "Firebase SDK snippet"
3. Select "Config" option
4. Copy the configuration object

### Step 3: Update Environment Variables
Edit `.env.local`:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

## 📂 Project Structure Quick Reference

```
Link_Hub/
├── src/
│   ├── components/      # Navbar, Footer, etc.
│   ├── pages/          # Home, AdminLogin, AdminDashboard
│   ├── services/       # Firebase & API services
│   ├── firebase/       # Firebase config & auth
│   ├── styles/         # Global CSS
│   ├── utils/          # Helpers & constants
│   ├── App.jsx         # Root component
│   └── main.jsx        # Entry point
├── public/             # Static files
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
└── .env.local          # Environment variables (create this)
```

## 🎯 Available Routes

- `/` - Home/Dashboard
- `/admin` - Admin Login
- `/admin/dashboard` - Admin Dashboard

## 🎨 Customization Quick Tips

### Change Colors
Edit `src/styles/global.css`:
```css
/* Change primary color from blue to other colors */
--primary: #64b5f6;    /* Blue */
--secondary: #7c4dff;  /* Purple */
```

### Change Font
Edit `src/styles/global.css`:
```css
font-family: 'Your Font Here', sans-serif;
```

### Add New Page
1. Create file in `src/pages/YourPage.jsx`
2. Create CSS file `src/pages/YourPage.css`
3. Add route in `App.jsx`:
```jsx
<Route path="/your-path" element={<YourPage />} />
```

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'react'"
**Solution**: Run `npm install`

### Issue: Firebase credentials not loading
**Solution**: 
1. Check `.env.local` file exists
2. Ensure environment variable names start with `VITE_`
3. Restart dev server after changing `.env.local`

### Issue: Port 3000 already in use
**Solution**: Edit `vite.config.js` and change the port:
```js
server: {
  port: 3001
}
```

### Issue: Styles not appearing
**Solution**: 
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart dev server (`npm run dev`)

## 📚 Next Steps

1. **Configure Firebase Authentication**
   - Enable auth providers in Firebase Console
   - Update `src/pages/AdminLogin.jsx` with real auth logic

2. **Set Up Firestore Database**
   - Create collections in Firebase
   - Update `src/services/firebaseService.js`

3. **Add More Pages & Features**
   - Create user dashboard
   - Implement link management
   - Add analytics

4. **Deploy Your App**
   - Build: `npm run build`
   - Deploy to Vercel, Netlify, or Firebase Hosting

## 🔗 Useful Links

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Firebase Docs](https://firebase.google.com/docs)
- [React Router Docs](https://reactrouter.com)
- [React Icons](https://react-icons.github.io/react-icons)

## 💡 Tips

- Use React DevTools Chrome extension for debugging
- Use Firebase Console to manage your data
- Check browser console (F12) for errors
- Enable dark mode in your browser to test the design better

## 🆘 Need Help?

1. Check the README.md for detailed documentation
2. Review browser console for error messages
3. Check Firebase Console for authentication/database issues
4. Review component files for code examples

---

**Happy Coding! 🎉**
