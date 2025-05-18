import { z } from "zod";

export const CREATE_ACCOUNT_SCHEMA = {
  tags: ["auth"],
  summary: "Create a new user",
  body: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  }),
  response: {
    201: z.object({
      token: z.string(),
    }),
  },
};
