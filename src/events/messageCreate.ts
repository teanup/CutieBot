import { client } from "..";
import { Event } from "../structures/Event";
import { RegisterPicOptions } from "../bin/RegisterPic";

async function parsePicOptions(messageContent: string): Promise<RegisterPicOptions> {
  const options: RegisterPicOptions = {
    title: "",
    description: "",
    date: "",
    location: ""
  };

  return options;
}

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

      // Filter out non-static images
      if (type !== "image" || !["png", "jpg", "jpeg", "webp"].includes(ext)) return;

      const name = attachment.name.split(".").slice(0, -1).join(".");
      const fileName = `${name}.${ext}`;

      // Parse options
      const options = await parsePicOptions(message.content);

      try {
        await client.registerPic(attachment.url, fileName, attachment, options);
      } catch (error) {
        console.error(error);
        client.log(`Failed to register picture ${fileName}`, "error");
        const embedError = await client.getEmbed("texts.events.messageCreate.registerPic.error");
        embedError.description = embedError.description
          .replace("${fileName}", fileName);
        await message.channel.send({ embeds: [embedError] });
      }

      // Delete message
      await message.delete();
    });
  }
});
