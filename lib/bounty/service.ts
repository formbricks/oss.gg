import { TREMENDOUS_CAMPAIGN_ID } from "@/lib/constants";
import { db } from "@/lib/db";
import { bountyOrders } from "@/lib/tremendous";
import { validateInputs } from "@/lib/utils/validate";
import {
  TBounty,
  TBountyCreateInput,
  TBountyOrderInput,
  ZBountyCreateInput,
  ZBountyOrderInput,
} from "@/types/bounty";
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
