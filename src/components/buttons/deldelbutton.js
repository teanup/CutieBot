require("dotenv").config();
const { embedsDir } = process.env;
const fs = require("fs");

module.exports = {
	data: {
		name: "deldel-button"
	},
	async execute(interaction, client) {
		const title = await interaction.message.embeds[0].data.title;
		const pic = title.match(/ .*? /g)[0].slice(1, -1);

		// delete file
		try {
			fs.unlinkSync(`${embedsDir+pic}.json`);
		}
		catch (error) {
			await interaction.reply({
				content: `\u26a0\ufe0f  An error occured when comitting changes:\n\`\`\`\n${error}\n\`\`\``,
				ephemeral: true
			});
			console.error(error);
			return;
		}

		const embed = {
			color: 0xff4422,
			title: `Removed ${pic} from the library`
		};

		console.log(`Removed ${pic} from the library.`);
		await interaction.message.edit({
			embeds: [embed],
			components: []
		});
	}
};
