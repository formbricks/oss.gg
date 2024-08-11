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
