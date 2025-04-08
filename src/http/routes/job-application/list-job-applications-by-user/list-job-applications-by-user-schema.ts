import { ApplicationStatus } from "@prisma/client";
import { z } from "zod";

export const LIST_JOB_APPLICATIONS_BY_USER_SCHEMA = {
  summary: "List All User Job Applications",
  tags: ["job-applications"],
  response: {
    200: z.array(
      z.object({
        id: z.string().uuid(),
        companyName: z.string(),
        jobTitle: z.string(),
        jobUrl: z.string().url().nullish(),
        status: z.nativeEnum(ApplicationStatus),
        appliedDate: z.date().nullish(),
        notes: z.string().nullish(),
      })
    ),
  },
};
