import { ExtendedClient } from "../structures/Client";
import { glob } from "glob";

export default async function loadPics(client: ExtendedClient): Promise<void> {
  client.log("Loading registered pics...", "loading");
  
  const picEmbeds = await glob(`${__dirname}/../${client.picEmbedsDir}/*.json`);
  const picEmbedsTrash = await glob(`${__dirname}/../${client.picEmbedsTrashDir}/*.json`);

  client.pics = picEmbeds.map((picEmbedPath: string) => (picEmbedPath.split("/").pop() as string).split(".")[0]);
  client.picsTrash = picEmbedsTrash.map((picEmbedPath: string) => (picEmbedPath.split("/").pop() as string).split(".")[0]);

  client.log(`Loaded ${picEmbeds.length} pictures and ${picEmbedsTrash.length} deleted pictures`, "success");
}
