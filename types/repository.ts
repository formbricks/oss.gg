import { z } from "zod";

import { ZInstallation } from "./installation";
import { ZLevel } from "./level";
import { ZPointTransaction } from "./pointTransaction";

export const ZRepository = z.object({
  id: z.string().cuid2(),
  githubId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  homepage: z.string().url().nullable(),
  topics: z.array(z.string()),
  default_branch: z.string(),
  installationId: z.string().cuid2(),
  levels: z.array(ZLevel),
});

export type TRepository = z.infer<typeof ZRepository>;

export const ZRepositoryCreateInput = z.object({
  githubId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  homepage: z.string().url().optional(),
  topics: z.array(z.string()),
  default_branch: z.string(),
  installationId: z.string().cuid2(),
  levels: z.array(ZLevel).optional(),
});

export type TRepositoryCreateInput = z.infer<typeof ZRepositoryCreateInput>;
