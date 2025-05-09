import { z } from "zod";

export const RESET_PASSWORD_SCHEMA = {
  tags: ["auth"],
  summary: "Reset password",
  body: z.object({
    code: z.string().uuid(),
    password: z.string().min(6),
  }),
  response: {
    204: z.null(),
  },
};
