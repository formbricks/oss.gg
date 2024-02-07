import { z } from "zod";

export const ZLevel = z.object({
  name: z.string(),
  pointThreshold: z.string(),
});

export type TLevel = z.infer<typeof ZLevel>;
