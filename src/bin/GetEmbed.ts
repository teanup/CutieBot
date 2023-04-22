import { APIEmbed } from "discord.js";
import { readFile } from "fs/promises";

export default async function getEmbed(embedId: string, pathPrefix?: string): Promise<APIEmbed> {
  const embedPath = `${__dirname}/../${pathPrefix ? pathPrefix : ""}/${embedId.replace(/\./g, "/")}.json`;
  const contentPromise = await readFile(embedPath, "utf8").then(JSON.parse);
  const content = JSON.parse(JSON.stringify(contentPromise));

  // Replace color with int
  if (typeof content.color === "string") {
    content.color = parseInt(content.color, 16);
  }

  return content
}
