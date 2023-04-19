import { Button } from "../../structures/Button";

export default new Button({
  customId: "delete",
  run: async ({ client, interaction }) => {
    // TODO: implement
    await interaction.reply({ content: interaction.picMessageId, ephemeral: true})
  }
});
