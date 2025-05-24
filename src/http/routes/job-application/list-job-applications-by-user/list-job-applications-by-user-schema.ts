import { ApplicationStatus } from "@prisma/client";
import { z } from "zod";

export const LIST_JOB_APPLICATIONS_BY_USER_SCHEMA = {
  summary: "List All User Job Applications",
  tags: ["job-applications"],
  security: [{ bearerAuth: [] }],
  response: {
    200: z.array(
      z.object({
        id: z.string().uuid(),
        companyName: z.string(),
        title: z.string(),
        url: z.string().url().nullish(),
        status: z.nativeEnum(ApplicationStatus),
        appliedDate: z.date().nullish(),
        notes: z.string().nullish(),
        salaryRange: z.string().nullish(),
      })
    ),
  },
};
