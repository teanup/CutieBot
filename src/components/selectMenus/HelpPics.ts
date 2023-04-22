import { SelectMenu } from "../../structures/SelectMenu";

export default new SelectMenu({
  customId: "help-pics",
  run: async ({ client, interaction }) => {
    const selected = interaction.values.at(0);

    const embed = await client.getEmbed(`texts.components.selectMenus.helpPics.${selected}`);
    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
});
