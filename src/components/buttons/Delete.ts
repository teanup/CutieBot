import { Button } from "../../structures/Button";

export default new Button({
  customId: "delete",
  run: async ({ client, interaction }) => {
    const embedDelete = await client.getEmbed("texts.components.buttons.delete");
    embedDelete.title = (embedDelete.title as string)
      .replace("${fileName}", interaction.picFileName as string);
    const components = await client.getMessageComponents("delete", `${interaction.picMessageId}:${interaction.picFileName}`);

    // Ask for confirmation
    await interaction.reply({ embeds: [embedDelete], components, ephemeral: true });
  }
});
