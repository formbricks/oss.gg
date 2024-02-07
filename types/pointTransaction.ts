import { z } from "zod";

import { ZRepository } from "./repository";
import { ZUser } from "./user";

export const ZPointTransaction = z.object({
  id: z.string().cuid2(),
  points: z.number().int(),
  description: z.string(),
  url: z.string().url().optional(),
  userId: z.string().cuid2(),
  repositoryId: z.string().cuid2(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: ZUser,
  repository: ZRepository,
});

export type TPointTransaction = z.infer<typeof ZPointTransaction>;
