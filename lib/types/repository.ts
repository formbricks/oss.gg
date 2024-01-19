import { z } from "zod"

import { ZInstallation } from "./installation"
import { ZLevel } from "./level"
import { ZPointTransaction } from "./pointTransaction"

export const ZRepository = z.object({
  id: z.string().cuid2(),
  githubId: z.number().int().nonnegative(),
  name: z.string(),
  description: z.string().optional(),
  homepage: z.string().url().optional(),
  topics: z.array(z.string()),
  default_branch: z.string(),
  installationId: z.string().cuid2(),
  levels: z.array(ZLevel),
  pointTransactions: z.array(ZPointTransaction),
  installation: ZInstallation,
})

export type TRepository = z.infer<typeof ZRepository>

export const ZRepositoryCreateInput = z.object({
  githubId: z.number().int().nonnegative(),
  name: z.string(),
  description: z.string().optional(),
  homepage: z.string().url().optional(),
  topics: z.array(z.string()),
  default_branch: z.string(),
  installationId: z.string().cuid2(),
  levels: z.union([z.array(z.unknown()), z.record(z.unknown())]).optional(),
})

export type TRepositoryCreateInput = z.infer<typeof ZRepositoryCreateInput>
