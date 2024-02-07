import { z } from "zod";

import { ZInstallation } from "./installation";
import { ZUser } from "./user";

const MembershipRoleEnum = z.enum(["owner", "member"]);

export const ZMembership = z.object({
  installationId: z.string().cuid2(),
  userId: z.string().cuid2(),
  role: MembershipRoleEnum,
  installation: ZInstallation,
  user: ZUser,
});

export type TMembership = z.infer<typeof ZMembership>;
