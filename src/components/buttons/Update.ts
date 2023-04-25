import { Button } from "../../structures/Button";

export default new Button({
  customId: "update",
  run: async ({ client, interaction }) => {
    await interaction.deferReply({ ephemeral: true });

    // Check if updatable
    if (!client.picIds.includes(interaction.picMessageId as string)) {
      const embedNoUpdate = await client.getEmbed("texts.components.buttons.update.no-update");
      const originalMessageURL = `https://discord.com/channels/${client.guildId}/${client.picChannelId}/${interaction.picMessageId}`;
      embedNoUpdate.description = (embedNoUpdate.description as string)
        .replace("${originalMessageURL}", originalMessageURL),
      await interaction.editReply({ embeds: [embedNoUpdate] });
      return;
    }

    // Edit message
    const picEmbed = await client.getEmbed(interaction.picMessageId as string, client.picEmbedsDir);
    await interaction.message.edit({ embeds: [picEmbed] });

    // Send confirmation
    const embedUpdated = await client.getEmbed("texts.components.buttons.update.updated");
    embedUpdated.description = (embedUpdated.description as string)
      .replace("${fileName}", interaction.picFileName as string);
    await interaction.editReply({ embeds: [embedUpdated] });
  }
});
