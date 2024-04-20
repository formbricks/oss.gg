import { z } from "zod";

export const ZLevel = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  pointThreshold: z.number(),
  iconUrl: z.string(),
  repositoryId: z.string(),
  permissions: z.object({
    limitIssues: z.boolean(),
    issueLabels: z.array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    ),
    canReportBugs: z.boolean(),
    canHuntBounties: z.boolean(),
  }),
});

export type TLevel = z.infer<typeof ZLevel>;

export const ZFormSchema = z
  .object({
    id: z.string(),
    name: z.string().min(3, {
      message: "level name must be at least 3 characters.",
    }),
    pointThreshold: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
    description: z.string().min(10, {
      message: "description must be at least 10 characters.",
    }),
    iconUrl: z.custom(),

    issueLabels: z.array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    ),
    limitIssues: z.boolean(),
    canReportBugs: z.boolean(),
    canHuntBounties: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.limitIssues && data.issueLabels.length === 0) {
        return false;
      }
      return true;
    },

    {
      message: "At least one issue label is required when limit issues is enabled.",
      path: ["issueLabels"],
    }
  );

export type TFormSchema = z.infer<typeof ZFormSchema>;
