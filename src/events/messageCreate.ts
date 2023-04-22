import { client } from "..";
import { Event } from "../structures/Event";
import { PicOptions } from "../bin/SetPic";

async function parsePicOptions(messageContent: string): Promise<PicOptions> {
  const lines = messageContent.split("\n");
  const options: PicOptions = {
    title: "",
    description: "",
    date: "",
    location: ""
  };

  // Parsers for each option, allows loose matching
  const regexParsers = {
    title: /^[Tt][ITLEitle]{1,6}[ :]+/i,
    description: /^[Dd][Ee][SCRIPTIONscription]{0,11}[ :]+/i,
    date: /^[Dd][Aa][TEte]{0,4}[ :]+/i,
    location: /^[Ll][OCATIONocation]{1,9}[ :]+/i
  } as { [key in keyof PicOptions]: RegExp };

  // Parse options
  lines.forEach((line) => {
    for (const [option, regex] of Object.entries(regexParsers)) {
      if (regex.test(line)) {
        const value = line.replace(regex, "");
        options[option as keyof PicOptions] = value;
      }
    }
  });

  return options;
}

export default new Event("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Check if message matches a reply
  const defaultChance = 0.2;
  client.replies.map(async (reply) => await client.autoReply(message, reply, defaultChance));

  // Check if message is a picture upload
  if (message.channelId === client.picChannelId) {
    let hasPics = false;
    message.attachments.map(async (attachment) => {
      if (!attachment.contentType) return;

      const [type, ext] = attachment.contentType.split("/");

      // Filter out non-static images
      if (type !== "image" || !["png", "jpg", "jpeg", "webp"].includes(ext)) return;

      hasPics = true;

      // Set correct file extension
      const name = attachment.name.split(".").slice(0, -1).join(".");
      const fileName = `${name}.${ext}`;
      attachment.name = fileName;

      // Parse options
      const options = await parsePicOptions(message.content);

      try {
        await client.registerPic(attachment.url, fileName, attachment, options);
      } catch (error) {
        console.error(error);
        client.log(`Failed to register picture ${fileName}`, "error");
        const embedError = await client.getEmbed("texts.commands.chatInputs.reg-pic.error");
        embedError.description = (embedError.description as string)
          .replace("${fileName}", fileName)
          .replace("${error}", error as string);
        await message.reply({ embeds: [embedError] });
      }
    });
    // Delete message if message contained pictures
    if (hasPics) {
      await message.delete();
    }
  }
});
