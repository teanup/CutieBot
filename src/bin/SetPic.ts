import {
  APIEmbed,
  EmbedAuthorData,
  Message
} from "discord.js";
import { ExtendedClient } from "src/structures/Client";

export interface PicOptions {
  title: string;
  description: string;
  date: string;
  location: string;
}

async function parseDate(dateRaw: string): Promise<string> {
  // Parse date as UTC
  let date = new Date(dateRaw);

  // If date is invalid, return current date
  if (isNaN(date.getTime())) {
    date = new Date();
  }

  // Set time to 12:00 UTC
  const isoDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T12:00:00.000Z`;
  return isoDate;
}

async function fetchLocation(location: string): Promise<EmbedAuthorData> {
  const endpoint = process.env.NOMINATIM_API_ENDPOINT as string;
  const queryParams = new URLSearchParams({
    q: location,
    addressdetails: "0",
    extratags: "0",
    namedetails: "0",
    "accept-language": "en",
    limit: "1",
    format: "json",
  });

  // Fetch location from API
  const fetchURL = `${endpoint}?${queryParams.toString()}`;
  const response = await fetch(fetchURL, {
    headers: {
      "User-Agent": "Discord bot (by @peanut#4445)"
    },
  });   
  const data = await response.json();

  // Parse OSM URL
  try {
    const res = await data[0];
    const osm_type = res.osm_type;
    const osm_id = res.osm_id;
    const display_name = res.display_name;

    // Author data
    const author: EmbedAuthorData = {
      name: display_name,
      url: `https://www.openstreetmap.org/${osm_type}/${osm_id}`,
      iconURL: "https://cdn-icons-png.flaticon.com/512/535/535137.png"
    };

    return author;
  } catch (error) {
    return {} as EmbedAuthorData;
  }
}

export default async function SetPic(client: ExtendedClient, picId: string, fileName: string, originalPicMsg: Message, embed: APIEmbed, options: PicOptions): Promise<APIEmbed> {
  // Get options
  embed.title = options.title;
  embed.description = options.description;
  embed.timestamp = await parseDate(options.date);
  // Fetch location
  client.log(`Fetching location for ${fileName}...`, "loading");
  if (options.location !== "") {
    const author = await fetchLocation(options.location);
    if (author.name !== undefined) {
      embed.author = author;
      client.log(`Fetched location ${author.name} for ${fileName}`, "success");
    } else {
      client.log(`Failed to fetch location for ${fileName}`, "warn");
    }
  }

  // Fix hidden attachment
  embed.image = { url: `attachment://${fileName}` };

  // Edit embed
  await originalPicMsg.edit({
    embeds: [embed],
    components: []
  });

  // Fetch new image URL
  let newURL = "";
  await originalPicMsg.fetch().then((msg) => {
    newURL = msg.embeds[0].image?.url as string;
  });
  embed.image = { url: newURL };

  // Save as JSON
  client.log(`Saving JSON data for ${fileName}...`, "loading");
  const jsonData = JSON.stringify(embed, null, 2);
  try {
    await client.editFile(jsonData, `${picId}.json`, client.picEmbedsDir);
    client.log(`Saved JSON data for ${fileName}`, "success");
  } catch (error) {
    console.error(error);
    client.log(`Failed to save JSON data for ${fileName}`, "error");
  }

  // Add components
  const components = await client.getMessageComponents("picture", `${picId}:${fileName}`);
  await originalPicMsg.edit({ components });

  return embed;
}
