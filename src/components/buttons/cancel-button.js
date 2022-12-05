module.exports = {
	data: {
		name: "cancel-button"
	},
	async execute(interaction, client) {
		await interaction.message.delete();
	}
};
