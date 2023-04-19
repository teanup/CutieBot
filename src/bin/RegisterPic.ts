import { Attachment, EmbedAuthorData, TextChannel } from "discord.js";
import { ExtendedClient } from "src/structures/Client";

export interface RegisterPicOptions {
  title: string;
  description: string;
  date: string;
  location: string;
}


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

export default async function registerPic(client: ExtendedClient, picUrl: string, fileName: string, attachment: Attachment, options: RegisterPicOptions): Promise<void> {
  client.log(`Registering ${fileName}...`, "loading");
  const picChannel = await client.channels.fetch(client.picChannelId) as TextChannel;

  // Send embed preview
  const embed = await client.getEmbed("texts.events.messageCreate.registerPic.loading");
  embed.footer = { text: fileName };
  embed.image = { url: `attachment://${fileName}` };
  const picMsg = await picChannel.send({ embeds: [embed], files: [attachment] });
  

  // Get and set dominant color
  client.log(`Fetching color for ${fileName}...`, "loading");
  const mainColor = "" as string;  // await fetchColor(picUrl);
  if (mainColor !== "") {
    const mainColorHex = parseInt(mainColor.replace("#", "0x"));
    client.log(`Fetched color ${mainColor} for ${fileName}`, "success");
    embed.setColor(mainColorHex);
  } else {
    client.log(`Failed to fetch color for ${fileName}`, "warn")
  }

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

  // Edit embed
  await picMsg.edit({ embeds: [embed] });

  // Fetch new image URL
  let newURL = "";
  await picMsg.fetch().then((msg) => {
    newURL = msg.embeds[0].image?.url as string;
  });
  embed.image = { url: newURL };

  // Save as JSON
  client.log(`Saving JSON data for ${fileName}...`, "loading");
  const jsonData = JSON.stringify(embed, null, 2);
  try {
    await client.editFile(jsonData, `${picMsg.id}.json`, client.picEmbedsDir);
    client.log(`Saved JSON data for ${fileName}`, "success");
  } catch (error) {
    console.error(error);
    client.log(`Failed to save JSON data for ${fileName}`, "error");
  }  

  // Embed content & raw content preview // TODO: Remove
  await picChannel.send({
    content: `\`\`\`json\n${jsonData}\n\`\`\``,
    embeds: [embed],
  });

  // Add components
  // TODO: Add buttons
  // const components = await client.getComponents("picture");
  // const row = new ActionRowBuilder<ButtonBuilder>();
  // await picMsg.edit({ components: [row] });

  client.log(`Registered ${fileName}`, "info");
}
