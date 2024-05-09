import { USD_CURRENCY_CODE } from "@/lib/constants";
import { CurrencyCodes, DeliveryMethod } from "tremendous";
import { z } from "zod";

export const ZBounty = z.object({
  id: z.string(),
  usdAmount: z.number(),
  status: z.enum(["open", "redeemed"]),
  issueUrl: z.string(),
  orderId: z.string(),
  rewardId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  repositoryId: z.string(),
});

export type TBounty = z.infer<typeof ZBounty>;

export const ZBountyCreateInput = ZBounty.pick({
  usdAmount: true,
  issueUrl: true,
  status: true,
  orderId: true,
  rewardId: true,
  userId: true,
  repositoryId: true,
});

export type TBountyCreateInput = z.infer<typeof ZBountyCreateInput>;

export const ZBountyOrderInput = z.object({
  fundingSource: z.string().optional().default("BALANCE"),
  amount: z.number().min(1),
  currencyCode: z.nativeEnum(CurrencyCodes).default(USD_CURRENCY_CODE),
  deliveryMethod: z.nativeEnum(DeliveryMethod).default("EMAIL"),
  recipientName: z.string(),
  recipientEmail: z.coerce.string().email().min(5),
});

export type TBountyOrderInput = z.infer<typeof ZBountyOrderInput>;

export const ZBountySettingsInput = z.object({
  repositoryId: z.string(),
  maxBounty: z.number().min(1),
  maxAutomaticPayout: z.number().min(1),
});

export type TBountySettingsInput = z.infer<typeof ZBountySettingsInput>;
