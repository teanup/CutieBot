require("dotenv").config();
const { token, guildId, embedsDir } = process.env;
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

// initialize client
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
});

// interactions
client.commands = new Collection();
client.modals = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.commandArray = [];

// config
client.guildId = guildId;

// cute-pic command sending history
const picHistory = {
	maxLength: Math.floor(fs.readdirSync(embedsDir).length / 2),
	history: [],
	async addLast(item) {
		this.history[this.history.length] = item;
	},
	async removeFirst() {
		if (this.history.length > this.maxLength) {
			for (let i=1; i<this.history.length; ++i) {
				this.history[i-1] = this.history[i];
			}
			this.history.length--;
		}
	},
	async sent(pic) {
		await this.addLast(pic);
		await this.removeFirst();
	},
	async has(pic) {
		return this.history.includes(pic);
	},
	async addedPic() {
		this.maxLength += this.maxLength % 2;
	},
};
client.picHistory = picHistory;


(async () => {
	// fetch functions
	const functionFolder = fs.readdirSync("./src/functions");
	for (const folder of functionFolder) {
		switch (folder) {
			case "handlers":
				const functionFiles = fs
					.readdirSync(`./src/functions/${folder}`)
					.filter((file) => file.endsWith(".js"));
				for (const file of functionFiles)
					require(`./functions/${folder}/${file}`)(client);
				break;
			default:
				break;
		}
	}

	client.handleEvents();
	client.handleCommands();
	client.handleComponents();
	client.login(token);
})();
