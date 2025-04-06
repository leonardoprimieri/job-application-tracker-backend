import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify/types/instance";
import { z } from "zod";
import { JobApplicationStatusEnum } from "~/enums/job-application-status.enum";
import { authMiddleware } from "~/http/middlewares/auth";
import { prisma } from "~/lib/prisma";

export async function createJobApplication(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authMiddleware)
    .post(
      "/job-application",
      {
        schema: {
          body: z.object({
            companyName: z.string(),
            jobTitle: z.string(),
            jobUrl: z.string().url(),
            notes: z.string().optional(),
            status: z.nativeEnum(JobApplicationStatusEnum),
            appliedDate: z.string(),
          }),
          summary: "Create a Job Application",
          response: {
            201: z.object({
              companyName: z.string(),
              jobTitle: z.string(),
              jobUrl: z.string().url(),
              notes: z.string().optional(),
              status: z.nativeEnum(JobApplicationStatusEnum),
              appliedDate: z.date(),
            }),
          },
        },
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

        // @ts-expect-error - will fix later
        return reply.status(201).send(createdJobApplication);
      }
    );
}
