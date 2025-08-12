 
import type { NextConfig } from "next";


const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  // disable: process.env.NODE_ENV === "development",
  disable: false, // Set to false to enable PWA in development mode
  // register: true,
  // scope: "/app",
  sw: "service-worker.js",
  // customWorkerDest: "service-worker",
  // cacheStartUrl: true,
  // dynamicStartUrl: true,
  // dynamicStartUrlRedirect: "/foo/bar",
  cacheOnFrontendNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  // scope: "/beta",
  workboxOptions: {
    
  },
  // ...
});


const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }, 
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  }, 
  
  devIndicators:false,
};

export default withPWA(nextConfig);
 