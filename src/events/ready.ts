import { client } from "..";
import { Event } from "../structures/Event";

export default new Event("ready", async () => {
  client.log(`Bot logged in as ${client.user?.tag}`, "info");

  // Set presence and cron jobs
  await client.setPresence();
  await client.setCronJobs();
  // Load replies
  await client.loadReplies();
  // Load pics
  await client.loadPics();
});
