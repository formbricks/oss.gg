import { z } from "zod"

import { ZMembership } from "./membership"
import { ZRepository } from "./repository"

const InstallationTypeEnum = z.enum(["TYPE1", "TYPE2"])

export const ZInstallation = z.object({
  id: z.string().cuid2(),
  githubId: z.number().int().nonnegative(),
  type: InstallationTypeEnum,
  memberships: z.array(ZMembership),
  repositories: z.array(ZRepository),
})

export type TInstallation = z.infer<typeof ZInstallation>
