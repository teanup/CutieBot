import { CronJob } from "cron";
import { ExtendedClient } from "../structures/Client";

export default async function setCronJobs(client: ExtendedClient): Promise<void> {
  const cutieTz = process.env.CUTIE_TIMEZONE as string;
  const cutieId = process.env.CUTIE_ID as string;
  const cutie = await client.users.fetch(cutieId);

  // Lunch reminder
  const lunchCronTime = process.env.LUNCH_CRON_TIME as string;
  const lunchMessagesRaw = process.env.LUNCH_MESSAGES as string;
  const lunchMessages = lunchMessagesRaw.split(",");
  new CronJob(lunchCronTime, () => {
    const randomMessage = lunchMessages[Math.floor(Math.random() * lunchMessages.length)];
    cutie.send(randomMessage);
  }, null, true, cutieTz)
    .start();

  // Dinner reminder
  const dinnerCronTime = process.env.DINNER_CRON_TIME as string;
  const dinnerMessagesRaw = process.env.DINNER_MESSAGES as string;
  const dinnerMessages = dinnerMessagesRaw.split(",");
  new CronJob(dinnerCronTime, () => {
    const randomMessage = dinnerMessages[Math.floor(Math.random() * dinnerMessages.length)];
    cutie.send(randomMessage);
  }, null, true, cutieTz)
    .start();

  client.log("Set cron jobs", "success");
}
