import { z } from "zod";

export const AUTH_WITH_PASSWORD_SCHEMA = {
  tags: ["auth"],
  summary: "Authenticate with email and password",
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
  response: {
    201: z.object({
      token: z.string(),
    }),
  },
};
