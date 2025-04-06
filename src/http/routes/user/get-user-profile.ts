import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify/types/instance";
import { z } from "zod";
import { prisma } from "~/lib/prisma";
import { BadRequestError } from "../_errors/bad-request-error";
import { authMiddleware } from "../../middlewares/auth";

export async function getUserProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authMiddleware)
    .get(
      "/profile",
      {
        schema: {
          tags: ["account"],
          summary: "Returns user information",
          response: {
            200: z.object({
              id: z.string().uuid(),
              name: z.string().nullable(),
              email: z.string().email().nullable(),
              avatarUrl: z.string().url().nullable(),
            }),
            404: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        });

        if (!user) {
          throw new BadRequestError("User not found.");
        }

        return reply.status(200).send(user);
      }
    );
}
