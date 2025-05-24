import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify/types/instance";
import { authMiddleware } from "~/http/middlewares/auth";
import { prisma } from "~/lib/prisma";
import { BadRequestError } from "../../_errors/bad-request-error";
import { JOB_APPLICATION_SCHEMA } from "./create-job-application-schema";

export async function createJobApplication(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authMiddleware)
    .post(
      "/job-applications",
      {
        schema: JOB_APPLICATION_SCHEMA,
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();

        try {
          const createdJobApplication = await prisma.jobApplication.create({
            data: {
              companyName: request.body.companyName,
              title: request.body.title,
              url: request.body.url,
              notes: request.body.notes,
              status: request.body.status,
              appliedDate: request.body.appliedDate,
              userId,
              salaryRange: request.body.salaryRange,
            },
          });

          return reply.status(201).send(createdJobApplication);
        } catch (err) {
          if (err instanceof PrismaClientKnownRequestError) {
            throw new BadRequestError(err.meta?.cause as string);
          }
          throw err;
        }
      }
    );
}
