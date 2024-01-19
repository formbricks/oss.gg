import { z } from "zod"

import { ZAccount } from "./account"
import { ZMembership } from "./membership"
import { ZPointTransaction } from "./pointTransaction"
import { ZSession } from "./session"

export const ZUser = z.object({
  id: z.string().cuid2(),
  githubId: z.number().int().nonnegative().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  emailVerified: z.date().optional(),
  image: z.string().url().optional(),
  address: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  accounts: z.array(ZAccount),
  sessions: z.array(ZSession),
  pointTransactions: z.array(ZPointTransaction),
  memberships: z.array(ZMembership),
})

export type TUser = z.infer<typeof ZUser>
