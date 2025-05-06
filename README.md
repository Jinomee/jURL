# jURL - Modern URL Shortener

A comprehensive URL shortener web application with a minimalistic design, custom branding, and a secure admin panel.

## 🚀 Features

- **URL Shortening**: Convert long URLs to short, manageable links
- **Custom Suffixes**: Create personalized URL endings
- **Expiring URLs**: Set expiration dates for your shortened links
- **Admin Panel**: Manage all URLs through a secure dashboard
- **Click Tracking**: Monitor usage of your shortened URLs
- **Responsive Design**: Works on desktop and mobile devices
- **Single-Port Deployment**: Both UI and redirection work through a single port
- **Domain-Aware URLs**: Automatically uses the current domain for shortened URLs
- **Proxy-Friendly**: Works correctly behind reverse proxies

## 🛠️ Tech Stack

- **Frontend**: React.js with modern hooks and context API
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL for durable storage
- **Caching**: Redis for high-performance URL redirection
- **Containerization**: Docker and Docker Compose for easy deployment
- **Proxy**: NGINX for handling both frontend and URL redirects

## 📋 Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- PostgreSQL (if running locally)
- Redis (if running locally)

## 🔧 Installation

### Local Development Setup

#### Backend Setup

```bash
# Clone the repository
git clone https://github.com/Jinomee/jURL.git
cd jURL/server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and Redis credentials

# Start the development server
npm run dev
```

#### Frontend Setup

```bash
# Navigate to the client directory
cd ../client

# Install dependencies
npm install

# Start the development server
npm start
```

### Docker Setup

```bash
# Clone the repository
git clone https://github.com/Jinomee/jURL.git
cd jURL

# Start all services using Docker Compose
docker-compose up -d

# The application will be available at:
# - Frontend and URL redirects: http://localhost:3000
```

## 🔍 Usage

### Public Interface

1. Visit the homepage
2. Enter a long URL in the input field
3. (Optional) Customize the URL suffix
4. (Optional) Set an expiration date
5. Click "Shorten URL"
6. Copy and share your new shortened URL

### Admin Panel

1. Access the admin panel at `/admin`
2. Log in with your credentials
3. View all shortened URLs
4. Edit, delete, or extend the expiration of URLs
5. Monitor click statistics

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 📚 API Documentation

### Public Endpoints

- `POST /api/urls` - Create a new shortened URL
- `GET /:code` - Redirect to the original URL
- `GET /api/redirect/:code` - Check if a URL exists without redirecting

### Admin Endpoints (Require Authentication)

- `GET /api/urls` - Get all URLs
- `GET /api/urls/:id` - Get URL by ID
- `PUT /api/urls/:id` - Update URL
- `DELETE /api/urls/:id` - Delete URL
- `GET /api/urls/stats` - Get URL statistics
- `GET /api/urls/refresh/:id` - Refresh statistics for a specific URL
- `POST /api/admin/login` - Admin authentication

## 🆕 Recent Updates

- **Domain-Aware URLs**: URLs are now generated using the actual request domain instead of hardcoded values
- **Visual Identity Update**: Added custom link icon for favicon and logo in the header
- **Single-Port Deployment**: Configured NGINX to handle both the frontend and URL redirects through port 3000
- **Improved Click Tracking**: Enhanced the URL redirect system to reliably track clicks
- **Proxy-Aware URLs**: Updated URL generation to work correctly behind proxies and in different environments
- **Browser Cache Bypassing**: Added mechanisms to prevent browser caching of redirects
- **Docker Configuration Enhancement**: Fixed environment variable escaping in Docker configuration

## 🔐 Environment Variables

### Backend

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `ADMIN_PASSWORD_HASH` - Hashed admin password
- `JWT_SECRET` - Secret for JWT tokens
- `URL_CODE_LENGTH` - Length of generated short codes (default: 6)

### Frontend

- `REACT_APP_API_URL` - Backend API URL (default: /api for relative path)

## 🚀 Deployment

### Production Setup

For production deployment, consider:

1. Using a secure domain with HTTPS 
2. Setting secure values for JWT_SECRET
3. Changing the default admin password
4. Setting up proper database backups
5. Configuring a firewall

### Environment Example

A sample production `.env` file might look like:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgres://user:password@postgres:5432/jurl
REDIS_URL=redis://redis:6379
JWT_SECRET=your_secure_random_string
ADMIN_PASSWORD_HASH=your_bcrypt_hashed_password
URL_CODE_LENGTH=6
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Jinomee** - [GitHub Profile](https://github.com/Jinomee)

---

Made with ❤️ by Jinomee