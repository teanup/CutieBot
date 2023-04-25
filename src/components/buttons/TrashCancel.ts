import { Button } from "../../structures/Button";

export default new Button({
  customId: "trashcancel",
  run: async ({ client, interaction }) => {
    const embedTrashCancel = await client.getEmbed("texts.components.buttons.trashcancel");
    embedTrashCancel.title = (embedTrashCancel.title as string)
      .replace("${fileName}", interaction.picFileName as string);

    // Edit trash message
    await interaction.update({
      embeds: [embedTrashCancel],
      components: []
    });
  }
});
