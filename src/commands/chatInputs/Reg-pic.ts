import { ApplicationCommandOptionType } from "discord.js";
import { ChatInputCommand } from "../../structures/ChatInputCommand";

export default new ChatInputCommand({
  name: "reg-pic",
  description: "Register a picture",
  options: [
    {
      name: "picture",
      description: "Picture to register",
      type: ApplicationCommandOptionType.Attachment,
      required: true
    },
    {
      name: "title",
      description: "Title of the picture",
      type: ApplicationCommandOptionType.String,
      required: false
    },
    {
      name: "description",
      description: "Description of the picture",
      type: ApplicationCommandOptionType.String,
      required: false
    },
    {
      name: "date",
      description: "Date of the picture",
      type: ApplicationCommandOptionType.String,
      required: false
    },
    {
      name: "location",
      description: "Location of the picture",
      type: ApplicationCommandOptionType.String,
      required: false
    }
  ],
  run: async ({ client, interaction, args }) => {
    const attachment = args.getAttachment("picture");
    const options = {
      title: args.getString("title") || "",
      description: args.getString("description") || "",
      date: args.getString("date") || "",
      location: args.getString("location") || ""
    }

    await interaction.deferReply({ ephemeral: true });

    if (!attachment) {
      const embedNoPic = await client.getEmbed("texts.commands.chatInputs.reg-pic.no-pic");
      await interaction.editReply({ embeds: [embedNoPic] });
      return;
    }

    // Filter out non-static images
    const [type, ext] = (attachment.contentType || "").split("/");
    if (type !== "image" || !["png", "jpg", "jpeg", "webp"].includes(ext)) {
      const embedBadFormat = await client.getEmbed("texts.commands.chatInputs.reg-pic.bad-format");
      await interaction.editReply({ embeds: [embedBadFormat] });
      return;
    }

    // Set correct file extension
    const name = attachment.name.split(".").slice(0, -1).join(".");
    const fileName = `${name}.${ext}`;
    attachment.name = fileName;

    try {
      const picMsgId = await client.registerPic(attachment.url, fileName, attachment, options);
      const picMessageURL = `https://discord.com/channels/${client.guildId}/${client.picChannelId}/${picMsgId}`;
      const embedSuccess = await client.getEmbed("texts.commands.chatInputs.reg-pic.success");
      embedSuccess.title = (embedSuccess.title as string)
        .replace("${fileName}", fileName);
      embedSuccess.description = (embedSuccess.description as string)
        .replace("${fileName}", fileName)
        .replace("${picMessageURL}", picMessageURL);
      await interaction.editReply({ embeds: [embedSuccess] });
    } catch (error) {
      console.error(error);
      client.log(`Failed to register picture ${fileName}`, "error");
      const embedError = await client.getEmbed("texts.commands.chatInputs.reg-pic.error");
      embedError.description = (embedError.description as string)
        .replace("${fileName}", fileName)
        .replace("${error}", error as string);
      await interaction.editReply({ embeds: [embedError] });
    }
  }
});
