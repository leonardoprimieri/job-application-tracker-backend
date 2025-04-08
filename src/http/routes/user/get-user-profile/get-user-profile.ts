import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify/types/instance";
import { prisma } from "~/lib/prisma";
import { GET_USER_PROFILE_SCHEMA } from "./get-user-profile-schema";
import { authMiddleware } from "~/http/middlewares/auth";
import { BadRequestError } from "../../_errors/bad-request-error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function getUserProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authMiddleware)
    .get(
      "/profile",
      {
        schema: GET_USER_PROFILE_SCHEMA,
      },
      async (request, reply) => {
        try {
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
        } catch (err) {
          if (err instanceof PrismaClientKnownRequestError) {
            throw new BadRequestError(err.meta?.cause as string);
          }
          throw err;
        }
      }
    );
}
