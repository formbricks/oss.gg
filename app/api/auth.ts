import { TApiKey } from "@/types/apiKey"
import { getApiKeyFromKey } from "@/lib/api-key"

export async function validateApiKey(
  request: Request
): Promise<TApiKey | null> {
  const apiKey = request.headers.get("x-api-key")
  if (!apiKey) {
    return null
  }

  const apiKeyData = await getApiKeyFromKey(apiKey)
  if (apiKeyData) {
    return apiKeyData
  } else return null
}
