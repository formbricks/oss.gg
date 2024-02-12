import { z } from 'zod';
import { ZEnrollment } from './enrollment';
import { ZInstallation } from './installation';
import { ZPointTransaction } from './pointTransaction';

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

  pointTransactions: z.array(ZPointTransaction),
  installation: ZInstallation,
  Enrollment: z.array(ZEnrollment),
}).strict();

export type TRepository = z.infer<typeof ZRepository>;