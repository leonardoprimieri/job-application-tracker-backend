import { z } from "zod";

export const GET_USER_PROFILE_SCHEMA = {
  tags: ["account"],
  summary: "Returns user information",
  security: [{ bearerAuth: [] }],
  response: {
    200: z.object({
      id: z.string().uuid(),
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
      email: z.string().email().nullable(),
      avatarUrl: z.string().url().nullable(),
    }),
    404: z.object({
      message: z.string(),
    }),
  },
};
