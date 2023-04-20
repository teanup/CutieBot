import { TextChannel } from "discord.js";
import { Button } from "../../structures/Button";

export default new Button({
  customId: "restore",
  run: async ({ client, interaction }) => {
    // Move embed file
    const embedFileName = `${interaction.picMessageId}.json`;
    await client.moveFile(embedFileName, embedFileName, client.picEmbedsTrashDir, client.picEmbedsDir);

    // Edit original message
    const picChannel = client.channels.cache.get(client.picChannelId) as TextChannel;
    const picMessage = await picChannel.messages.fetch(interaction.picMessageId as string);
    const embeds = picMessage.embeds;
    embeds.pop();

    const components = await client.getComponents("picture", `${interaction.picMessageId}:${interaction.picFileName}`);

    await picMessage.edit({ embeds, components });

    // Reply to interaction
    const embedRestored = await client.getEmbed("texts.components.buttons.restored");
    embedRestored.title = embedRestored.title
      .replace("${fileName}", interaction.picFileName);

    await interaction.reply({ embeds: [embedRestored], ephemeral: true });
  }
});
