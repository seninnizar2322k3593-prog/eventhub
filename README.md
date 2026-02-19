# EventHub - Event Management Website

A full-stack Event Management Website built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This application enables administrators to manage events and review participant image submissions, while providing a public interface for event discovery and image uploads.

## Features

### Admin Features
- 🔐 Secure JWT-based authentication
- 📅 Complete event CRUD operations (Create, Read, Update, Delete)
- 🖼️ Image approval/rejection system
- 📊 Dashboard with statistics
- 🔍 Filter and search capabilities

### Public Features
- 📋 Browse all events dynamically
- 🔎 Search and filter events
- 📝 Google Form registration links
- 📸 Image upload for events
- 📱 Fully responsive design

## Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database and ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Multer** - File upload handling
- **Express Rate Limit** - API rate limiting

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Vite** - Build tool

## Security

This application implements comprehensive security measures including:
- ✅ JWT authentication with bcrypt password hashing
- ✅ Rate limiting on all routes
- ✅ Input validation and sanitization
- ✅ MongoDB ObjectId validation
- ✅ File upload restrictions (type and size)
- ✅ Protected admin routes
- ✅ CORS configuration

For detailed security information, see [SECURITY.md](SECURITY.md).

## Project Structure

```
eventhub/
├── backend/
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── cloudinary.js            # Cloudinary setup
│   ├── controllers/
│   │   ├── adminController.js       # Admin authentication logic
│   │   ├── eventController.js       # Event CRUD operations
│   │   └── uploadController.js      # Image upload logic
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   └── errorMiddleware.js       # Error handling
│   ├── models/
│   │   ├── Admin.js                 # Admin schema
│   │   ├── Event.js                 # Event schema
│   │   └── ImageUpload.js           # Image upload schema
│   ├── routes/
│   │   ├── adminRoutes.js           # Admin routes
│   │   ├── eventRoutes.js           # Event routes
│   │   └── uploadRoutes.js          # Upload routes
│   ├── utils/
│   │   └── generateToken.js         # JWT token generator
│   ├── .env.example                 # Environment variables template
│   ├── server.js                    # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   ├── EventManagement.jsx
│   │   │   │   └── ImageManagement.jsx
│   │   │   ├── public/
│   │   │   │   ├── EventList.jsx
│   │   │   │   ├── EventDetails.jsx
│   │   │   │   ├── ImageUpload.jsx
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Footer.jsx
│   │   │   └── common/
│   │   │       ├── Loader.jsx
│   │   │       └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Authentication context
│   │   ├── services/
│   │   │   └── api.js               # API service layer
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image storage)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Admin Routes
```
POST   /api/admin/register       # Register new admin
POST   /api/admin/login          # Admin login
GET    /api/admin/verify         # Verify JWT token (Protected)
```

### Event Routes
```
GET    /api/events               # Get all events (Public)
GET    /api/events/:id           # Get single event (Public)
POST   /api/events               # Create event (Protected)
PUT    /api/events/:id           # Update event (Protected)
DELETE /api/events/:id           # Delete event (Protected)
```

### Upload Routes
```
POST   /api/uploads              # Upload image (Public)
GET    /api/uploads              # Get all uploads (Protected)
GET    /api/uploads/event/:eventId  # Get uploads by event (Public - approved only)
PATCH  /api/uploads/:id/approve  # Approve image (Protected)
PATCH  /api/uploads/:id/reject   # Reject image (Protected)
DELETE /api/uploads/:id          # Delete image (Protected)
```

## Usage

### Admin Panel

1. **Initial Setup**: Register the first admin account
   - Navigate to `/admin/login`
   - Use the register endpoint or create directly in database

2. **Login**: Access the admin panel at `/admin/login`

3. **Dashboard**: View statistics and recent events at `/admin/dashboard`

4. **Manage Events**: 
   - Create, update, and delete events at `/admin/events`
   - Add event details including Google Form registration links

5. **Manage Images**:
   - Review uploaded images at `/admin/images`
   - Approve, reject, or delete submissions
   - Filter by status and event

### Public Interface

1. **Home Page**: View featured content at `/`

2. **Browse Events**: See all events at `/events`
   - Search by title or description
   - Filter by status (upcoming, ongoing, completed)

3. **Event Details**: Click on any event to view full details and registration link

4. **Upload Images**: Share event photos at `/upload`
   - Select an event
   - Upload multiple images (max 5MB each)
   - Images require admin approval before being visible

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Protected admin routes
- ✅ Input validation and sanitization
- ✅ File upload validation (type and size)
- ✅ CORS configuration
- ✅ Environment variable management
- ✅ Secure image storage with Cloudinary

## Database Schema

### Admin Collection
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  createdAt: Date
}
```

### Event Collection
```javascript
{
  title: String (required),
  description: String (required),
  date: Date (required),
  location: String (required),
  googleFormLink: String (required, URL),
  category: String (optional),
  status: String (enum: upcoming/ongoing/completed),
  createdBy: ObjectId (ref: Admin),
  timestamps: true
}
```

### ImageUpload Collection
```javascript
{
  eventId: ObjectId (ref: Event, required),
  imageUrl: String (required),
  cloudinaryId: String (required),
  uploadedBy: String (optional),
  uploaderEmail: String (optional),
  status: String (enum: pending/approved/rejected),
  uploadedAt: Date,
  reviewedAt: Date,
  reviewedBy: ObjectId (ref: Admin)
}
```

## Environment Variables

### Backend (.env)
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

### Frontend (.env)
- `VITE_API_URL`: Backend API URL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues, questions, or contributions, please open an issue in the GitHub repository.

---

**Built with ❤️ using the MERN Stack**