import { APIEmbed, ApplicationCommandType, EmbedAuthorData } from "discord.js";
import { MessageContextMenuCommand } from "../../structures/MessageContextMenuCommand";

export default new MessageContextMenuCommand({
  name: "See message data",
  type: ApplicationCommandType.Message,
  run: async ({ client, interaction, args }) => {
    const message = args.getMessage("message");

    // No message
    if (!message) return;

    const messageURL = `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`;
    const embeds: APIEmbed[] = [];

    // Get content data
    const contentData = message.content;
    if (contentData) {
      const embedContent = await client.getEmbed("texts.commands.contextMenus.see-message-data.content");
      // Edit embed
      embedContent.description = (embedContent.description as string)
        .replace("${contentData}", contentData.replace(/`/g, "\\`"));
      (embedContent.author as EmbedAuthorData).url = messageURL;
      // Push embed
      embeds.push(embedContent);
    }

    // Get components data
    await Promise.all(message.components.map(async (component, index) => {
      const componentData = component.toJSON()
      const embedComponent = await client.getEmbed("texts.commands.contextMenus.see-message-data.component");
      // Edit embed
      embedComponent.title = (embedComponent.title as string)
        .replace("${index}", `${index + 1}`);
      embedComponent.description = (embedComponent.description as string)
        .replace("${componentData}", JSON.stringify(componentData, null, 2).replace(/`/g, "\\`"));
        (embedComponent.author as EmbedAuthorData).url = messageURL;
      // Push embed
      embeds.push(embedComponent);
    }));

    // Get attachments data
    await Promise.all(message.attachments.map(async (attachment) => {
      const attachmentData = attachment.toJSON();
      const embedAttachment = await client.getEmbed("texts.commands.contextMenus.see-message-data.attachment");
      // Edit embed
      embedAttachment.title = (embedAttachment.title as string)
        .replace("${name}", attachment.name);
      embedAttachment.description = (embedAttachment.description as string)
        .replace("${attachmentData}", JSON.stringify(attachmentData, null, 2).replace(/`/g, "\\`"));
      (embedAttachment.author as EmbedAuthorData).url = messageURL;
      // Push embed
      embeds.push(embedAttachment);
    }));

    // Get embeds data
    await Promise.all(message.embeds.map(async (embed, index) => {
      const embedData = embed.toJSON();
      const embedEmbed = await client.getEmbed("texts.commands.contextMenus.see-message-data.embed");
      // Edit embed
      embedEmbed.title = (embedEmbed.title as string)
        .replace("${index}", `${index + 1}`);
      embedEmbed.description = (embedEmbed.description as string)
        .replace("${embedData}", JSON.stringify(embedData, null, 2).replace(/`/g, "\\`"));
      (embedEmbed.author as EmbedAuthorData).url = messageURL;
      // Push embed
      embeds.push(embedEmbed);
    }));

    // No data
    if (!embeds.length) {
      const embedNone = await client.getEmbed("texts.commands.contextMenus.see-message-data.no-data");
      (embedNone.author as EmbedAuthorData).url = messageURL;
      // Push embed
      embeds.push(embedNone);
    }

    // Send embeds
    await interaction.reply({
      embeds: embeds,
      ephemeral: true
    });
  }
});
