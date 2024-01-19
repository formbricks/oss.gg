"use server"

import { getServerSession } from "next-auth"

import { createApiKey } from "@/lib/apikey"
import { authOptions } from "@/lib/auth"
import { userHasAccessToRepository } from "@/lib/repository"
import { TApiKeyCreateInput } from "@/lib/types/apiKey"

export async function createApiKeyAction(
  repositoryId: string,
  apiKeyData: TApiKeyCreateInput
) {
  const session = await getServerSession(authOptions)
  if (!session) return
  if (!userHasAccessToRepository) return
  return await createApiKey(repositoryId, apiKeyData)
}
