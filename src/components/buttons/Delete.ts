import { Button } from "../../structures/Button";

export default new Button({
  customId: "delete",
  run: async ({ client, interaction }) => {
    const embedDelete = await client.getEmbed("texts.components.buttons.delete");
    embedDelete.title = embedDelete.title
      .replace("${fileName}", interaction.picFileName);
    const components = await client.getComponents("delete", `${interaction.picMessageId}:${interaction.picFileName}`);

    // Ask for confirmation
    await interaction.reply({ embeds: [embedDelete], components, ephemeral: true });
  }
});
