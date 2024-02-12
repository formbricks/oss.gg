import { z } from 'zod';

export const ZGithubUserSchema = z.object({
  login: z.string(),
});

export const ZGithubPrIssueSchema = z.object({
  html_url: z.string(),
  title: z.string(),
  user: ZGithubUserSchema,
  id: z.number(),
  state: z.string().optional(), // Optional because it might not be present in all mappings
  draft: z.boolean().optional(), // Optional because it might not be present in all mappings
});

export const ZGithubApiResponseSchema = z.object({
  items: z.array(ZGithubPrIssueSchema),
});

export const ZMappedDataSchema = z.object({
  logoHref: z.string(),
  href: z.string(),
  title: z.string(),
  author: z.string(),
  key: z.string(),
  state: z.string().optional(), // Optional because it might not be present in all mappings
  draft: z.boolean().optional(), // Optional because it might not be present in all mappings
  isIssue: z.boolean(),
});

export type TGithubApiResponse = z.infer<typeof ZGithubApiResponseSchema>;
export type TMappedData = z.infer<typeof ZMappedDataSchema>;
