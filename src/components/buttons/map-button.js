require("dotenv").config();
const { embedsDir } = process.env;

module.exports = {
	data: {
		name: "map-button"
	},
	async execute(interaction, client) {
		// get gps data
		const pic = await interaction.message.embeds[0].data.footer.text;
		const { mapInfo } = require(`../../../${embedsDir + pic}.json`);
		const { location, gmapsURL, gmapsPic } = mapInfo;
		const gps = gmapsURL.match(/loc:.+?,.+?$/g)[0].slice(4);
		const [gpsN, gpsE] = gps.split(',');

		const osmURL = `https://www.openstreetmap.org/?mlat=${gpsN}&mlon=${gpsE}#map=12/${gpsN}/${gpsE}`;

		const embed = {
			color: 0x88cc44,
			description: `\u00bb\u2000**Latitude:**  \`${gpsN}\`\n\u00bb\u2000**Longitude:**  \`${gpsE}\``,
			url: osmURL,
			thumbnail: {
				url: "https://www.openstreetmap.org/assets/osm_logo_256-ed028f90468224a272961c380ecee0cfb73b8048b34f4b4b204b7f0d1097875d.png"
			},
			image: {
				url: gmapsPic
			}
		}

		// location failure
		if (!location || location == "Unknown location") {
			embed.title = "See Location";
			const pic = await interaction.message.embeds[0].data.footer.text;
			console.log(`Missing location for ${pic}.`)
		} else {
			embed.title = location;
		}

		await interaction.reply({
			embeds: [embed],
			ephemeral: true
		});
	}
};
