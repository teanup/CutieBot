const fs = require('fs');

module.exports = {
	async editJSON(jsonData, path) {
		const json = await require(`../../../${path}`);

        // edit json data
        for (let key in jsonData) {
            json[key] = jsonData[key];
        }
        // commit changes
        fs.writeFileSync(path, JSON.stringify(json));

        return json;
	}
};
