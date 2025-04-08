import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyJwt from "@fastify/jwt";
import { authWithPassword } from "./routes/auth/auth-with-password/auth-with-password";
import { errorHandler } from "./error-handler";
import { getEnvVariables } from "~/env/get-env-variables";
import { createJobApplication } from "./routes/job-application/create-job-application/create-job-application";
import { createAccount } from "./routes/user/create-account/create-account";
import { getUserProfile } from "./routes/user/get-user-profile/get-user-profile";

const PORT = getEnvVariables().PORT;

const server = fastify().withTypeProvider<ZodTypeProvider>();

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.register(fastifyCors);
server.register(fastifyJwt, { secret: getEnvVariables().JWT_SECRET });

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Job Application Tracker API",
      description: "API for tracking job applications",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});
server.register(fastifySwaggerUi, { routePrefix: "/docs" });

server.register(createAccount);
server.register(authWithPassword);
server.register(getUserProfile);
server.register(createJobApplication);

server.setErrorHandler(errorHandler);

const startServer = async () => {
  try {
    await server.listen({ port: Number(PORT), host: "0.0.0.0" });
    console.log(`Server listening at http://localhost:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

const shutdown = async () => {
  try {
    await server.close();
    console.log("Server closed gracefully");
    process.exit(0);
  } catch (err) {
    console.error("Error during server shutdown", err);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();
