# IntelliShip - AI-Powered Smart Logistics Monitoring Platform

A modern, SaaS-grade web platform for real-time shipment integrity monitoring powered by Edge AI devices.

## 🚀 Features

- **Real-Time Monitoring**: Track shipments with millisecond precision
- **Seller Dashboard**: Complete management interface for logistics operations
- **Public Tracking**: Customer-facing shipment tracking without authentication
- **Event Timeline**: Interactive visualization of all shipment events
- **Status Indicators**: Visual feedback with color-coded severity levels
- **Complaint System**: Allow customers to report issues with damaged shipments
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Dark Theme**: Premium glassmorphism design with gradient backgrounds

## 🛠 Tech Stack

- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API communication
- **Lucide React** for icons

## 📦 Installation

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🌐 API Integration

The platform connects to the backend API at:

```
https://intelliship.onrender.com
```

### Available Endpoints:

- `POST /api/shipments` - Create new shipment
- `GET /api/shipments/:id` - Get shipment details
- `GET /api/events/:shipment_id` - Get all events for a shipment
- `POST /api/events` - Create new event (used by hardware)

## 🎯 Routing Structure

```
/                          - Landing page
/login                     - Seller authentication
/dashboard                 - Main dashboard with stats
/dashboard/create          - Create new shipment
/dashboard/shipments       - List all shipments
/dashboard/shipments/:id   - View shipment details
/track/:shipment_id        - Public tracking page
```

## 🎨 Design System

### Colors

- **Primary**: `#4287f5` - Main brand color
- **Safe**: `#10b981` - Emerald green for safe status
- **Minor**: `#f59e0b` - Amber for minor vibrations
- **Severe**: `#ef4444` - Red with glow for severe impacts

### Typography

- Font Family: Inter, Poppins
- Large, bold headings with clean spacing

### Effects

- Glassmorphism cards
- Gradient backgrounds
- Soft shadows and glows
- Smooth page transitions
- Pulse animations for severe events

## 🔐 Authentication

Currently uses simple local storage authentication for demo purposes.

**To login**: Enter any email and password combination.

For production, integrate with your backend JWT authentication system.

## 🔄 Real-Time Updates

The platform automatically polls for new events every 5 seconds on:

- Shipment Details page
- Customer Tracking page

This ensures users always see the latest shipment status.

## 📱 Responsive Features

- Collapsible sidebar navigation for mobile
- Adaptive card layouts
- Touch-friendly interactions
- Simplified timeline view on small screens

## 🚀 Production Build

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist` folder.

To preview the production build:

```bash
npm run preview
```

## 📋 Component Architecture

```
src/
├── components/
│   ├── Sidebar.jsx           - Navigation sidebar
│   ├── StatusBadge.jsx       - Status indicator component
│   ├── ShipmentCard.jsx      - Shipment card for lists
│   ├── Timeline.jsx          - Event timeline container
│   ├── EventCard.jsx         - Individual event display
│   ├── ToastNotification.jsx - Toast alerts
│   ├── ComplaintModal.jsx    - Complaint submission form
│   └── ProtectedRoute.jsx    - Auth guard component
├── pages/
│   ├── Landing.jsx           - Public landing page
│   ├── Login.jsx             - Authentication page
│   ├── Dashboard.jsx         - Main dashboard
│   ├── CreateShipment.jsx    - Shipment creation form
│   ├── Shipments.jsx         - Shipment list view
│   ├── ShipmentDetails.jsx   - Detailed shipment view
│   └── TrackShipment.jsx     - Public tracking page
├── services/
│   └── api.js                - API service layer
├── App.jsx                   - Main app with routing
├── main.jsx                  - Entry point
└── index.css                 - Global styles
```

## 🎯 Status Calculation Logic

The platform automatically calculates shipment status based on events:

```javascript
if (any event_type === "Severe") → status = Severe (Red + Pulse)
else if (any event_type === "Minor") → status = Minor (Amber)
else → status = Safe (Green)
```

## 🌟 Key Features

### Seller Dashboard

- View summary statistics
- Quick access to create shipment
- Navigate to active shipments

### Create Shipment

- Auto-generates unique shipment ID
- Captures product and customer details
- Sets fragility level
- Success animation on creation

### Shipment List

- Search by ID, product, or customer
- Filter by status
- Animated card grid layout
- Click to view details

### Shipment Details (Seller)

- Large status indicator with animations
- Event timeline with visual styling
- Real-time polling every 5 seconds
- Share tracking link functionality
- Refresh button for manual updates

### Public Tracking

- No authentication required
- Clean, customer-friendly interface
- Event timeline visualization
- Complaint button (appears if severe events exist)
- Auto-refresh functionality

### Animations

- Page transitions with Framer Motion
- Card hover effects
- Status pulse for severe events
- Timeline slide-in animations
- Success confirmations

## 🔧 Customization

### Update API Base URL

Edit `src/services/api.js`:

```javascript
const API = axios.create({
  baseURL: "YOUR_API_URL_HERE",
});
```

### Modify Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#4287f5',
      // Add your custom colors
    },
  },
},
```

---

**Built with ❤️ for modern supply chain management**

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
