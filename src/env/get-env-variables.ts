export function getEnvVariables() {
  const PORT = process.env.PORT || 8080;
  const JWT_SECRET = process.env.JWT_SECRET;
  const GITHUB_AUTH_CLIENT_ID = process.env.GITHUB_AUTH_CLIENT_ID;
  const GITHUB_AUTH_CLIENT_SECRET = process.env.GITHUB_AUTH_CLIENT_SECRET;
  const GITHUB_AUTH_REDIRECT_URL = process.env.GITHUB_AUTH_REDIRECT_URL;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FRONTEND_RESET_EMAIL_URL = process.env.FRONTEND_RESET_EMAIL_URL;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  if (!GITHUB_AUTH_CLIENT_ID) {
    throw new Error("GITHUB_AUTH_CLIENT_ID environment variable is required");
  }

  if (!GITHUB_AUTH_CLIENT_SECRET) {
    throw new Error(
      "GITHUB_AUTH_CLIENT_SECRET environment variable is required"
    );
  }

  if (!GITHUB_AUTH_REDIRECT_URL) {
    throw new Error(
      "GITHUB_AUTH_REDIRECT_URL environment variable is required"
    );
  }

  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is required");
  }

  if (!FRONTEND_RESET_EMAIL_URL) {
    throw new Error(
      "FRONTEND_RESET_EMAIL_URL environment variable is required"
    );
  }

  return {
    PORT,
    JWT_SECRET,
    GITHUB_AUTH_CLIENT_ID,
    GITHUB_AUTH_CLIENT_SECRET,
    GITHUB_AUTH_REDIRECT_URL,
    RESEND_API_KEY,
    FRONTEND_RESET_EMAIL_URL,
  };
}
