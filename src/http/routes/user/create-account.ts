import type { FastifyInstance } from "fastify/types/instance";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "~/lib/prisma";

import { hash } from "bcryptjs";
import { BadRequestError } from "../_errors/bad-request-error";

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users",
    {
      schema: {
        tags: ["account"],
        summary: "Create a new user",
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({
            message: z.string().optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userAlreadyExists = await prisma.user.findUnique({
        where: {
          email: request.body.email,
        },
      });

      if (userAlreadyExists) {
        throw new BadRequestError("User already exists.");
      }

      const passwordHash = await hash(request.body.password, 6);

      await prisma.user.create({
        data: {
          name: request.body.name,
          email: request.body.email,
          passwordHash,
        },
      });

      return reply.status(201).send();
    }
  );
}
