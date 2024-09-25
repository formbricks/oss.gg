import { z } from "zod";

export const ZGithubUserData = z
  .object({
    name: z.string(),
    avatar_url: z.string().url(),
    bio: z.string(),
    twitter_username: z.string().optional(),
    html_url: z.string().url(),
  })
  .strict();

export type TGithubUserData = z.infer<typeof ZGithubUserData>;


// Zod schema for ZUserPointsSchema
export const ZUserPointsSchema = z.object({
  installationId: z.number(),
  prAuthorGithubId: z.number(),
  prAuthorUsername: z.string(),
  avatarUrl: z.string(),
  points: z.number(),
  url: z.string(),
  repoId: z.string(),
  comment: z.string(),
});

export type TUserPoints = z.infer<typeof ZUserPointsSchema>;


// Zod schema for PostCommentProps
export const PostComment = z.object({
  installationId: z.number(),
  body: z.string(),
  issueNumber: z.number(),
  repo: z.string(),
  owner: z.string(),
});

export type TPostComment = z.infer<typeof PostComment>;

