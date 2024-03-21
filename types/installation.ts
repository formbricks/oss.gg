import { z } from "zod";

import { ZMembership } from "./membership";

const InstallationTypeEnum = z.enum(["user", "organization"]);

export const ZInstallation = z
  .object({
    id: z.string(),
    githubId: z.number().int(),
    type: InstallationTypeEnum,
    memberships: z.array(ZMembership),
  })
  .strict();
