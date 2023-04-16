import { ExtendedClient } from "../structures/Client";

export default async function loadChannels(client: ExtendedClient): Promise<void> {
  client.log("Loading channels...", "loading");
  const channels = [
    { name: "info", id: process.env.CHANNEL_INFO },
    { name: "welcome", id: process.env.CHANNEL_WELCOME },
    { name: "linking", id: process.env.CHANNEL_LINKING },
    { name: "coord", id: process.env.CHANNEL_COORD },
    { name: "bot", id: process.env.CHANNEL_BOT },
    { name: "moderation", id: process.env.CHANNEL_MODERATION },
    { name: "jail", id: process.env.CHANNEL_JAIL }
  ] as { name: string, id: string }[];

  channels.map(async (channel) => {
    client.gChannels.set(channel.name, channel.id);
  });
  client.log(`Loaded ${channels.length} channels: ${channels.map((channel) => channel.name).join(", ")}`, "success");
}
