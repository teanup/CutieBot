import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} from "discord.js";
import { ExtendedClient } from "../structures/Client";

export default async function getMessageComponents(client: ExtendedClient, componentsName: string, appendInfo?: string): Promise<ActionRowBuilder<MessageActionRowComponentBuilder>[]> {
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

    case "cute-pic":
      const originalMessageId = (appendInfo as string).split(":")[0];
      const originalMessageURL = `https://discord.com/channels/${client.guildId}/${client.picChannelId}/${originalMessageId}`;
      const updateButton = new ButtonBuilder()
        .setCustomId(`update:${appendInfo}`)
        .setEmoji("✨")
        .setStyle(ButtonStyle.Success);
      const optionsButton = new ButtonBuilder()
        .setURL(originalMessageURL)
        .setEmoji("⚙️")
        .setStyle(ButtonStyle.Link);

      rows.push(new ActionRowBuilder<ButtonBuilder>()
        .addComponents(updateButton, optionsButton));
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

    case "help-pics":
      const helpSelectMenu = new StringSelectMenuBuilder()
        .setCustomId("help-pics")
        .setPlaceholder("Help with the cute pics features")
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions([
          new StringSelectMenuOptionBuilder({
            value: "register",
            label: "Registration",
            emoji: "✅",
            description: "Register new pictures to add them to the album"
          }),
          new StringSelectMenuOptionBuilder({
            value: "view",
            label: "Viewing",
            emoji: "🖼️",
            description: "Ask for a random picture or view a specific one"
          }),
          new StringSelectMenuOptionBuilder({
            value: "edit",
            label: "Editing",
            emoji: "📝",
            description: "Edit the attributes of a picture"
          }),
          new StringSelectMenuOptionBuilder({
            value: "update",
            label: "Updating",
            emoji: "✨",
            description: "Update a picture message with the current attributes"
          }),
          new StringSelectMenuOptionBuilder({
            value: "trash",
            label: "Trashing",
            emoji: "🗑️",
            description: "Trash a picture to remove it from the album"
          }),
          new StringSelectMenuOptionBuilder({
            value: "restore",
            label: "Restoring",
            emoji: "♻️",
            description: "Restore a trashed picture"
          }),
          new StringSelectMenuOptionBuilder({
            value: "delete",
            label: "Deleting",
            emoji: "🧹",
            description: "Delete a trashed picture permanently"
          })
        ]);

      rows.push(new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(helpSelectMenu));
      break;

    default:
      break;
  }

  return rows;
}
