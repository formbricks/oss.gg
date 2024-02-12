import { z } from 'zod';

const InstallationTypeEnum = z.enum(['user', 'organization']);

export const ZInstallation = z.object({
  id: z.string(),
  githubId: z.number().int(),
  type: InstallationTypeEnum,
}).strict();
