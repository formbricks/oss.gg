import { z } from "zod";

export const ZGithubUserSchema = z.object({
  login: z.string(),
});

export const ZGithubLabelSchema = z.object({
  id: z.number(),
  node_id: z.string(),
  url: z.string(),
  name: z.string(),
  color: z.string(),
  default: z.boolean(),
  description: z.string().nullable(),
});

export const ZGithubPrIssueSchema = z.object({
  html_url: z.string(),
  title: z.string(),
  user: ZGithubUserSchema,
  id: z.number(),
  labels: z.array(ZGithubLabelSchema),
  state: z.string().optional(),
  draft: z.boolean().optional(),
  assignee: ZGithubUserSchema.optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  closed_at: z.string().optional().nullable(),
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
  state: z.string().optional(),
  draft: z.boolean().optional(),
  isIssue: z.boolean(),
  assignee: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  closedAt: z.string().optional().nullable(),
});

export type TGithubApiResponse = z.infer<typeof ZGithubApiResponseSchema>;
export type TMappedData = z.infer<typeof ZMappedDataSchema>;
