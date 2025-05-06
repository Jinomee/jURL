# jURL - URL Shortener Project Planning

## Project Overview
jURL is a comprehensive URL shortener web application that allows users to create shortened URLs with optional custom suffixes and expiration dates. It includes a modern, minimalistic public interface and a password-protected admin panel.

## Architecture

### Frontend
- **Technology**: React.js
- **Structure**:
  - Public interface for URL shortening
  - Admin panel for URL management
- **UI/UX Focus**: Minimalistic, clean, and intuitive design
- **Branding**: Custom link icon as logo and favicon

### Backend
- **Technology**: Node.js with Express.js
- **API Endpoints**:
  - URL creation (with custom suffix and expiration options)
  - URL redirection
  - Admin operations (list, view, update, delete)
  - Authentication for admin access
- **Proxy Awareness**: Handles X-Forwarded headers for proper URL generation
- **Dynamic URL Generation**: Uses request headers to determine domain for shortened URLs

### Database
- **Technology**: PostgreSQL
- **Schema**:
  - URLs table (original URL, short code, creation date, expiration date, click count)
  - Admin credentials table

### Caching
- **Technology**: Redis
- **Usage**: Caching short code to original URL mappings for fast redirection
- **Cache Control**: Headers prevent browser caching of redirects

### Deployment
- **Technology**: Docker & Docker Compose
- **Configuration**: NGINX for frontend serving and proxying
- **Port Structure**: Single port (3000) for both frontend and URL redirection
- **Environment Management**: Properly escaped environment variables for Docker

## Project Structure
```
jURL/
├── client/                 # React frontend
│   ├── public/
│   │   ├── icons/          # Favicon and other icon assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service calls
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── context/        # React context for state management
│   │   ├── styles/         # Global styles and theme
│   │   └── App.js          # Main application component
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── config/         # Configuration files
│   │   └── index.js        # Application entry point
│   ├── tests/              # Backend tests
│   └── package.json
├── docker/                 # Docker configuration
│   ├── frontend/           # Frontend Docker configuration with NGINX
│   │   ├── Dockerfile      # Frontend build and NGINX setup
│   │   └── nginx.conf      # NGINX configuration for single-port deployment
│   └── backend/            # Backend Docker configuration
│       └── Dockerfile      # Backend build and runtime setup
├── docker-compose.yml      # Docker Compose configuration
├── README.md               # Project documentation
├── PLANNING.md             # Architecture and planning document
└── TASK.md                 # Task tracking and progress
```

## Naming Conventions
- **Files**: PascalCase for React components, camelCase for other files
- **Variables**: camelCase
- **CSS Classes**: kebab-case
- **Database**: snake_case
- **Constants**: UPPERCASE_WITH_UNDERSCORES
- **API Endpoints**: kebab-case

## Recent Enhancements
- **Dynamic URL Generation**: Uses actual domain for shortened URLs instead of hardcoded values
- **Visual Identity**: Custom branded link icon for favicon and logo
- **Unified Deployment**: Single-port architecture for frontend and URL redirection
- **Improved URL Handling**: Enhanced proxy awareness and cache prevention
- **Error Handling**: Better user feedback for duplicate URL codes
- **Docker Configuration**: Fixed environment variable escaping for bcrypt password hash

## Style Guide
- Use functional components with hooks in React
- Use async/await for asynchronous operations
- Follow RESTful principles for API design
- Implement proper error handling
- Use environment variables for configuration
- Write clear, concise comments

## Development Workflow
1. Set up project structure and development environment
2. Implement database schema and models
3. Develop backend API endpoints
4. Implement Redis caching
5. Create authentication mechanisms
6. Build frontend interfaces
7. Set up Docker configuration
8. Test and refine the application

## Deployment Workflow
1. Build Docker images for frontend and backend
2. Configure NGINX for proxying requests
3. Set up environment variables
4. Deploy using Docker Compose
5. Configure domain and SSL certificates
6. Set up monitoring and backups

## Constraints
- Maximum file length: 500 lines of code
- Consistent coding style and architecture patterns
- Thorough testing for all features
- Clean, documented code
- Domain-aware URL generation

## Future Directions
- User accounts with personal URL management
- Advanced analytics dashboard
- QR code generation for short URLs
- API rate limiting
- Tagging and categorization features
- Mobile app integration