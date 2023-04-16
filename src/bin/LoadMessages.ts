import { ExtendedClient } from "../structures/Client";

export default async function loadMessages(client: ExtendedClient): Promise<void> {
  client.log("Loading messages...", "loading");
  const messages = [
    { info: [
        { name: "welcome", id: process.env.MESSAGE_WELCOME },
        { name: "minecraft", id: process.env.MESSAGE_MINECRAFT },
        { name: "pingroles", id: process.env.MESSAGE_PINGROLES }
      ] },
    { welcome: [
        { name: "help", id: process.env.MESSAGE_HELP }
      ] },
    { linking: [
        { name: "linking", id: process.env.MESSAGE_LINKING }
      ] },
    { moderation: [
        { name: "moderation", id: process.env.MESSAGE_MODERATION }
      ] }
  ] as { [key: string]: { name: string, id: string }[] }[];

  messages.map(async (message) => {
    Object.keys(message).map(async (key) => {
      message[key].map(async (msg) => {
        client.gMessages.set(`${client.gChannels.get(key)}-${msg.id}`, msg.name);
      });
    });
  });
  client.log(`Loaded ${messages.length} messages: ${client.gMessages.map((msg) => msg).join(", ")}`, "success");
}
