import { getApiKeyFromKey } from "@/lib/apikey"
import { TApiKey } from "@/lib/types/apiKey"

export async function isApiKeyValid(request: Request): Promise<TApiKey | null> {
  const apiKey = request.headers.get("x-api-key")
  if (!apiKey) {
    return null
  }

  const apiKeyData = await getApiKeyFromKey(apiKey)
  if (apiKeyData) {
    return apiKeyData
  } else return null
}
