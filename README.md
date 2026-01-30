# Pravin-Lab
# 🧪 Pravin Lab - Laboratory Management System

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [User Roles & Permissions](#user-roles--permissions)
- [Core Functionality](#core-functionality)
- [Database Schema](#database-schema)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🔍 Overview

**Pravin Lab Management System** is a full-stack web application designed to digitize and streamline the operations of a medical diagnostic laboratory. The platform serves two primary user groups:

- **Patients**: Browse diagnostic tests, book appointments, place orders, upload prescriptions, track order status, and access medical reports online.
- **Administrators**: Manage tests, packages, orders, users, offers, banners, notifications, and site content through a comprehensive admin dashboard.

The system provides an end-to-end solution from test discovery to report delivery, with features like Google OAuth authentication, real-time notifications, chatbot assistance, and responsive design for all devices.

---

## ✨ Features

### Patient Portal
- 🔐 **Authentication**: Secure registration/login with email/password or Google OAuth
- 🧬 **Test Browsing**: Search and filter through available diagnostic tests
- 📦 **Package Deals**: View comprehensive health packages with multiple tests
- 🛒 **Shopping Cart**: Add tests/packages to cart and manage orders
- 📅 **Appointment Booking**: Schedule sample collection with date/time preferences
- 💰 **Offers & Coupons**: Browse active promotional offers and apply discount codes
- 📄 **Order Tracking**: Monitor order status from booking to report delivery
- 📊 **Report Access**: Download medical reports securely
- 🔔 **Notifications**: Receive updates about orders, bookings, and offers
- 💬 **AI Chatbot**: Get instant assistance for common queries
- 👤 **Profile Management**: Update personal information and view order history
- 🌐 **Multi-language Support**: Interface available in multiple languages

### Admin Dashboard
- 📈 **Analytics Dashboard**: View key metrics and statistics
- 🧪 **Test Management**: Create, update, delete, and categorize tests
- 📦 **Package Management**: Build test packages with pricing and descriptions
- 📋 **Order Management**: Process orders, update status, upload reports
- 🎟️ **Offer Management**: Create promotional campaigns and discount codes
- 🖼️ **Banner Management**: Control homepage banners and hero section
- 👥 **User Management**: Manage user accounts and roles (admin/patient)
- 🔔 **Notification Center**: Send targeted notifications to users
- 📸 **Gallery Manager**: Upload and manage laboratory images
- 📞 **Contact Submissions**: Review customer queries from contact form
- ⚙️ **Site Settings**: Configure lab details, contact info, and operating hours

---

## 🛠️ Technology Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database for data storage |
| **Mongoose** | MongoDB object modeling (ODM) |
| **JWT** | Authentication and authorization |
| **bcryptjs** | Password hashing |
| **Multer** | File upload handling |
| **Google Auth Library** | Google OAuth integration |
| **CORS** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI library |
| **Vite** | Build tool and dev server |
| **React Router DOM** | Client-side routing |
| **Tailwind CSS v4** | Utility-first CSS framework |
| **Axios** | HTTP client for API requests |
| **Framer Motion** | Animation library |
| **Lucide React** | Icon library |
| **React Hot Toast** | Toast notifications |
| **Recharts** | Data visualization charts |
| **QRCode** | QR code generation |
| **@react-oauth/google** | Google OAuth integration |

---

## 📁 Project Structure

```
JM-Pravin-Lab/
│
├── backend/                      # Backend API
│   ├── models/                   # Mongoose models (12 models)
│   │   ├── User.js              # User authentication & profile
│   │   ├── Test.js              # Diagnostic tests
│   │   ├── Package.js           # Test packages
│   │   ├── Order.js             # Orders & purchases
│   │   ├── Booking.js           # Sample collection appointments
│   │   ├── Offer.js             # Promotional offers
│   │   ├── Banner.js            # Homepage banners
│   │   ├── Notification.js      # User notifications
│   │   ├── HeroSettings.js      # Hero section content
│   │   ├── SiteSettings.js      # Lab configuration
│   │   ├── Gallery.js           # Image gallery
│   │   └── Contact.js           # Contact form submissions
│   │
│   ├── routes/                   # API route handlers (14 routes)
│   │   ├── auth.routes.js       # Authentication endpoints
│   │   ├── test.routes.js       # Test CRUD operations
│   │   ├── package.routes.js    # Package CRUD operations
│   │   ├── order.routes.js      # Order management
│   │   ├── booking.routes.js    # Booking management
│   │   ├── offer.routes.js      # Offer management
│   │   ├── banner.routes.js     # Banner management
│   │   ├── notification.routes.js # Notification system
│   │   ├── upload.routes.js     # File upload handling
│   │   ├── stats.routes.js      # Analytics & statistics
│   │   ├── settings.routes.js   # Site settings
│   │   ├── heroSettings.routes.js # Hero section settings
│   │   ├── gallery.routes.js    # Gallery management
│   │   └── contact.routes.js    # Contact form endpoints
│   │
│   ├── middleware/               # Custom middleware
│   │   └── auth.middleware.js   # JWT verification
│   │
│   ├── scripts/                  # Utility scripts
│   ├── templates/                # Email/notification templates
│   ├── uploads/                  # Uploaded files storage
│   ├── .env                      # Environment variables
│   ├── server.js                 # Main server entry point
│   └── package.json              # Backend dependencies
│
├── frontend/                     # Frontend React app
│   ├── src/
│   │   ├── components/          # Reusable components (12 components)
│   │   │   ├── Navbar.jsx       # Navigation bar
│   │   │   ├── Footer.jsx       # Footer section
│   │   │   ├── Chatbot.jsx      # AI assistance
│   │   │   ├── AuthModal.jsx    # Login/Register modal
│   │   │   ├── TestCard.jsx     # Test display card
│   │   │   ├── PackageCard.jsx  # Package display card
│   │   │   ├── LanguageToggle.jsx # Language switcher
│   │   │   ├── ScrollToTop.jsx  # Auto scroll to top
│   │   │   ├── ScrollToTopButton.jsx # Manual scroll button
│   │   │   ├── PageTransition.jsx # Page animation wrapper
│   │   │   ├── PublicLayout.jsx # Public page layout
│   │   │   └── admin/           # Admin-specific components
│   │   │
│   │   ├── pages/               # Page components
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Tests.jsx        # Test listing page
│   │   │   ├── TestDetail.jsx   # Individual test details
│   │   │   ├── Packages.jsx     # Package listing page
│   │   │   ├── PackageDetail.jsx # Individual package details
│   │   │   ├── Cart.jsx         # Shopping cart
│   │   │   ├── Checkout.jsx     # Checkout process
│   │   │   ├── OrderSuccess.jsx # Order confirmation
│   │   │   ├── MyOrders.jsx     # User order history
│   │   │   ├── MyBookings.jsx   # Sample collection bookings
│   │   │   ├── MyReports.jsx    # Medical reports
│   │   │   ├── Offers.jsx       # Active offers page
│   │   │   ├── Profile.jsx      # User profile
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── About.jsx        # About us page
│   │   │   ├── Contact.jsx      # Contact page
│   │   │   ├── Notifications.jsx # User notifications
│   │   │   └── admin/           # Admin panel pages (14 pages)
│   │   │       ├── AdminDashboard.jsx      # Analytics overview
│   │   │       ├── AdminTests.jsx          # Test management
│   │   │       ├── AdminPackages.jsx       # Package management
│   │   │       ├── AdminOrders.jsx         # Order processing
│   │   │       ├── AdminOffers.jsx         # Offer campaigns
│   │   │       ├── AdminBanners.jsx        # Banner control
│   │   │       ├── AdminUsers.jsx          # User administration
│   │   │       ├── AdminNotifications.jsx  # Send notifications
│   │   │       ├── AdminReports.jsx        # Report uploads
│   │   │       ├── AdminSettings.jsx       # Lab settings
│   │   │       ├── AdminHeroSettings.jsx   # Hero section
│   │   │       ├── AdminContentManagement.jsx # Content editor
│   │   │       ├── GalleryManager.jsx      # Image gallery
│   │   │       └── AdminContacts.jsx       # Contact inquiries
│   │   │
│   │   ├── context/             # React Context for state
│   │   │   ├── AuthContext.jsx  # Authentication state
│   │   │   └── CartContext.jsx  # Shopping cart state
│   │   │
│   │   ├── data/                # Static data files
│   │   ├── assets/              # Images and media
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   ├── i18n.js              # Internationalization config
│   │   └── index.css            # Global styles
│   │
│   ├── public/                  # Static assets
│   ├── .env                     # Frontend environment variables
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind configuration
│   └── package.json             # Frontend dependencies
│
├── PROJECT_DOCUMENTATION.md     # Detailed project documentation
└── README.md                    # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (for cloning the repository)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd JM-Pravin-Lab
```

### Step 2: Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pravin-lab?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

#### Start Backend Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The backend API will be available at `http://localhost:5000`

### Step 3: Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `frontend` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000

# Google OAuth (must match backend)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173`

### Step 4: Access the Application

- **Patient Portal**: `http://localhost:5173`
- **Admin Panel**: `http://localhost:5173/admin`
- **API Documentation**: `http://localhost:5000`

---

## 🔐 Environment Variables

### Backend (.env)
| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Server port number | No (default: 5000) | `5000` |
| `NODE_ENV` | Environment mode | No | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string | **Yes** | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT signing | **Yes** | `mysecretkey123` |
| `JWT_EXPIRE` | JWT expiration time | No (default: 7d) | `7d`, `24h`, `30m` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | **Yes** | `123456.apps.googleusercontent.com` |

### Frontend (.env)
| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API base URL | **Yes** | `http://localhost:5000` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | **Yes** | `123456.apps.googleusercontent.com` |

---

## 🌐 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login with credentials
- `POST /google` - Google OAuth login
- `GET /me` - Get current user info (protected)
- `PUT /profile` - Update user profile (protected)

### Tests (`/api/tests`)
- `GET /` - Get all tests (with filters)
- `GET /:id` - Get single test by ID
- `POST /` - Create new test (admin)
- `PUT /:id` - Update test (admin)
- `DELETE /:id` - Delete test (admin)

### Packages (`/api/packages`)
- `GET /` - Get all packages
- `GET /:id` - Get single package
- `POST /` - Create package (admin)
- `PUT /:id` - Update package (admin)
- `DELETE /:id` - Delete package (admin)

### Orders (`/api/orders`)
- `GET /` - Get all orders (admin) or user's orders
- `GET /:id` - Get order details
- `POST /` - Create new order
- `PUT /:id` - Update order status (admin)
- `POST /:id/report` - Upload report (admin)

### Bookings (`/api/bookings`)
- `GET /` - Get all bookings
- `POST /` - Create booking
- `PUT /:id` - Update booking
- `DELETE /:id` - Cancel booking

### Offers (`/api/offers`)
- `GET /` - Get active offers
- `POST /` - Create offer (admin)
- `PUT /:id` - Update offer (admin)
- `DELETE /:id` - Delete offer (admin)

### Banners (`/api/banners`)
- `GET /` - Get active banners
- `POST /` - Create banner (admin)
- `PUT /:id` - Update banner (admin)
- `DELETE /:id` - Delete banner (admin)

### Notifications (`/api/notifications`)
- `GET /` - Get user notifications
- `POST /` - Create notification (admin)
- `PUT /:id/read` - Mark as read

### Settings (`/api/settings`)
- `GET /` - Get site settings
- `PUT /` - Update settings (admin)

### Hero Settings (`/api/hero-settings`)
- `GET /` - Get hero section content
- `PUT /` - Update hero section (admin)

### Gallery (`/api/gallery`)
- `GET /` - Get gallery images
- `POST /` - Add image (admin)
- `DELETE /:id` - Remove image (admin)

### Contacts (`/api/contacts`)
- `GET /` - Get contact submissions (admin)
- `POST /` - Submit contact form
- `PUT /:id` - Update status (admin)

### Upload (`/api/upload`)
- `POST /` - Upload file (image, PDF)

### Stats (`/api/stats`)
- `GET /` - Get dashboard statistics (admin)

---

## 👥 User Roles & Permissions

### Patient Role
- Browse tests and packages
- Add items to cart
- Place orders
- Book sample collection appointments
- View order history and status
- Download medical reports
- Update profile information
- View notifications
- Apply promotional offers

### Admin Role
All patient permissions **plus**:
- Manage tests and packages (CRUD)
- Process orders and update status
- Upload medical reports
- Create and manage offers/coupons
- Manage homepage banners
- Send notifications to users
- View analytics and statistics
- Configure site settings
- Manage user accounts
- View contact form submissions
- Manage image gallery

---

## 🎯 Core Functionality

### 1. Authentication System
- **Email/Password Authentication**: Secure registration and login with bcrypt password hashing
- **Google OAuth Integration**: One-click login with Google account
- **JWT Token Management**: Stateless authentication with JWT tokens
- **Protected Routes**: Middleware-based route protection for authenticated users
- **Profile Management**: Users can update personal information

### 2. Shopping & Ordering
- **Product Catalog**: Browse diagnostic tests organized by categories
- **Package Deals**: Bundled tests at discounted prices
- **Shopping Cart**: Add/remove items, adjust quantities
- **Checkout Process**: Multi-step checkout with prescription upload
- **Order Tracking**: Real-time status updates from booking to report delivery
- **Payment Integration**: Ready for integration with payment gateways

### 3. Sample Collection Booking
- **Appointment Scheduling**: Select preferred date and time
- **Address Management**: Home sample collection with multiple addresses
- **Booking Management**: View, reschedule, or cancel appointments
- **Status Updates**: Track sample collection status

### 4. Report Management
- **Secure Upload**: Admins upload reports in PDF format
- **User Access**: Patients access reports from their dashboard
- **Download Feature**: PDF reports downloadable for offline viewing
- **Notification System**: Users notified when reports are available

### 5. Promotional Features
- **Offers & Coupons**: Percentage or fixed amount discounts
- **Banner Management**: Dynamic homepage banners
- **Hero Section**: Customizable hero content with search functionality
- **Special Deals**: Featured tests and packages

### 6. Admin Dashboard
- **Analytics**: View total orders, revenue, users, and tests
- **Data Visualization**: Charts and graphs using Recharts
- **Content Management**: Update site content, settings, and information
- **User Management**: View and manage user accounts
- **Order Processing**: Update order status and upload reports

### 7. User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode**: Toggle between light and dark themes
- **Animations**: Smooth transitions with Framer Motion
- **Notifications**: Real-time toast notifications with React Hot Toast
- **AI Chatbot**: Instant assistance for common queries
- **Multi-language**: Support for multiple languages

---

## 🗄️ Database Schema

### Key Collections

#### Users
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['patient', 'admin']),
  phone: String,
  address: Object,
  googleId: String,
  createdAt: Date
}
```

#### Tests
```javascript
{
  name: String,
  category: String,
  description: String,
  price: Number,
  sampleType: String,
  preparationInstructions: Array,
  reportDeliveryTime: String,
  imageUrl: String,
  isActive: Boolean
}
```

#### Packages
```javascript
{
  name: String,
  description: String,
  tests: Array (references Test IDs),
  originalPrice: Number,
  discountedPrice: Number,
  imageUrl: String,
  isActive: Boolean
}
```

#### Orders
```javascript
{
  user: ObjectId (ref: User),
  items: Array (tests/packages),
  totalAmount: Number,
  status: String (enum: ['pending', 'confirmed', 'sample-collected', 'processing', 'completed', 'cancelled']),
  paymentMethod: String,
  prescriptionUrl: String,
  reportUrl: String,
  createdAt: Date
}
```

#### Bookings
```javascript
{
  user: ObjectId (ref: User),
  order: ObjectId (ref: Order),
  scheduledDate: Date,
  timeSlot: String,
  address: Object,
  status: String,
  notes: String
}
```

---

## 💻 Development

### Code Quality
The project follows modern development practices:
- **ES6+ JavaScript**: Modern syntax with async/await
- **Component-based Architecture**: Reusable React components
- **Context API**: Centralized state management
- **RESTful API Design**: Standard HTTP methods and status codes
- **Error Handling**: Comprehensive error handling on both frontend and backend
- **Input Validation**: Client and server-side validation

### Development Scripts

#### Backend
```bash
npm run dev    # Start with nodemon (auto-restart)
npm start      # Start in production mode
```

#### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Best Practices
- **Environment Variables**: Never commit `.env` files
- **Git Ignore**: Properly configured `.gitignore` for node_modules, uploads, etc.
- **Code Comments**: Well-documented code for maintainability
- **Error Logging**: Console logs for debugging
- **Security**: Password hashing, JWT authentication, CORS configuration

---

## 🚢 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. **Prepare for deployment**:
   - Ensure `NODE_ENV=production` in environment variables
   - Set correct `MONGODB_URI` for production database
   - Configure `JWT_SECRET` with strong secret key
   - Set up `GOOGLE_CLIENT_ID` with production credentials

2. **Deploy on Render** (recommended):
   - Create new Web Service
   - Connect GitHub repository
   - Set root directory to `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variables

3. **Deploy on Railway**:
   - Create new project from GitHub repo
   - Select `backend` directory
   - Add environment variables
   - Deploy

### Frontend Deployment (Vercel/Netlify)

1. **Build the project**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy on Vercel** (recommended):
   - Import project from GitHub
   - Set root directory to `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Add environment variables:
     - `VITE_API_URL`: Your backend production URL
     - `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID

3. **Deploy on Netlify**:
   - Drag and drop `dist` folder, or
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variables

### Post-Deployment
- Test all functionality in production
- Update Google OAuth redirect URIs in Google Cloud Console
- Configure CORS to allow production frontend URL
- Set up custom domains (optional)
- Enable SSL/HTTPS (usually automatic on Vercel/Netlify)

---

## 📞 Support & Contact

For questions, issues, or feature requests, please contact the development team or create an issue in the repository.

---

## 📄 License

This project is licensed under the **ISC License**. See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with modern technologies for optimal performance
- Designed for scalability and maintainability
- User-centric approach for both patients and administrators

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Developed by**: Pravin Lab Development Team
