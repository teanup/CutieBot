import { Message } from "discord.js";
import { ReplyType } from "src/typings/Client";

export default async function autoReply(message: Message, reply: ReplyType, defaultChance: number): Promise<void> {
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
}
