import type { NextConfig } from "next";

const securityHeaders = [
  // Verhindert Clickjacking (iframe-Einbettung durch Dritte)
  { key: "X-Frame-Options", value: "DENY" },
  // Verhindert MIME-Type-Sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Kein Referrer bei externen Links
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // HTTPS erzwingen (1 Jahr, inkl. Subdomains)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  // Permissions: keine Kamera, Mikrofon, Geolocation
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // XSS-Schutz für ältere Browser
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval für Next.js Dev/HMR nötig
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://api.resend.com https://api.stripe.com https://kasapi.kasserver.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // Externe Bildquellen erlauben (falls später nötig)
  images: {
    remotePatterns: [],
  },

  // Produktions-Logging reduzieren
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;
