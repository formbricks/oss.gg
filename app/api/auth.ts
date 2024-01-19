import { getApiKeyFromKey } from "@/lib/apikey"

export async function isApiKeyValid(request: Request): Promise<boolean> {
  const apiKey = request.headers.get("x-api-key")
  if (!apiKey) {
    return false
  }

  const apiKeyData = await getApiKeyFromKey(apiKey)
  return Boolean(apiKeyData)
}
