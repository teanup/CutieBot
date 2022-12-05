require("dotenv").config();
const { embedsDir } = process.env;
const { editJSON } = require("../../functions/util/edit-json")

module.exports = {
	data: {
		name: "edit-modal"
	},
	async execute(interaction, client) {
		const pic = await interaction.message.embeds[0].data.footer.text;
		const title = await interaction.fields.getTextInputValue("title");
		const description = await interaction.fields.getTextInputValue("description");

        // edit embed file
        try {
			const path = `${embedsDir+pic}.json`;

			const embed = {};
			if (title != '') embed.title = title;
			if (description != '') embed.description = description;
	
			const newEmbed = await editJSON(embed, path);

			await interaction.message.edit({
				embeds: [newEmbed]
			});
            await interaction.reply({
				content: "\u2705  *Successfully comitted changes*",
				ephemeral: true
			});
        } catch (error) {
			await interaction.reply({
				content: `\u26a0\ufe0f  An error occured when comitting changes:\n\`\`\`\n${error}\n\`\`\``,
				ephemeral: true
			});
			console.error(error);
			return;
        }
	}
};
