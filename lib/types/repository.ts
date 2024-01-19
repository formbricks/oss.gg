import { z } from "zod"

import { ZApiKey } from "./apiKey"

export const ZRepository = z.object({
  id: z.string().cuid2(),
  name: z.string(),
  description: z.string().nullable(),
  isPrivate: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  ownerId: z.string().cuid2(),
  ownerType: z.enum(["ORGANIZATION", "USER"]),
  userId: z.string().cuid2(),
  apiKeys: z.array(ZApiKey),
  // Include other fields if needed
})

export type TRepository = z.infer<typeof ZRepository>

export const ZRepositoryCreateInput = z.object({
  name: z.string(),
  description: z.string().optional(),
  isPrivate: z.boolean().optional(),
  ownerId: z.string().cuid2(),
  ownerType: z.enum(["ORGANIZATION", "USER"]),
  userId: z.string().cuid2(),
  // Include other fields required for creation
})

export type TRepositoryCreateInput = z.infer<typeof ZRepositoryCreateInput>
