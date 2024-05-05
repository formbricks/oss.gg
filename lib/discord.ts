import { env } from "@/env.mjs";
// @ts-ignore
import { API } from "@discordjs/core/http-only";
import { REST } from "@discordjs/rest";

const rest = new REST({ version: "10" }).setToken(env.DISCORD_BOT_TOKEN!);
export const discordApi = new API(rest);
