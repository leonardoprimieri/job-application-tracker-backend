import { z } from "zod";

export const AUTH_WITH_GITHUB_SCHEMA = {
  tags: ["auth"],
  summary: "Authenticate with github",
  body: z.object({
    code: z.string(),
  }),
  response: {
    201: z.object({
      token: z.string(),
    }),
  },
};
