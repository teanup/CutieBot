const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Get the bot's ping"),
	async execute(interaction, client) {
		const message = await interaction.deferReply({
			fetchReply: true,
			ephemeral: true
		});

		const latency = (message.createdTimestamp - interaction.createdTimestamp);
		const APILatency = client.ws.ping;

		function emoji_picker(ping) {
			switch (true) {
				case (ping < 60):
					return "\uD83D\uDC0E";  // horse emoji
				case (ping < 120):
					return "\uD83E\uDD98";  // kangaroo emoji
				case (ping < 240):
					return "\uD83D\uDC07";  // rabbit emoji
				case (ping < 480):
					return "\uD83D\uDC22";  // turtle emoji
				default:
					return "\uD83D\uDC0C"; // snail emoji
			}
		};

		const embed = {
			title: "Pong !  \uD83C\uDFD3",
			color: 0xa02040,
			fields: [
				{
					name: "Bot Ping",
					value: `${latency} ms  ${emoji_picker(latency)}`,
					inline: true
				},
				{
					name: "API Latency",
					value: `${APILatency} ms  ${emoji_picker(APILatency)}`,
					inline: true
				}
			]
		};

		await interaction.editReply({
			embeds: [embed]
		});
	}
};
