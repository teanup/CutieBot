import { ExtendedClient } from "../structures/Client";

export default async function loadReplies(client: ExtendedClient): Promise<void> {
  client.log("Loading replies...", "loading");
  
  const replyIdsRaw = process.env.REPLIES as string;
  const replyIds = replyIdsRaw.split(",");

  replyIds.forEach((id) => {
    const regexRaw = process.env[`${id}_REGEX`] as string;
    const repliesRaw = process.env[`${id}_REPLIES`] as string;

    const regex = new RegExp(regexRaw, "i");
    const replies = repliesRaw.split(",");
    const emoji = process.env[`${id}_EMOJI`] as string;

    client.replies.set(id, {
      regex,
      replies,
      emoji
    });
  });

  client.log(`Loaded ${replyIds.length} replies: ${replyIds.join(", ")}`, "success");
}
