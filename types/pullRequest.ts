import { z } from "zod";

const PullRequestStatus = z.enum(["draft", "open", "merged", "closed"]);

export const ZPullRequest = z
  .object({
    title: z.string(),
    href: z.string().url(),
    author: z.string(),
    repositoryFullName: z.string().optional(),
    points: z.number().int().nonnegative().optional().nullable(),
    dateOpened: z.string().datetime(),
    dateMerged: z.string().datetime().nullable(),
    dateClosed: z.string().datetime().nullable(),
    status: PullRequestStatus,
  })
  .strict()
  .refine(
    (data) => {
      if (data.status === "merged") return data.dateMerged !== null;
      if (data.status === "closed") return data.dateClosed !== null;
      if (data.status === "open") return data.dateMerged === null && data.dateClosed === null;
      return true;
    },
    {
      message: "Status must be consistent with date fields",
    }
  );

export type TPullRequest = z.infer<typeof ZPullRequest>;
