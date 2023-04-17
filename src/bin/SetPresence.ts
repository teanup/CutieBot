import { ActivityType } from "discord.js";
import { ExtendedClient } from "../structures/Client";

export default async function setPresence(client: ExtendedClient): Promise<void> {
  client.user?.setPresence({
    activities: [
      {
        name: "cuties :3",
        type: ActivityType.Listening
      },
    ],
    status: "online"
  });

  client.log("Set presence", "success");
}
