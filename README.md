# 🎬 Movie Database - Role-Based Access Control

A full-stack movie web application with JWT authentication, role-based access control, and IMDb Top 250 integration. Built with the MERN stack, featuring asynchronous job processing with BullMQ and Redis.

## 🌟 Features

### User Features
- 🎥 Browse IMDb Top 250 movies with pagination
- 🔍 Search movies by title or description
- 📊 Sort movies by title, rating, release date, or duration
- 👤 User registration and JWT-based authentication
- 🎨 Responsive dark theme UI with Material-UI

### Admin Features
- ➕ Add new movies (queued processing with BullMQ)
- ✏️ Edit existing movie details
- 🗑️ Delete movies
- 🔐 Protected admin routes with role-based access control

### Technical Features
- 🔄 Asynchronous job processing with distributed queue (BullMQ + Redis)
- 🔒 Secure JWT authentication with role-based middleware
- 📱 Fully responsive design with Material-UI
- 🚀 Deployed on Railway (backend/worker) and Vercel (frontend)
- 🗄️ MongoDB Atlas for database hosting
- ☁️ Redis Cloud for queue management

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **UI Library:** Material-UI (MUI)
- **Routing:** React Router DOM
- **State Management:** Context API
- **HTTP Client:** Fetch API

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcryptjs

### Queue System
- **Queue:** BullMQ
- **Message Broker:** Redis (ioredis)

### Deployment
- **Frontend:** Vercel
- **Backend:** Railway
- **Worker:** Railway
- **Database:** MongoDB Atlas
- **Redis:** Redis Cloud

## 📸 Screenshots

### Home Page
![Home Page](screenshots/image2.png)
*Browse through IMDb Top 250 movies with pagination*

### Search & Sort
![Search Page](screenshots/image1.png)
*Search and sort movies by various criteria*

### Admin Dashboard
![Admin Dashboard](screenshots/AdminDash1.png)
*Admin interface for managing movies*

### Authentication
![Login Page](screenshots/Login.png)
*Secure JWT-based authentication*

> Note: Add screenshots to a `screenshots/` folder in your repository

## 🚀 Live Demo

- **Frontend:** [https://movieinfoapp1.netlify.app](https://movieinfoapp1.netlify.app)
- **Backend API:** [https://movie-info-app-production.up.railway.app](https://movie-info-app-production.up.railway.app)

### Test Credentials

**Admin Account:**
- Register with any email and select "Admin" role during registration
- Or use: `admin@example.com` / `admin123` (if seeded)

**Regular User:**
- Register with any email and select "User" role

> **Note:** Role selection is enabled for demo purposes. In production, admin roles would be assigned manually via database or admin panel.

## 📦 Installation & Setup

### Prerequisites

- Node.js (v20.19+ or v22.12+)
- MongoDB (local or Atlas account)
- Redis (local or Redis Cloud account)
- OMDb API Key (for IMDb data) - Get it from [OMDb API](https://www.omdbapi.com/apikey.aspx)

### Backend Setup

1. **Clone the repository:**
```bash
   git clone https://github.com/YOUR_USERNAME/movie-app-rbac.git
   cd movie-app-rbac
```

2. **Install backend dependencies:**
```bash
   cd backend
   npm install
```

3. **Create environment variables:**
   
   Create `backend/.env` file:
```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   
   REDIS_HOST=your_redis_host
   REDIS_PORT=your_redis_port
   REDIS_PASSWORD=your_redis_password
   REDIS_URL=redis://default:password@host:port
```

4. **Populate database with IMDb Top 250:**
   
   Update `scripts/populateIMDb.js` with your OMDb API key, then run:
```bash
   node scripts/populateIMDb.js
```

5. **Start the backend server:**
```bash
   npm start
```
   Server runs on `http://localhost:5000`

6. **Start the worker (in a new terminal):**
```bash
   cd backend
   node queue/movieWorker.js
```

### Frontend Setup

1. **Install frontend dependencies:**
```bash
   cd frontend
   npm install
```

2. **Create environment variables:**
   
   Create `frontend/.env` file:
```env
   VITE_API_URL=http://localhost:5000/api
```

3. **Start the development server:**
```bash
   npm run dev
```
   App runs on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-backend.railway.app/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // or "admin"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Movie Endpoints

#### Get All Movies (Paginated)
```http
GET /movies?page=1&limit=9
```

**Response:**
```json
{
  "movies": [...],
  "currentPage": 1,
  "totalPages": 6,
  "totalMovies": 50
}
```

#### Search Movies
```http
GET /movies/search?q=godfather
```

**Response:** Array of matching movies

#### Get Sorted Movies
```http
GET /movies/sorted?sortBy=rating
```

**Query Parameters:**
- `sortBy`: `title`, `rating`, `releaseDate`, `duration`

**Response:** Array of sorted movies

#### Add Movie (Admin Only)
```http
POST /movies
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Inception",
  "description": "A thief who steals corporate secrets...",
  "rating": 8.8,
  "duration": 148,
  "releaseDate": "2010-07-16"
}
```

**Response:**
```json
{
  "message": "Movie added to queue. It will be processed shortly."
}
```

#### Update Movie (Admin Only)
```http
PUT /movies/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "rating": 9.0
}
```

#### Delete Movie (Admin Only)
```http
DELETE /movies/:id
Authorization: Bearer <token>
```

## 🔐 Security Features

### Authentication & Authorization
- **JWT Tokens:** Secure token-based authentication with 1-day expiration
- **Password Hashing:** bcryptjs with salt rounds for secure password storage
- **Role-Based Access Control:** Middleware to protect admin-only routes
- **Protected Routes:** Frontend routes protected with React Router

### Security Considerations

**Current Implementation (Demo):**
- Role selection is available during registration for easy testing

**Production Recommendations:**
- Remove role selection from registration form
- Implement admin creation via secure backend scripts
- Add email verification for registration
- Implement rate limiting on authentication endpoints
- Use environment-specific secrets (rotate regularly)
- Add HTTPS enforcement in production
- Implement refresh tokens for better security
- Add input validation and sanitization
- Implement CSRF protection

## 🏗️ Architecture

### System Design
```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │─────▶│   Express    │─────▶│   MongoDB   │
│  Frontend   │      │   Backend    │      │   Atlas     │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │    Redis     │
                     │    Cloud     │
                     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   BullMQ     │
                     │   Worker     │
                     └──────────────┘
```

### Data Flow

1. **User Action:** User submits movie form (admin only)
2. **API Request:** Frontend sends POST request to backend
3. **Queue Job:** Backend adds job to Redis queue (BullMQ)
4. **Immediate Response:** API returns 202 Accepted
5. **Background Processing:** Worker picks up job from queue
6. **Database Write:** Worker saves movie to MongoDB
7. **Job Complete:** Worker marks job as completed

### Why Distributed Queue?

- **Performance:** Non-blocking API responses
- **Scalability:** Can add multiple workers
- **Reliability:** Jobs persist in Redis if worker crashes
- **Concurrency:** Multiple jobs processed simultaneously

## 🚀 Deployment Guide

### Backend & Worker (Railway)

1. **Create Railway account:** [railway.app](https://railway.app)
2. **New Project** → Deploy from GitHub repo
3. **Configure Backend Service:**
   - Root Directory: `backend`
   - Start Command: `npm start`
   - Add environment variables (see `.env.example`)
   - Generate domain
4. **Configure Worker Service:**
   - Root Directory: `backend`
   - Start Command: `node queue/movieWorker.js`
   - Add same environment variables

### Frontend (Vercel)

1. **Create Vercel account:** [vercel.com](https://vercel.com)
2. **Import** GitHub repository
3. **Configure:**
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Add Environment Variable:**
   - `VITE_API_URL`: Your Railway backend URL + `/api`
5. **Deploy**

### Database & Redis

- **MongoDB:** Use MongoDB Atlas (free tier available)
- **Redis:** Use Redis Cloud (free tier available)

## 📝 Environment Variables

### Backend `.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/movieApp
JWT_SECRET=your_super_secret_jwt_key_here
REDIS_HOST=your-redis-host.cloud.redislabs.com
REDIS_PORT=19696
REDIS_PASSWORD=your_redis_password
REDIS_URL=redis://default:password@host:port
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

**⚠️ Important:** Never commit `.env` files to version control!

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration works
- [ ] User login works (JWT token received)
- [ ] Home page displays movies with pagination
- [ ] Search finds movies by title/description
- [ ] Sort works for all fields (title, rating, date, duration)
- [ ] Admin can access admin dashboard
- [ ] Admin can add movies (queued and processed)
- [ ] Admin can edit movies
- [ ] Admin can delete movies
- [ ] Regular users cannot access admin features
- [ ] Logout works
- [ ] Protected routes redirect unauthorized users

### API Testing

Use tools like Postman, Insomnia, or curl:
```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Test get movies
curl http://localhost:5000/api/movies

# Test add movie (with token)
curl -X POST http://localhost:5000/api/movies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test Movie","rating":8.5}'
```

## 📊 Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["user", "admin"], default: "user"),
  createdAt: Date,
  updatedAt: Date
}
```

### Movie Model
```javascript
{
  title: String (required),
  description: String,
  rating: Number (0-10),
  duration: Number (minutes),
  releaseDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is created for educational/assessment purposes.

## 👨‍💻 Author

**Your Name**
- GitHub: [@AryanGotiwale](https://github.com/AryanGotiwale)
- Email: aryangotiwale.com

## 🙏 Acknowledgments

- IMDb for movie data
- OMDb API for movie information retrieval
- Material-UI for the component library
- Railway for backend hosting
- Vercel for frontend hosting
- MongoDB Atlas for database hosting
- Redis Cloud for queue management

## 📞 Support

For support, email aryangotiwale.com or open an issue in the GitHub repository.

---

**⭐ If you found this project useful, please give it a star!**
