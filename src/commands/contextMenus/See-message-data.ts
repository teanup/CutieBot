import { ApplicationCommandType } from "discord.js";
import { MessageContextMenuCommand } from "../../structures/MessageContextMenuCommand";
import { Embed } from "discord.js";

export default new MessageContextMenuCommand({
  name: "See message data",
  type: ApplicationCommandType.Message,
  run: async ({ client, interaction, args }) => {
    const message = args.getMessage("message");

    // No message
    if (!message) return;

    const messageURL = `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`;
    const embeds: Embed[] = [];

    // Get content data
    const contentData = message.content;
    if (contentData) {
      const embedContent = await client.getText("commands.contextMenus.see-message-data.content");
      // Edit embed
      embedContent.description = embedContent.description
        .replace("${contentData}", contentData.replace(/`/g, "\\`"));
      embedContent.author.url = messageURL;
      // Push embed
      embeds.push(embedContent);
    }

    // Get components data
    await Promise.all(message.components.map(async (component, index) => {
      const componentData = component.toJSON()
      const embedComponent = await client.getText("commands.contextMenus.see-message-data.component");
      // Edit embed
      embedComponent.title = embedComponent.title
        .replace("${index}", index + 1);
      embedComponent.description = embedComponent.description
        .replace("${componentData}", JSON.stringify(componentData, null, 2).replace(/`/g, "\\`"));
      embedComponent.author.url = messageURL;
      // Push embed
      embeds.push(embedComponent);
    }));

    // Get attachments data
    await Promise.all(message.attachments.map(async (attachment) => {
      const attachmentData = attachment.toJSON();
      const embedAttachment = await client.getText("commands.contextMenus.see-message-data.attachment");
      // Edit embed
      embedAttachment.title = embedAttachment.title
        .replace("${name}", attachment.name);
      embedAttachment.description = embedAttachment.description
        .replace("${attachmentData}", JSON.stringify(attachmentData, null, 2).replace(/`/g, "\\`"));
      embedAttachment.author.url = messageURL;
      // Push embed
      embeds.push(embedAttachment);
    }));

    // Get embeds data
    await Promise.all(message.embeds.map(async (embed, index) => {
      const embedData = embed.toJSON();
      const embedEmbed = await client.getText("commands.contextMenus.see-message-data.embed");
      // Edit embed
      embedEmbed.title = embedEmbed.title
        .replace("${index}", index + 1);
      embedEmbed.description = embedEmbed.description
        .replace("${embedData}", JSON.stringify(embedData, null, 2).replace(/`/g, "\\`"));
      embedEmbed.author.url = messageURL;
      // Push embed
      embeds.push(embedEmbed);
    }));

    // No data
    if (!embeds.length) {
      const embedNone = await client.getText("commands.contextMenus.see-message-data.no-data");
      embedNone.author.url = messageURL;
      // Push embed
      embeds.push(embedNone);
    }

    // Send embeds
    await interaction.reply({ embeds: embeds, ephemeral: true });
  }
});
