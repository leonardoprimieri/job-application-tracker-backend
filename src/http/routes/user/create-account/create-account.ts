import type { FastifyInstance } from "fastify/types/instance";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "~/lib/prisma";

import { hash } from "bcryptjs";
import { CREATE_ACCOUNT_SCHEMA } from "./create-account-schema";
import { BadRequestError } from "../../_errors/bad-request-error";

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users",
    {
      schema: CREATE_ACCOUNT_SCHEMA,
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
