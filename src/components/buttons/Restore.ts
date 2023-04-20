import { APIEmbed, TextChannel } from "discord.js";
import { Button } from "../../structures/Button";

export default new Button({
  customId: "restore",
  run: async ({ client, interaction }) => {
    // Move embed file
    const embedFileName = `${interaction.picMessageId}.json`;
    await client.moveFile(embedFileName, embedFileName, client.picEmbedsTrashDir, client.picEmbedsDir);
    client.picIdsTrash = client.picIdsTrash.filter((id) => id !== interaction.picMessageId);
    client.picIds.push(interaction.picMessageId as string);

    // Edit original message
    const picChannel = client.channels.cache.get(client.picChannelId) as TextChannel;
    const picMessage = await picChannel.messages.fetch(interaction.picMessageId as string);
    const embeds = picMessage.embeds;
    embeds.pop();
    // Fix hidden attachment
    const baseEmbed = embeds.pop()?.toJSON() as APIEmbed;
    baseEmbed.image = { url: `attachment://${interaction.picFileName}` };

    const components = await client.getMessageComponents("picture", `${interaction.picMessageId}:${interaction.picFileName}`);

    await picMessage.edit({
      embeds: [baseEmbed],
      components
    });

    // Reply to interaction
    const embedRestored = await client.getEmbed("texts.components.buttons.restored");
    embedRestored.title = (embedRestored.title as string)
      .replace("${fileName}", interaction.picFileName as string);

    await interaction.reply({
      embeds: [embedRestored],
      ephemeral: true
    });
  }
});
