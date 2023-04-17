import { client } from "..";
import { Event } from "../structures/Event";

export default new Event("messageCreate", async (message) => {
  if (message.author.bot) return;

  const defaultChance = 0.2;

  client.replies.map(async (reply) => {
    if (reply.regex.test(message.content)) {
      // React to message
      await message.react(reply.emoji);

      // Reply to message with decreasing chance
      const nbReplies = reply.replies.length;
      let chance = defaultChance;
      for (let i = 0; i < nbReplies; i++) {
        if (Math.random() < chance) {
          await message.reply({ content: reply.replies[i], failIfNotExists: false });
          return;
        }
        chance = defaultChance / (i + 2);
      }
    }
  });
});
