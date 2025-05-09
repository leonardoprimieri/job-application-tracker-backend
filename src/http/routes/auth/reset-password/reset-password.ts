import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify/types/instance";
import { prisma } from "~/lib/prisma";
import { RESET_PASSWORD_SCHEMA } from "./reset-password-schema";
import { UnauthorizedError } from "../../_errors/unauthorized-error";
import { hashPassword } from "~/auth/utils/hashPassword";

export function resetPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/password/reset",
    {
      schema: RESET_PASSWORD_SCHEMA,
    },
    async (request, reply) => {
      const { code, password } = request.body;

      const token = await prisma.token.findUnique({
        where: {
          id: code,
        },
      });

      if (!token) throw new UnauthorizedError();

      const passwordHash = await hashPassword(password);

      await prisma.user.update({
        where: {
          id: token.userId,
        },
        data: {
          passwordHash,
        },
      });

      return reply.status(204).send();
    }
  );
}
