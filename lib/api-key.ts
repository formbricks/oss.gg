import "server-only"

import { createHash, randomBytes } from "crypto"

import { db } from "@/lib/db"

import { TApiKey, TApiKeyCreateInput } from "../types/apiKey"

export const getHash = (key: string): string =>
  createHash("sha256").update(key).digest("hex")
export const getApiKey = async (apiKeyId: string): Promise<TApiKey | null> => {
  try {
    const apiKeyData = await db.apiKey.findUnique({
      select: {
        id: true,
        label: true,
        hashedKey: true,
        repositoryId: true,
        createdAt: true,
      },
      where: {
        id: apiKeyId,
      },
    })

    return apiKeyData
  } catch (error) {
    throw error
  }
}
export const getApiKeys = async (
  repositoryId: string,
  page?: number
): Promise<TApiKey[]> => {
  try {
    const apiKeys = await db.apiKey.findMany({
      where: {
        repositoryId,
      },
    })
    return apiKeys
  } catch (error) {
    throw error
  }
}

export const hashApiKey = (key: string): string =>
  createHash("sha256").update(key).digest("hex")

export async function createApiKey(
  repositoryId: string,
  apiKeyData: TApiKeyCreateInput
): Promise<TApiKey> {
  try {
    const key = randomBytes(16).toString("hex")
    const hashedKey = hashApiKey(key)

    const result = await db.apiKey.create({
      data: {
        ...apiKeyData,
        hashedKey,
        repository: { connect: { id: repositoryId } },
      },
    })
    return { ...result, apiKey: key }
  } catch (error) {
    throw error
  }
}

export const deleteApiKey = async (id: string): Promise<TApiKey | null> => {
  try {
    const deletedApiKeyData = await db.apiKey.delete({
      where: {
        id: id,
      },
    })

    return deletedApiKeyData
  } catch (error) {
    throw error
  }
}

export const getApiKeyFromKey = async (
  apiKey: string
): Promise<TApiKey | null> => {
  if (!apiKey) {
    throw new Error("API key required")
  }
  const hashedKey = getHash(apiKey)
  try {
    const apiKeyData = await db.apiKey.findUnique({
      where: {
        hashedKey,
      },
    })

    return apiKeyData
  } catch (error) {
    throw error
  }
}
