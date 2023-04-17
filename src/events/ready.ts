import { client } from "..";
import { Event } from "../structures/Event";

export default new Event("ready", () => {
  client.log(`Bot logged in as ${client.user?.tag}`, "info");
});
