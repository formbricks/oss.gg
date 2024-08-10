import { z } from "zod";

const ContributionStatus = z.enum(["open", "merged", "closed"]);

export const ZContribution = z
  .object({
    title: z.string(),
    href: z.string().url(),
    author: z.string(),
    points: z.number().int().nonnegative(),
    dateOpened: z.string().datetime(),
    dateMerged: z.string().datetime().nullable(),
    dateClosed: z.string().datetime().nullable(),
    status: ContributionStatus,
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

export type TContribution = z.infer<typeof ZContribution>;
