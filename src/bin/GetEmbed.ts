import { APIEmbed } from "discord.js";

export default async function getEmbed(embedId: string, pathPrefix?: string): Promise<APIEmbed> {
  const embedPath = `${__dirname}/../${pathPrefix ? pathPrefix : ""}/${embedId.replace(/\./g, "/")}.json`;
  const contentPromise = await import(embedPath);
  const content = JSON.stringify(contentPromise.default);
  const copy = JSON.parse(content);

  // Replace color with int
  if (typeof copy.color === "string") {
    copy.color = parseInt(copy.color, 16);
  }

  return copy
}
