import { discordApi } from "@/lib/discord";
import { logger, task } from "@trigger.dev/sdk/v3";

export const discordPointMessageTask = task({
  id: "discord-points-message",
  run: async (payload: { channelId: string; message: string }) => {
    const { channelId, message } = payload;
    logger.info("Post awarded message to Discord channel");

    const channelsAPI = discordApi.channels;
    await channelsAPI.createMessage(channelId, { content: message });
  },
});
