import { glob } from "glob";
import { readFile } from "fs/promises";
import { ExtendedClient } from "../structures/Client";

export default async function loadPics(client: ExtendedClient): Promise<void> {
  client.log("Loading registered pics...", "loading");

  // Load available pictures
  const picEmbeds = await glob(`${__dirname}/../${client.picEmbedsDir}/*.json`);
  const picEmbedsTrash = await glob(`${__dirname}/../${client.picEmbedsTrashDir}/*.json`);

  client.picIds = picEmbeds.map((file) =>
      (file.split("/").pop() as string).split(".")[0]
    );
  client.picIdsTrash = picEmbedsTrash.map((file) =>
      (file.split("/").pop() as string).split(".")[0]
    );

  // Load file names
  const fileNamesRaw = await readFile(`${__dirname}/../${client.picFileNamesPath}`, "utf8");
  // Parse file names from TSV file
  const picFileNames = fileNamesRaw.split("\n")
  picFileNames.map((line) => {
    const [picId, fileName] = line.split("\t");
    if (picId && (client.picIds.includes(picId) || client.picIdsTrash.includes(picId))) {
      client.picFileNames.set(picId, fileName);
    }
  });
  
  client.log(`Loaded ${picEmbeds.length} pictures and ${picEmbedsTrash.length} trashed pictures (${picFileNames.length - 1} file names)`, "success");
}
