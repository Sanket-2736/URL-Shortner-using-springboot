# URL Shortener Frontend

A modern React + Vite + Tailwind CSS frontend for the URL Shortener application. This application allows users to create short URLs, track analytics, and manage their links with a beautiful, responsive interface.

## Features

- **User Authentication**: Login and registration with JWT-based authentication
- **Create Short URLs**: Convert long URLs into short, shareable links
- **Dashboard**: View all your shortened URLs with click statistics
- **Analytics**: Detailed click tracking with time-based analytics and visualizations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Charts and statistics that update based on date ranges
- **Copy to Clipboard**: Quick copy functionality for short URLs
- **User-friendly Interface**: Intuitive design with Lucide icons and Tailwind CSS styling

## Tech Stack

- **React 19**: UI framework
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client for API requests
- **React Hot Toast**: Toast notifications
- **Recharts**: Chart and graph visualizations
- **Lucide React**: Icon library

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── Navbar.jsx          # Navigation bar component
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration page
│   │   ├── Dashboard.jsx       # Main dashboard with URL list
│   │   ├── CreateUrl.jsx       # URL creation page
│   │   └── Analytics.jsx       # Detailed analytics page
│   ├── services/
│   │   ├── api.js              # Axios API client and endpoints
│   │   └── auth.js             # Authentication utilities
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles with Tailwind
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── package.json                # Dependencies and scripts
```

## Installation & Setup

### Prerequisites

- Node.js 16+ and npm
- Backend API running on `http://localhost:8080`

### Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## API Configuration

The frontend communicates with the backend API at `http://localhost:8080`. All API endpoints are configured in `src/services/api.js`:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/my-urls` - Get user's shortened URLs

### URL Management Endpoints
- `POST /api/urls/shorten` - Create a shortened URL
- `GET /api/urls/analytics/{shortUrl}` - Get click events for a URL
- `GET /api/urls/totalClicks` - Get total clicks by date range

### Redirect Endpoint
- `GET /api/redirect/{shortUrl}` - Redirect to original URL

## Key Components

### Pages

#### Login Page (`src/pages/Login.jsx`)
- Email and password authentication
- Link to registration page
- Secure password visibility toggle
- Error handling and toast notifications

#### Register Page (`src/pages/Register.jsx`)
- User registration with username, email, and password
- Password confirmation field
- Form validation
- Link to login page

#### Dashboard (`src/pages/Dashboard.jsx`)
- Overview stats: Total URLs, Total Clicks, Average Clicks
- Line chart showing clicks over a date range
- Table of all user's shortened URLs
- View analytics button for each URL
- Copy short URL to clipboard
- Open original URL in new tab

#### Create URL (`src/pages/CreateUrl.jsx`)
- Textarea input for long URLs
- URL validation
- Display shortened URL after creation
- Copy to clipboard functionality
- Information cards about the service

#### Analytics (`src/pages/Analytics.jsx`)
- Detailed view for a specific shortened URL
- Bar chart showing clicks over time
- Date range selector with datetime picker
- Table of all click events with timestamps
- IP addresses and user agent information
- Total and unique visitor statistics

### Services

#### API Service (`src/services/api.js`)
- Centralized Axios instance with base URL
- JWT token injection in request headers
- Organized API calls grouped by feature
- Error handling with interceptors

#### Auth Service (`src/services/auth.js`)
- Token management (get, set, remove)
- Authentication state checking

### Components

#### Navbar (`src/components/Navbar.jsx`)
- Navigation links to Dashboard and Create URL
- User logout button
- Responsive mobile menu
- Consistent branding

## Features in Detail

### Authentication Flow
1. User registers or logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token automatically added to all API requests
5. Protected routes redirect unauthenticated users to login

### URL Creation
1. User enters long URL
2. Frontend validates the URL format
3. Request sent to backend
4. Short URL returned and displayed
5. User can copy or view analytics immediately

### Analytics Tracking
1. Each click on a short URL is tracked by the backend
2. Analytics page shows temporal distribution of clicks
3. Date range selector filters data
4. Table displays detailed click information

### Dashboard Overview
1. Summary statistics at the top
2. Chart showing click trends over selected date range
3. Complete table of all URLs with quick access to analytics
4. Easy navigation to individual URL analytics

## Styling

The app uses Tailwind CSS for styling with custom component classes defined in `src/index.css`:
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.input-field` - Form input style
- `.card` - Card container style

All colors, spacing, and responsive breakpoints follow Tailwind conventions.

## Environment Variables

No environment variables are required for the frontend. The API base URL is hardcoded in `src/services/api.js` to `http://localhost:8080/api`.

To change this, edit the `API_BASE_URL` in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## Error Handling

- All API errors are caught and displayed as toast notifications
- Invalid URLs are prevented before submission
- Form validation ensures data integrity
- 404 errors for missing users are handled gracefully
- Network errors display user-friendly messages

## Performance Optimizations

- Lazy loading of pages via React Router
- Memoization of chart components via Recharts
- Efficient state management with React hooks
- CSS bundling and minification in production build

## Browser Support

- Modern browsers supporting ES6+
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- QR code generation for short URLs
- Advanced filtering and search in dashboard
- Export analytics as CSV/PDF
- URL expiration settings
- Custom short URL aliases
- Click event filtering by geography/device
- Dark mode toggle
- Multi-language support
- Rate limiting indicators
- Bulk URL shortening

## Troubleshooting

### Port Already in Use
```bash
# Use a different port
npm run dev -- --port 3000
```

### API Connection Issues
- Ensure backend is running on `http://localhost:8080`
- Check CORS configuration on backend
- Open browser DevTools to see network requests

### Token Expiration
- Clear localStorage and login again
- Token should be refreshed automatically if backend supports it

### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Contributing

When adding new features:
1. Create new page components in `src/pages/`
2. Add API calls to `src/services/api.js`
3. Use existing component patterns and styling
4. Keep responsive design in mind
5. Update this README with new features

## License

This project is part of the URL Shortener application.
