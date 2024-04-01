import { z } from "zod";

const MembershipRoleEnum = z.enum(["owner", "member"]);

export const ZMembership = z.object({
  installationId: z.string(),
  userId: z.string(),
  role: MembershipRoleEnum,
});
