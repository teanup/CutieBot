require("dotenv").config();
const { embedsDir } = process.env;
const fs = require('fs');
const { scrapeExif } = require("../../functions/util/get-exif");
const { getColorFromURL } = require('color-thief-node');

module.exports = {
	data: {
		name: "add-modal"
	},
	async execute(interaction, client) {
		const url = await interaction.fields.getTextInputValue("url");
		const title = await interaction.fields.getTextInputValue("title");
		const description = await interaction.fields.getTextInputValue("description");

		// check url style
		const urlPattern = /^https:\/\/photos\.google\.com\/share\//;
		if (!urlPattern.test(url)) {
			await interaction.reply({
				content: "\u26a0\ufe0f  Unknown URL format!\n\nYour URL should look like this:  `https://photos.google.com/share/.../photo/...?key=...`",
				ephemeral: true
			});
			return;
		}

		// scrape data from website
		let scrapedData = {};
		try {
			await interaction.reply({
				content: "\u23f3  *Scraping image data...*",
				ephemeral: true
			});	
			scrapedData = await scrapeExif(url);
		} catch(error) {
			await interaction.editReply({
				content: `\u26a0\ufe0f  An error occured when scraping image data:\n\`\`\`\n${error}\n\`\`\``
			});
			console.error(error);
			return;
		}
		const { picInfo, timestamp, fileName, location, gmapsURL, gmapsPic } = scrapedData;

		// make embed
		await interaction.editReply({
			content: "\u23f3  *Creating embed...*"
		});
		const color = await getColorFromURL(picInfo.url);
		const mainColor = parseInt(`0x${color[0].toString(16)}${color[1].toString(16)}${color[2].toString(16)}`);

		const embed = {
			color: mainColor,
			timestamp: timestamp,
			footer: { text: fileName },
			image: picInfo
		};

		if (title != '') embed.title = title;
		else embed.title = "TITLE";

		if (description != '') embed.description = description;
		else embed.description = "DESCRIPTION";

		if (gmapsURL) embed.mapInfo = {
			location: location,
			gmapsURL: gmapsURL,
			gmapsPic: gmapsPic
		};


		// create embed JSON file
		try {
			fs.writeFileSync(`${embedsDir+fileName}.json`, JSON.stringify(embed));
			await interaction.editReply({
				content: "\u2705  *Successfully registered image.*\n\n**\ud83d\uddbc  Embed Preview:**\n\u200b",
				embeds: [embed]
			});
		} catch (error) {
			await interaction.editReply({
				content: `\u26a0\ufe0f  An error occured when adding image:\n\`\`\`\n${error}\n\`\`\``
			});
			console.error(error);
			return;
		}

		await client.picHistory.addedPic();
		console.log(`Added ${fileName} to the library.`);
	}
};
