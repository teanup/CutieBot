import { TextChannel } from "discord.js";
import { Modal } from "../../structures/Modal";
import { PicOptions } from "../../bin/SetPic";

export default new Modal({
  customId: "edit",
  run: async ({ client, interaction }) => {
    // Load old and new data
    const picEmbed = await client.getEmbed(interaction.picMessageId as string, client.picEmbedsDir);
    const oldData: PicOptions = {
      title: picEmbed.title || "",
      description: picEmbed.description || "",
      date: picEmbed.timestamp?.split("T")[0] || "",
      location: picEmbed.author?.name || ""
    };
    const newData = {
      title: interaction.fields.getTextInputValue("edit-title"),
      description: interaction.fields.getTextInputValue("edit-description"),
      date: interaction.fields.getTextInputValue("edit-date"),
      location: interaction.fields.getTextInputValue("edit-location")
    };

    // Check for changes
    const newOptions: PicOptions = {
      title: newData.title === "" ? oldData.title : newData.title,
      description: newData.description === "" ? oldData.description : newData.description,
      date: newData.date === "" ? oldData.date : newData.date,
      location: newData.location === "" ? oldData.location : newData.location
    };

    // Update embed
    const picChannel = await client.channels.fetch(client.picChannelId) as TextChannel;
    const originalPicMsg = await picChannel.messages.fetch(interaction.picMessageId as string);
    await client.setPic(interaction.picMessageId as string, interaction.picFileName as string, originalPicMsg, picEmbed, newOptions);

    // Reply
    const originalMessageURL = `https://discord.com/channels/${interaction.guildId}/${client.picChannelId}/${interaction.picMessageId}`;
    const embedEdit = await client.getEmbed("texts.components.modals.edit");
    (embedEdit.title as string) = (embedEdit.title as string)
      .replace("${fileName}", interaction.picFileName as string);
    (embedEdit.description as string) = (embedEdit.description as string)
      .replace("${originalMessageURL}", originalMessageURL)
      .replace("${fileName}", interaction.picFileName as string);
    await interaction.reply({
      embeds: [embedEdit],
      ephemeral: true
    });
    client.log(`${interaction.user.tag} edited ${interaction.picFileName} [${interaction.picMessageId}]`, "info");
  }
});
