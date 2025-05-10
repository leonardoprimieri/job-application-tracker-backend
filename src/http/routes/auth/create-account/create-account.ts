import type { FastifyInstance } from "fastify/types/instance";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "~/lib/prisma";

import { hash } from "bcryptjs";
import { CREATE_ACCOUNT_SCHEMA } from "./create-account-schema";
import { BadRequestError } from "../../_errors/bad-request-error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { hashPassword } from "~/auth/utils/hashPassword";

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/sign-up",
    {
      schema: CREATE_ACCOUNT_SCHEMA,
    },
    async (request, reply) => {
      const { password, name, email } = request.body;

      const userAlreadyExists = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (userAlreadyExists) {
        throw new BadRequestError("User already exists.");
      }

      const passwordHash = await hashPassword(password);

      try {
        await prisma.user.create({
          data: {
            name,
            email,
            passwordHash,
          },
        });

        return reply.status(201).send();
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
          throw new BadRequestError(err.meta?.cause as string);
        }
        throw err;
      }
    }
  );
}
