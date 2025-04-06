import { compare } from "bcryptjs";
import type { FastifyInstance } from "fastify/types/instance";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "~/lib/prisma";
import { BadRequestError } from "../_errors/bad-request-error";

export async function authWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/sessions/password",
    {
      schema: {
        tags: ["auth"],
        summary: "Authenticate with email and password",
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userFromEmail = await prisma.user.findUnique({
        where: {
          email: request.body.email,
        },
      });

      if (!userFromEmail) {
        throw new BadRequestError("Invalid Credentials.");
      }

      if (!userFromEmail.passwordHash) {
        throw new BadRequestError("Invalid Credentials.");
      }

      const isPasswordCorrect = await compare(
        request.body.password,
        userFromEmail.passwordHash
      );

      if (!isPasswordCorrect) {
        throw new BadRequestError("Invalid Credentials.");
      }

      const token = await reply.jwtSign(
        {
          sub: userFromEmail.id,
        },
        {
          sign: {
            expiresIn: "7d",
          },
        }
      );

      return reply.status(201).send({
        token,
      });
    }
  );
}
