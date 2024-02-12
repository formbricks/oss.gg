import { z } from 'zod';

export const ZPointTransaction = z.object({
  id: z.string(),
  points: z.number().int(),
  description: z.string(),
  url: z.string().optional(),
  userId: z.string(),
  repositoryId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
 }).strict();