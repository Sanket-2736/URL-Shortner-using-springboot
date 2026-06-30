# Frontend Pages Breakdown

## 🔐 Login Page (`/login`)

### Purpose
Authenticates existing users to access their dashboard and URL management features.

### Components
- Username input field
- Password input field
- Login button
- Link to registration page
- Error toast notifications

### User Flow
1. User enters username and password
2. Clicks "Sign In" button
3. Credentials sent to `/api/auth/login`
4. JWT token received and stored
5. Redirected to `/dashboard`

### Features
- Form validation (non-empty fields)
- Loading state during submission
- Error messages from backend
- Icon-enhanced inputs with Lucide icons
- Gradient background design

### Styling
- Centered card layout
- Blue color scheme
- Professional gradient background
- Responsive on all screen sizes

---

## 📝 Register Page (`/register`)

### Purpose
Allows new users to create an account and join the platform.

### Components
- Username input field
- Email input field
- Password input field
- Confirm password input field
- Register button
- Link to login page

### User Flow
1. User enters username, email, password
2. Confirms password matches
3. Clicks "Create Account" button
4. Credentials sent to `/api/auth/register`
5. Success message shown
6. Redirected to login page (1.5s delay)

### Validation
- ✅ All fields required
- ✅ Valid email format (regex check)
- ✅ Password minimum 6 characters
- ✅ Passwords must match
- ✅ Username availability (backend validates)

### Features
- Client-side form validation
- Clear error messages
- Loading state during submission
- Success feedback before redirect
- Green accent color for new accounts

---

## 📊 Dashboard Page (`/dashboard`)

### Purpose
Central hub showing all user's shortened URLs and overall statistics.

### Header Section
- Page title and description
- "Create New" button (prominent CTA)

### Statistics Cards (3 cards)
1. **Total URLs**
   - Shows count of all shortened URLs
   - Blue gradient card
   - Link icon

2. **Total Clicks**
   - Shows cumulative clicks across all URLs
   - Green gradient card
   - Eye icon
   - Filtered by selected date range

3. **Average Clicks**
   - Calculated as total clicks / total URLs
   - Purple gradient card
   - Bar chart icon

### Date Range Filter
- 4 buttons: Last 7 Days, Last 30 Days, Last 90 Days, All Time
- Active button highlighted in blue
- Updates statistics when changed

### URLs Table
**Columns:**
1. **Short URL** - Code in blue highlighted box
2. **Original URL** - Truncated with ellipsis on hover
3. **Clicks** - Green badge showing count
4. **Created** - Formatted date
5. **Actions** - Three icon buttons

**Action Buttons:**
- 🔗 Copy - Copy short URL to clipboard
- 📊 Analytics - Navigate to analytics page
- 🗑️ Delete - Remove URL (confirmation dialog)

### Empty State
- Message: "No URLs created yet"
- CTA button to create first URL

### Features
- Auto-refreshes data on load
- Date range filtering with API sync
- Copy to clipboard with success toast
- Loading skeleton state
- Responsive table design
- Mobile-friendly table scrolling

---

## ➕ Create URL Page (`/create`)

### Purpose
Dedicated page for creating new shortened URLs with immediate feedback.

### Main Form
**Input:**
- Long URL text field
- Placeholder: "https://example.com/very/long/url/path"
- Helper text: "Paste any long URL and we'll create a short link for you"
- Validation: Must be valid URL format

**Submit Button:**
- "Shorten URL" text
- Loading state: "Shortening..."
- Disabled until valid URL entered

### Success State
After URL is shortened, displays:

**Green Success Box** containing:
1. **Original URL**
   - Full URL in copyable text box
   - White background

2. **Short URL**
   - Formatted as: `http://localhost:5173/{shortUrl}`
   - Blue text with monospace font
   - Copy button next to it (Changes to "Copied!" on click)

3. **Metadata Cards** (2 column grid):
   - Click Count: Shows "0" for new URLs
   - Created Date: Formatted date

**Reset Button:**
- "Shorten Another URL" button
- Clears form and resets to input state

### Features
- Real-time URL validation
- Immediate user feedback
- One-click copy to clipboard
- Clear success/error states
- Prevents invalid URLs
- Auto-clear after successful submission

### Error Handling
- Empty URL: "Please enter a URL"
- Invalid URL: "Please enter a valid URL"
- Server error: Backend error message shown

---

## 📈 Analytics Page (`/analytics/:shortUrl`)

### Purpose
Detailed analytics and visualizations for a specific shortened URL.

### Header Section
- Back button to dashboard
- Short URL code
- Copy button for the short URL

### Date Range Picker
- Start Date input
- End Date input
- "Refresh" button
- Defaults to last 30 days
- Validates date range (start ≤ end)

### Statistics Cards (4 cards)
1. **Total Clicks** - Total count for date range
2. **Unique Days** - Days with at least one click
3. **Avg per Day** - Average clicks per day
4. **Date Range** - Number of days selected

### Charts & Visualizations

#### 1. Line Chart: "Clicks Over Time"
- X-axis: Date
- Y-axis: Number of clicks
- Shows trend over selected period
- Interactive tooltip on hover
- Helps identify peak usage days

#### 2. Bar Chart: "Clicks by Hour"
- X-axis: Hour of day (0:00 to 23:00)
- Y-axis: Number of clicks
- Shows hourly distribution
- Identifies busiest hours
- Helps understand user behavior patterns

#### 3. Pie Chart: "Device Types"
- Shows breakdown of clicks by device
- Displays: Desktop, Mobile, Tablet, etc.
- Colored segments
- Legend with click counts
- Visible only if device data exists

### Data Processing
- All timestamps converted to user's local timezone
- Grouped by date for line chart
- Grouped by hour for bar chart
- Device type aggregation for pie chart

### Features
- Custom date range selection
- Real-time data refresh
- Interactive charts with Recharts
- Responsive chart sizing
- Tooltips on chart hover
- Legend for all charts
- Empty state for no data
- Loading state while fetching

### User Flow
1. Click analytics button from dashboard
2. Redirect to analytics page
3. View default 30-day analytics
4. Adjust date range as needed
5. Click "Refresh" to reload data
6. Export or screenshot charts

---

## 🧭 Navigation Bar (`Navbar.jsx`)

### Desktop View
- **Logo Section**: URLShort brand with link icon
- **Navigation Links**: 
  - Dashboard
  - Create URL
- **Logout Button**: Right-aligned with icon

### Mobile View
- **Logo**: Left side
- **Hamburger Menu**: Right side toggle
- **Mobile Menu**: Slides down with all options

### Active State
- Current page link highlighted with blue background
- Clear visual indicator of active page

### Functionality
- Clicking logo goes to dashboard
- Each nav link routes to respective page
- Logout clears token and redirects to login
- Mobile menu closes after selecting item
- Sticky positioning (stays at top while scrolling)

### Styling
- White background with subtle shadow
- Icons from Lucide React
- Responsive spacing
- Smooth transitions on hover
- Mobile-optimized touch targets

---

## 🎨 Common UI Elements

### Buttons
```
Primary Button (btn-primary)
- Blue background (#2563eb)
- White text
- Hover: Darker blue
- Padding: px-4 py-2

Secondary Button (btn-secondary)
- Gray background (#e5e7eb)
- Gray text
- Hover: Lighter gray
```

### Input Fields (input-field)
- Full width
- Gray border
- Blue focus ring
- Padding: px-4 py-2
- Rounded corners

### Cards (card)
- White background
- Rounded corners
- Subtle shadow
- Light gray border
- Padding: p-6

### Alert/Toast
- Used for all notifications
- Auto-dismiss after 2-3 seconds
- Success (green), Error (red), Info (blue)

---

## 🔄 Data Flow

### Authentication Flow
```
User Input
    ↓
Form Validation
    ↓
API Call (login/register)
    ↓
JWT Token Received
    ↓
Store in localStorage
    ↓
Redirect to Dashboard
```

### URL Creation Flow
```
User enters Long URL
    ↓
Validate URL format
    ↓
POST /api/urls/shorten
    ↓
Receive shortened data
    ↓
Display success state
    ↓
User can copy or create another
```

### Analytics Flow
```
Navigate to /analytics/:shortUrl
    ↓
Fetch analytics for date range
    ↓
Process data (group by date, hour, device)
    ↓
Render charts and statistics
    ↓
User adjusts date range
    ↓
Refetch and re-render
```

---

## 📱 Responsive Breakpoints

All pages use Tailwind responsive design:
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Adjustments per Breakpoint
- Stack cards vertically on mobile
- Hide/show elements conditionally
- Adjust font sizes
- Modify table view (horizontal scroll on mobile)
- Scale charts responsively

---

## 🎯 User Journeys

### New User Journey
1. Register → Verification
2. Login → Dashboard (empty)
3. Create URL → Success
4. View Dashboard → See URL
5. Click Analytics → View data

### Returning User Journey
1. Login → Dashboard
2. View existing URLs
3. Create new URL or view analytics
4. Manage URLs (copy, view, delete)

---

## ✅ Accessibility Features

- Semantic HTML structure
- ARIA labels on all inputs
- Keyboard navigation support
- Form validation feedback
- Color contrast compliance (WCAG AA)
- Icon + text labels for buttons
- Focus indicators on interactive elements

---

**Total Pages**: 5
**Total Components**: 6
**Lines of Code**: ~1,500+
**Responsive**: Yes ✅
**Accessible**: Yes ✅
