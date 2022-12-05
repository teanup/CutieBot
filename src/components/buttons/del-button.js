const { ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
	data: {
		name: "del-button"
	},
	async execute(interaction, client) {
		const pic = await interaction.message.embeds[0].data.footer.text;

		// make buttons
		const cancelButton = new ButtonBuilder()
			.setCustomId("cancel-button")
			.setStyle("Secondary")
			.setEmoji("\u2716");

		const deleteButton = new ButtonBuilder()
			.setCustomId("deldel-button")
			.setStyle("Danger")
			.setEmoji("\ud83d\uddd1");
		const row = new ActionRowBuilder()
			.addComponents(cancelButton)
			.addComponents(deleteButton);

		const embed = {
			color: 0xff4422,
			title: `Remove ${pic} from the library ?`,
			description: "You can still add it again to the library using **`/add-pic`**."
		} 

		await interaction.reply({
			embeds: [embed],
			components: [row]
		});
	}
};
