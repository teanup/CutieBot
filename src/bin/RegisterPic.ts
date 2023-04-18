import { Attachment, AttachmentBuilder, EmbedBuilder, Message, TextChannel } from "discord.js";
import { ExtendedClient } from "src/structures/Client";
import { promises, unlink } from "fs";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";

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

export default async function registerPic(client: ExtendedClient, message: Message, picUrl: string, fileName: string, attachment: Attachment): Promise<void> {
  client.log(`Registering ${fileName}...`, "loading");

  // Send embed preview
  const embed = await client.getText("events.messageCreate.registerPic.loading");
  embed.footer = { text: fileName };
  embed.image = { url: `attachment://${fileName}` };
  const picMsg = await (message.channel as TextChannel).send({ embeds: [embed], files: [attachment] });

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

  // Get title, description and date
  // TODO: get title, description and date
  embed.title = "Title";
  embed.description = "Description";
  embed.timestamp = new Date().toISOString();

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
  const json = JSON.stringify(embed, null, 2);
  const jsonPath = `../${process.env.EMBEDS_DIR}/${fileName}.json`;
  try {
    await client.editFile(jsonPath, json);
    client.log(`Saved JSON data for ${fileName}`, "success");
  } catch (error) {
    console.error(error);
    client.log(`Failed to save JSON data for ${fileName}`, "error");
  }  

  // Embed content & raw content preview // TODO: Remove
  await (message.channel as TextChannel).send({
    content: `\`\`\`json\n${JSON.stringify(embed, null, 2)}\n\`\`\``,
    embeds: [embed],
  });

  // Add components
  // TODO: Add buttons
  // const components = await client.getComponents("picture");
  const row = new ActionRowBuilder<ButtonBuilder>();
  await picMsg.edit({ components: [row] });

  // Delete original message
  await message.delete();

  client.log(`Registered ${fileName}`, "info");
}
