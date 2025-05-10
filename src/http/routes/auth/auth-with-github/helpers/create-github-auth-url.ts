import { getEnvVariables } from "~/env/get-env-variables";

const {
  GITHUB_AUTH_CLIENT_ID,
  GITHUB_AUTH_CLIENT_SECRET,
  GITHUB_AUTH_REDIRECT_URL,
} = getEnvVariables();

export function createGithubAuthUrl(code: string) {
  const githubUrl = new URL("https://github.com/login/oauth/access_token");

  githubUrl.searchParams.set("client_id", GITHUB_AUTH_CLIENT_ID);
  githubUrl.searchParams.set("client_secret", GITHUB_AUTH_CLIENT_SECRET);
  githubUrl.searchParams.set("redirect_uri", GITHUB_AUTH_REDIRECT_URL);
  githubUrl.searchParams.set("code", code);

  return githubUrl.toString();
}
