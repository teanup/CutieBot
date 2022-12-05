const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName("See data")
		.setType(ApplicationCommandType.Message),
	async execute(interaction, client) {
		const message = await interaction.targetMessage;

		// check author
		if (message.author.id !== client.user.id) {
			await interaction.reply({
				content: "\u26A0\uFE0F This message isn't mine!",
				ephemeral: true
			});
			return;
		}

		// send embed
        let embed = {};
        try {
            embed = await message.embeds[0];
            if (!embed) throw "no embed";
        } catch (error) {
			await interaction.reply({
				content: "\u26A0\uFE0F No embed found!",
				ephemeral: true
			});
			return;
        }

        const replyEmbed = {
            color: 0x5868f0,
            title: "JSON Embed",
            description: `\`\`\`${JSON.stringify(embed, null, 4)}\`\`\``
        };

        await interaction.reply({
            embeds: [replyEmbed],
            ephemeral: true
        });
	}
};
