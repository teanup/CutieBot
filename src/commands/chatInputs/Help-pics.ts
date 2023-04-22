import { ChatInputCommand } from "../../structures/ChatInputCommand";

export default new ChatInputCommand({
  name: "help-pics",
  description: "Get help with the cute pics features",
  run: async ({ client, interaction }) => {
    const embedHelp = await client.getEmbed("texts.commands.chatInputs.help-pics");
    const components = await client.getMessageComponents("help-pics");

    await interaction.reply({
      embeds: [embedHelp],
      components,
      ephemeral: true
    });
  }
});
