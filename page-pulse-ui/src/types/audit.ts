// src/types/audit.ts (Update this in both backend and frontend)
export interface AuditData {
  url: string;
  finalUrl: string;
  status: number;
  responseTime: number;
  timestamp: string;

  // HTTP & Server
  contentType: string | null;
  contentLength: string | null;
  server: string | null;
  headers: Record<string, string>;
  redirects: string[];

  // Security & SSL
  securityHeaders: {
    hsts: boolean;
    csp: boolean;
    xFrameOptions: boolean;
    xContentTypeOptions: boolean;
  };
  ssl: {
    valid: boolean;
    issuer: string | null;
    validTo: string | null;
    tlsVersion: string | null;
  } | null;

  // SEO & Meta
  seo: {
    title: string | null;
    description: string | null;
    canonical: string | null;
    robots: string | null;
    language: string | null;
    favicon: string | null;
    openGraph: boolean;
    twitterCard: boolean;
  };

  // HTML Structure & Performance
  structure: {
    h1Count: number;
    h2Count: number;
    images: number;
    imagesWithoutAlt: number;
    links: number;
    internalLinks: number;
    externalLinks: number;
    scripts: number;
    stylesheets: number;
  };
}

export interface AuditResponse {
  success: boolean;
  requestId: string;
  cached?: boolean;
  data?: AuditData;
  error?: { code: string; message: string };
}
