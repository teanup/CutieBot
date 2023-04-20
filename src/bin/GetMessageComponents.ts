import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder
} from "discord.js";

export default async function getMessageComponents(componentsName: string, appendInfo?: string): Promise<ActionRowBuilder<MessageActionRowComponentBuilder>[]> {
  let rows = [];

  switch (componentsName) {
    case "picture":
      const editButton = new ButtonBuilder()
        .setCustomId(`edit:${appendInfo}`)
        .setEmoji("📝")
        .setLabel("Edit")
        .setStyle(ButtonStyle.Primary);
      const trashButton = new ButtonBuilder()
        .setCustomId(`trash:${appendInfo}`)
        .setEmoji("🗑️")
        .setLabel("Trash")
        .setStyle(ButtonStyle.Danger);

      rows.push(new ActionRowBuilder<ButtonBuilder>()
        .addComponents(editButton, trashButton));
      break;
    case "trash":
      const trashCancelButton = new ButtonBuilder()
        .setCustomId(`trashcancel:${appendInfo}`)
        .setEmoji("❌")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Secondary);
      const trashConfirmButton = new ButtonBuilder()
        .setCustomId(`trashconfirm:${appendInfo}`)
        .setEmoji("🗑️")
        .setLabel("Trash")
        .setStyle(ButtonStyle.Danger);

      rows.push(new ActionRowBuilder<ButtonBuilder>()
        .addComponents(trashCancelButton, trashConfirmButton));
      break;
    case "trashconfirm":
      const restoreButton = new ButtonBuilder()
        .setCustomId(`restore:${appendInfo}`)
        .setEmoji("♻️")
        .setLabel("Restore")
        .setStyle(ButtonStyle.Success);
      const delButton = new ButtonBuilder()
        .setCustomId(`delete:${appendInfo}`)
        .setEmoji("🧹")
        .setLabel("Delete permanently")
        .setStyle(ButtonStyle.Danger);

      rows.push(new ActionRowBuilder<ButtonBuilder>()
        .addComponents(restoreButton, delButton));
      break;
    case "delete":
      const deleteCancelButton = new ButtonBuilder()
        .setCustomId(`deletecancel:${appendInfo}`)
        .setEmoji("❌")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Secondary);
      const deleteConfirmButton = new ButtonBuilder()
        .setCustomId(`deleteconfirm:${appendInfo}`)
        .setEmoji("🧹")
        .setLabel("Delete permanently")
        .setStyle(ButtonStyle.Danger);

      rows.push(new ActionRowBuilder<ButtonBuilder>()
        .addComponents(deleteCancelButton, deleteConfirmButton));
      break;

      default:
        break;
  }

  return rows;
}
