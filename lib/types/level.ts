import { z } from "zod"

export const ZLevel = z.object({
  id: z.string().cuid2(),
  name: z.string(),
  pointThreshold: z.string(), // Assuming pointThreshold is stored as a string
  repositoryId: z.string().cuid2(),
})

export type TLevel = z.infer<typeof ZLevel>
