export function getEnvVariables() {
  const PORT = process.env.PORT || 8080;
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  return {
    PORT,
    JWT_SECRET,
  };
}
