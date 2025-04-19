import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "openweathermap.org",
      "placehold.co",
      "assets1.cbsnewsstatic.com",
      "assets2.cbsnewsstatic.com",
      "assets3.cbsnewsstatic.com",
      "media.cnn.com",
      "s.yimg.com",
      "static.foxnews.com",
      "media.npr.org",
      "ichef.bbci.co.uk",
      "static01.nyt.com",
      "media.wired.com",
      "images.wsj.net",
      "img.huffingtonpost.com",
      "cdn.cnn.com",
      "nypost.com",
      "nypost-com",
      "cdn.punchng.com"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "openweathermap.org",
        pathname: "/img/wn/**",
      },
      {
        protocol: "https",
        hostname: "**cbsnewsstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.cnn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.yimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.foxnews.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.npr.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.bbci.co.uk",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.nyt.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.wired.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.wsj.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.huffingtonpost.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.nypost.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.punchng.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      }
    ],
  },
};

export default nextConfig;
