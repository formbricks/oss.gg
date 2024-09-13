import { TRIGGER_API_KEY } from "@/lib/constants";
import { TriggerClient } from "@trigger.dev/sdk";

export const triggerDotDevClient = new TriggerClient({
  id: "test-989w",
  apiKey: TRIGGER_API_KEY,
});
