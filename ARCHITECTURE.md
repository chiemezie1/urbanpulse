# UrbanPulse - Technical Architecture

## Overview

UrbanPulse is built using a modern web application stack with Next.js as the primary framework. The architecture follows a client-server model with server-side rendering capabilities, API routes for backend functionality, and a relational database for data persistence.

## Architecture Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                       │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                         Next.js App                         │
│                                                             │
│  ┌─────────────────┐    ┌──────────────┐    ┌────────────┐  │
│  │   React UI      │    │  API Routes  │    │  Auth      │  │
│  │  Components     │    │  (Backend)   │    │  (NextAuth)│  │
│  └─────────────────┘    └──────────────┘    └────────────┘  │
│                                │                            │
└────────────────────────────────┼────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                         Prisma ORM                          │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      MySQL Database                         │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      External Services                      │
│                                                             │
│  ┌─────────────────┐    ┌──────────────┐    ┌────────────┐  │
│  │  Weather API    │    │   News API   │    │ Geocoding  │  │
│  │                 │    │              │    │   API      │  │
│  └─────────────────┘    └──────────────┘    └────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Component Architecture

### Frontend

The frontend is built using React components within the Next.js framework, utilizing the App Router for routing and server components where appropriate.

#### Key Components:

1. **Layout Components**
   - `RootLayout`: Base layout with theme provider and authentication context
   - `DashboardLayout`: Layout for authenticated dashboard pages

2. **Page Components**
   - Home page (landing page)
   - Dashboard pages (overview, map, incidents, weather, etc.)
   - Authentication pages (login, register)

3. **Feature Components**
   - `CityMap`: Interactive map component
   - `WeatherWidget`: Weather display component
   - `RecentIncidents`: Incident listing component
   - `CommunityFeed`: Social feed component
   - `LocalNews`: News display component

4. **UI Components**
   - shadcn/ui components (Button, Card, Dialog, etc.)
   - Custom UI components (FeatureCard, LocationDisplay, etc.)

### Backend

The backend functionality is implemented using Next.js API routes, which provide serverless functions for handling data operations.

#### Key API Routes:

1. **Authentication**
   - `/api/auth/[...nextauth]`: NextAuth.js authentication endpoints
   - `/api/register`: User registration endpoint

2. **Data Operations**
   - `/api/incidents`: Incident CRUD operations
   - `/api/posts`: Community post operations
   - `/api/services`: Service listing operations

3. **External Integrations**
   - `/api/weather`: Weather data fetching
   - `/api/news`: News article fetching

### Database

The database is a MySQL database accessed through Prisma ORM, with the following main entities:

1. **User**: User accounts and profiles
2. **Incident**: Reported incidents with location and details
3. **Post**: Community posts and social content
4. **Comment**: Comments on posts
5. **Like**: User likes on posts
6. **Service**: Service listings with location and details

## Authentication Flow

1. User submits login credentials
2. NextAuth.js validates credentials against the database
3. On success, JWT token is issued and stored in cookies
4. Protected routes check for valid session
5. Unauthorized access redirects to login page

## Data Flow

### Incident Reporting Flow:

1. User submits incident report via form
2. Client sends POST request to `/api/incidents`
3. API route validates request and user authentication
4. Prisma creates new incident record in database
5. Success/error response returned to client
6. UI updates to show the new incident

### Weather Data Flow:

1. Client requests weather data for a location
2. Request sent to `/api/weather` with coordinates
3. API route calls OpenWeatherMap API
4. Data is processed and formatted
5. Formatted data returned to client
6. UI displays weather information

## External Integrations

1. **OpenWeatherMap API**
   - Used for weather data and forecasts
   - Accessed via server-side API calls

2. **NewsAPI**
   - Used for fetching location-based news
   - Accessed via server-side API calls

3. **BigDataCloud Reverse Geocoding**
   - Used for converting coordinates to location names
   - Accessed via client-side API calls

## Deployment Architecture

UrbanPulse is designed to be deployed on Vercel, leveraging:

1. **Vercel Edge Network**
   - Global CDN for static assets
   - Edge functions for API routes

2. **Database Hosting**
   - MySQL database hosted on Neon or similar provider
   - Connection pooling for efficient database access

3. **Environment Variables**
   - Secure storage of API keys and secrets
   - Runtime configuration

## Security Architecture

1. **Authentication**
   - JWT-based authentication via NextAuth.js
   - Secure password hashing with bcrypt
   - CSRF protection

2. **Data Protection**
   - Input validation on all API routes
   - Parameterized queries via Prisma
   - Role-based access control

3. **Network Security**
   - HTTPS enforcement
   - Secure headers
   - Rate limiting on sensitive endpoints

## Scalability Considerations

1. **Horizontal Scaling**
   - Stateless API routes for easy scaling
   - Connection pooling for database efficiency

2. **Performance Optimization**
   - Static generation for public pages
   - Incremental Static Regeneration where appropriate
   - API response caching

3. **Database Scaling**
   - Efficient indexing
   - Query optimization
   - Connection pooling
