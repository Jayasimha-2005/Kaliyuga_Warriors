# Setup Instructions

## Initial Setup for Link Hub

### Prerequisites
- Node.js v16+ installed
- npm or yarn package manager
- A Firebase account
- Git (optional)

---

## Step-by-Step Installation

### 1. Navigate to Project Directory
```bash
cd Link_Hub
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages:
- React & React DOM
- Vite
- React Router DOM
- Firebase SDK
- React Icons
- ESLint and other dev tools

### 3. Create Environment Configuration

#### Option A: Manual Setup
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Firebase credentials

#### Option B: Using Firebase CLI
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase:
   ```bash
   firebase init
   ```

### 4. Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing
3. Go to Project Settings (gear icon)
4. Under "Your apps", select or create a web app
5. Copy the configuration

### 5. Update .env.local

Edit the `.env.local` file with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdefg123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

⚠️ **Never commit `.env.local` to Git** - it's already in `.gitignore`

### 6. Start Development Server

```bash
npm run dev
```

The application will automatically open at `http://localhost:3000`

---

## Firebase Configuration (Optional)

### Enable Authentication
1. In Firebase Console, go to Authentication
2. Click "Get started"
3. Enable "Email/Password" and other providers as needed

### Enable Firestore
1. In Firebase Console, go to Firestore Database
2. Click "Create database"
3. Start in test mode (for development)

### Enable Storage
1. In Firebase Console, go to Storage
2. Click "Get started"
3. Review rules and proceed

---

## Project Commands

### Development
```bash
npm run dev      # Start dev server (hot reload enabled)
```

### Production Build
```bash
npm run build    # Create optimized build
npm run preview  # Preview the production build locally
```

### Code Quality
```bash
npm run lint     # Check code with ESLint
```

---

## Folder Structure Overview

```
Link_Hub/
├── src/
│   ├── components/      # React components (Navbar, Footer)
│   ├── pages/          # Page components (Home, Login, Dashboard)
│   ├── services/       # Business logic (API, Firebase services)
│   ├── firebase/       # Firebase config and auth functions
│   ├── context/        # React Context for global state
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions and constants
│   ├── styles/         # Global CSS
│   ├── App.jsx         # Root component
│   └── main.jsx        # Application entry point
├── public/             # Static assets
├── index.html          # HTML template
├── package.json        # Project dependencies
├── vite.config.js      # Vite build configuration
├── .eslintrc.json      # ESLint configuration
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
├── README.md           # Main documentation
├── QUICKSTART.md       # Quick start guide
└── SETUP.md           # This file
```

---

## First Time Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` file created with Firebase credentials
- [ ] Development server running (`npm run dev`)
- [ ] Application opens at http://localhost:3000
- [ ] Firebase console credentials verified
- [ ] All routes accessible:
  - [ ] http://localhost:3000/ (Home)
  - [ ] http://localhost:3000/admin (Admin Login)
  - [ ] http://localhost:3000/admin/dashboard (Admin Dashboard)

---

## Customization Guide

### Change Port
Edit `vite.config.js`:
```js
server: {
  port: 3001  // Change 3000 to your desired port
}
```

### Change Application Title
Edit `index.html`:
```html
<title>Your App Title</title>
```

### Change Colors
Edit `src/styles/global.css`:
```css
/* Change these CSS variables */
--primary-color: #64b5f6;
--secondary-color: #7c4dff;
```

### Add New Pages
1. Create file in `src/pages/YourPage.jsx`
2. Create corresponding CSS file
3. Add route in `src/App.jsx`
4. Export from `src/pages/index.js`

---

## Troubleshooting

### Problem: "npm: command not found"
**Solution**: Install Node.js from [nodejs.org](https://nodejs.org)

### Problem: "Cannot find module 'react'"
**Solution**: Run `npm install` in the project directory

### Problem: Firebase credentials not working
**Solution**:
1. Check `.env.local` exists
2. Verify all credentials are correct
3. Ensure values start with `VITE_`
4. Restart dev server

### Problem: "EADDRINUSE: address already in use"
**Solution**: 
- Change port in `vite.config.js`, or
- Kill process using port 3000

### Problem: Styles not appearing
**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart dev server
3. Check CSS file imports

### Problem: Hot reload not working
**Solution**:
1. Restart dev server
2. Check file changes are saved
3. Check for syntax errors

---

## Performance Tips

1. **Clear node_modules and reinstall**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Use React DevTools** - Install Chrome extension for debugging

3. **Monitor build size**
   ```bash
   npm run build
   # Check dist folder size
   ```

---

## Git Setup (Optional)

```bash
git init
git add .
git commit -m "Initial commit: Link Hub project setup"
git branch -M main
git remote add origin https://github.com/yourusername/link-hub.git
git push -u origin main
```

---

## Next Steps

1. ✅ Complete initial setup (this document)
2. Read [QUICKSTART.md](./QUICKSTART.md) for quick reference
3. Check [README.md](./README.md) for comprehensive documentation
4. Review [DOCUMENTATION.md](./DOCUMENTATION.md) for architecture details
5. Implement Firebase authentication
6. Set up Firestore database
7. Add features and custom components
8. Deploy to production

---

## Useful Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Firebase Setup](https://firebase.google.com/docs/web/setup)
- [React Router](https://reactrouter.com)
- [React Icons](https://react-icons.github.io/react-icons)
- [MDN Web Docs](https://developer.mozilla.org)

---

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review browser console for errors (F12)
3. Check Firebase Console for service status
4. Review the documentation files
5. Check Node.js and npm versions:
   ```bash
   node --version
   npm --version
   ```

---

**Setup Complete! Ready to build amazing things with Link Hub! 🚀**
