require("dotenv").config();
const { token, guildId, clientId } = process.env;
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, GatewayIntentBits } = require("discord.js");

// initialize client
new Client({
	intents: [
		GatewayIntentBits.Guilds,
	]
});

const rest = new REST({ version: "9" }).setToken(token);

(async () => {
    try {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: []
        });
        console.log("Removed application commands.");
    } catch (error) {
        console.error(error);
    }
})();

