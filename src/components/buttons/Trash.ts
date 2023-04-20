import { Button } from "../../structures/Button";

export default new Button({
  customId: "trash",
  run: async ({ client, interaction }) => {
    const originalMessageURL = `https://discord.com/channels/${client.guildId}/${client.picChannelId}/${interaction.picMessageId}`;
    const embedTrash = await client.getEmbed("texts.components.buttons.trash");
    embedTrash.title = embedTrash.title
      .replace("${fileName}", interaction.picFileName);
      embedTrash.description = embedTrash.description
      .replace("${originalURL}", originalMessageURL);
    const components = await client.getComponents("trash", `${interaction.picMessageId}:${interaction.picFileName}`);

    // Ask for confirmation
    await interaction.reply({ embeds: [embedTrash], components, ephemeral: true });
  }
});
