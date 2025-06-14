import { z } from "zod";

export const REQUEST_PASSWORD_RECOVER_SCHEMA = {
  tags: ["auth"],
  summary: "Request recover password",
  body: z.object({
    email: z.string().email(),
  }),
  response: {
    204: z.null(),
    500: z.object({
      message: z.string(),
    }),
  },
};
