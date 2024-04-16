import { z } from "zod";

export const ZEnrollment = z.object({
  id: z.string().optional(),
  userId: z.string(),
  repositoryId: z.string(),
  enrolledAt: z.date().optional(),
});

export type TEnrollment = z.infer<typeof ZEnrollment>;

export const ZLevelInput = z.object({
  name: z.string(),
  description: z.string(),
  pointThreshold: z.number(),
  icon: z.string(),
  repositoryId: z.string(),
  permissions: z.object({
    canWorkOnIssues: z.boolean(),
    issueLabels: z.array(z.string()),
    canWorkOnBugs: z.boolean(),
    canHuntBounties: z.boolean(),
  }),
  tags: z.array(z.string()),
});

export type TLevelInput = z.infer<typeof ZLevelInput>;

