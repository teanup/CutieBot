import { ApplicationCommandOptionType } from "discord.js";
import { ChatInputCommand } from "../../structures/ChatInputCommand";

export default new ChatInputCommand({
  name: "cute-pic",
  description: "Sends a random cute picture",
  options: [
    {
      name: "pic",
      description: "Request a specific picture (by file name)",
      type: ApplicationCommandOptionType.String,
      minLength: 1,
      required: false
    }
  ],
  run: async ({ client, interaction, args }) => {
    let picMsgId = "";
    let appendInfo = "";

    // Check if pic is specified
    const pic = args.getString("pic");
    if (pic) {
      // Check if pic exists
      const foundMsgId = client.picFileNames.findKey((fileName, picId) => (fileName === pic && client.picIds.includes(picId)));
      if (foundMsgId) {
        picMsgId = foundMsgId;
        appendInfo = `${picMsgId}:${pic}`;
      } else {
        const embedNoPic = await client.getEmbed("texts.commands.chatInputs.cute-pic.no-pic");
        (embedNoPic.title as string) = (embedNoPic.title as string)
          .replace("${fileName}", pic);
        await interaction.reply({
          embeds: [embedNoPic],
          ephemeral: true
        });
        return;
      }
    } else {
      // Pick random file
      picMsgId = client.picIds[Math.floor(Math.random() * client.picIds.length)];
      appendInfo = `${picMsgId}:${client.picFileNames.get(picMsgId)}`;
    }

    const picEmbed = await client.getEmbed(picMsgId, `${client.picEmbedsDir}`);

    // Send embed
    const components = await client.getMessageComponents("picture", appendInfo);
    await interaction.reply({
      embeds: [picEmbed],
      components
    });
  }
});
