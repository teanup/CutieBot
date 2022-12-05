const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const embeds = require("../../extra/help-pics/help-pics.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help-pics")
		.setDescription("Get help with \"cute pics\"-related commands"),
	async execute(interaction, client) {
		// fetch images
		let imgFiles = fs.readdirSync("./src/extra/help-pics/")
			.filter((file) => file.endsWith(".png"))
			.map(img =>`./src/extra/help-pics/${img}`);

		// fix colors
		embeds.forEach(e => e.color = parseInt(e.color));

		await interaction.reply({
			embeds: embeds,
			files: imgFiles,
			ephemeral: true
		});
	}
};
