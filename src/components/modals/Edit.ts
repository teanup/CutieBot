import { Modal } from "../../structures/Modal";
import { RegisterPicOptions } from "src/bin/RegisterPic";

export default new Modal({
  customId: "edit",
  run: async ({ client, interaction }) => {
    // Load old and new data
    const picEmbed = await client.getEmbed(interaction.picMessageId as string, client.picEmbedsDir);
    const oldData: RegisterPicOptions = {
      title: picEmbed.title || "",
      description: picEmbed.description || "",
      date: picEmbed.timestamp || "",
      location: picEmbed.author?.name || ""
    }
    const newData: RegisterPicOptions = {
      title: interaction.fields.getTextInputValue("edit-title") || "",
      description: interaction.fields.getTextInputValue("edit-description") || "",
      date: interaction.fields.getTextInputValue("edit-date") || "",
      location: interaction.fields.getTextInputValue("edit-location") || ""
    }

    // Check for changes
    // TODO: Check for changes

    // Update embed
    // TODO: Update embed
  }
});
