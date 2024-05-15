"use server";

import { bountySettingsCache } from "@/lib/bounty/cache";
import { DEFAULT_CACHE_REVALIDATION_INTERVAL, TREMENDOUS_CAMPAIGN_ID } from "@/lib/constants";
import { db } from "@/lib/db";
import { bountyOrders } from "@/lib/tremendous";
import { validateInputs } from "@/lib/utils/validate";
import {
  TBounty,
  TBountyCreateInput,
  TBountyOrderInput,
  TBountySettingsInput,
  ZBountyCreateInput,
  ZBountyOrderInput,
  ZBountySettingsInput,
} from "@/types/bounty";
import { unstable_cache } from "next/cache";
import { CreateOrderRequest } from "tremendous";

export const checkIfBountyExists = async (issueUrl: TBounty["issueUrl"]) => {
  try {
    const alreadyCreatedBounty = await db.bounty.findFirst({
      where: {
        issueUrl,
      },
    });
    return alreadyCreatedBounty;
  } catch (error) {
    throw error;
  }
};

export const storeBounty = async (bountyData: TBountyCreateInput) => {
  try {
    validateInputs([bountyData, ZBountyCreateInput]);

    const newlyCreatedBounty = await db.bounty.create({
      data: {
        issueUrl: bountyData.issueUrl,
        usdAmount: bountyData.usdAmount,
        status: bountyData.status,
        orderId: bountyData.orderId,
        rewardId: bountyData.rewardId,
        userId: bountyData.userId,
        repositoryId: bountyData.repositoryId,
      },
    });
    return newlyCreatedBounty;
  } catch (error) {
    throw error;
  }
};

export const updateBountyStatus = async (id: TBounty["id"], status: TBounty["status"]) => {
  try {
    const bounty = await db.bounty.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
    return bounty;
  } catch (error) {
    throw error;
  }
};

export const dispatchBountyOrder = async (orderData: TBountyOrderInput) => {
  try {
    validateInputs([orderData, ZBountyOrderInput]);

    const params: CreateOrderRequest = {
      payment: {
        funding_source_id: orderData.fundingSource,
      },
      reward: {
        value: {
          denomination: orderData.amount,
          currency_code: orderData.currencyCode,
        },
        campaign_id: TREMENDOUS_CAMPAIGN_ID,
        delivery: {
          method: orderData.deliveryMethod,
        },
        recipient: {
          name: orderData.recipientName,
          email: orderData.recipientEmail,
        },
      },
    };

    const { data } = await bountyOrders.createOrder(params);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getBountySettingsByRepositoryId = (repositoryId: string) =>
  unstable_cache(
    async () => {
      try {
        const bountySettings = await db.repository.findFirst({
          where: {
            id: repositoryId,
          },
          select: { maxBounty: true, maxAutomaticPayout: true },
        });
        return bountySettings;
      } catch (error) {
        throw error;
      }
    },
    [`getBountySettingsByRepositoryId-${repositoryId}`],
    {
      tags: [bountySettingsCache.tag.byRepositoryId(repositoryId)],
      revalidate: DEFAULT_CACHE_REVALIDATION_INTERVAL,
    }
  );

export const updateBountySettings = async (bountySettingsData: TBountySettingsInput) => {
  try {
    validateInputs([bountySettingsData, ZBountySettingsInput]);
    const { repositoryId, maxBounty, maxAutomaticPayout } = bountySettingsData;

    await db.repository.update({
      where: {
        id: repositoryId,
      },
      data: {
        maxBounty,
        maxAutomaticPayout,
      },
    });
    bountySettingsCache.revalidate({ repositoryId });
  } catch (error) {
    throw error;
  }
};
