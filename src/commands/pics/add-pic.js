const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("add-pic")
		.setDescription("Register a new picture"),
	async execute(interaction, client) {
		// image registration modal
		const modal = new ModalBuilder()
			.setCustomId("add-modal")
			.setTitle("Register a picture from the album");

		const urlInput = new TextInputBuilder()
			.setCustomId("url")
			.setLabel("Image URL")
			.setPlaceholder("https://photos.google.com/share/...")
			.setRequired(true)
			.setStyle(TextInputStyle.Short);

		const titleInput = new TextInputBuilder()
			.setCustomId("title")
			.setLabel("Title")
			.setPlaceholder("Enter title (leave blank for default)")
			.setRequired(false)
			.setStyle(TextInputStyle.Short);

		const descriptionInput = new TextInputBuilder()
			.setCustomId("description")
			.setLabel("Description")
			.setPlaceholder("Enter description (leave blank for default)")
			.setRequired(false)
			.setStyle(TextInputStyle.Paragraph);

		modal.addComponents([
			new ActionRowBuilder().addComponents(urlInput),
			new ActionRowBuilder().addComponents(titleInput),
			new ActionRowBuilder().addComponents(descriptionInput)
		]);

		await interaction.showModal(modal);
	}
};
