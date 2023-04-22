import { ModalBuilder } from "discord.js";
import { Button } from "../../structures/Button";
import { PicOptions } from "../../bin/SetPic";

export default new Button({
  customId: "edit",
  run: async ({ client, interaction }) => {
    const fileName = interaction.picFileName as string;
    // Check if editable
    if (!client.picIds.includes(interaction.picMessageId as string)) {
      const embedNoEdit = await client.getEmbed("texts.components.buttons.edit.no-edit");
      const originalMessageURL = `https://discord.com/channels/${client.guildId}/${client.picChannelId}/${interaction.picMessageId}`;
      embedNoEdit.title = (embedNoEdit.title as string)
        .replace("${fileName}", fileName);
      embedNoEdit.description = (embedNoEdit.description as string)
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
    const appendInfo = `${interaction.picMessageId}:${fileName}`;
    const components = await client.getModalComponents("edit", appendInfo, inputDefaultData);
    // Title length can't be over 45 (funky Discord render if over 30)
    const title = `Edit ${fileName.length <= 25 ? fileName : `${fileName.slice(0, 22)}...`}`;
    const editModal = new ModalBuilder()
      .setCustomId(`edit:${appendInfo}`)
      .setTitle(title)
      .addComponents(components);

    await interaction.showModal(editModal);
  }
});
