import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify/types/instance";
import { prisma } from "~/lib/prisma";
import { REQUEST_PASSWORD_RECOVER_SCHEMA } from "./request-password-recover-schema";
import { sendEmail } from "~/email/send-email";

export function requestPasswordRecover(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/password/request-recover",
    {
      schema: REQUEST_PASSWORD_RECOVER_SCHEMA,
    },
    async (request, reply) => {
      const userFromEmail = await prisma.user.findUnique({
        where: { email: request.body.email },
      });

      if (!userFromEmail) {
        return reply.status(200).send();
      }

      // delete previous user's tokens
      await prisma.token.deleteMany({
        where: {
          userId: userFromEmail.id,
          type: "PASSWORD_RECOVER",
        },
      });

      const recoverPasswordToken = await prisma.token.create({
        data: {
          type: "PASSWORD_RECOVER",
          userId: userFromEmail.id,
        },
      });

      if (userFromEmail.email) {
        const { error } = await sendEmail({
          to: userFromEmail.email,
          subject: "JobTrackr - Password Recover",
          html: `<p>Click <a href="${process.env.FRONTEND_RESET_EMAIL_URL}?code=${recoverPasswordToken.id}">here</a> to reset your password.</p>`,
        });

        if (error) {
          console.error("Error sending email:", error);
          return reply.status(500).send({ message: error.message });
        }
      }

      return reply.status(204).send();
    }
  );
}
