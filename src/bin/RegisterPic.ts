import { Attachment, AttachmentBuilder, EmbedBuilder, Message } from "discord.js";
import { promises, unlink } from "fs";

async function downloadImage(url: string, path: string): Promise<void> {
  const response = await fetch(url);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await promises.writeFile(path, buffer);
}

export default async function registerPic(message: Message, picUrl: string, fileName: string): Promise<void> {
  const loading = process.env.LOADING_EMOJIS as string;

  // Download image
  const reply = await message.reply(`${loading}  Downloading image...`);
  const downloadPath = `${__dirname}/../${process.env.DOWNLOAD_DIR}/${fileName}`;
  await downloadImage(picUrl, downloadPath);

  // Build embed
  await reply.edit(`${loading}  Building embed...`);
  const embed = new EmbedBuilder()
    .setTitle(" ")
    .setDescription(" ")
    .setFooter({ text: fileName })
    .setImage(`attachment://${fileName}`);
  // Get date from EXIF data
  // TODO: Get date from EXIF data
  embed.setTimestamp(new Date());
  // Get main color
  // TODO: Get main color from image
  const mainColor = 0x88ccaa;
  embed.setColor(mainColor);

  // Send embed
  await reply.edit(`${loading}  Sending embed...`);
  const attachment = new AttachmentBuilder(downloadPath)
    .setName(fileName);
  const sent = await message.channel.send({ embeds: [embed], files: [attachment] });
  await reply.delete();

  // Delete image
  unlink(downloadPath, (err) => {});

  // Generate duplicable embed
  let newURL = "";
  sent.attachments.map((attachment: Attachment) => {
    newURL = attachment.url;
  });
  embed.setImage(newURL);
  // TODO: save as JSON

  // Add buttons
  // TODO: Add buttons
  // const components = await client.getComponents("picture");
  // await sent.edit({ embeds: [embed], components: [components] });
  // TODO: check if attachment stays with message even with embed image not referencing it
}
