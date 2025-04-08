import { ApplicationStatus } from "@prisma/client";
import { z } from "zod";

export const JOB_APPLICATION_SCHEMA = {
  tags: ["job-application"],
  body: z.object({
    companyName: z.string(),
    jobTitle: z.string(),
    jobUrl: z.string().url().optional(),
    notes: z.string().optional(),
    status: z.nativeEnum(ApplicationStatus),
    appliedDate: z.string().nullish(),
  }),
  summary: "Create a Job Application",
  response: {
    201: z.object({
      companyName: z.string(),
      jobTitle: z.string(),
      jobUrl: z.string().url().nullish(),
      notes: z.string().nullish(),
      status: z.nativeEnum(ApplicationStatus),
      appliedDate: z.date().nullish(),
    }),
  },
};
