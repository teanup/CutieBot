require("dotenv").config();
const { embedsDir } = process.env;
const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("cute-pic")
		.setDescription("Shows a cute pic!"),
	async execute(interaction, client) {
		await interaction.deferReply({
			fetchReply: true
		});
		const pics = fs.readdirSync(embedsDir);

		// select random picture
		let randomId = Math.floor(Math.random() * pics.length);
		let pic = pics[randomId];
		while (await client.picHistory.has(pic)) {
			randomId = Math.floor(Math.random() * pics.length);
			pic = pics[randomId];
		}

		// embed
		const embed = await require(`../../../${embedsDir+pic}`);

		// edit button
		const editButton = new ButtonBuilder()
			.setCustomId("edit-button")
			.setStyle("Primary")
			.setEmoji("\ud83d\udcdd");
		const row = new ActionRowBuilder()
			.addComponents(editButton);

		// map button
		if (embed.mapInfo) {
			const mapButton = new ButtonBuilder()
				.setCustomId("map-button")
				.setStyle("Success")
				.setEmoji("\ud83d\uddfa");
			row.addComponents(mapButton);
		}

		// delete button
		const deleteButton = new ButtonBuilder()
			.setCustomId("del-button")
			.setStyle("Danger")
			.setEmoji("\ud83d\uddd1");
		row.addComponents(deleteButton);

		await interaction.editReply({
			embeds: [embed],
			components: [row]
		});
		await client.picHistory.sent(pic);
		console.log(`Sent ${pic} in #${interaction.channel.name}.`);
	}
};
