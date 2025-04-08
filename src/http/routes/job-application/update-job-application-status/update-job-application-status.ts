import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { authMiddleware } from "~/http/middlewares/auth";
import { UPDATE_JOB_APPLICATION_STATUS_SCHEMA } from "./update-job-application-status-schema";
import { prisma } from "~/lib/prisma";
import { NotFoundError } from "../../_errors/not-found-error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export function updateJobApplicationStatus(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authMiddleware)
    .patch(
      "/job-applications/:jobApplicationId",
      {
        schema: UPDATE_JOB_APPLICATION_STATUS_SCHEMA,
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();
        const jobApplicationId = request.params.jobApplicationId;

        try {
          await prisma.jobApplication.update({
            where: {
              userId,
              id: jobApplicationId,
            },
            data: {
              status: request.body.status,
            },
          });
        } catch (err) {
          if (err instanceof PrismaClientKnownRequestError) {
            throw new NotFoundError(err.meta?.cause as string);
          }
          throw err;
        }

        return reply.status(204).send();
      }
    );
}
