import type { FastifyInstance } from "fastify/types/instance";
import { UnauthorizedError } from "../routes/_errors/unauthorized-error";
import fastifyPlugin from "fastify-plugin";

export const authMiddleware = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook("preHandler", async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const userId = (await request.jwtVerify<{ sub: string }>()).sub;

        return userId;
      } catch {
        throw new UnauthorizedError("Invalid Token.");
      }
    };
  });
});
