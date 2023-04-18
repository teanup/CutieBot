import { client } from "..";
import { Event } from "../structures/Event";

export default new Event("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Check if message matches a reply
  const defaultChance = 0.2;
  client.replies.map(async (reply) => await client.autoReply(message, reply, defaultChance));

  // Check if message is a picture upload
  if (message.channelId === client.picChannelId) {
    message.attachments.map(async (attachment) => {
      if (!attachment.contentType) return;

      const [type, ext] = attachment.contentType.split("/");

      if (type !== "image") return;

      const name = attachment.name.split(".").slice(0, -1).join(".");
      await client.registerPic(message, attachment.url, `${name}.${ext}`);
    });
  }
});
