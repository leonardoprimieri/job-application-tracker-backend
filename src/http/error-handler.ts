import type { FastifyInstance } from "fastify";
import { BadRequestError } from "./routes/_errors/bad-request-error";
import { UnauthorizedError } from "./routes/_errors/unauthorized-error";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { NotFoundError } from "./routes/_errors/not-found-error";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.code(400).send({
      errors: error.validation.map((error) => error.params.issue),
      message: "Validation Error",
    });
  }

  if (error instanceof BadRequestError) {
    reply.status(400).send({
      message: error.message,
    });
  }

  if (error instanceof NotFoundError) {
    reply.status(404).send({
      message: error.message,
    });
  }

  if (error instanceof UnauthorizedError) {
    reply.status(401).send({
      message: error.message,
    });
  }

  console.log({ error });

  reply.status(500).send({ message: "Internal server error" });
};
