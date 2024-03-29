import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";
import { PicOptions } from "../bin/SetPic";

export default async function getModalComponents(componentsName: string, appendInfo?: string, inputDefaultData?: PicOptions): Promise<ActionRowBuilder<ModalActionRowComponentBuilder>[]> {
  let rows = [];

  switch (componentsName) {
    case "edit":
      const title = inputDefaultData?.title || "";
      const description = inputDefaultData?.description || "";
      const date = inputDefaultData?.date || "";
      const location = inputDefaultData?.location || "";

      const titleInput = new TextInputBuilder()
        .setCustomId(`edit-title`)
        .setLabel("Title")
        .setPlaceholder(title)
        .setStyle(TextInputStyle.Short)
        .setRequired(false);
      const descriptionInput = new TextInputBuilder()
        .setCustomId(`edit-description`)
        .setLabel("Description")
        .setPlaceholder(description)
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);
      const dateInput = new TextInputBuilder()
        .setCustomId(`edit-date`)
        .setLabel("Date")
        .setPlaceholder(date)
        .setStyle(TextInputStyle.Short)
        .setRequired(false);
      const locationInput = new TextInputBuilder()
        .setCustomId(`edit-location`)
        .setLabel("Location")
        .setPlaceholder(location)
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      rows.push(new ActionRowBuilder<TextInputBuilder>()
        .addComponents(titleInput));
      rows.push(new ActionRowBuilder<TextInputBuilder>()
        .addComponents(descriptionInput));
      rows.push(new ActionRowBuilder<TextInputBuilder>()
        .addComponents(dateInput));
      rows.push(new ActionRowBuilder<TextInputBuilder>()
        .addComponents(locationInput));
      break;

      default:
        break;
  }

  return rows;
}
