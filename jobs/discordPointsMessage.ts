import { DISCORD_POINTS_MESSAGE_TRIGGER_ID } from "@/lib/constants";
import { discordApi } from "@/lib/discord";
import { triggerDotDevClient } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import z from "zod";

triggerDotDevClient.defineJob({
  id: "discord-points-message",
  name: "Discord award points message",
  version: "0.0.1",
  trigger: eventTrigger({
    name: DISCORD_POINTS_MESSAGE_TRIGGER_ID,
    schema: z.object({
      channelId: z.string(),
      message: z.string(),
    }),
  }),
  run: async (payload, io) => {
    const { channelId, message } = payload;

    await io.runTask(
      "Post awarded message to Discord channel",
      async () => {
        const channelsAPI = discordApi.channels;
        await channelsAPI.createMessage(channelId, { content: message });
      },

      // Add metadata to the task to improve how it displays in the logs
      { name: "Send message", icon: "discord" }
    );
  },
});
