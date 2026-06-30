# URL Shortener Frontend - Complete Setup Guide

## Overview
This is a fully functional React + Vite + Tailwind CSS frontend for the URL Shortener application. It provides a modern, responsive user interface for managing shortened URLs with analytics.

## Features

### 1. **Authentication**
- **Login Page** (`/login`)
  - Username and password login
  - JWT token-based authentication
  - Form validation with error handling
  - Redirect to signup for new users

- **Register Page** (`/register`)
  - User registration with username, email, and password
  - Email validation
  - Password confirmation matching
  - Automatic redirect to login after registration

### 2. **Dashboard** (`/dashboard`)
- Overview of all shortened URLs created by the user
- Statistics cards showing:
  - Total URLs created
  - Total clicks across all URLs
  - Average clicks per URL
- Date range filtering (7 days, 30 days, 90 days, All time)
- Interactive table with columns:
  - Short URL (code)
  - Original URL (truncated)
  - Click count
  - Creation date
  - Actions (Copy, Analytics, Delete)

### 3. **Create URL** (`/create`)
- Long URL input field with validation
- One-click URL shortening
- Display of shortened URL with:
  - Original URL
  - Short URL (copyable)
  - Click count
  - Creation date
- Copy to clipboard functionality
- Create another URL flow

### 4. **Analytics** (`/analytics/:shortUrl`)
- Comprehensive analytics dashboard for individual shortened URLs
- Date range picker for custom date ranges
- Statistics:
  - Total clicks
  - Unique days with clicks
  - Average clicks per day
  - Date range display
- Visualizations:
  - **Line Chart**: Clicks over time
  - **Bar Chart**: Clicks by hour of day
  - **Pie Chart**: Device type distribution

### 5. **Navigation**
- Sticky navbar with:
  - Logo and app name
  - Dashboard and Create URL links
  - User logout
  - Mobile-responsive hamburger menu

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration page
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── CreateUrl.jsx       # URL creation page
│   │   └── Analytics.jsx       # Analytics dashboard
│   ├── components/
│   │   └── Navbar.jsx          # Navigation bar component
│   ├── services/
│   │   ├── api.js              # API service with axios
│   │   └── auth.js             # Authentication helpers
│   ├── App.jsx                 # Main app with routing
│   ├── index.css               # Global styles and Tailwind
│   └── main.jsx                # Entry point
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── index.html                  # HTML template
```

## Technology Stack

- **React 19**: UI library
- **Vite 8**: Build tool and dev server
- **React Router 7**: Client-side routing
- **Tailwind CSS 4**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **Recharts**: React charting library
- **React Hot Toast**: Notification system
- **Lucide React**: Icon library
- **ESLint**: Code quality

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configuration**
   - Update API base URL in `src/services/api.js` if needed (default: `http://localhost:8080/api`)
   - Ensure backend is running on port 8080

4. **Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

5. **Build for Production**
   ```bash
   npm run build
   ```
   Output will be in the `dist/` directory

6. **Code Linting**
   ```bash
   npm run lint
   ```

## API Integration

The frontend communicates with the backend using the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/my-urls` - Get user's shortened URLs

### URL Management
- `POST /api/urls/shorten` - Create shortened URL
- `GET /api/urls/analytics/:shortUrl` - Get analytics for a URL
- `GET /api/urls/totalClicks` - Get total clicks by date

### Redirect
- `GET /:shortUrl` - Redirect to original URL

## Authentication Flow

1. User logs in/registers via authentication pages
2. JWT token received from backend
3. Token stored in localStorage
4. Token automatically included in all API requests via Axios interceptor
5. Logout clears token and redirects to login page

## Styling & Design

- **Tailwind CSS v4**: All styling done through Tailwind utility classes
- **Custom Components**: Reusable button, input, and card styles
- **Color Scheme**: Blue primary, green accents, gray backgrounds
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Icons**: Lucide React icons for consistent visual language

## Key Components

### Input Field
```jsx
<input className="input-field" placeholder="..." />
```

### Primary Button
```jsx
<button className="btn-primary">Click me</button>
```

### Card Container
```jsx
<div className="card">Content here</div>
```

## Error Handling

- All API errors are caught and displayed as toast notifications
- Form validation before submission
- URL validation using browser's native URL constructor
- User-friendly error messages

## Performance Optimizations

- Code-split pages with React Router
- Lazy loading of components
- Memoized callbacks for analytics calculations
- Efficient chart re-renders with Recharts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Tips

1. **Hot Module Replacement (HMR)**: Vite provides instant updates during development
2. **Redux DevTools**: Can be added for complex state management
3. **Testing**: Consider adding Jest + React Testing Library
4. **Accessibility**: Components follow WCAG guidelines with proper labels and ARIA attributes

## Troubleshooting

### Issue: API calls failing
- **Solution**: Ensure backend is running on `http://localhost:8080`
- Update API_BASE_URL in `src/services/api.js`

### Issue: Tailwind styles not working
- **Solution**: Ensure `@tailwindcss/postcss` is installed
- Clear cache: `rm -rf node_modules/.vite && npm run dev`

### Issue: Token not persisting
- **Solution**: Check localStorage is enabled in browser
- Verify token is being set in `setToken()` function

## Future Enhancements

- [ ] URL deletion endpoint in backend
- [ ] User profile page
- [ ] Advanced analytics (geolocation, referrer tracking)
- [ ] QR code generation for shortened URLs
- [ ] Export analytics as CSV
- [ ] Bulk URL operations
- [ ] Custom short URL slugs
- [ ] Expiring URLs
- [ ] Public/private URL sharing

## Support

For issues or questions, check the backend documentation or create an issue in the repository.
