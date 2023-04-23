import { SelectMenu } from "../../structures/SelectMenu";

export default new SelectMenu({
  customId: "help-pics",
  run: async ({ client, interaction }) => {
    const selected = interaction.values.at(0);

    const embed = await client.getEmbed(`texts.components.selectMenus.helpPics.${selected}`);
    if (embed.description) {
      embed.description = embed.description
        .replace(/\${picChannelId}/g, client.picChannelId);
    }
    if (embed.fields) {
      embed.fields.forEach(field => {
        if (field.value) {
          field.value = field.value
            .replace(/\${picChannelId}/g, client.picChannelId);
        }
      });
    }
    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
});
