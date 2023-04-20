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

    if (!attachment) {
      const embedNoPic = await client.getEmbed("texts.commands.chatInputs.reg-pic.no-pic");
      await interaction.reply({
        embeds: [embedNoPic],
        ephemeral: true
      });
      return;
    }

    // Filter out non-static images
    const [type, ext] = (attachment.contentType || "").split("/");
    if (type !== "image" || !["png", "jpg", "jpeg", "webp"].includes(ext)) {
      const embedBadFormat = await client.getEmbed("texts.commands.chatInputs.reg-pic.bad-format");
      await interaction.reply({ embeds: [embedBadFormat], ephemeral: true });
      return;
    }

    // Set correct file extension
    const name = attachment.name.split(".").slice(0, -1).join(".");
    const fileName = `${name}.${ext}`;

    try {
      await client.registerPic(attachment.url, fileName, attachment, options);
    } catch (error) {
      console.error(error);
      client.log(`Failed to register picture ${fileName}`, "error");
      const embedError = await client.getEmbed("texts.events.messageCreate.registerPic.error");
      embedError.description = (embedError.description as string)
        .replace("${fileName}", fileName);
      await interaction.reply({ embeds: [embedError] });
    }
  }
});
