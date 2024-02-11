import { z } from 'zod';

export const ZEnrollment = z.object({
  id: z.string().optional(),
  userId: z.string(),
  repositoryId: z.string(),
  enrolledAt: z.date().optional(),
});

export type TEnrollment = z.infer<typeof ZEnrollment>;

export const ZEnrollmentInput = z.object({
  userId: z.string(),
  repositoryId: z.string(),
});

export type TEnrollmentInput = z.infer<typeof ZEnrollmentInput>;