import {
  Attachment,
  TextChannel
} from "discord.js";
import { ExtendedClient } from "src/structures/Client";
import { PicOptions } from "../bin/SetPic";
import { appendFile } from "fs/promises";

async function fetchColor(imageURL: string): Promise<string> {
  const endpoint = process.env.COLOR_API_ENDPOINT as string;
  const auth = process.env.COLOR_API_AUTH as string;
  const queryParams = new URLSearchParams({
    image_url: imageURL,
    extract_overall_colors: "1",
    extract_object_colors: "0",
    overall_count: "1",
    separated_count: "1",
    deterministic: "0",
  });

  // Fetch color from API
  const fetchURL = `${endpoint}?${queryParams.toString()}`;
  const response = await fetch(fetchURL, {
    headers: {
      "Authorization": auth,
    },
  });
  const data = await response.json();

  // Parse color
  try {
    const color = await data.result.colors.image_colors[0].html_code;
    return color;
  } catch (error) {
    return ""
  }
}

export default async function registerPic(client: ExtendedClient, picUrl: string, fileName: string, attachment: Attachment, options: PicOptions): Promise<void> {
  client.log(`Registering ${fileName}...`, "loading");
  const picChannel = await client.channels.fetch(client.picChannelId) as TextChannel;

  // Send embed preview
  const embed = await client.getEmbed("texts.events.messageCreate.registerPic.loading");
  embed.footer = { text: fileName };
  embed.image = { url: `attachment://${fileName}` };
  const picMsg = await picChannel.send({
    embeds: [embed],
    files: [attachment]
  });
  
  // Get and set dominant color
  const mainColor = await fetchColor(picUrl);
  if (mainColor !== "") {
    const mainColorHex = parseInt(mainColor.replace("#", "0x"));
    client.log(`Fetched color ${mainColor} for ${fileName} [${picMsg.id}]`, "success");
    embed.color = mainColorHex;
  } else {
    client.log(`Failed to fetch color for ${fileName} [${picMsg.id}]`, "warn")
  }

  // Add to picture cache
  await appendFile(`${__dirname}/../${client.picFileNamesPath}`, `${picMsg.id}\t${fileName}\n`);
  client.picFileNames.set(picMsg.id, fileName);
  client.picIds.push(picMsg.id);

  // Get options
  await client.setPic(picMsg.id, fileName, picMsg, embed, options);

  client.log(`Registered ${fileName} [${picMsg.id}]`, "info");
}
