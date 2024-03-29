import { CommandInteractionOptionResolver } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";
import { ExtendedCommandInteraction } from "../typings/Command";
import { ExtendedButtonInteraction } from "../typings/Button";
import { ExtendedSelectMenuInteraction } from "../typings/SelectMenu";
import { ExtendedModalInteraction } from "../typings/Modal";

export default new Event("interactionCreate", async (interaction) => {
  // Application commands
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      client.log(`Unknown command ${interaction.commandName} by ${interaction.user.tag} [${interaction.user.id}]`, "warn");
      const embedUnknown = await client.getEmbed("texts.common.unknown.command");
      await interaction.reply({
        embeds: [embedUnknown],
        ephemeral: true
      });
      return;
    };

    try {
      await command.run({
        client,
        interaction: interaction as ExtendedCommandInteraction,
        args: interaction.options as CommandInteractionOptionResolver
      });
    }
    catch (error) {
      client.log(`Error occured while executing command ${interaction.commandName} by ${interaction.user.tag} [${interaction.user.id}]`, "error");
      console.error(error);
      const embedError = await client.getEmbed("texts.common.error.command");
      await interaction.reply({
        embeds: [embedError],
        ephemeral: true
      });
    }

    return;
  }

  // Context menus
  if (interaction.isMessageContextMenuCommand()) {
    const contextMenu = client.commands.get(interaction.commandName);
    if (!contextMenu) {
      client.log(`Unknown context menu ${interaction.commandName} by ${interaction.user.tag} [${interaction.user.id}]`, "warn");
      const embedUnknown = await client.getEmbed("texts.common.unknown.contextMenu");
      await interaction.reply({
        embeds: [embedUnknown],
        ephemeral: true
      });
      return;
    };

    try {
      await contextMenu.run({
        client,
        interaction: interaction as ExtendedCommandInteraction,
        args: interaction.options as CommandInteractionOptionResolver
      });
    }
    catch (error) {
      client.log(`Error occured while using context menu ${interaction.commandName} by ${interaction.user.tag} [${interaction.user.id}]`, "error");
      console.error(error);
      const embedError = await client.getEmbed("texts.common.error.contextMenu");
      await interaction.reply({
        embeds: [embedError],
        ephemeral: true
      });
    }

    return;
  }

  // Buttons
  if (interaction.isButton()) {
    const customIdData = interaction.customId.split(":");
    const customId = customIdData[0];
    let picMessageId: string | undefined;
    let picFileName: string | undefined;
    switch (customIdData.length) {
      case 1:
        break;
      case 2:
        picMessageId = customIdData[1];
        break;
      case 3:
        picMessageId = customIdData[1];
        picFileName = customIdData[2];
        break;
      default:
        picMessageId = customIdData[-2];
        picFileName = customIdData[-1];
    }

    const button = client.buttons.get(customId);
    if (!button) {
      client.log(`Unknown button ${customId} by ${interaction.user.tag} [${interaction.user.id}]`, "warn");
      const embedUnknown = await client.getEmbed("texts.common.unknown.button");
      await interaction.reply({
        embeds: [embedUnknown],
        ephemeral: true
      });
      return;
    };

    try {
      if (picMessageId) (interaction as ExtendedButtonInteraction).picMessageId = picMessageId;
      if (picFileName) (interaction as ExtendedButtonInteraction).picFileName = picFileName;
      await button.run({
        client,
        interaction: interaction as ExtendedButtonInteraction
      });
    }
    catch (error) {
      client.log(`Error occured while using button ${customId} by ${interaction.user.tag} [${interaction.user.id}]`, "error");
      console.error(error);
      const embedError = await client.getEmbed("texts.common.error.button");
      await interaction.reply({
        embeds: [embedError],
        ephemeral: true
      });
    }

    return;
  }

  // Select menus
  if (interaction.isStringSelectMenu()) {
    const selectMenu = client.selectMenus.get(interaction.customId);
    if (!selectMenu) {
      client.log(`Unknown select menu ${interaction.customId} by ${interaction.user.tag} [${interaction.user.id}]`, "warn");
      const embedUnknown = await client.getEmbed("texts.common.unknown.selectMenu");
      await interaction.reply({
        embeds: [embedUnknown],
        ephemeral: true
      });
      return;
    };

    try {
      await selectMenu.run({
        client,
        interaction: interaction as ExtendedSelectMenuInteraction
      });
    }
    catch (error) {
      client.log(`Error occured while using select menu ${interaction.customId} by ${interaction.user.tag} [${interaction.user.id}]`, "error");
      console.error(error);
      const embedError = await client.getEmbed("texts.common.error.selectMenu");
      await interaction.reply({
        embeds: [embedError],
        ephemeral: true
      });
    }

    return;
  }

  // Modals
  if (interaction.isModalSubmit()) {
    const customIdData = interaction.customId.split(":");
    const customId = customIdData[0];
    let picMessageId: string | undefined;
    let picFileName: string | undefined;
    switch (customIdData.length) {
      case 1:
        break;
      case 2:
        picMessageId = customIdData[1];
        break;
      case 3:
        picMessageId = customIdData[1];
        picFileName = customIdData[2];
        break;
      default:
        picMessageId = customIdData[-2];
        picFileName = customIdData[-1];
    }

    const modal = client.modals.get(customId);
    if (!modal) {
      client.log(`Unknown modal ${customId} by ${interaction.user.tag} [${interaction.user.id}]`, "warn");
      const embedUnknown = await client.getEmbed("texts.common.unknown.modal");
      await interaction.reply({
        embeds: [embedUnknown],
        ephemeral: true
      });
      return;
    };

    try {
      if (picMessageId) (interaction as ExtendedModalInteraction).picMessageId = picMessageId;
      if (picFileName) (interaction as ExtendedModalInteraction).picFileName = picFileName;
      await modal.run({
        client,
        interaction: interaction as ExtendedModalInteraction
      });
    }
    catch (error) {
      client.log(`Error occured while using modal ${customId} by ${interaction.user.tag} [${interaction.user.id}]`, "error");
      console.error(error);
      const embedError = await client.getEmbed("texts.common.error.modal");
      await interaction.reply({
        embeds: [embedError],
        ephemeral: true
      });
    }

    return;
  }
});
