import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { authMiddleware } from "~/http/middlewares/auth";
import { prisma } from "~/lib/prisma";
import { LIST_JOB_APPLICATIONS_BY_USER_SCHEMA } from "./list-job-applications-by-user-schema";

export function listJobApplicationsByUser(app: FastifyInstance) {
  return app
    .withTypeProvider<ZodTypeProvider>()
    .register(authMiddleware)
    .get(
      "/job-applications",
      {
        schema: LIST_JOB_APPLICATIONS_BY_USER_SCHEMA,
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();

        const userJobApplications = await prisma.jobApplication.findMany({
          where: {
            userId: userId,
          },
          omit: {
            updatedAt: true,
            userId: true,
            createdAt: true,
          },
        });

        return reply.send(userJobApplications);
      }
    );
}
