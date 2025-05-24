import { ApplicationStatus } from "@prisma/client";
import { z } from "zod";

export const JOB_APPLICATION_SCHEMA = {
  tags: ["job-applications"],
  security: [{ bearerAuth: [] }],
  body: z.object({
    companyName: z.string(),
    title: z.string(),
    url: z.string().url().optional(),
    notes: z.string().optional(),
    status: z.nativeEnum(ApplicationStatus),
    appliedDate: z.string().nullish(),
    salaryRange: z.string().nullish(),
  }),
  summary: "Create a Job Application",
  response: {
    201: z.object({
      companyName: z.string(),
      title: z.string(),
      url: z.string().url().nullish(),
      notes: z.string().nullish(),
      status: z.nativeEnum(ApplicationStatus),
      appliedDate: z.date().nullish(),
      salaryRange: z.string().nullish(),
    }),
  },
};
