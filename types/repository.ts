import { z } from 'zod';

export const ZRepository = z.object({
  id: z.string(),
  githubId: z.number().int(),
  name: z.string(),
  description: z.string().optional(), 
  homepage: z.string().optional(),
  topics: z.array(z.string()), 
  default_branch: z.string().optional(), 
  installationId: z.string(),
  configured: z.boolean().default(false),
  levels: z.any(), 

  pointTransactions: z.array(z.any()), // Placeholder, define `PointTransaction` schema separately
  installation: z.any(), // Placeholder, define `Installation` schema separately
  Enrollment: z.array(z.any()), // Placeholder, define `Enrollment` schema separately
}).strict();

export type TRepository = z.infer<typeof ZRepository>;