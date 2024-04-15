import { z } from "zod";

export const ZPointTransaction = z
  .object({
    id: z.string(),
    points: z.number().int(),
    description: z.string(),
    url: z.union([z.string(), z.null()]).optional(),
    userId: z.string(),
    repositoryId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type TPointTransaction = z.infer<typeof ZPointTransaction>;

export const ZPointTransactionWithUser = z.object({
  name: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  login: z.string(),
  points: z.number().int(),
  userId: z.string(),
});

export type TPointTransactionWithUser = z.infer<typeof ZPointTransactionWithUser>;
