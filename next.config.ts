import type { NextConfig } from "next"

/**
 * The Lekan backend does not enable CORS, so the browser talks to it through
 * this same-origin proxy: `/api/*` → `${LEKAN_API_URL}/*`.
 */
const LEKAN_API_URL = (process.env.LEKAN_API_URL ?? "http://localhost:8000").replace(/\/+$/, "")

const nextConfig: NextConfig = {
  experimental: {
    // `/chat` can take up to 60s while the agent calls Google tools.
    // The default rewrite proxy timeout is 30s.
    proxyTimeout: 120_000,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${LEKAN_API_URL}/:path*`,
      },
    ]
  },
}

export default nextConfig
