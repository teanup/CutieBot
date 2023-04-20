import { ChatInputCommand } from "../../structures/ChatInputCommand";
import { glob } from "glob";

export default new ChatInputCommand({
  name: "cute-pic",
  description: "Sends a random cute picture",
  run: async ({ client, interaction }) => {
    // Pick random file
    const picEmbeds = await glob(`${__dirname}/../../${client.picEmbedsDir}/*.json`);
    const randomPicEmbed = picEmbeds[Math.floor(Math.random() * picEmbeds.length)];

    // Send embed
    

  }
});
