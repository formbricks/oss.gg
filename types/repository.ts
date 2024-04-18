import { z } from "zod";

import { ZEnrollment } from "./enrollment";
import { ZInstallation } from "./installation";
import { ZPointTransaction } from "./pointTransaction";

export const ZRepository = z
  .object({
    id: z.string(),
    githubId: z.number().int(),
    name: z.string(),
    description: z.union([z.string(), z.null()]).optional(),
    homepage: z.union([z.string(), z.null()]).optional(),
    topics: z.array(z.string()),
    default_branch: z.string().nullable().optional(),
    installationId: z.string(),
    configured: z.boolean().default(false),
    logoUrl: z.union([z.string(), z.null()]).optional(),
    projectDescription: z.union([z.string(), z.null()]).optional(),
    levels: z.any(),
    pointTransactions: z.array(ZPointTransaction).optional(),
    installation: ZInstallation.optional(),
    enrollments: z.array(ZEnrollment).optional(),
  })
  .strict();

export type TRepository = z.infer<typeof ZRepository>;
