import type { FastifyInstance } from "fastify/types/instance";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "~/lib/prisma";

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
      const { password, email, firstName, lastName } = request.body;

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
        const user = await prisma.user.create({
          data: {
            email,
            passwordHash,
            firstName,
            lastName,
          },
        });

        const token = await reply.jwtSign(
          {
            sub: user.id,
          },
          {
            sign: {
              expiresIn: "7d",
            },
          }
        );
        console.log("🚀 ~ token:", token);

        return reply.status(201).send({
          token,
        });
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
          throw new BadRequestError(err.meta?.cause as string);
        }
        throw err;
      }
    }
  );
}
