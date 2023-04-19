import { Button } from "../../structures/Button";

export default new Button({
  customId: "delete",
  run: async ({ client, interaction }) => {
    const originalMessageURL = `https://discord.com/channels/${client.guildId}/${client.picChannelId}/${interaction.picMessageId}`;
    const embedDelete = await client.getEmbed("texts.components.buttons.delete");
    embedDelete.title = embedDelete.title
      .replace("${fileName}", interaction.picFileName);
    embedDelete.description = embedDelete.description
      .replace("${originalURL}", originalMessageURL)
    const components = await client.getComponents("delete", interaction.picMessageId);

    // Ask for confirmation
    await interaction.reply({ embeds: [embedDelete], components, ephemeral: true });
  }
});
