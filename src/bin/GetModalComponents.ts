import { ActionRowBuilder, ModalActionRowComponentBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { RegisterPicOptions } from "./RegisterPic";

export default async function getModalComponents(componentsName: string, appendInfo?: string, inputDefaultData?: RegisterPicOptions): Promise<ActionRowBuilder<ModalActionRowComponentBuilder>[]> {
  let rows = [];

  switch (componentsName) {
    case "edit":
      const title = inputDefaultData?.title || "";
      const description = inputDefaultData?.description || "";
      const date = inputDefaultData?.date || "";
      const location = inputDefaultData?.location || "";

      const titleInput = new TextInputBuilder()
        .setCustomId(`edit-title:${appendInfo}`)
        .setLabel("Title")
        .setPlaceholder(title)
        .setStyle(TextInputStyle.Short)
        .setRequired(false);
      const descInput = new TextInputBuilder()
        .setCustomId(`edit-desc:${appendInfo}`)
        .setLabel("Description")
        .setPlaceholder(description)
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);
      const dateInput = new TextInputBuilder()
        .setCustomId(`edit-date:${appendInfo}`)
        .setLabel("Date")
        .setPlaceholder(date)
        .setStyle(TextInputStyle.Short)
        .setRequired(false);
      const locInput = new TextInputBuilder()
        .setCustomId(`edit-loc:${appendInfo}`)
        .setLabel("Location")
        .setPlaceholder(location)
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      rows.push(new ActionRowBuilder<TextInputBuilder>()
        .addComponents(titleInput));
      rows.push(new ActionRowBuilder<TextInputBuilder>()
        .addComponents(descInput));
      rows.push(new ActionRowBuilder<TextInputBuilder>()
        .addComponents(dateInput, locInput));
      break;

      default:
        break;
  }

  return rows;
}
