<div align="center">
  <a href="https://github.com/chiemezie1/urbanpulse.git">
    <img src='/public/images/logo_no_text.jpeg' alt="UrbanPulse Logo" width="80" height="80">
  </a>
  <h3 align="center">UrbanPulse</h3>
  <p align="center">
    A smart city platform that connects residents with real-time information about traffic, weather, and community updates.
  </p>
</div

## Overview

UrbanPulse is a smart city platform designed to keep residents informed about their surroundings. It provides real-time information on traffic incidents, weather updates, local services, and community news, all in one place. With an interactive map and user-friendly interface, UrbanPulse empowers residents to stay connected and engaged with their city.

## Why UrbanPulse?
Cities are becoming increasingly complex, and while the world is more connected than ever, the need for local, real-time information has never been greater. Residents want to stay informed, but traditional methods of communication often fail to provide timely and relevant updates. UrbanPulse solves this problem by giving residents access to a platform that offers everything they need to stay connected to their city in real time.

By putting important local information—such as traffic incidents, weather updates, and community news—into the hands of every resident, UrbanPulse encourages active participation in the community. The platform isn't just about receiving information, it's about enabling residents to contribute, stay informed, and help build a smarter, safer, and more connected city.

## Why Use UrbanPulse?

UrbanPulse simplifies how people interact with their environment:
- Stay informed about local incidents and hazards.
- Discover nearby services and community updates.
- Contribute to public safety by reporting issues.
- Access location-specific weather and air quality info.
- Engage with neighbors through a social feed.

This platform promotes transparency, safety, and community involvement, making it an essential tool for smart city living.

## Demo Video
👉 **[Video demo](https://www.youtube.com/watch?v=dQw4w9WgXcQ)**  

## How It Works

UrbanPulse uses APIs and a geolocation system to deliver relevant updates based on user location. Key features include:
- **Interactive Map**: Visualize incidents and services.
- **Incident Reporting**: Report and track local events.
- **Weather & AQI**: View weather and air quality updates.
- **Local News**: Access regional news filtered by interest.
- **Community Feed**: Share and read posts from nearby users.
- **Authentication**: Secure login and role-based access.

## Installation Instructions

### Prerequisites
- **Node.js**: Version 18.x or higher
- **Package Manager**: npm or yarn
- **Database**: MySQL (Refer to [MYSQL_SETUP.md](MYSQL_SETUP.md) for setup instructions)
- **API Keys**: Obtain keys for OpenWeatherMap, NewsAPI, and Geoapify

### 1. Clone the Repository

```bash
git clone https://github.com/chiemezie1/urbanpulse.git
cd urbanpulse
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Setup Environment Variables

Create a `.env` file with the following:

```env
DATABASE_URL="mysql://user:password@host:port/db"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
OPENWEATHERMAP_API_KEY="your-key"
NEWS_API_KEY="your-key"
NEXT_PUBLIC_GEOAPIFY_API_KEY="your-key"
```

### 4. Configure Database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Run the App

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

## Conclusion
UrbanPulse turns complex city data into actionable insights, it’s the ultimate companion for city residents.

## Contributing
We welcome contributions!- See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## ARCHITECTURE
Complete project detailes – See [ARCHITECTURE.md](ARCHITECTURE.md).

## Author
Authors and Contributors  – See [AUTHORS.md](AUTHORS.md) for a complete list of contributors.

## License
Licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
