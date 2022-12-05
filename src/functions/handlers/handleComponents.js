const fs = require("fs");

module.exports = (client) => {
	client.handleComponents = async () => {
		// fetch component files
		const componentFolders = fs.readdirSync("./src/components");
		for (const folder of componentFolders) {
			const componentFiles = fs
				.readdirSync(`./src/components/${folder}`)
				.filter((file) => file.endsWith(".js"));

			const { modals, buttons, selectMenus } = client;

			switch (folder) {
				case "modals":
					// add modals to client
					for (const file of componentFiles) {
						const modal = require(`../../components/${folder}/${file}`);
						modals.set(modal.data.name, modal);
					}
					break;
				case "buttons":
					// add buttons to client
					for (const file of componentFiles) {
						const button = require(`../../components/${folder}/${file}`);
						buttons.set(button.data.name, button);
					}
					break;
				case "selectMenus":
					// add select menus to client
					for (const file of componentFiles) {
						const selectMenu = require(`../../components/${folder}/${file}`);
						selectMenus.set(selectMenu.data.name, selectMenu);
					}
					break;
				default:
					break;
			}
		}
	}
};
