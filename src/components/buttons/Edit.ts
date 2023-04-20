import { ModalBuilder } from "discord.js";
import { Button } from "../../structures/Button";
import { RegisterPicOptions } from "src/bin/RegisterPic";

export default new Button({
  customId: "edit",
  run: async ({ client, interaction }) => {
    // Load current data
    const picEmbed = await client.getEmbed(interaction.picMessageId as string, client.picEmbedsDir);
    const inputDefaultData: RegisterPicOptions = {
      title: picEmbed.title || "",
      description: picEmbed.description || "",
      date: picEmbed.timestamp || "",
      location: picEmbed.author?.name || ""
    }

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
