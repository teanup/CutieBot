import { TextChannel } from "discord.js";
import { APIEmbed } from "discord.js";
import { Button } from "../../structures/Button";

export default new Button({
  customId: "trashconfirm",
  run: async ({ client, interaction }) => {
    const originalMessageURL = `https://discord.com/channels/${client.guildId}/${client.picChannelId}/${interaction.picMessageId}`;

    // Check if editable
    if (!client.picIds.includes(interaction.picMessageId as string)) {
      const embedNoEdit = await client.getEmbed("texts.components.buttons.trashconfirm.no-trash");
      (embedNoEdit.title as string) = (embedNoEdit.title as string)
        .replace("${fileName}", interaction.picFileName as string);
      (embedNoEdit.description as string) = (embedNoEdit.description as string)
        .replace("${originalMessageURL}", originalMessageURL),
      await interaction.update({
        embeds: [embedNoEdit],
        components: []
      });
      return;
    }

    // Move embed file
    const embedFileName = `${interaction.picMessageId}.json`;
    await client.moveFile(embedFileName, embedFileName, client.picEmbedsDir, client.picEmbedsTrashDir);
    client.picIds = client.picIds.filter((id) => id !== interaction.picMessageId);
    client.picIdsTrash.push(interaction.picMessageId as string);

    // Edit original message
    const picChannel = client.channels.cache.get(client.picChannelId) as TextChannel;
    const picMessage = await picChannel.messages.fetch(interaction.picMessageId as string);
    const embeds = picMessage.embeds;
    // Fix hidden attachment
    const baseEmbed = embeds.pop()?.toJSON() as APIEmbed;
    baseEmbed.image = { url: `attachment://${interaction.picFileName}` };
    // Add trashed embed
    const embedTrashed = await client.getEmbed("texts.components.buttons.trashconfirm.trashed");
    embedTrashed.title = (embedTrashed.title as string)
      .replace("${fileName}", interaction.picFileName as string);

    const components = await client.getMessageComponents("trashconfirm", `${interaction.picMessageId}:${interaction.picFileName}`);

    await picMessage.edit({
      embeds: [baseEmbed, embedTrashed],
      components
    });

    // Edit trash message
    const embedTrashConfirm = await client.getEmbed("texts.components.buttons.trashconfirm.reply");
    embedTrashConfirm.title = (embedTrashConfirm.title as string)
      .replace("${fileName}", interaction.picFileName as string);
    embedTrashConfirm.description = (embedTrashConfirm.description as string)
      .replace("${originalURL}", originalMessageURL);

    await interaction.update({
      embeds: [embedTrashConfirm],
      components: []
    });
    client.log(`${interaction.user.tag} trashed ${interaction.picFileName} [${interaction.picMessageId}]`, "info");
  }
});
