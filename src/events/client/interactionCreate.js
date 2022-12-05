const { InteractionType } = require("discord.js");

module.exports = {
	name: "interactionCreate",
	async execute(interaction, client) {
		if (interaction.isChatInputCommand()) {
			// get command
			const { commands } = client;
			const { commandName } = interaction;
			const command = commands.get(commandName);

			if (!command) return;

			try {
				await command.execute(interaction, client);
			} catch (error) {
				console.error(error);
			}

		} else if (interaction.isContextMenuCommand()) {
			// get command
			const { commands } = client;
			const { commandName } = interaction;
			const contextCommand = commands.get(commandName);

			if (!contextCommand) return;

			try {
				await contextCommand.execute(interaction, client);
			} catch (error) {
				console.error(error);
			}

		} else if (interaction.type == InteractionType.ModalSubmit) {
			// get modal
			const { modals } = client;
			const { customId } = interaction;
			const modal = modals.get(customId);

			if (!modal) return;

			try {
				await modal.execute(interaction, client);
			} catch (error) {
				console.error(error);
			}

		} else if (interaction.isButton()) {
			// get button
			const { buttons } = client;
			const { customId } = interaction;
			const button = buttons.get(customId);

			if (!button) return;

			try {
				await button.execute(interaction, client);
			} catch (error) {
				console.error(error);
			}

		} else if (interaction.isSelectMenu()) {
			// get button
			const { selectMenus } = client;
			const { customId } = interaction;
			const selectMenu = selectMenus.get(customId);

			if (!selectMenu) return;

			try {
				await selectMenu.execute(interaction, client);
			} catch (error) {
				console.error(error);
			}

		}
	}
};
