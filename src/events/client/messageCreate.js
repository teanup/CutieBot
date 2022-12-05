const { answerMessage } = require("../../extra/message-create/message-answers");

module.exports = {
	name: "messageCreate",
	async execute(message, client) {
		if (message.author.bot) return;
        const content = await message.content;

        await answerMessage(message, content);
	}
};
