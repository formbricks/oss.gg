import "server-only";

export const IS_FORMBRICKS_CLOUD = process.env.IS_FORMBRICKS_CLOUD === "1";
export const REVALIDATION_INTERVAL = 0; //TODO: find a good way to cache and revalidate data when it changes
export const SERVICES_REVALIDATION_INTERVAL = 60 * 30; // 30 minutes
export const MAU_LIMIT = IS_FORMBRICKS_CLOUD ? 9000 : 1000000;

// URLs
export const WEBAPP_URL =
  process.env.WEBAPP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : false) ||
  "http://localhost:3000";

export const SHORT_URL_BASE = process.env.SHORT_URL_BASE ? process.env.SHORT_URL_BASE : WEBAPP_URL;

// encryption keys
export const FORMBRICKS_ENCRYPTION_KEY = process.env.FORMBRICKS_ENCRYPTION_KEY || undefined;
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// Other
export const INTERNAL_SECRET = process.env.INTERNAL_SECRET || "";
export const CRON_SECRET = process.env.CRON_SECRET;
export const DEFAULT_BRAND_COLOR = "#64748b";

export const PRIVACY_URL = process.env.PRIVACY_URL;
export const TERMS_URL = process.env.TERMS_URL;
export const IMPRINT_URL = process.env.IMPRINT_URL;

export const GITHUB_OAUTH_ENABLED = process.env.GITHUB_AUTH_ENABLED === "1";
export const GITHUB_ID = process.env.GITHUB_ID;
export const GITHUB_SECRET = process.env.GITHUB_SECRET;

export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT;
export const SMTP_SECURE_ENABLED = process.env.SMTP_SECURE_ENABLED === "1";
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
export const MAIL_FROM = process.env.MAIL_FROM;

export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

// Storage constants
export const UPLOADS_DIR = "./uploads";
export const MAX_SIZES = {
  public: 1024 * 1024 * 10, // 10MB
  free: 1024 * 1024 * 10, // 10MB
  pro: 1024 * 1024 * 1024, // 1GB
} as const;
export const IS_S3_CONFIGURED: boolean =
  process.env.S3_ACCESS_KEY &&
  process.env.S3_SECRET_KEY &&
  process.env.S3_REGION &&
  process.env.S3_BUCKET_NAME
    ? true
    : false;

export const DEBUG = process.env.DEBUG === "1";
