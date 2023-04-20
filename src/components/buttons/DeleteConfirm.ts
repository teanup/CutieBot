import { TextChannel } from "discord.js";
import { Button } from "../../structures/Button";

export default new Button({
  customId: "deleteconfirm",
  run: async ({ client, interaction }) => {
    // Delete original message
    const picChannel = client.channels.cache.get(client.picChannelId) as TextChannel;
    const picMessage = await picChannel.messages.fetch(interaction.picMessageId as string);
    await picMessage.delete();

    // Delete embed file
    await client.deleteFile(`${interaction.picMessageId}.json`, client.picEmbedsTrashDir);
    client.picIdsTrash = client.picIdsTrash.filter((id) => id !== interaction.picMessageId);
    client.picFileNames.delete(interaction.picMessageId as string);

    const embedDelete = await client.getEmbed("texts.components.buttons.deleteconfirm");
    embedDelete.title = (embedDelete.title as string)
      .replace("${fileName}", interaction.picFileName as string);

    // Reply to interaction
    await interaction.update({
      embeds: [embedDelete],
      components: []
    });
  }
});
