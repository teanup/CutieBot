import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

export default async function getComponents(componentsName: string, appendInfo?: string): Promise<ActionRowBuilder[]> {
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
    // case "minecraft":
    //   const helpSelectMenu = new StringSelectMenuBuilder()
    //     .setCustomId("commands-help")
    //     .setPlaceholder("Help with in-game commands")
    //     .setMinValues(1)
    //     .setMaxValues(1)
    //     .addOptions([
    //       new StringSelectMenuOptionBuilder({
    //         value: "homes",
    //         label: "Homes",
    //         emoji: "🏠",
    //         description: "Set and teleport to your homes"
    //       }),
    //       new StringSelectMenuOptionBuilder({
    //         value: "warps",
    //         label: "Warps",
    //         emoji: "🌀",
    //         description: "Set and teleport to warps"
    //       }),
    //       new StringSelectMenuOptionBuilder({
    //         value: "teleport",
    //         label: "Teleport",
    //         emoji: "🚀",
    //         description: "Teleport to other players, and have them teleport to you"
    //       }),
    //       new StringSelectMenuOptionBuilder({
    //         value: "graves",
    //         label: "Graves",
    //         emoji: "⚰️",
    //         description: "Retrieve your items from your graves"
    //       }),
    //       new StringSelectMenuOptionBuilder({
    //         value: "ta-vm",
    //         label: "TreeAssist & VeinMiner",
    //         emoji: "⚡",
    //         description: "Chop down trees and mine ores with ease"
    //       }),
    //       new StringSelectMenuOptionBuilder({
    //         value: "armored-elytra",
    //         label: "Armored Elytra",
    //         emoji: "🦋",
    //         description: "Combine the protection of an armor with the speed of elytra"
    //       }),
    //       new StringSelectMenuOptionBuilder({
    //         value: "mob-grief",
    //         label: "Mob Grief",
    //         emoji: "💥",
    //         description: "World protection against some mobs"
    //       })
    //     ]);
    //   rows.push(new ActionRowBuilder<StringSelectMenuBuilder>()
    //     .addComponents(helpSelectMenu));
    //   break;
      default:
        break;
  }

  return rows;
}
