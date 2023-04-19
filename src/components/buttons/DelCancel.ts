import { Button } from "../../structures/Button";

export default new Button({
  customId: "delcancel",
  run: async ({ client, interaction }) => {
    const embedDelCancel = await client.getEmbed("texts.components.buttons.delcancel");
    embedDelCancel.title = embedDelCancel.title
      .replace("${fileName}", interaction.picFileName);

    // Edit original message
    await interaction.update({ embeds: [embedDelCancel], components: [] });
  }
});
