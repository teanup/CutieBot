import { ModalBuilder } from "discord.js";
import { Button } from "../../structures/Button";
import { PicOptions } from "../../bin/SetPic";

export default new Button({
  customId: "edit",
  run: async ({ client, interaction }) => {
    // Check if editable
    if (!client.picIds.includes(interaction.picMessageId as string)) {
      const embedNoEdit = await client.getEmbed("texts.components.buttons.edit.no-edit");
      const originalMessageURL = `https://discord.com/channels/${interaction.guildId}/${client.picChannelId}/${interaction.picMessageId}`;
      (embedNoEdit.title as string) = (embedNoEdit.title as string)
        .replace("${fileName}", interaction.picFileName as string);
      (embedNoEdit.description as string) = (embedNoEdit.description as string)
        .replace("${originalMessageURL}", originalMessageURL),
      await interaction.reply({
        embeds: [embedNoEdit],
        ephemeral: true
      });
      return;
    }

    // Load current data
    const picEmbed = await client.getEmbed(interaction.picMessageId as string, client.picEmbedsDir);
    const inputDefaultData: PicOptions = {
      title: picEmbed.title || "",
      description: picEmbed.description || "",
      date: picEmbed.timestamp?.split("T")[0] || "",
      location: picEmbed.author?.name || ""
    };

    // Display modal
    const appendInfo = `${interaction.picMessageId}:${interaction.picFileName}`;
    const components = await client.getModalComponents("edit", appendInfo, inputDefaultData);
    const editModal = new ModalBuilder()
      .setCustomId(`edit:${appendInfo}`)
      .setTitle(`Edit info for ${interaction.picFileName}`)
      .addComponents(components);
    
    await interaction.showModal(editModal);
  }
});
