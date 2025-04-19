# UrbanPulse - Smart City Community Platform

![UrbanPulse Logo](public/urbanpulse-logo.png)

UrbanPulse is a comprehensive smart city platform that connects residents, shares real-time information, and creates a digital community space for urban environments.

## Author

**Agbo Chiemezie**  
Email: chiemezieagbo1@gmail.com  
GitHub: [github.com/chiemezie](https://github.com/chiemezie)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Overview

UrbanPulse is designed to enhance urban living by providing residents with real-time information about their city, including:

- Interactive city mapping
- Incident reporting and tracking
- Weather and air quality monitoring
- Local news aggregation
- Community engagement tools
- Service discovery

The platform aims to create more connected, informed, and engaged urban communities by centralizing information and providing tools for citizen participation.

## Features

### 1. Interactive City Map
- Multi-layered map showing incidents, services, and points of interest
- Real-time updates for traffic, construction, and events
- Filter controls for different data types
- Location-based information display

### 2. Incident Reporting & Tracking
- User-submitted incident reports
- Categorization by type (traffic, construction, alerts, etc.)
- Severity classification
- Status tracking
- Location mapping

### 3. Weather & Environmental Monitoring
- Current weather conditions
- 5-day forecast
- Air quality index
- Weather-based recommendations
- Personalized alerts

### 4. Local News
- Location-based news aggregation
- Searchable news database
- Category filtering
- Source attribution
- Saved articles functionality

### 5. Community Feed
- User-generated posts and updates
- Like and comment functionality
- Community engagement metrics
- Profile-based posting

### 6. Service Discovery
- Nearby essential services (hospitals, restaurants, shops)
- Service details and contact information
- Operating hours
- Directions and mapping

### 7. User Authentication
- Secure login and registration
- Profile management
- Session handling
- Role-based access control

## Technical Architecture

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Components**: shadcn/ui component library
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Maps**: Leaflet.js
- **Authentication**: NextAuth.js

### Backend
- **API Routes**: Next.js API routes
- **Database ORM**: Prisma
- **Authentication**: NextAuth.js with JWT
- **Password Hashing**: bcrypt

### Database
- **Database**: MySQL (via Neon or other provider)
- **Schema**: Prisma schema with relations for users, incidents, posts, etc.

### External APIs
- **Weather**: OpenWeatherMap API
- **News**: NewsAPI
- **Geocoding**: BigDataCloud Reverse Geocoding API

## Requirements

- Node.js 18.x or higher
- npm or yarn
- MySQL database
- API keys for external services

## Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/chiemezie/urbanpulse.git
   cd urbanpulse
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   \`\`\`
   # Database
   DATABASE_URL="mysql://username:password@host:port/database"

   # NextAuth
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"

   # External APIs
   OPENWEATHERMAP_API_KEY="your-openweathermap-api-key"
   NEWS_API_KEY="your-newsapi-key"
   \`\`\`

4. Set up the database:
   \`\`\`bash
   npx prisma migrate dev --name init
   npx prisma db seed
   \`\`\`

5. Start the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Connection string for MySQL database | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js JWT encryption | Yes |
| `NEXTAUTH_URL` | Base URL of the application | Yes |
| `OPENWEATHERMAP_API_KEY` | API key for OpenWeatherMap | Yes |
| `NEWS_API_KEY` | API key for NewsAPI | Yes |

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication endpoint
- `POST /api/register` - User registration

### Incidents
- `GET /api/incidents` - Get all incidents (with optional type filter)
- `POST /api/incidents` - Create a new incident

### Posts
- `GET /api/posts` - Get all community posts
- `POST /api/posts` - Create a new post
- `POST /api/posts/[id]/likes` - Toggle like on a post

### Services
- `GET /api/services` - Get all services (with optional type filter)

### Weather
- `GET /api/weather` - Get weather data for a location

### News
- `GET /api/news` - Get news articles for a location

## Database Schema

### User
- id (string, primary key)
- name (string)
- email (string, unique)
- emailVerified (datetime, optional)
- password (string, optional)
- image (string, optional)
- createdAt (datetime)
- updatedAt (datetime)
- Relations: accounts, sessions, incidents, posts, comments, likes

### Incident
- id (string, primary key)
- title (string)
- description (string, optional)
- type (string)
- severity (string)
- status (string, default: "active")
- location (string)
- latitude (float, optional)
- longitude (float, optional)
- createdAt (datetime)
- updatedAt (datetime)
- userId (string, foreign key)
- Relations: user

### Post
- id (string, primary key)
- content (string)
- createdAt (datetime)
- updatedAt (datetime)
- userId (string, foreign key)
- Relations: user, comments, likes

### Service
- id (string, primary key)
- name (string)
- description (string, optional)
- type (string)
- address (string)
- latitude (float)
- longitude (float)
- openHours (string, optional)
- phone (string, optional)
- website (string, optional)
- createdAt (datetime)
- updatedAt (datetime)

## Usage Instructions

### User Registration and Login
1. Navigate to the homepage at [http://localhost:3000](http://localhost:3000)
2. Click "Sign Up" to create a new account
3. Fill in your details and submit the form
4. Log in with your credentials

### Dashboard Navigation
- **Overview**: Main dashboard with key information
- **City Map**: Interactive map of your city
- **Incidents**: View and report incidents
- **Weather**: Check weather conditions and forecast
- **Services**: Find nearby services
- **Community**: Engage with community posts
- **Local News**: Read location-based news
- **Settings**: Manage your account settings

### Reporting an Incident
1. Navigate to the City Map page
2. Click "Report Incident"
3. Fill in the incident details (type, severity, location, etc.)
4. Submit the form

### Creating a Community Post
1. Navigate to the Community page
2. Type your message in the post box
3. Click "Post" to share with the community

### Finding Services
1. Navigate to the Services page
2. Use filters to find specific service types
3. View service details and location on the map

## Contributing

We welcome contributions to UrbanPulse! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows our coding standards and includes appropriate tests.

## Deployment

UrbanPulse can be deployed to Vercel with minimal configuration:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure the environment variables
4. Deploy

## Roadmap

- Mobile application (React Native)
- Real-time notifications via WebSockets
- Integration with city open data APIs
- Advanced analytics dashboard
- Public API for developers
- Multi-language support

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Leaflet](https://leafletjs.com/)
- [OpenWeatherMap](https://openweathermap.org/)
- [NewsAPI](https://newsapi.org/)
