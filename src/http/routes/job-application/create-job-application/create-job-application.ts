import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify/types/instance";
import { authMiddleware } from "~/http/middlewares/auth";
import { prisma } from "~/lib/prisma";
import { JOB_APPLICATION_SCHEMA } from "./create-job-application-schema";

export async function createJobApplication(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authMiddleware)
    .post(
      "/job-application",
      {
        schema: JOB_APPLICATION_SCHEMA,
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();

        const createdJobApplication = await prisma.jobApplication.create({
          data: {
            companyName: request.body.companyName,
            jobTitle: request.body.jobTitle,
            jobUrl: request.body.jobUrl,
            notes: request.body.notes,
            status: request.body.status,
            appliedDate: request.body.appliedDate,
            userId,
          },
        });

        return reply.status(201).send(createdJobApplication);
      }
    );
}
