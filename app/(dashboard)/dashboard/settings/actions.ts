"use server"

import { getServerSession } from "next-auth"

import { createApiKey } from "@/lib/apikey"
import { authOptions } from "@/lib/auth"
import { TApiKeyCreateInput } from "@/lib/types/apiKey"

export async function createApiKeyAction(
  accountId: string,
  apiKeyData: TApiKeyCreateInput
) {
  const session = await getServerSession(authOptions)
  if (!session) return

  return await createApiKey(accountId, apiKeyData)
}
