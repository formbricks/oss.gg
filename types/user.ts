import z from "zod";

export const ZUser = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  githubId: z.number(),
  login: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
});

export type TUser = z.infer<typeof ZUser>;

export const ZUserUpdateInput = z.object({
  name: z.string().nullish(),
  email: z.string().nullish(),
});

export type TUserUpdateInput = z.infer<typeof ZUserUpdateInput>;

const roleEnum = z.enum(["user", "admin"]);

export const ZUserCreateInput = z.object({
  githubId: z.number(),
  login: z.string(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  avatarUrl: z.string().url().nullish(),
  role: roleEnum.default("user").nullish(),
});

export type TUserCreateInput = z.infer<typeof ZUserCreateInput>;
