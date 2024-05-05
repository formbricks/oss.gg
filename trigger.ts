import { TRIGGER_API_KEY, TRIGGER_API_URL } from "@/lib/constants";
import { TriggerClient } from "@trigger.dev/sdk";

export const triggerDotDevClient = new TriggerClient({
  id: "oss-gg-dev-ND8k",
  apiKey: TRIGGER_API_KEY,
  apiUrl: TRIGGER_API_URL,
});
