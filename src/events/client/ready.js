require("dotenv").config();
const { cutieId } = process.env;
const { ActivityType } = require('discord.js');
const { CronJob } = require("cron");

module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		console.log(`Logged in as ${client.user.tag}.`);

		// set status
		await client.user.setActivity('cuties :3', { type: ActivityType.Listening });

		// eating reminders
		const cutie = await client.users.fetch(cutieId);
		// const me = await client.users.fetch(testcutieId);

		// lunch reminder
		new CronJob("0 21 * * *", async () => {
			if (Math.random() <= 0.5) {
				await cutie.send("Make sure to have some lunch today \ud83e\udd7a \ud83c\udf7d");
			} else {
				await cutie.send("Try to have lunch today \ud83e\udd7a \ud83c\udf7d");
			}
		}).start();

		// dinner reminder
		new CronJob("30 2 * * *", async () => {
			if (Math.random() <= 0.5) {
				await cutie.send("Make sure to have dinner today \ud83e\udd7a \ud83c\udf7d");
			} else {
				await cutie.send("Try to have some dinner today \ud83e\udd7a \ud83c\udf7d");
			}
		}).start();
	}
};
