import { Button } from "../../structures/Button";

export default new Button({
  customId: "deletecancel",
  run: async ({ client, interaction }) => {
    const embedDeleteCancel = await client.getEmbed("texts.components.buttons.deletecancel");
    embedDeleteCancel.title = embedDeleteCancel.title
      .replace("${fileName}", interaction.picFileName);

    // Edit delete message
    await interaction.update({ embeds: [embedDeleteCancel], components: [] });
  }
});
