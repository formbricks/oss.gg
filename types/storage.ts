import { z } from "zod";

export const ZAccessType = z.enum(["public", "private"]);
export type TAccessType = z.infer<typeof ZAccessType>;

export const ZStorageRetrievalParams = z.object({
  fileName: z.string(),
  //TODO: add cuid validation to the repositoryId
  repositoryId: z.string(),
  accessType: ZAccessType,
});

export const ZUploadFileConfig = z.object({
  allowedFileExtensions: z.array(z.string()).optional(),
  surveyId: z.string().optional(),
});

export type TUploadFileConfig = z.infer<typeof ZUploadFileConfig>;
