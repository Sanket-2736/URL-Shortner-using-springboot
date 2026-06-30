# Frontend Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```
The frontend will be available at **http://localhost:5173**

### Step 3: Ensure Backend is Running
Make sure your Spring Boot backend is running on **http://localhost:8080**

## 📦 Available Commands

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Check code quality with ESLint
```

## 🔐 Authentication

1. Go to **http://localhost:5173/register**
2. Create a new account with:
   - Username
   - Email
   - Password (min 6 characters)
3. Login with your credentials
4. Start creating shortened URLs!

## 📋 Features Tour

### Dashboard
- View all your shortened URLs
- See total clicks and statistics
- Filter by date range
- Copy short URLs to clipboard

### Create URL
- Paste any long URL
- One-click shortening
- Instantly get your short link

### Analytics
- View click history
- See hourly distribution
- Track device types
- Custom date ranges

## 🛠️ Configuration

### API Endpoint
Edit `src/services/api.js` if backend is on a different URL:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

### Tailwind Customization
Edit `tailwind.config.js` to customize colors, fonts, etc.

## 📱 Responsive Design

- ✅ Works on mobile (320px+)
- ✅ Tablet optimized (768px+)
- ✅ Desktop ready (1024px+)
- ✅ Responsive navigation menu

## 🎨 Styling

All styling is done with **Tailwind CSS**. Key custom classes:
- `.btn-primary` - Blue action button
- `.btn-secondary` - Gray action button
- `.input-field` - Styled input field
- `.card` - White content container

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"
**Fix**: Ensure Spring Boot is running on `http://localhost:8080`

### Issue: "Tailwind styles not applied"
**Fix**: Run `npm install` and restart dev server

### Issue: "Port 5173 already in use"
**Fix**: Run on different port:
```bash
npm run dev -- --port 5174
```

### Issue: "Login not working"
**Fix**: 
1. Check backend is accepting requests
2. Verify username/password are correct
3. Check browser console for errors

## 📊 Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **HTTP**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 🔗 Useful Links

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
- Tailwind CSS Docs: https://tailwindcss.com
- React Router Docs: https://reactrouter.com
- Recharts Docs: https://recharts.org

## 📝 Common Tasks

### Add a new page
1. Create file in `src/pages/`
2. Add route in `App.jsx`
3. Add navigation link in `Navbar.jsx`

### Add a new component
1. Create file in `src/components/`
2. Export the component
3. Import and use in pages

### Add an API call
1. Add function to `src/services/api.js`
2. Use in component with `await apiFunction()`
3. Handle errors with try/catch

### Modify styling
1. Update classes in JSX (Tailwind)
2. Add custom CSS to `src/index.css`
3. Or update `tailwind.config.js` for theme changes

## 🚨 Build for Production

```bash
npm run build
npm run preview  # Test the build locally
```

This creates a `dist/` folder ready for deployment.

## 📚 Project Structure

```
frontend/
├── src/
│   ├── pages/          # Page components
│   ├── components/     # Reusable components
│   ├── services/       # API calls
│   ├── App.jsx         # Main app + routing
│   ├── index.css       # Global styles
│   └── main.jsx        # Entry point
├── public/             # Static assets
├── package.json        # Dependencies
├── vite.config.js      # Vite config
├── tailwind.config.js  # Tailwind config
└── postcss.config.js   # PostCSS config
```

## ✨ Tips & Tricks

1. **Hot Reload**: Changes save instantly during dev
2. **Inspect Elements**: Use browser DevTools
3. **Network Tab**: Monitor API calls
4. **Console**: Check for errors and logs
5. **Lighthouse**: Test performance & accessibility

## 🎯 Next Steps

1. ✅ Get it running (`npm run dev`)
2. ✅ Create an account
3. ✅ Test URL shortening
4. ✅ Check analytics
5. ✅ Deploy to production

---

**Need Help?** Check FRONTEND_SETUP.md for detailed documentation.

**Happy Building!** 🎉
