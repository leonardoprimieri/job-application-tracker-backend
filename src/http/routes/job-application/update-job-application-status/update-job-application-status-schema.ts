import { ApplicationStatus } from "@prisma/client";
import { z } from "zod";

export const UPDATE_JOB_APPLICATION_STATUS_SCHEMA = {
  tags: ["job-applications"],
  summary: "Update Job Application Status",
  security: [{ bearerAuth: [] }],
  params: z.object({
    jobApplicationId: z.string().uuid(),
  }),
  body: z.object({
    status: z.nativeEnum(ApplicationStatus),
  }),
};
