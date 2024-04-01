import { TriggerClient } from "@trigger.dev/sdk";
import { TRIGGER_API_KEY, TRIGGER_API_URL } from "@/lib/constants";

export const triggerDotDevClient = new TriggerClient({
  id: "testing-bHhV",
  apiKey: TRIGGER_API_KEY,
  apiUrl: TRIGGER_API_URL,
});
