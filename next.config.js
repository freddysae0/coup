/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server in .next/standalone for a small Docker image.
  output: "standalone",
};

module.exports = nextConfig;
