import type { FastifyInstance } from "fastify/types/instance";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { AUTH_WITH_GITHUB_SCHEMA } from "./auth-with-github-schema";
import axios from "axios";
import { prisma } from "~/lib/prisma";
import { createGithubAuthUrl } from "./helpers/create-github-auth-url";
import { UnauthorizedError } from "../../_errors/unauthorized-error";
import { BadRequestError } from "../../_errors/bad-request-error";

export async function authWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/sessions/github",
    {
      schema: AUTH_WITH_GITHUB_SCHEMA,
    },
    async (request, reply) => {
      const { code } = request.body;

      const githubUrl = createGithubAuthUrl(code);

      const githubAccessToken = await axios<{
        access_token: string;
      }>({
        url: githubUrl,
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });

      const githubUserData = await axios<{
        email: string;
        id: string;
        name: string;
        avatar_url: string;
      }>({
        url: "https://api.github.com/user",
        headers: {
          Authorization: `Bearer ${githubAccessToken?.data?.access_token}`,
        },
      });

      if (!githubUserData?.data?.email) {
        throw new BadRequestError(
          "Your github account must have an email to authenticate."
        );
      }

      const alreadyRegisteredUser = await prisma.user.findUnique({
        where: { email: githubUserData?.data.email },
      });

      if (alreadyRegisteredUser) {
        const token = await reply.jwtSign(
          {
            sub: alreadyRegisteredUser.id,
          },
          {
            sign: {
              expiresIn: "7d",
            },
          }
        );

        return reply.status(201).send({ token });
      }

      const newUser = await prisma.user.create({
        data: {
          email: githubUserData?.data.email,
          avatarUrl: githubUserData?.data?.avatar_url,
          firstName: githubUserData?.data?.name,
        },
      });

      await prisma.account.create({
        data: {
          provider: "GITHUB",
          providerAccountId: githubUserData?.data?.id.toString(),
          userId: newUser.id,
        },
      });

      const token = await reply.jwtSign(
        {
          sub: newUser.id,
        },
        {
          sign: {
            expiresIn: "7d",
          },
        }
      );

      return reply.status(201).send({ token });
    }
  );
}
