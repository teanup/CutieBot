import { TextChannel } from "discord.js";
import { Button } from "../../structures/Button";

export default new Button({
  customId: "trashconfirm",
  run: async ({ client, interaction }) => {
    // Move embed file
    const embedFileName = `${interaction.picMessageId}.json`;
    await client.moveFile(embedFileName, embedFileName, client.picEmbedsDir, client.picEmbedsTrashDir);

    // Edit original message
    const picChannel = client.channels.cache.get(client.picChannelId) as TextChannel;
    const picMessage = await picChannel.messages.fetch(interaction.picMessageId as string);
    const embeds = picMessage.embeds;
    const embedTrashed = await client.getEmbed("texts.components.buttons.trashconfirm.trashed");
    embedTrashed.title = embedTrashed.title
      .replace("${fileName}", interaction.picFileName);
    embeds.push(embedTrashed);

    const components = await client.getComponents("trashconfirm", `${interaction.picMessageId}:${interaction.picFileName}`);

    await picMessage.edit({ embeds, components });

    // Edit trash message
    const originalMessageURL = `https://discord.com/channels/${client.guildId}/${client.picChannelId}/${interaction.picMessageId}`;
    const embedTrashConfirm = await client.getEmbed("texts.components.buttons.trashconfirm.reply");
    embedTrashConfirm.title = embedTrashConfirm.title
      .replace("${fileName}", interaction.picFileName);
    embedTrashConfirm.description = embedTrashConfirm.description
      .replace("${originalURL}", originalMessageURL);

    await interaction.update({ embeds: [embedTrashConfirm], components: [] });
  }
});
