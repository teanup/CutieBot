const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
	data: {
		name: "edit-button"
	},
	async execute(interaction, client) {
		const modal = new ModalBuilder()
			.setCustomId("edit-modal")
			.setTitle("Edit picture attributes");

		const titleInput = new TextInputBuilder()
			.setCustomId("title")
			.setLabel("New Title")
			.setPlaceholder("Enter title (leave blank to keep the current one)")
			.setRequired(false)
			.setStyle(TextInputStyle.Short);

		const descriptionInput = new TextInputBuilder()
			.setCustomId("description")
			.setLabel("New Description")
			.setPlaceholder("Enter description (leave blank to keep the current one)")
			.setRequired(false)
			.setStyle(TextInputStyle.Paragraph);

		modal.addComponents([
			new ActionRowBuilder().addComponents(titleInput),
			new ActionRowBuilder().addComponents(descriptionInput)			
		]);

		await interaction.showModal(modal);
	}
};
