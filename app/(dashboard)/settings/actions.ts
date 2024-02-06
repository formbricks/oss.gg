"use server"

import { getServerSession } from "next-auth"

import { TApiKeyCreateInput } from "@/types/apiKey"
import { createApiKey } from "@/lib/api-key"
import { authOptions } from "@/lib/auth"
import { hasUserAccessToRepository } from "@/lib/repository"

export async function createApiKeyAction(
  repositoryId: string,
  apiKeyData: TApiKeyCreateInput
) {
  const session = await getServerSession(authOptions)
  if (!session) return
  const hasUserAccess = await hasUserAccessToRepository(
    session.user.id,
    repositoryId
  )
  if (!hasUserAccess) {
    throw new Error("You do not have access to this repository")
  }
  return await createApiKey(repositoryId, apiKeyData)
}
