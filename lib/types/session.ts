import { z } from "zod"

import { ZUser } from "./user"

export const ZSession = z.object({
  id: z.string().cuid2(),
  sessionToken: z.string(),
  userId: z.string().cuid2(),
  expires: z.date(),

  user: ZUser.optional(),
})

export type TSession = z.infer<typeof ZSession>
