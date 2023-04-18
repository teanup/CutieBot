import { ApplicationCommandType, APIEmbed } from "discord.js";
import { MessageContextMenuCommand } from "../../structures/MessageContextMenuCommand";
import { Embed } from "discord.js";

export default new MessageContextMenuCommand({
  name: "See embed data",
  type: ApplicationCommandType.Message,
  run: async ({ client, interaction, args }) => {
    const message = args.getMessage("message");

    // No message or no embeds
    if (!message) return;
    if (!message.embeds.length) {
      const embedNone = await client.getText("commands.contextMenus.see-embed-data.no-embed");
      await interaction.reply({ embeds: [embedNone], ephemeral: true });
      return;
    }

    // Get embed data
    const embeds = await Promise.all(message.embeds.map(async (embed, index) => {
      const embedData = embed.toJSON();
      const embedReply = await client.getText("commands.contextMenus.see-embed-data.embed-data");
      // Edit embed
      embedReply.title = embedReply.title
        .replace("${index}", index + 1);
      embedReply.description = embedReply.description
        .replace("${embedData}", JSON.stringify(embedData, null, 2));
        embedReply.author.url = embedReply.author.url
        .replace("${guildId}", message.guildId as string)
        .replace(/\${channelId}/g, message.channelId)
        .replace("${messageId}", message.id)
      return embedReply as APIEmbed;
    }));

    // Send embeds
    await interaction.reply({ embeds: embeds, ephemeral: true });
  }
});
